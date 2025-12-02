import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../config/db.js";

// Socket.io event handlers
export const initializeSocketHandlers = (io) => {
    // Middleware for Socket.io authentication
    io.use(async (socket, next) => {
        try {
            // Get cookies from handshake headers
            const cookies = socket.handshake.headers.cookie;

            if (!cookies) {
                return next(new Error("Authentication error: No cookies provided"));
            }

            // Parse cookies
            const parsedCookies = cookie.parse(cookies);
            const token = parsedCookies.token;

            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, fullName: true, email: true, role: true }
            });

            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            // Attach user to socket
            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket authentication error:", error);
            return next(new Error("Authentication error"));
        }
    });

    // Connection event
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.fullName} (${socket.user.id})`);

        // Join user's personal room for receiving notifications
        socket.join(socket.user.id);

        // Join conversation room
        socket.on("join_conversation", (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${socket.user.id} joined conversation ${conversationId}`);
        });

        // Send message
        socket.on("send_message", async (data) => {
            try {
                const { conversationId, recipientId, content } = data;

                // Verify conversation exists and user is a participant
                const conversation = await prisma.conversation.findFirst({
                    where: {
                        id: conversationId,
                        OR: [
                            { user1Id: socket.user.id },
                            { user2Id: socket.user.id }
                        ]
                    }
                });

                if (!conversation) {
                    return socket.emit("error", { message: "Conversation not found or access denied" });
                }

                // Check if this is the first message and if sender is allowed
                const messageCount = await prisma.message.count({
                    where: { conversationId }
                });

                // If no messages exist and initiatedBy is set, only the initiator can send the first message
                if (messageCount === 0 && conversation.initiatedBy && conversation.initiatedBy !== socket.user.id) {
                    return socket.emit("error", { 
                        message: "Only the recruiter can send the first message" 
                    });
                }

                // Create message in database
                const message = await prisma.message.create({
                    data: {
                        content,
                        conversationId,
                        senderId: socket.user.id
                    },
                    include: {
                        sender: {
                            select: { id: true, fullName: true, profilePhoto: true, role: true }
                        }
                    }
                });

                // Update conversation's last message
                await prisma.conversation.update({
                    where: { id: conversationId },
                    data: {
                        lastMessage: content.substring(0, 100),
                        lastMessageAt: new Date()
                    }
                });

                // Emit message to conversation room
                io.to(conversationId).emit("new_message", {
                    message,
                    conversationId
                });

                // Also emit to recipient's personal room for notifications
                io.to(recipientId).emit("new_message_notification", {
                    message,
                    conversationId
                });

            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        // Typing indicator
        socket.on("typing", (data) => {
            const { conversationId, recipientId } = data;
            socket.to(recipientId).emit("user_typing", {
                userId: socket.user.id,
                conversationId
            });
        });

        // Stop typing indicator
        socket.on("stop_typing", (data) => {
            const { conversationId, recipientId } = data;
            socket.to(recipientId).emit("user_stopped_typing", {
                userId: socket.user.id,
                conversationId
            });
        });

        // Disconnect event
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user.fullName} (${socket.user.id})`);
        });
    });
};
