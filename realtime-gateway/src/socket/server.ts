import { createServer } from "http";
import { Server, Socket } from "socket.io";

console.log("Starting WebSocket server...");

const httpServer = createServer();
const io = new Server(httpServer, {
  // ...
});

io.on("connection", (socket: Socket) => {
  // ...
});

console.log("WebSocket server started on port 3000");

httpServer.listen(3000);