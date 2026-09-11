import { createServer } from "http";
import { Server, Socket } from "socket.io";
import express from "express";

console.log("Starting WebSocket server...");

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


const httpServer = createServer();
const port = Number(process.env.PORT ?? 3000);

export const io = new Server(httpServer, {
  cors: { origin: "*" }
});

export const connectedUsers = new Map<string, string[]>();

io.on("connection", (socket: Socket) => {
  const userId = socket.handshake.auth.userId as string;

  if (userId) {

    const id = connectedUsers.get(userId);

    if (id) {
      id.push(socket.id);
      connectedUsers.set(userId, id);
    } else {
      connectedUsers.set(userId, [socket.id]);
    }

    console.log(`User ${userId} connected`);
  }

  console.log(connectedUsers);

  socket.on("disconnect", () => {
    if (userId) {

      const id = connectedUsers.get(userId);

      if (id) {
        if (id.length > 1) {
          const socketIds = id.filter(socket_id => socket_id !== socket.id);
          connectedUsers.set(userId, socketIds);
        } else {
          connectedUsers.delete(userId);
        }
        
        console.log(`User ${userId} disconnected`);
      }
    }
  });
});


httpServer.listen(port, () =>
  console.log(`WebSocket server listening on port ${port}`)
);