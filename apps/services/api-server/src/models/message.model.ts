import mongoose, { Document } from "mongoose";

interface IReadReceipt {
  user: mongoose.Types.ObjectId;
  readAt: Date;
}

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  chat: mongoose.Types.ObjectId;
  content: string;
  messageType: "text" | "image" | "file";
  fileUrl?: string;
  readBy: IReadReceipt[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxLength: [1000, "Message cannot exceed 1000 characters"],
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    fileUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Invalid file URL",
      },
    },

    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);

export type { IMessage, IReadReceipt };
