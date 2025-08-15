import express from "express";
import { createChat, sendMessage, getMessages } from "./chatController.js";

const router = express.Router();

// Create a chat
router.post("/", createChat);

// Send a message
router.post("/message", sendMessage);

// Get all messages for a chat
router.get("/:chatId/messages", getMessages);

export default router;
