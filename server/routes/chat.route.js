import express from "express";
import { handleChat } from "../controllers/chat.controller.js";

const router = express.Router();

// POST /api/chat - Send a message to AI assistant
router.post("/", handleChat);

export default router;
