import { io } from "socket.io-client";

// Change to your backend URL if deployed
const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensures stable connection
});

export default socket;
