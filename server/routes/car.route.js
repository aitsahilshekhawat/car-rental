import express from "express";

import { addCar } from "../controllers/car.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addCar);

export default router;
