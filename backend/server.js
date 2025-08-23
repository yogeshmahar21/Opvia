import app from './src/app.js';
import { config } from './src/config/config.js';
import connectToDb from './src/config/db.js';
import http from 'http';
import { Server } from 'socket.io';
import Chat from './src/chat/chatModel.js';
import Message from './src/chat/messageModel.js';
import cors from "cors";

const startServer = async () => {
  await connectToDb();

  const port = config.port || process.env.PORT || 5000;

  // CORS middleware (API requests)
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173", 
      credentials: true,
    })
  );

  // Create HTTP server
  const server = http.createServer(app);

  // Socket.IO with CORS
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // SOCKET.IO EVENTS
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat room: ${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, senderId, content }) => {
      try {
        const message = await Message.create({
          chat: chatId,
          sender: senderId,
          content
        });

        await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

        io.to(chatId).emit("receiveMessage", message);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Start server
  server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
