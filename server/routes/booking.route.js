import express from "express";

import {
  bookCar,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// Book Car
router.post("/book", authMiddleware, bookCar);

// Get All Bookings
router.get("/", getAllBookings);

// Get My Bookings
router.get("/my", authMiddleware, getMyBookings);

// Cancel Booking
router.put("/:id/cancel", authMiddleware, cancelBooking);

// Update Booking Status
router.put("/:id/status", updateBookingStatus);
router.put("/status/:id", authMiddleware, adminMiddleware, updateBookingStatus);

export default router;
