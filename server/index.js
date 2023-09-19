const express = require("express");
const fetch = require("node-fetch");
const http = require("http");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "https://dramasq.one",
  },
});

const PLAY = "PLAY";
const SEEKED = "SEEKED";
const PAUSE = "PAUSE";

io.on("connection", async (socket) => {
  const room = socket.handshake.query.room ?? "Public";
  const ip = socket.handshake.headers["x-forwarded-for"]?.split(",")[0];
  const res = await fetch(`http://ip-api.com/json/${ip}`);
  const { city, region, countryCode } = await res.json();
  const user = ip
    ? `${ip} (${[city, region, countryCode].join(", ")})`
    : uuidv4();

  socket.join(room);

  console.log(`User: ${user} joined room: ${room}`);

  socket.on(PLAY, () => socket.to(room).emit(PLAY));
  socket.on(SEEKED, (time) => socket.to(room).emit(SEEKED, time));
  socket.on(PAUSE, () => socket.to(room).emit(PAUSE));

  socket.on("disconnect", () => {
    console.log(`User: ${user} left from: ${room}`);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
