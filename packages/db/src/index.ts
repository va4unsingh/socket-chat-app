import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.log("MONGO URI ISN'T LOADED");
}

const dbConnect = async () => {
  try {
    const db = await mongoose.connect(MONGODB_URI);
    console.log(`Mongo DB is running on Port: ${db.connection.port}`);
  } catch (error) {
    console.log("Failed to connect MongoDB due to some reasons");
  }
};

export default dbConnect;
