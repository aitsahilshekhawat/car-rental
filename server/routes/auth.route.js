import express from "express";

import {
  register,
  login,
  getMe,
  forgotPassword
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
const router = express.Router();

router.post("/register", register);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);

router.get("/me", authMiddleware, getMe);

router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

export default router;
