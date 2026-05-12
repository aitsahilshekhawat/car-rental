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

router.post("/book", authMiddleware, bookCar);

router.get("/my-bookings", authMiddleware, getMyBookings);

router.put("/cancel/:id", authMiddleware, cancelBooking);

router.get("/all", authMiddleware, adminMiddleware, getAllBookings);
router.put("/status/:id", authMiddleware, adminMiddleware, updateBookingStatus);

export default router;
