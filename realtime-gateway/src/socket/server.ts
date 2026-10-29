import { createServer, Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import express from "express";
import { ConnectedUsers } from "../sessions/connected-users";

export function createSocketServer(users: ConnectedUsers): { httpServer: HttpServer; io: Server } {
  const app = express();

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.auth.userId as string;

    if (userId) {
      users.add(userId, socket.id);
      console.log(`User ${userId} connected`);
    }

    socket.on("disconnect", () => {
      if (userId) {
        users.remove(userId, socket.id);
        console.log(`User ${userId} disconnected`);
      }
    });
  });

  return { httpServer, io };
}