import { Router } from "express";
import {
  changeCurrentPassword,
  createChat,
  deactivateAccount,
  deleteAccount,
  forgotPassword,
  getChatMessages,
  getCurrentUser,
  getUserChats,
  logout,
  logoutAll,
  markMessagesAsRead,
  reactivateAccount,
  refreshAccessToken,
  resendVerificationEmail,
  resetPassword,
  sendMessage,
  signIn,
  signUp,
  updateAccountDetails,
  verifyUser,
} from "../controllers/users.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

// No auth needed
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/verify/:token").get(verifyUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/resend-verification").post(resendVerificationEmail);
router.route("/reactivate-account").patch(reactivateAccount);

// Auth needed
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT, logout);
router.route("/logout-all").post(verifyJWT, logoutAll);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/delete-account").delete(verifyJWT, deleteAccount);
router.route("/deactivate-account").patch(verifyJWT, deactivateAccount);

router.route("/chats").get(verifyJWT, getUserChats);
router.route("/chats").post(verifyJWT, createChat);
router.route("/chat/:chatId/messages").get(verifyJWT, getChatMessages);
router.route("/chats/:chatId/messages").post(verifyJWT, sendMessage);
router.route("/chats/:chatId/read").patch(verifyJWT, markMessagesAsRead);

export default router;
