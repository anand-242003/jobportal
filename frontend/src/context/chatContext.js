"use client";

import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { initializeSocket, getSocket, disconnectSocket } from "@/lib/socketClient";
import { useUser } from "./userContext";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
    const { user } = useUser();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({});
    const [typingUsers, setTypingUsers] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    // Initialize Socket.io when user is authenticated
    useEffect(() => {
        if (user) {
            // Initialize socket with cookie-based auth
            const socket = initializeSocket();

            if (socket) {
                // Socket event listeners
                socket.on("connect", () => {
                    setIsConnected(true);
                });

                socket.on("disconnect", () => {
                    setIsConnected(false);
                });

                socket.on("new_message", ({ message, conversationId }) => {
                    // Add message to messages state
                    setMessages(prev => ({
                        ...prev,
                        [conversationId]: [...(prev[conversationId] || []), message]
                    }));

                    // Update conversation's last message
                    setConversations(prev => prev.map(conv =>
                        conv.id === conversationId
                            ? { ...conv, lastMessage: message.content, lastMessageAt: message.createdAt }
                            : conv
                    ));

                    // Increment unread count if not in active conversation
                    if (activeConversation?.id !== conversationId && message.senderId !== user.id) {
                        setUnreadCounts(prev => ({
                            ...prev,
                            [conversationId]: (prev[conversationId] || 0) + 1
                        }));
                    }
                });

                socket.on("user_typing", ({ userId, conversationId }) => {
                    setTypingUsers(prev => ({
                        ...prev,
                        [conversationId]: userId
                    }));
                });

                socket.on("user_stopped_typing", ({ userId, conversationId }) => {
                    setTypingUsers(prev => {
                        const updated = { ...prev };
                        delete updated[conversationId];
                        return updated;
                    });
                });
            }
        }

        return () => {
            disconnectSocket();
            setIsConnected(false);
        };
    }, [user, activeConversation]);

    // Fetch conversations
    const fetchConversations = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get("/chat/conversations");
            
            // Filter conversations - only show if there's at least one message
            const activeConversations = data.filter(conv => conv.lastMessage);
            setConversations(activeConversations);

            // Set unread counts
            const counts = {};
            activeConversations.forEach(conv => {
                if (conv.unreadCount > 0) {
                    counts[conv.id] = conv.unreadCount;
                }
            });
            setUnreadCounts(counts);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    }, []);

    // Fetch messages for a conversation
    const fetchMessages = useCallback(async (conversationId) => {
        try {
            const { data } = await axiosInstance.get(`/chat/messages/${conversationId}`);
            setMessages(prev => ({
                ...prev,
                [conversationId]: data.messages
            }));
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, []);

    // Send message
    const sendMessage = useCallback((conversationId, recipientId, content) => {
        const socket = getSocket();
        if (socket && socket.connected) {
            socket.emit("send_message", {
                conversationId,
                recipientId,
                content
            });
        } else {
            console.error("Socket not connected");
        }
    }, []);

    // Mark messages as read
    const markAsRead = useCallback(async (conversationId) => {
        try {
            await axiosInstance.put(`/chat/messages/${conversationId}/read`);
            setUnreadCounts(prev => {
                const updated = { ...prev };
                delete updated[conversationId];
                return updated;
            });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    }, []);

    // Join conversation room
    const joinConversation = useCallback((conversationId) => {
        const socket = getSocket();
        if (socket) {
            socket.emit("join_conversation", conversationId);
        }
    }, []);

    // Send typing indicator
    const sendTyping = useCallback((conversationId, recipientId) => {
        const socket = getSocket();
        if (socket) {
            socket.emit("typing", { conversationId, recipientId });
        }
    }, []);

    // Stop typing indicator
    const stopTyping = useCallback((conversationId, recipientId) => {
        const socket = getSocket();
        if (socket) {
            socket.emit("stop_typing", { conversationId, recipientId });
        }
    }, []);

    // Get or create conversation
    const getOrCreateConversation = useCallback(async (otherUserId, params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.applicationId) queryParams.append('applicationId', params.applicationId);
            if (params.jobId) queryParams.append('jobId', params.jobId);
            
            const url = `/chat/conversations/${otherUserId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const { data } = await axiosInstance.get(url);

            // Add to conversations if not exists
            setConversations(prev => {
                const exists = prev.find(c => c.id === data.id);
                if (exists) return prev;
                return [data, ...prev];
            });

            return data;
        } catch (error) {
            console.error("Error getting/creating conversation:", error);
            throw error;
        }
    }, []);

    // Total unread count
    const totalUnreadCount = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

    const contextValue = {
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        unreadCounts,
        totalUnreadCount,
        typingUsers,
        isConnected,
        fetchConversations,
        fetchMessages,
        sendMessage,
        markAsRead,
        joinConversation,
        sendTyping,
        stopTyping,
        getOrCreateConversation
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    return useContext(ChatContext);
};
