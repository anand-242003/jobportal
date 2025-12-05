import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../config/db.js";

export const initializeSocketHandlers = (io) => {
    io.use(async (socket, next) => {
        try {
            const tokenFromQuery = socket.handshake.auth?.token;
            const cookies = socket.handshake.headers.cookie;
            let token = tokenFromQuery;

            if (!token && cookies) {
                const parsedCookies = cookie.parse(cookies);
                token = parsedCookies.token;
            }

            if (!token) {
                socket.user = null;
                return next();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, fullName: true, email: true, role: true }
            });

            if (!user) {
                socket.user = null;
                return next();
            }

            socket.user = user;
            next();
        } catch (error) {
            socket.user = null;
            next();
        }
    });

    io.on("connection", (socket) => {
        if (socket.user) {
            socket.join(socket.user.id);
        }

        socket.on("join_conversation", (conversationId) => {
            if (!socket.user) {
                return socket.emit("error", { message: "Not authenticated. Please login." });
            }
            socket.join(conversationId);
        });

        socket.on("send_message", async (data) => {
            try {
                if (!socket.user) {
                    return socket.emit("error", { message: "Not authenticated. Please login." });
                }

                const { conversationId, recipientId, content } = data;

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

                const messageCount = await prisma.message.count({
                    where: { conversationId }
                });

                if (messageCount === 0 && conversation.initiatedBy && conversation.initiatedBy !== socket.user.id) {
                    return socket.emit("error", { 
                        message: "Only the recruiter can send the first message" 
                    });
                }

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

                await prisma.conversation.update({
                    where: { id: conversationId },
                    data: {
                        lastMessage: content.substring(0, 100),
                        lastMessageAt: new Date()
                    }
                });
                
                io.to(conversationId).emit("new_message", {
                    message,
                    conversationId
                });

                io.to(recipientId).emit("new_message_notification", {
                    message,
                    conversationId
                });

                socket.emit("message_sent", {
                    message,
                    conversationId
                });

            } catch (error) {
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        socket.on("typing", (data) => {
            if (!socket.user) return;
            const { conversationId, recipientId } = data;
            socket.to(recipientId).emit("user_typing", {
                userId: socket.user.id,
                conversationId
            });
        });

        socket.on("stop_typing", (data) => {
            if (!socket.user) return;
            const { conversationId, recipientId } = data;
            socket.to(recipientId).emit("user_stopped_typing", {
                userId: socket.user.id,
                conversationId
            });
        });

        socket.on("disconnect", () => {});
    });
};
