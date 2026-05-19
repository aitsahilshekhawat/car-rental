import express from "express";

import {
  addCar,
  getCars,
  getCarById,
  deleteCar,
  updateCar,
} from "../controllers/car.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import adminMiddleware from "../middleware/admin.middleware.js";
import upload from "../middleware/upload.middleware.js";
const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  addCar,
);

router.get("/", getCars);
router.get("/:id", getCarById);
router.put("/:id", authMiddleware, adminMiddleware, updateCar);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCar);

export default router;
