"use client";

import { useEffect } from "react";
import { useChat } from "@/context/chatContext";
import { useUser } from "@/context/userContext";
import styles from "./Chat.module.css";
import StartConversation from "./StartConversation";

export default function ConversationList() {
    const { user } = useUser();
    const {
        conversations,
        activeConversation,
        setActiveConversation,
        unreadCounts,
        fetchConversations,
        joinConversation,
        fetchMessages
    } = useChat();

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user, fetchConversations]);

    const handleSelectConversation = async (conversation) => {
        setActiveConversation(conversation);
        joinConversation(conversation.id);
        await fetchMessages(conversation.id);
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 24) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (hours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '??';
    };

    return (
        <div className={styles.conversationSidebar}>
            <div className={styles.sidebarHeader}>
                <h2>Messages</h2>
            </div>

            <StartConversation />

            <div className={styles.conversationList}>
                {conversations.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--foreground-muted)" }}>
                        <p style={{ fontSize: "15px", marginBottom: "8px" }}>No active conversations</p>
                        <p style={{ fontSize: "13px", lineHeight: "1.6" }}>
                            {user?.role === 'Employer' || user?.role === 'Admin' 
                                ? 'Start conversations with accepted applicants' 
                                : 'Conversations will appear here once a recruiter contacts you'}
                        </p>
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`${styles.conversationItem} ${activeConversation?.id === conversation.id ? styles.active : ''}`}
                            onClick={() => handleSelectConversation(conversation)}
                        >
                            <div className={styles.avatar}>
                                <div className={styles.avatarCircle}>
                                    {getInitials(conversation.otherUser.fullName)}
                                </div>
                                {/* TODO: Add online status */}
                                {/* <div className={styles.onlineIndicator}></div> */}
                            </div>
                            <div className={styles.conversationInfo}>
                                <div className={styles.conversationTop}>
                                    <div>
                                        <span className={styles.userName}>
                                            {conversation.otherUser.fullName}
                                        </span>
                                        <span className={styles.roleTag}>
                                            {conversation.otherUser.role}
                                        </span>
                                    </div>
                                    <span className={styles.timestamp}>
                                        {formatTime(conversation.lastMessageAt)}
                                    </span>
                                </div>
                                <div className={styles.lastMessage}>
                                    {conversation.lastMessage || 'No messages yet'}
                                </div>
                            </div>
                            {unreadCounts[conversation.id] > 0 && (
                                <div className={styles.unreadBadge}>
                                    {unreadCounts[conversation.id]}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
