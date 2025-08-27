import { Request, Response } from "express";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "../schema/user.schema";
import { IUser, User } from "../models/users.model";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
      message: "Internal server error while refreshing token",
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
      res.status(400).json({
        message: "Confirm Password doesn't match",
        success: false,
      });
    }

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user?.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
      res.status(400).json({
        message: "Invalid Password",
        success: false,
      });
    }

    if (user) {
      user.password = newPassword;
      await user.save({ validateBeforeSave: true });
    }

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

export {
  signUp,
  signIn,
  verifyUser,
  logout,
  refreshAccessToken,
  logoutAll,
  changeCurrentPassword,
};
