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

router.use(authmiddleware);

router.get("/users/search", searchUsers);

router.get("/conversations", getConversations);

router.get("/conversations/:otherUserId", getOrCreateConversation);

router.get("/messages/:conversationId", getMessages);

router.put("/messages/:conversationId/read", markMessagesAsRead);

export default router;
