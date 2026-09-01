import express from "express";

import { getUserDashboard } from "../controllers/userDashboard.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getUserDashboard);

export default router;
