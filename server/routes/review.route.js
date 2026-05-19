import express from "express";

import { addReview, getCarReviews } from "../controllers/review.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addReview);

router.get("/:carId", getCarReviews);

export default router;
