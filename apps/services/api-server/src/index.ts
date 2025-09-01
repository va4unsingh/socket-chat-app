import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import dbConnect from "@repo/db/mongo";

import { authRoutes, chatRoutes, userRoutes } from "./routes";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

dbConnect();

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Chat App API is running!",
  });
});

// Routes with proper base paths
app.use("/api/v1/auth", authRoutes); // Authentication routes
app.use("/api/v1/chat", chatRoutes); // Chat & messaging routes
app.use("/api/v1/users", userRoutes); // User profile & social routes

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy!",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.stack || err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Chat App Backend running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/v1/health`);
});
