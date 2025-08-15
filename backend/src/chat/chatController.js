import createHttpError from "http-errors";
import Chat from "./chatModel.js";
import Message from "./messageModel.js";

// Create a new chat
export const createChat = async (req, res, next) => {
  const { participants } = req.body;

  if (!participants || participants.length < 2) {
    return next(createHttpError(400, "A chat must have at least two participants"));
  }

  try {
    const chat = await Chat.create({ participants });
    res.status(201).json(chat);
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Send a message
export const sendMessage = async (req, res, next) => {
  const { chatId, sender, content } = req.body;

  if (!chatId || !sender || !content) {
    return next(createHttpError(400, "chatId, sender, and content are required"));
  }

  try {
    const message = await Message.create({ chat: chatId, sender, content });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get all messages in a chat
export const getMessages = async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId }).populate("sender", "Username email");
    res.status(200).json(messages);
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
