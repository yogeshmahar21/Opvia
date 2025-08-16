import express from "express";
import { createChat, sendMessage, getMessages } from "./chatController.js";

const chatRouter = express.Router();

// Create a chat
chatRouter.post("/", createChat);

// Send a message
chatRouter.post("/message", sendMessage);

// Get all messages for a chat
chatRouter.get("/:chatId/messages", getMessages);

export default chatRouter;
