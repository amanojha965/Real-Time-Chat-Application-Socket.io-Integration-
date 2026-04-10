import http from "http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routers/auth.routes.js";
import { errorHandler } from "./middle/auth.middleware.js";

// Load environment variables
dotenv.config();

// Get current directory (for ES6 modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express and socket.io
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
app.use(express.static(path.resolve("./public")));

// Session middleware (simple in-memory, use express-session for production)
app.use((req, res, next) => {
  if (!req.session) {
    req.session = {};
  }
  next();
});

// ==================== DATABASE CONNECTION ====================
connectDB();

// ==================== API ROUTES ====================
// Authentication routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    statusCode: 200,
  });
});

// ==================== SOCKET.IO CONNECTION ====================
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Emit online users list
  socket.emit("online-users", io.engine.clientsCount);
  socket.broadcast.emit("user-joined", {
    message: "A new user has joined",
    usersOnline: io.engine.clientsCount,
  });

  // Listen for messages
  socket.on("user-message", (message) => {
    console.log(`📨 Message from ${socket.id}:`, message);
    io.emit("message", {
      from: socket.id,
      message: message,
      timestamp: new Date(),
    });
  });

  // Listen for typing indicator
  socket.on("typing", (data) => {
    socket.broadcast.emit("user-typing", {
      userId: socket.id,
      isTyping: data.isTyping,
    });
  });

  // Listen for disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    io.emit("user-left", {
      message: "A user has left",
      usersOnline: io.engine.clientsCount,
    });
  });
});

// ==================== STATIC ROUTES ====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// ==================== ERROR HANDLING ====================
// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    statusCode: 404,
  });
});

// Error handler middleware
app.use(errorHandler);

// ==================== START SERVER ====================
const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════╗
  ║   🚀 Real-Time Chat Server Up!   ║
  ║   🌐 http://localhost:${PORT}      ║
  ╚═══════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Server shutting down...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
