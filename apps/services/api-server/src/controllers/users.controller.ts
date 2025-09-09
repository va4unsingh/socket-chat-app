// User Profiles & Social Features

import { Request, Response } from "express";
import { UserProfile } from "../models/userProfile.model";
import { User } from "../models/users.model";
import mongoose from "mongoose";

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
        success: false,
      });
    }

    const userProfile = await UserProfile.findOne({ user: userId }).populate({
      path: "user",
      select: "email", // Select the fields you want to expose
    });

    if (!userProfile) {
      // If no profile, maybe create one or just return user data?
      // For now, let's check if the user exists and return basic info.
      const user = await User.findById(userId).select("email");
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }
      // You might want to create a default profile here if one doesn't exist
      return res.status(200).json({
        message: "User found, but no profile created yet.",
        success: true,
        data: { user },
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({
      message: "Internal server error while fetching user profile",
      success: false,
    });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { bio, avatar } = req.body;

    // Find the profile and update it, or create it if it doesn't exist
    const userProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          bio,
          avatar,
        },
      },
      { new: true, upsert: true, runValidators: true } // upsert creates if not found
    );

    if (!userProfile) {
      return res.status(500).json({
        message: "Failed to update or create user profile",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    return res.status(500).json({
      message: "Internal server error while updating user profile",
      success: false,
    });
  }
};

const searchUsers = async (req: Request, res: Response) => {
  /* ... */
};

const uploadAvatar = async (req: Request, res: Response) => {
  /* ... */
};

const updateUserStatus = async (req: Request, res: Response) => {
  /* ... */
};

const blockUser = async (req: Request, res: Response) => {
  /* ... */
};

const unblockUser = async (req: Request, res: Response) => {
  /* ... */
};

const getBlockedUsers = async (req: Request, res: Response) => {
  /* ... */
};

// Privacy settings controllers
const getPrivacySettings = async (req: Request, res: Response) => {
  /* ... */
};

const updatePrivacySettings = async (req: Request, res: Response) => {
  /* ... */
};

const updateNotificationSettings = async (req: Request, res: Response) => {
  /* ... */
};

export {
  getUserProfile,
  updateUserProfile,
  searchUsers,
  uploadAvatar,
  updateUserStatus,
  blockUser,
  unblockUser,
  getBlockedUsers,
  getPrivacySettings,
  updatePrivacySettings,
  updateNotificationSettings,
};
