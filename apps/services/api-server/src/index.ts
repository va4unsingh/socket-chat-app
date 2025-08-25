import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import dbConnect from "@repo/db/mongo";
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

dbConnect();
app.get("/api/data", (req, res) => {
  res.json({
    message: "Hello from express REST API",
  });
});

app.use("/api/auth");

app.listen(PORT, () => {
  console.log(`Express Backend running on http://localhost:${PORT}`);
});
