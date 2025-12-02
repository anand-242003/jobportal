import prisma from "../config/db.js";

// Get all conversations for the logged-in user
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all conversations where user is either user1 or user2
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            },
            include: {
                user1: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        profilePhoto: true,
                        role: true
                    }
                },
                user2: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        profilePhoto: true,
                        role: true
                    }
                },
                messages: {
                    where: {
                        isRead: false,
                        senderId: { not: userId }
                    },
                    select: { id: true }
                }
            },
            orderBy: {
                lastMessageAt: 'desc'
            }
        });

        // Format conversations to include the other user and unread count
        const formattedConversations = conversations.map(conv => {
            const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
            return {
                id: conv.id,
                otherUser,
                lastMessage: conv.lastMessage,
                lastMessageAt: conv.lastMessageAt,
                unreadCount: conv.messages.length,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt
            };
        });

        res.status(200).json(formattedConversations);
    } catch (error) {
        console.error("Get conversations error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get or create a conversation with a specific user (for recruiters with accepted applications)
export const getOrCreateConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUserId } = req.params;
        const { applicationId, jobId } = req.query;

        if (userId === otherUserId) {
            return res.status(400).json({ message: "Cannot create conversation with yourself" });
        }

        // Check if other user exists
        const otherUser = await prisma.user.findUnique({
            where: { id: otherUserId },
            select: {
                id: true,
                fullName: true,
                email: true,
                profilePhoto: true,
                role: true
            }
        });

        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        // Determine user1 and user2 (smaller ID first for unique constraint)
        const [user1Id, user2Id] = [userId, otherUserId].sort();

        // Try to find existing conversation
        let conversation = await prisma.conversation.findUnique({
            where: {
                user1Id_user2Id: {
                    user1Id,
                    user2Id
                }
            },
            include: {
                user1: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        profilePhoto: true,
                        role: true
                    }
                },
                user2: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        profilePhoto: true,
                        role: true
                    }
                }
            }
        });

        // If conversation doesn't exist, only recruiters can create it
        if (!conversation) {
            // Check if user is a recruiter/employer
            if (currentUser.role !== 'Employer' && currentUser.role !== 'Admin') {
                return res.status(403).json({ 
                    message: "Only recruiters can initiate conversations. Wait for the recruiter to contact you." 
                });
            }

            // If applicationId provided, verify the application is accepted
            if (applicationId) {
                const application = await prisma.application.findUnique({
                    where: { id: applicationId },
                    include: { job: true }
                });

                if (!application) {
                    return res.status(404).json({ message: "Application not found" });
                }

                if (application.status !== 'Accepted') {
                    return res.status(403).json({ 
                        message: "Can only start conversations with accepted applications" 
                    });
                }

                // Verify the recruiter owns the job
                if (application.job.createdById !== userId) {
                    return res.status(403).json({ 
                        message: "You can only start conversations for your own job postings" 
                    });
                }
            }

            // Create conversation
            conversation = await prisma.conversation.create({
                data: {
                    user1Id,
                    user2Id,
                    participants: [user1Id, user2Id],
                    initiatedBy: userId,
                    applicationId: applicationId || null,
                    jobId: jobId || null
                },
                include: {
                    user1: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            profilePhoto: true,
                            role: true
                        }
                    },
                    user2: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            profilePhoto: true,
                            role: true
                        }
                    }
                }
            });
        }

        // Format response
        const response = {
            id: conversation.id,
            otherUser,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
            applicationId: conversation.applicationId || null,
            jobId: conversation.jobId || null,
            initiatedBy: conversation.initiatedBy || null,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Get or create conversation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get messages for a specific conversation
export const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        // Verify user is part of the conversation
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            }
        });

        if (!conversation) {
            return res.status(403).json({ message: "Access denied to this conversation" });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get messages
        const [messages, totalCount] = await Promise.all([
            prisma.message.findMany({
                where: { conversationId },
                include: {
                    sender: {
                        select: {
                            id: true,
                            fullName: true,
                            profilePhoto: true,
                            role: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.message.count({ where: { conversationId } })
        ]);

        // Reverse to show oldest first
        messages.reverse();

        const totalPages = Math.ceil(totalCount / parseInt(limit));

        res.status(200).json({
            messages,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalMessages: totalCount,
                hasMore: parseInt(page) < totalPages
            }
        });
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;

        // Verify user is part of the conversation
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            }
        });

        if (!conversation) {
            return res.status(403).json({ message: "Access denied to this conversation" });
        }

        // Mark all unread messages in this conversation as read
        const result = await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                isRead: false
            },
            data: {
                isRead: true
            }
        });

        res.status(200).json({
            message: "Messages marked as read",
            count: result.count
        });
    } catch (error) {
        console.error("Mark messages as read error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
