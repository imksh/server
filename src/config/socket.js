import { Server } from "socket.io";

let io;

const userSocketMap = {};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      console.log("No userId, disconnecting");

      socket.disconnect();

      return;
    }

    console.log("Socket connected:", socket.id, userId);

    if (userId) {
      if (!userSocketMap[userId]) {
        userSocketMap[userId] = new Set();
      }
      userSocketMap[userId].add(socket.id);
    }

    socket.on("disconnect", (reason) => {
      if (!userId) return;

      userSocketMap[userId].delete(socket.id);

      console.log("Socket disconnected:", socket.id, reason);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized yet");
  }

  return io;
};

const getReceiverSocketIds = (userId) =>
  userSocketMap[userId] ? Array.from(userSocketMap[userId]) : [];

export { io, getReceiverSocketIds, userSocketMap };

export default initializeSocket;
