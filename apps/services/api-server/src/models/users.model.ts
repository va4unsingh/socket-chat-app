import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface RefreshTokenData {
  token: string; // the JWT
  device: string; // iphone, chrome, etc.
  createdAt: Date;
  expiresAt: Date;
}

interface IUser extends Document {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  // All refresh token info is here
  refreshTokens: RefreshTokenData[];

  createdAt: Date;
  updatedAt: Date;

  // Existing authentication methods
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateVerificationToken(): string;
  generatePasswordResetToken(): string;

  // New refresh token management methods
  addRefreshToken(token: string, device?: string): void;
  removeRefreshToken(tokenToRemove: string): void;
  clearAllRefreshTokens(): void;
  cleanupExpiredTokens(): void;
  hasValidRefreshToken(token: string): boolean;
  getActiveSessionsCount(): number;

  isActive?: boolean; // <-- add this
  deactivatedAt?: Date;
  reactivatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    verificationToken: {
      type: String,
      index: true,
    },

    verificationTokenExpires: Date,

    resetPasswordToken: {
      type: String,
      index: true,
    },

    resetPasswordExpires: Date,

    refreshTokens: [
      {
        token: { type: String, required: true },
        device: { type: String, default: "unknown" },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    deactivatedAt: {
      type: Date,
    },

    reactivatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1, isVerified: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  console.log("Checking password for user:", this.email);

  if (!this.password) {
    // console.log("No password set for this user");
    return false;
  }

  if (!password) {
    // console.log("No password provided to compare");
    return false;
  }

  try {
    const isMatch = await bcrypt.compare(password, this.password);
    // console.log("Password comparison result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

// Helper function to parse time string to milliseconds
const parseTimeToMs = (timeStr: string): number => {
  const timeValue = parseInt(timeStr);
  const timeUnit = timeStr.slice(-1).toLowerCase();

  switch (timeUnit) {
    case "s":
      return timeValue * 1000;
    case "m":
      return timeValue * 60 * 1000;
    case "h":
      return timeValue * 60 * 60 * 1000;
    case "d":
      return timeValue * 24 * 60 * 60 * 1000;
    case "w":
      return timeValue * 7 * 24 * 60 * 60 * 1000;
    default:
      return timeValue * 60 * 1000; // default to minutes
  }
};

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY as any,
    }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY as any,
    }
  );
};

// Updated method for multiple refresh tokens
userSchema.methods.addRefreshToken = function (
  token: string,
  device: string = "unknown"
): void {
  const expiryMs = parseTimeToMs(REFRESH_TOKEN_EXPIRY);
  const expiresAt = new Date(Date.now() + expiryMs);

  this.refreshTokens.push({
    token,
    device,
    createdAt: new Date(),
    expiresAt,
  });

  // Keep only last 5 sessions
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
};

userSchema.methods.removeRefreshToken = function (tokenToRemove: string): void {
  this.refreshTokens = this.refreshTokens.filter(
    (tokenData: RefreshTokenData) => tokenData.token !== tokenToRemove
  );
};

userSchema.methods.clearAllRefreshTokens = function (): void {
  this.refreshTokens = [];
};

userSchema.methods.cleanupExpiredTokens = function (): void {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(
    (tokenData: RefreshTokenData) => tokenData.expiresAt > now
  );
};

userSchema.methods.hasValidRefreshToken = function (token: string): boolean {
  const now = new Date();
  return this.refreshTokens.some(
    (tokenData: RefreshTokenData) =>
      tokenData.token === token && tokenData.expiresAt > now
  );
};

userSchema.methods.getActiveSessionsCount = function (): number {
  const now = new Date();
  return this.refreshTokens.filter(
    (tokenData: RefreshTokenData) => tokenData.expiresAt > now
  ).length;
};

userSchema.methods.generateVerificationToken = function (): string {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24hr
  return token;
};

userSchema.methods.generatePasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10mins
  return resetToken;
};

export const User = mongoose.model<IUser>("User", userSchema);

export type { IUser };
