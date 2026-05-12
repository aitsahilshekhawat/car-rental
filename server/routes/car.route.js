import express from "express";

import { addCar, getCars, getCarById } from "../controllers/car.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/add", authMiddleware, adminMiddleware, addCar);

router.get("/", getCars);
router.get("/:id", getCarById);

export default router;
