import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.accessToken;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.id || decoded._id;

      if (!userId) {
        return next(new Error("Invalid token"));
      }

      socket.userId = userId.toString();

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);

    console.log(`Socket connected: ${socket.userId}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};