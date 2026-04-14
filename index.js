import http from "http";
import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routers/auth.routes.js";
import { errorHandler } from "./middle/auth.middleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dummy session
app.use((req, res, next) => {
  if (!req.session) req.session = {};
  next();
});

// ==================== DB ====================
connectDB();

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chat server is running 🚀",
  });
});

// ==================== SOCKET ====================
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.emit("online-users", io.engine.clientsCount);

  socket.broadcast.emit("user-joined", {
    message: "A new user has joined",
    usersOnline: io.engine.clientsCount,
  });

  socket.on("user-message", (message) => {
    io.emit("message", {
      from: socket.id,
      message,
      timestamp: new Date(),
    });
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("user-typing", {
      userId: socket.id,
      isTyping: data.isTyping,
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);

    io.emit("user-left", {
      message: "A user has left",
      usersOnline: io.engine.clientsCount,
    });
  });
});

// ==================== ERROR ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    statusCode: 404,
  });
});

app.use(errorHandler);

// ==================== SERVER ====================
const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
});

// Shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Server shutting down...");
  server.close(() => {
    process.exit(0);
  });
});