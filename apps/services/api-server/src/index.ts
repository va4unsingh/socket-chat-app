import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import dbConnect from "@repo/db/mongo";
import userRouter from "./routes/users.routes";
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

dbConnect();

app.post("/", (req, res) => {
  return res.json({ message: "Test works!" });
});

app.use("/api/auth", userRouter);

app.listen(PORT, () => {
  console.log(`Express Backend running on http://localhost:${PORT}`);
});
