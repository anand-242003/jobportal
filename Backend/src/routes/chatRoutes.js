import express from "express";
import {
    getConversations,
    getOrCreateConversation,
    getMessages,
    markMessagesAsRead
} from "../controllers/messageController.js";
import { searchUsers } from "../controllers/userSearchController.js";
import { authmiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authmiddleware);

// Search users to start conversation
router.get("/users/search", searchUsers);

// Get all user conversations
router.get("/conversations", getConversations);

// Get or create conversation with specific user
router.get("/conversations/:otherUserId", getOrCreateConversation);

// Get messages for a conversation
router.get("/messages/:conversationId", getMessages);

// Mark messages as read
router.put("/messages/:conversationId/read", markMessagesAsRead);

export default router;
