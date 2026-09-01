import express from "express";
import rateLimit from "express-rate-limit";

import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { googleLogin } from "../controllers/google.controller.js";
import { phoneLogin } from "../controllers/phone.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// H2: Rate limiting on auth endpoints — 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for password reset (5 per 15 min)
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many password reset requests. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/google", authLimiter, googleLogin);
router.post("/phone", authLimiter, phoneLogin);
router.post("/forgot-password", resetLimiter, forgotPassword);
router.post("/reset-password/:token", resetLimiter, resetPassword);

router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);

router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

export default router;
