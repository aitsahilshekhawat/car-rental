import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";

/* =========================
   GET BOOKED DATES FOR A CAR
========================= */

export const getBookedDates = async (req, res) => {
  try {
    const { carId } = req.params;

    // Find all active bookings (Pending or Approved) for this car
    const bookings = await Booking.find({
      car: carId,
      status: { $in: ["Pending", "Approved"] },
      returnDate: { $gte: new Date() },
    }).select("pickupDate returnDate -_id");

    // Convert each booking range into an array of individual dates
    const bookedDates = [];
    for (const booking of bookings) {
      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);
      const current = new Date(start);

      while (current <= end) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, "0");
        const d = String(current.getDate()).padStart(2, "0");
        bookedDates.push(`${y}-${m}-${d}`);
        current.setDate(current.getDate() + 1);
      }
    }

    const uniqueDates = [...new Set(bookedDates)];
    res.status(200).json({ bookedDates: uniqueDates });
  } catch (error) {
    console.log("GET BOOKED DATES ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   BOOK CAR
========================= */

export const bookCar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { car, pickupDate, returnDate } = req.body;

    // DATE VALIDATION
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (start >= end) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Return date must be after pickup date" });
    }

    // CHECK CAR & COMPUTE PRICE SERVER-SIDE
    const carDoc = await Car.findById(car).session(session);
    if (!carDoc) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Car Not Found" });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * carDoc.pricePerDay;

    // ATOMIC OVERLAP CHECK WITHIN TRANSACTION
    const existingBooking = await Booking.findOne({
      car,
      status: { $in: ["Pending", "Approved"] },
      $or: [
        {
          pickupDate: { $lte: returnDate },
          returnDate: { $gte: pickupDate },
        },
      ],
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Car Already Booked For Selected Dates" });
    }

    // CREATE BOOKING WITHIN TRANSACTION
    const [booking] = await Booking.create(
      [
        {
          user: req.user.id,
          car,
          pickupDate,
          returnDate,
          totalPrice,
          status: "Pending",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Car Booked Successfully",
      booking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("BOOKING ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   GET MY BOOKINGS
========================= */

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("car")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.log("GET MY BOOKINGS ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* =========================
   CANCEL BOOKING
========================= */

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking Not Found",
      });
    }

    // USER CHECK

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    // MAKE CAR AVAILABLE AGAIN

    const car = await Car.findById(booking.car);

    if (car) {
      car.available = true;

      await car.save();
    }

    res.status(200).json({
      message: "Booking Cancelled Successfully",
    });
  } catch (error) {
    console.log("CANCEL BOOKING ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* =========================
   GET ALL BOOKINGS
========================= */

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "-password")
      .populate("car")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.log("GET ALL BOOKINGS ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* =========================
   UPDATE BOOKING STATUS
========================= */

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking Not Found",
      });
    }

    // VALID STATUS

    const validStatuses = [
      "Pending",

      "Approved",

      "Rejected",

      "Completed",

      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status",
      });
    }

    booking.status = status;

    await booking.save();

    // CAR AVAILABILITY

    const car = await Car.findById(booking.car);

    if (car) {
      if (status === "Approved") {
        car.available = false;
      }

      if (
        status === "Completed" ||
        status === "Rejected" ||
        status === "Cancelled"
      ) {
        car.available = true;
      }

      await car.save();
    }

    res.status(200).json({
      message: "Booking Status Updated",

      booking,
    });
  } catch (error) {
    console.log("UPDATE BOOKING STATUS ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
