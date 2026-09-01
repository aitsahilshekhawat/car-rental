import crypto from "crypto";
import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";

export const createDemoOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount, // already in paise
      currency: "INR",
      receipt: `receipt_demo_${Date.now()}`
    });
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay demo order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { car, pickupDate, returnDate } = req.body;

    if (!car || !pickupDate || !returnDate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Car, pickup date, and return date are required" });
    }

    // Validate car exists
    const carDoc = await Car.findById(car).session(session);
    if (!carDoc) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Car Not Found" });
    }

    // SERVER-SIDE price calculation — never trust client-sent amount
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid date format" });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Return date must be after pickup date" });
    }

    const totalPrice = days * carDoc.pricePerDay;
    const amount = totalPrice;

    // Atomic overlap check within transaction
    const existingBooking = await Booking.findOne({
      car,
      status: { $in: ["Pending", "Approved"] },
      $or: [{ pickupDate: { $lte: returnDate }, returnDate: { $gte: pickupDate } }],
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Car Already Booked For Selected Dates" });
    }

    const receipt = `receipt_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt,
    });

    const [payment] = await Payment.create(
      [
        {
          user: req.user.id,
          razorpayOrderId: order.id,
          amount,
          currency: "INR",
          status: "created",
          receipt,
          bookingDetails: {
            car,
            pickupDate,
            returnDate,
            totalPrice,
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order created successfully",
      order,
      paymentId: payment._id,
      calculatedAmount: amount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      await Payment.findByIdAndUpdate(paymentId, { status: "failed" }).session(session);
      await session.commitTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update payment as paid
    const payment = await Payment.findById(paymentId).session(session);
    if (!payment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Payment not found" });
    }

    // Double-check no overlapping booking was created in the meantime
    const conflict = await Booking.findOne({
      car: payment.bookingDetails.car,
      status: { $in: ["Pending", "Approved"] },
      $or: [
        {
          pickupDate: { $lte: payment.bookingDetails.returnDate },
          returnDate: { $gte: payment.bookingDetails.pickupDate },
        },
      ],
    }).session(session);

    if (conflict) {
      payment.status = "failed";
      await payment.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.status(400).json({ message: "Car was booked by another user. Payment will be refunded." });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    await payment.save({ session });

    // Create booking within the same transaction
    const [booking] = await Booking.create(
      [
        {
          user: req.user.id,
          car: payment.bookingDetails.car,
          pickupDate: payment.bookingDetails.pickupDate,
          returnDate: payment.bookingDetails.returnDate,
          totalPrice: payment.bookingDetails.totalPrice,
          status: "Approved",
          paymentId: payment._id,
        },
      ],
      { session }
    );

    // Link booking to payment
    payment.booking = booking._id;
    await payment.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Payment verified and booking confirmed",
      booking,
      payment,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("booking")
      .populate("bookingDetails.car")
      .sort({ createdAt: -1 });

    res.status(200).json({ payments });
  } catch (error) {
    console.log("GET PAYMENT HISTORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPaymentReceipt = async (req, res) => {
  try {
    // Check ownership before populate to prevent IDOR
    const paymentRaw = await Payment.findById(req.params.id);
    if (!paymentRaw) {
      return res.status(404).json({ message: "Payment not found" });
    }
    if (paymentRaw.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const payment = await Payment.findById(req.params.id)
      .populate("booking")
      .populate("bookingDetails.car")
      .populate("user", "name email");

    res.status(200).json({ payment });
  } catch (error) {
    console.log("GET PAYMENT RECEIPT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
