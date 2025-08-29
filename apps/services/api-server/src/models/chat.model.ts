import mongoose, { Document } from "mongoose";

export interface IChat extends Document {
  type: "direct" | "group";
  participants: mongoose.Types.ObjectId[];
  name?: string;
  admin?: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId[];
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // For group chat only
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Group name cannot exceed 50 characters"],
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
