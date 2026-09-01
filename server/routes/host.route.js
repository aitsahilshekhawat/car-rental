import express from "express";
import {
  applyForHost,
  getHostDashboard,
  getHostBookings,
  getHostCars,
} from "../controllers/host.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { hostOrAdminMiddleware } from "../middleware/host.middleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyForHost);
router.get("/dashboard", authMiddleware, hostOrAdminMiddleware, getHostDashboard);
router.get("/bookings", authMiddleware, hostOrAdminMiddleware, getHostBookings);
router.get("/cars", authMiddleware, hostOrAdminMiddleware, getHostCars);

export default router;
