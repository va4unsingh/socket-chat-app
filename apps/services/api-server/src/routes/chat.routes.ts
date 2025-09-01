import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addGroupMember,
  createChat,
  createGroup,
  getChatMessages,
  getUserChats,
  leaveGroup,
  markMessagesAsRead,
  removeGroupMember,
  sendMessage,
  uploadFile,
} from "../controllers";
const router: Router = Router();

router.route("/chats").get(verifyJWT, getUserChats);
router.route("/chats").post(verifyJWT, createChat);
router.route("/chats/:chatId/messages").get(verifyJWT, getChatMessages);
router.route("/chats/:chatId/messages").post(verifyJWT, sendMessage);
router.route("/chats/:chatId/read").patch(verifyJWT, markMessagesAsRead);

// Group chats
router.route("/groups").post(verifyJWT, createGroup);
router.route("/groups/:groupId/members").post(verifyJWT, addGroupMember);
router
  .route("/groups/:groupId/members/:userId")
  .delete(verifyJWT, removeGroupMember);
router.route("/groups/:groupId/leave").post(verifyJWT, leaveGroup);

// File uploads
router.route("/upload-file").post(verifyJWT, uploadFile);

export default router;
