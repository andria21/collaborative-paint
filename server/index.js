import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });

  socket.on("draw-line", (data) => {
    socket.broadcast.emit("draw-line", data);
  });

  socket.on("erase", (eraseData) => {
    io.emit("erase", eraseData);
    socket.broadcast.emit("erase", eraseData);
  });

  socket.on("canvas-state", (state) => {
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("clear", () => io.emit("clear"));
});

server.listen("3001", () => {
  console.log("Server listening on port 3001");
});
