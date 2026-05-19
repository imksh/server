import { getReceiverSocketIds,io } from "../config/socket.js";

export const sendSocketNotification = (userId, notification) => {
  const socketIds = getReceiverSocketIds(userId);

  if (socketIds.length === 0) {
    console.log(`No active sockets for user ${userId}`);
    return;
  }

  console.log(`Sending notification to user ${userId} on sockets:`, socketIds);

  socketIds.forEach((socketId) => {
    io.to(socketId).emit("notification:new", notification);
  });
};
