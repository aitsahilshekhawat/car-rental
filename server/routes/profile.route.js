import express from "express";

import {
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Get Logged-in User Profile
router.get("/", authMiddleware, getProfile);

// Update Profile
router.put("/", authMiddleware, updateProfile);

export default router;
