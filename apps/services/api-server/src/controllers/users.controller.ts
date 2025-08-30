import { Request, Response } from "express";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationEmailSchema,
  resetPasswordSchema,
  updateAccountSchema,
} from "../schema/user.schema";
import { IUser, User } from "../models/users.model";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Chat, IChat } from "../models/chat.model";
import { group } from "console";
import mongoose from "mongoose";
import { IMessage, Message } from "../models/message.model";
import { success } from "zod";

const generateAccessAndRefreshTokens = async (
  userId: string,
  deviceInfo: string = "unknown"
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Clean up any expired tokens first
    user.cleanupExpiredTokens();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Add the new refresh token (this handles the 5-session limit automatically)
    user.addRefreshToken(refreshToken, deviceInfo);

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
      verificationTokenExpires: { $gt: Date.now() },
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

      // Get user without sensitive data
      const loggedInUser = await User.findById(user._id).select(
        "-refreshTokens"
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

    const incomingRefreshToken = req.cookies.refreshToken;

    if (incomingRefreshToken) {
      // Remove only the current session's refresh token
      const user = await User.findById(req.user._id);
      if (user) {
        user.removeRefreshToken(incomingRefreshToken);
        await user.save();
      }
    }

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

const logoutAll = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized request",
        success: false,
      });
    }

    // Clear all refresh tokens for this user
    const user = await User.findById(req.user._id);
    if (user) {
      user.clearAllRefreshTokens();
      await user.save();
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "User logged out from all devices",
        success: true,
      });
  } catch (error) {
    console.error("Logout all error:", error);
    return res.status(500).json({
      message: "Internal server error while logging out user from all devices",
      success: false,
    });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Unauthorized Request",
        success: false,
      });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as any;
    } catch (jwtError) {
      return res.status(401).json({
        message: "Invalid refresh token",
        success: false,
      });
    }
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
        success: false,
      });
    }

    // Check if the token exists in user's refresh tokens array and is not expired
    if (!user.hasValidRefreshToken(incomingRefreshToken)) {
      return res.status(401).json({
        message: "Refresh token is expired or invalid",
        success: false,
      });
    }

    // Generate only a new access token, keep the same refresh token
    const newAccessToken = user.generateAccessToken();

    const accessTokenOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000, // 15 mins
    };

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, accessTokenOptions)
      .json({
        message: "Access token refreshed",
        success: true,
        accessToken: newAccessToken,
      });
  } catch (error) {
    console.error("Refresh token:", error);
    return res.status(500).json({
      message: "Internal server error while refreshing access token",
      success: false,
    });
  }
};

const changeCurrentPassword = async (req: Request, res: Response) => {
  try {
    const parsedBody = changePasswordSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body for signUp",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { currentPassword, newPassword, confirmNewPassword } =
      parsedBody.data;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Confirm Password doesn't match",
        success: false,
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
        success: false,
      });
    }

    const user = await User.findById(req.user?._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect",
        success: false,
      });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: true });

    return res.status(200).json({
      message: "Password changed Successfully",
      success: true,
    });
  } catch (error) {
    console.error("Change Password error:", error);
    return res.status(500).json({
      message: "Internal server error while changing Password",
      success: false,
    });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { refreshTokens, ...safeUser } = req.user.toObject();

    return res.status(200).json({
      message: "Current user fetched successfully",
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({
      message: "Internal server error while fetching current user ",
      success: false,
    });
  }
};

const updateAccountDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const parsedBody = updateAccountSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body for signUp",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { firstname, lastname, email, username } = parsedBody.data;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          firstname,
          lastname,
          username,
          email,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Account Details upadted Successfully",
      success: true,
    });
  } catch (error) {
    console.error("Update user detail error:", error);
    return res.status(500).json({
      message: "Internal server error while updating user detail",
      success: false,
    });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const parsedBody = forgotPasswordSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body for forgotPassword", // Fixed message
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { identifier } = parsedBody.data;

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid User",
        success: false,
      });
    }

    const resetPasswordToken = user.generatePasswordResetToken();
    await user.save();

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST as string,
        port: parseInt(process.env.MAILTRAP_PORT as string),
        secure: false,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });

      const resetUrl = `${process.env.BASE_URL}/reset-password/${resetPasswordToken}`;

      const mailOptions = {
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: user.email,
        subject: "Password Reset",
        text: `Click this link to reset your password: ${resetUrl}`,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        message: "Failed to send reset email",
        success: false,
      });
    }

    res.status(200).json({
      message: "Password reset link sent to your email.",
      success: true,
    });
  } catch (error) {
    console.error("Forget password error:", error);
    return res.status(500).json({
      message: "Internal server error while processing forgot password",
      success: false,
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const parsedBody = resetPasswordSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body for reset password",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { password, confirmPassword } = parsedBody.data;

    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Invalid or missing token",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Confirm Password doesn't match",
        success: false,
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid or expired reset token",
        success: false,
      });
    }

    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Internal server error while resetting password",
      success: false,
    });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized request",
        success: false,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.clearAllRefreshTokens();
    await user.save();

    await User.findByIdAndDelete(req.user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json({
        message: "User Account deleted successfully",
        success: true,
      });
  } catch (error) {
    console.error("Logout all error:", error);
    return res.status(500).json({
      message: "Internal server error while logging out user from all devices",
      success: false,
    });
  }
};

const deactivateAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized request",
        success: false,
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found ",
        success: false,
      });
    }

    user.isActive = false;
    user.deactivatedAt = new Date();
    user.clearAllRefreshTokens?.();
    await user.save();

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json({
        message: "Account deactivated successfully",
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to deactivate account",
      success: false,
    });
  }
};

const reactivateAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized request",
        success: false,
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        message: "Account already active",
        success: false,
      });
    }
    // Reactivate account
    user.isActive = true;
    user.reactivatedAt = new Date();
    await user.save();

    return res.status(200).json({
      message: "Account reactivated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to reactivate account",
      success: true,
    });
  }
};

const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const parsedBody = resendVerificationEmailSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body for signUp",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { email } = parsedBody.data;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: true,
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Account already verified",
        success: false,
      });
    }

    // 🔑 generate new token (raw token for email)
    const verificationToken = user.generateVerificationToken();
    user.save();

    // send mail
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
    console.log(`Verification email resent to: ${user.email}`);

    return res.status(200).json({
      message: "Verification email resent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      message: "Internal server error while resending verification email",
      success: false,
    });
  }
};

const createChat = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { participantId, type = "direct", name: groupName } = req.body;

    if (!participantId) {
      return res.status(400).json({
        message: "Participant ID is required",
        success: false,
      });
    }

    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (type === "direct") {
      const existingChat = await Chat.findOne({
        type: "direct",
        participants: {
          $all: [userId, participantId],
          $size: 2,
        },
      }).populate("participants", "firstname lastname username");

      if (existingChat) {
        return res.status(200).json({
          message: "Chat already exists",
          sucess: true,
          data: existingChat,
        });
      }
    }

    const chatData: any = {
      type,
      participants: [userId, participantId],
      lastActivity: new Date(),
    };
    if (type === "group") {
      if (!groupName || groupName.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Group name is required for group chats",
        });
      }
      chatData.name = groupName.trim();
      chatData.admin = [userId];
    }

    const chat = await Chat.create(chatData);

    const populatedChat = await Chat.findById(chat._id)
      .populate("participants", "firstname lastname username")
      .populate("admin", "firstname lastname username");

    res.status(201).json({
      message: `${type === "group" ? "Group" : "Chat"} created successfully`,
      success: true,
      data: populatedChat,
    });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating chat",
    });
  }
};

const getUserChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "firstname lastname username")
      .populate("lastMessage")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstname lastname username",
        },
      })
      .sort({ lastActivity: -1 });

    res.status(200).json({
      message: "Chats retrieved successfully",
      succcess: true,
      data: chats,
      count: chats.length,
    });
  } catch (error) {
    console.error("Get user chats error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving chats",
    });
  }
};

const getChatMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(chatId!)) {
      return res.status(400).json({
        message: "Invalid chat ID",
        success: false,
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(403).json({
        message: "Access denied or chat not found",
        success: false,
      });
    }

    const messages = await Message.find({
      chat: chatId,
      isDeleted: false,
    })
      .populate("sender", "firstname lastname username")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalMessages = await Message.countDocuments({
      chat: chatId,
      isDeleted: false,
    });

    const totalPages = Math.ceil(totalMessages / limit);

    res.status(200).json({
      message: "Messages retrieved successfully",
      success: true,
      data: {
        message: messages.reverse(),
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages,
          hasMore: page < totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Get chat messages error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving messages",
    });
  }
};

const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.params;
    const { content, messageType = "text", fileUrl } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        message: "Message content is required",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId!)) {
      return res.status(400).json({
        message: "Invalid chat ID",
        success: false,
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(403).json({
        success: false,
        message: "Access denied or chat not found",
      });
    }

    if (messageType !== "text" && !fileUrl) {
      return res.status(400).json({
        message: "File URL is required for non-text messages",
        success: false,
      });
    }

    const messageData: Partial<IMessage> = {
      sender: new mongoose.Types.ObjectId(userId),
      chat: new mongoose.Types.ObjectId(chatId),
      content: content.trim(),
      messageType,
    };

    if (fileUrl) {
      messageData.fileUrl = fileUrl;
    }

    const message = await Message.create(messageData);

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      lastActivity: new Date(),
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "firstname lastname username"
    );

    res.status(201).json({
      message: "Message sent successfully",
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending message",
    });
  }
};

const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.params;
    const { messageIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(chatId!)) {
      return res.status(400).json({
        message: "Invalid chat ID",
        success: true,
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(403).json({
        message: "Access denied or chat not found",
        success: false,
      });
    }

    let query: any = {
      chat: chatId,
      sender: { $ne: userId }, // Don't mark own messages as read
      "readBy.user": { $ne: userId }, // Only unread messages
    };

    if (messageIds && Array.isArray(messageIds)) {
      const validMessageIds = messageIds.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if(validMessageIds.length>0){
        query.
      }
    }
  } catch (error) {}
};

export {
  signUp,
  signIn,
  verifyUser,
  logout,
  refreshAccessToken,
  logoutAll,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  forgotPassword,
  resetPassword,
  deleteAccount,
  deactivateAccount,
  reactivateAccount,
  resendVerificationEmail,
  createChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
};