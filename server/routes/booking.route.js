import express from "express";

import {
  bookCar,
  getBookedDates,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// Get booked dates for a car (public — needed for date picker)
router.get("/booked-dates/:carId", getBookedDates);

// Book Car (authenticated users)
router.post("/book", authMiddleware, bookCar);

// Get All Bookings (admin only)
router.get("/", authMiddleware, adminMiddleware, getAllBookings);

// Get My Bookings (authenticated users)
router.get("/my", authMiddleware, getMyBookings);

// Cancel Booking (authenticated users — ownership checked in controller)
router.put("/:id/cancel", authMiddleware, cancelBooking);

// Update Booking Status (admin only)
router.put("/status/:id", authMiddleware, adminMiddleware, updateBookingStatus);

export default router;
