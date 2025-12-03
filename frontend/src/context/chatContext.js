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

    useEffect(() => {
        if (user) {
            const socket = initializeSocket();

            if (socket) {
                socket.on("connect", () => {
                    setIsConnected(true);
                });

                socket.on("disconnect", () => {
                    setIsConnected(false);
                });

                const handleNewMessage = ({ message, conversationId }) => {
                    console.log("Received new_message event:", message);
                    
                    setMessages(prev => {
                        const existingMessages = prev[conversationId] || [];
                        const filteredMessages = existingMessages.filter(m => !m._isOptimistic);
                        
                        const messageExists = filteredMessages.some(m => m.id === message.id);
                        if (messageExists) {
                            return prev;
                        }
                        
                        return {
                            ...prev,
                            [conversationId]: [...filteredMessages, message]
                        };
                    });

                    setConversations(prev => prev.map(conv =>
                        conv.id === conversationId
                            ? { ...conv, lastMessage: message.content, lastMessageAt: message.createdAt }
                            : conv
                    ));

                    if (activeConversation?.id !== conversationId && message.senderId !== user.id) {
                        setUnreadCounts(prev => ({
                            ...prev,
                            [conversationId]: (prev[conversationId] || 0) + 1
                        }));
                    }
                };

                socket.on("new_message", handleNewMessage);
                socket.on("new_message_notification", handleNewMessage);

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

                socket.on("error", (error) => {
                    console.error("Socket error:", error);
                    alert(error.message || "An error occurred");
                });
            }
        }

        return () => {
            disconnectSocket();
            setIsConnected(false);
        };
    }, [user, activeConversation]);

    const fetchConversations = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get("/chat/conversations");
            
            const activeConversations = data.filter(conv => conv.lastMessage);
            setConversations(activeConversations);

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

    const sendMessage = useCallback((conversationId, recipientId, content) => {
        const socket = getSocket();
        if (socket && socket.connected) {
            const tempMessage = {
                id: `temp-${Date.now()}`,
                content,
                senderId: user.id,
                conversationId,
                createdAt: new Date().toISOString(),
                sender: {
                    id: user.id,
                    fullName: user.fullName,
                    profilePhoto: user.profilePhoto,
                    role: user.role
                },
                _isOptimistic: true
            };

            setMessages(prev => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), tempMessage]
            }));

            socket.emit("send_message", {
                conversationId,
                recipientId,
                content
            });
        } else {
            console.error("Socket not connected");
            alert("Not connected to chat server. Please refresh the page.");
        }
    }, [user]);

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

    const joinConversation = useCallback((conversationId) => {
        const socket = getSocket();
        if (socket) {
            socket.emit("join_conversation", conversationId);
        }
    }, []);

    const sendTyping = useCallback((conversationId, recipientId) => {
        const socket = getSocket();
        if (socket) {
            socket.emit("typing", { conversationId, recipientId });
        }
    }, []);

    const stopTyping = useCallback((conversationId, recipientId) => {
        const socket = getSocket();
        if (socket) {
            socket.emit("stop_typing", { conversationId, recipientId });
        }
    }, []);

    const getOrCreateConversation = useCallback(async (otherUserId, params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.applicationId) queryParams.append('applicationId', params.applicationId);
            if (params.jobId) queryParams.append('jobId', params.jobId);
            
            const url = `/chat/conversations/${otherUserId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const { data } = await axiosInstance.get(url);

            // Update conversations list immediately
            setConversations(prev => {
                const exists = prev.find(c => c.id === data.id);
                if (exists) {
                    // Update existing conversation
                    return prev.map(c => c.id === data.id ? data : c);
                }
                // Add new conversation at the top
                return [data, ...prev];
            });

            // Fetch messages for this conversation immediately
            const messagesResponse = await axiosInstance.get(`/chat/messages/${data.id}`);
            setMessages(prev => ({
                ...prev,
                [data.id]: messagesResponse.data.messages
            }));

            // Join the conversation via socket
            const socket = getSocket();
            if (socket) {
                socket.emit("join_conversation", data.id);
            }

            return data;
        } catch (error) {
            console.error("Error getting/creating conversation:", error);
            throw error;
        }
    }, []);

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
