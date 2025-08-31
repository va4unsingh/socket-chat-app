import { Request, Response } from "express";
import { User } from "../models/users.model";
import { Chat } from "../models/chat.model";
import mongoose from "mongoose";
import { IMessage, Message } from "../models/message.model";

// Chat & Messagings

const createChat = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { participantId, type = "direct", name: groupName } = req.body;

    // Validate input
    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: "Participant ID is required",
      });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // For direct chats, check if chat already exists
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
          success: true,
          data: existingChat,
          message: "Chat already exists",
        });
      }
    }

    // Create new chat
    const chatData: any = {
      type,
      participants: [userId, participantId],
      lastActivity: new Date(),
    };

    // For group chats
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
      success: true,
      data: populatedChat,
      message: `${type === "group" ? "Group" : "Chat"} created successfully`,
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

    // Validate chatId
    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID",
      });
    }

    // Check if user is participant in this chat
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

    // Get messages with pagination (newest first)
    const messages = await Message.find({
      chat: chatId,
      isDeleted: false,
    })
      .populate("sender", "firstname lastname username")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count for pagination info
    const totalMessages = await Message.countDocuments({
      chat: chatId,
      isDeleted: false,
    });

    const totalPages = Math.ceil(totalMessages / limit);

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages,
          hasMore: page < totalPages,
        },
      },
      message: "Messages retrieved successfully",
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

    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // Validate chatId
    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID",
      });
    }

    // Check if user is participant in this chat
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

    // Validate file URL if provided
    if (messageType !== "text" && !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "File URL is required for non-text messages",
      });
    }

    // Create message
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

    // Update chat's lastMessage and lastActivity
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      lastActivity: new Date(),
    });

    // Populate sender info
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "firstname lastname username"
    );

    res.status(201).json({
      success: true,
      data: populatedMessage,
      message: "Message sent successfully",
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
    const { messageIds } = req.body; // Optional: specific message IDs

    // Validate chatId
    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID",
      });
    }

    // Check if user is participant in this chat
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

    let query: any = {
      chat: chatId,
      sender: { $ne: userId }, // Don't mark own messages as read
      "readBy.user": { $ne: userId }, // Only unread messages
    };

    // If specific message IDs provided
    if (messageIds && Array.isArray(messageIds)) {
      const validMessageIds = messageIds.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (validMessageIds.length > 0) {
        query._id = { $in: validMessageIds };
      }
    }

    // Find messages to update
    const messagesToUpdate = await Message.find(query);

    if (messagesToUpdate.length === 0) {
      return res.status(200).json({
        success: true,
        data: { updatedCount: 0 },
        message: "No messages to mark as read",
      });
    }

    // Add read receipt to each message
    const readReceipt = {
      user: new mongoose.Types.ObjectId(userId),
      readAt: new Date(),
    };

    const updateResult = await Message.updateMany(query, {
      $push: {
        readBy: readReceipt,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        updatedCount: updateResult.modifiedCount,
        totalMessages: messagesToUpdate.length,
      },
      message: `${updateResult.modifiedCount} messages marked as read`,
    });
  } catch (error) {
    console.error("Mark messages as read error:", error);
    res.status(500).json({
      success: false,
      message: "Error marking messages as read",
    });
  }
};

const createGroup = async (req: Request, res: Response) => {};

const addGroupMember = async (req: Request, res: Response) => {};

const removeGroupMember = async (req: Request, res: Response) => {};

const leaveGroup = async (req: Request, res: Response) => {};

const uploadFile = async (req: Request, res: Response) => {};

export {
  createChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  createGroup,
  addGroupMember,
  removeGroupMember,
  leaveGroup,
  uploadFile,
};
