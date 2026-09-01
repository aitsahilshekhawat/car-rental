import express from "express";
import {
  createOrder,
  createDemoOrder,
  verifyPayment,
  getPaymentHistory,
  getPaymentReceipt,
} from "../controllers/payment.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/demo-order", createDemoOrder);
router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);
router.get("/history", authMiddleware, getPaymentHistory);
router.get("/receipt/:id", authMiddleware, getPaymentReceipt);

export default router;
