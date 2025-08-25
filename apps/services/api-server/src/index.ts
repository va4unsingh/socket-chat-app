import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import dbConnect from "@repo/db/mongo";
import userRouter from "./routes/auth.routes";
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

dbConnect();

app.post("/", (req, res) => {
  return res.json({ message: "Test works!" });
});

app.use("/api/auth", userRouter);

app.listen(PORT, () => {
  console.log(`Express Backend running on http://localhost:${PORT}`);
});
