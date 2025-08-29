import mongoose, { Document } from "mongoose";

export interface IUserProfile extends Document {
  user: mongoose.Types.ObjectId;
  avatar?: string;
  bio: string;
  status: "online" | "offline" | "away";
  lastSeen: Date;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new mongoose.Schema<IUserProfile>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    avatar: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Invalid avatar URL",
      },
    },

    bio: {
      type: String,
      maxLength: [150, "Bio cannot exceed 150 characters"],
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserProfile = mongoose.model<IUserProfile>(
  "UserProfile",
  userProfileSchema
);
