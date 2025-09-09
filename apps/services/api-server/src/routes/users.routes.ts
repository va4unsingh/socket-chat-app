import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware";
import {
  blockUser,
  getBlockedUsers,
  getPrivacySettings,
  getUserProfile,
  searchUsers,
  unblockUser,
  updateNotificationSettings,
  updatePrivacySettings,
  updateUserProfile, // Import the new controller
  updateUserStatus,
  uploadAvatar,
} from "../controllers";

const router: Router = Router();

// User profiles
router.route("/profile/:userId").get(verifyJWT, getUserProfile);
router.route("/profile").patch(verifyJWT, updateUserProfile); // Add the new route
router.route("/search-users").get(verifyJWT, searchUsers);
router.route("/upload-avatar").patch(verifyJWT, uploadAvatar);
router.route("/update-status



").patch(verifyJWT, updateUserStatus);

// Privacy & blocking
router.route("/block/:userId").post(verifyJWT, blockUser);
router.route("/unblock/:userId").post(verifyJWT, unblockUser);
router.route("/blocked-users").get(verifyJWT, getBlockedUsers);

// Settings
router.route("/privacy-settings").get(verifyJWT, getPrivacySettings);
router.route("/privacy-settings").patch(verifyJWT, updatePrivacySettings);
router
  .route("/notification-settings")
  .patch(verifyJWT, updateNotificationSettings);

export default router;
