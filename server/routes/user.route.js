import express from "express";

import { getUsers, updateUserRole } from "../controllers/user.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// Get all users
router.get("/", authMiddleware, adminMiddleware, getUsers);

// Change user role
router.patch("/:id/role", authMiddleware, adminMiddleware, updateUserRole);

export default router;
