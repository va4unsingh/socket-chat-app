import { Request, Response } from "express";
import mongoose from "mongoose";
import { loginSchema, registerSchema } from "../schema/user.schema";
import { IUser, User } from "../models/users.model";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (
  userId: string,
  deviceInfo?: string
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Calculate expiration date based on REFRESH_TOKEN_EXPIRY (7d default)
    const refreshTokenExpiryMs = 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + refreshTokenExpiryMs);

    user.refreshTokens.push({
      token: refreshToken,
      device: deviceInfo || "unknown",
      createdAt: new Date(),
      expiresAt: expiresAt,
    });

    // remove oldest if > 5
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`Error generating tokens for userId ${userId}:`, error);
    throw error;
  }
};

const getDeviceInfo = (req: Request): string => {
  const userAgent = req.headers["user-agent"] || "";

  // Simple device detection
  if (userAgent.includes("Mobile") || userAgent.includes("Android")) {
    return "Mobile";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    return "iOS";
  } else if (userAgent.includes("Chrome")) {
    return "Chrome Browser";
  } else if (userAgent.includes("Firefox")) {
    return "Firefox Browser";
  } else if (userAgent.includes("Safari")) {
    return "Safari Browser";
  } else {
    return "Unknown Device";
  }
};

const signUp = async (req: Request, res: Response) => {
  try {
    const parsedBody = registerSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body for signUp",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { firstname, lastname, username, email, password } = parsedBody.data;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.username === username
            ? "Username already taken"
            : "Email already registered",
        success: false,
      });
    }

    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password,
    });

    if (!user) {
      return res.status(500).json({
        message: "Failed to create user",
        success: false,
      });
    }

    const verificationToken = user.generateVerificationToken();
    await user.save();

    try {
      // send mail to user for verification
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST as string,
        port: parseInt(process.env.MAILTRAP_PORT as string),
        secure: false,
        auth: {
          user: process.env.MAILTRAP_USERNAME as string,
          pass: process.env.MAILTRAP_PASSWORD as string,
        },
      });

      const mailOption = {
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: user.email,
        subject: "Click here to verify your email",
        text: `Please click on the following link: ${process.env.BASE_URL}/api/auth/verify/${verificationToken}`,
      };

      await transporter.sendMail(mailOption);
      console.log(`Verification email sent to: ${user.email}`);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // User is still created successfully just email failed
    }

    return res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account",
      success: true,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("SignUp error:", error);
    return res.status(500).json({
      message: "Internal server error while registering user",
      success: false,
    });
  }
};

const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Invalid or missing token",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      message: "Internal server error while verifying user",
      success: false,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const parsedBody = loginSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body for signIn",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { identifier, password } = parsedBody.data;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before signing in",
        success: false,
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    try {
      // Get device info and generate tokens
      const deviceInfo = getDeviceInfo(req);
      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id as string);

      const loggedInUser = await User.findById(user._id).select(
        "-refreshToken -password"
      );

      const refreshTokenOptions = {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      };

      const accessTokenOptions = {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000, // 15 mins
      };

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .json({
          message: "Login successful, Your email is verified.",
          user: loggedInUser,
          refreshToken,
          accessToken,
        });
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return res.status(500).json({
        message: "Failed to generate authentication tokens",
        success: false,
      });
    }
  } catch (error) {
    console.error("Sign in error:", error);
    return res.status(500).json({
      message: "Internal server error while logging user user",
      success: false,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized request",
        success: false,
      });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "User logged out",
        success: true,
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error while logging out user",
      success: false,
    });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Body:", req.body);
    console.log("Headers:", req.headers.cookie);

    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Unauthorized Request",
        success: false,
      });
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as IUser;

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
        success: false,
      });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({
        message: "Refresh token is expired or used",
        success: false,
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    await User.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        message: "Access token refreshed",
        accessToke: newAccessToken,
        refreshToken: newRefreshToken,
        success: true,
      });
  } catch (error) {
    console.error("Refresh token:", error);
    return res.status(500).json({
      message: "Internal server error while refreshing",
      success: false,
    });
  }
};

export { signUp, signIn, verifyUser, logout, refreshAccessToken };
