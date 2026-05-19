import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";

/* =========================
   BOOK CAR
========================= */

export const bookCar = async (req, res) => {
  try {
    const { car, pickupDate, returnDate, totalPrice } = req.body;

    // DATE VALIDATION

    if (new Date(pickupDate) >= new Date(returnDate)) {
      return res.status(400).json({
        message: "Return date must be after pickup date",
      });
    }

    // PRICE VALIDATION

    if (totalPrice <= 0) {
      return res.status(400).json({
        message: "Invalid Total Price",
      });
    }

    // CHECK CAR

    const carExists = await Car.findById(car);

    if (!carExists) {
      return res.status(404).json({
        message: "Car Not Found",
      });
    }

    // CHECK EXISTING BOOKING

    const existingBooking = await Booking.findOne({
      car,

      status: {
        $in: ["Pending", "Approved"],
      },

      $or: [
        {
          pickupDate: {
            $lte: returnDate,
          },

          returnDate: {
            $gte: pickupDate,
          },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Car Already Booked For Selected Dates",
      });
    }

    // CREATE BOOKING

    const booking = await Booking.create({
      user: req.user.id,

      car,

      pickupDate,

      returnDate,

      totalPrice,

      status: "Pending",
    });

    res.status(201).json({
      message: "Car Booked Successfully",

      booking,
    });
  } catch (error) {
    console.log("BOOKING ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
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
