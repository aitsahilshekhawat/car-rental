import prisma from "../config/prisma.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";

export const createDemoOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("DEMO ORDER ERROR:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, totalPrice } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Check for overlapping bookings
      const overlapping = await tx.booking.findFirst({
        where: {
          carId,
          status: { in: ["PENDING", "APPROVED"] },
          OR: [
            {
              pickupDate: { lte: new Date(returnDate) },
              returnDate: { gte: new Date(pickupDate) },
            },
          ],
        },
      });

      if (overlapping) {
        throw new Error("OVERLAP");
      }

      const receipt = `receipt_${Date.now()}`;
      const options = {
        amount: Math.round(totalPrice * 100),
        currency: "INR",
        receipt,
      };

      const order = await razorpayInstance.orders.create(options);

      const payment = await tx.payment.create({
        data: {
          userId: req.user.id,
          razorpayOrderId: order.id,
          amount: totalPrice,
          currency: "INR",
          status: "created",
          receipt,
          bookingCarId: carId,
          bookingPickupDate: new Date(pickupDate),
          bookingReturnDate: new Date(returnDate),
          bookingTotalPrice: totalPrice,
        },
      });

      return { order, payment };
    });

    res.status(200).json({
      success: true,
      order: result.order,
      paymentId: result.payment.id,
    });
  } catch (error) {
    if (error.message === "OVERLAP") {
      return res
        .status(400)
        .json({ success: false, message: "Car is already booked for these dates" });
    }
    console.log("CREATE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        throw new Error("INVALID_SIGNATURE");
      }

      // Find the payment record
      const payment = await tx.payment.findFirst({
        where: { razorpayOrderId: razorpay_order_id },
      });

      if (!payment) {
        throw new Error("PAYMENT_NOT_FOUND");
      }

      // Check for date conflicts before creating booking
      if (payment.bookingCarId) {
        const conflict = await tx.booking.findFirst({
          where: {
            carId: payment.bookingCarId,
            status: { in: ["PENDING", "APPROVED"] },
            OR: [
              {
                pickupDate: { lte: payment.bookingReturnDate },
                returnDate: { gte: payment.bookingPickupDate },
              },
            ],
          },
        });

        if (conflict) {
          throw new Error("DATE_CONFLICT");
        }
      }

      // Create booking
      const booking = await tx.booking.create({
        data: {
          userId: req.user.id,
          carId: payment.bookingCarId,
          pickupDate: payment.bookingPickupDate,
          returnDate: payment.bookingReturnDate,
          totalPrice: payment.bookingTotalPrice,
          status: "APPROVED",
        },
      });

      // Update payment with verification details and booking link
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "paid",
          bookingId: booking.id,
        },
      });

      return { booking, payment: updatedPayment };
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and booking created",
      booking: { ...result.booking, _id: result.booking.id },
      payment: { ...result.payment, _id: result.payment.id },
    });
  } catch (error) {
    if (error.message === "INVALID_SIGNATURE") {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
    if (error.message === "PAYMENT_NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
    }
    if (error.message === "DATE_CONFLICT") {
      return res
        .status(400)
        .json({ success: false, message: "Car is no longer available for these dates" });
    }
    console.log("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      include: {
        booking: {
          include: { car: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      payments: payments.map((p) => ({
        ...p,
        _id: p.id,
        booking: p.booking
          ? {
              ...p.booking,
              _id: p.booking.id,
              car: p.booking.car
                ? { ...p.booking.car, _id: p.booking.car.id }
                : null,
            }
          : null,
      })),
    });
  } catch (error) {
    console.log("GET PAYMENT HISTORY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPaymentReceipt = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        booking: {
          include: { car: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.status(200).json({
      ...payment,
      _id: payment.id,
    });
  } catch (error) {
    console.log("GET RECEIPT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
