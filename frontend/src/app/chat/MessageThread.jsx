"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/context/chatContext";
import { useUser } from "@/context/userContext";
import styles from "./Chat.module.css";

export default function MessageThread() {
    const { user } = useUser();
    const {
        activeConversation,
        messages,
        typingUsers,
        sendMessage,
        markAsRead,
        sendTyping,
        stopTyping,
        joinConversation
    } = useChat();

    const [messageInput, setMessageInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const conversationMessages = messages[activeConversation?.id] || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages]);

    useEffect(() => {
        if (activeConversation) {
            joinConversation(activeConversation.id);
            markAsRead(activeConversation.id);
        }
    }, [activeConversation, markAsRead, joinConversation]);

    useEffect(() => {
        if (conversationMessages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversationMessages.length]);

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);

        if (!isTyping) {
            setIsTyping(true);
            sendTyping(activeConversation.id, activeConversation.otherUser.id);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            stopTyping(activeConversation.id, activeConversation.otherUser.id);
        }, 2000);
    };

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        sendMessage(
            activeConversation.id,
            activeConversation.otherUser.id,
            messageInput.trim()
        );

        setMessageInput("");
        setIsTyping(false);
        stopTyping(activeConversation.id, activeConversation.otherUser.id);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
                   date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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

    const renderMessageContent = (content) => {
        return content;
    };

    const isTypingNow = typingUsers[activeConversation?.id] === activeConversation?.otherUser.id;

    return (
        <div className={styles.messageThread}>
            <div className={styles.chatHeader}>
                <div className={styles.avatar}>
                    <div className={styles.avatarCircle}>
                        {getInitials(activeConversation.otherUser.fullName)}
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <div className={styles.userName}>
                        {activeConversation.otherUser.fullName}
                    </div>
                    <div className={styles.userStatus}>
                        <span className={styles.roleTag}>{activeConversation.otherUser.role}</span>
                        {isTypingNow && <span className={styles.typingText}>typing...</span>}
                    </div>
                </div>
            </div>

            <div className={styles.messagesContainer}>
                {conversationMessages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💬</div>
                        <h3>Start the conversation</h3>
                        <p>Send a message to begin your discussion with {activeConversation.otherUser.fullName}</p>
                    </div>
                ) : (
                    conversationMessages.map((message, index) => {
                        const isSent = message.senderId === user.id;
                        const prevMessage = conversationMessages[index - 1];
                        const showDate = !prevMessage || 
                            new Date(message.createdAt).toDateString() !== new Date(prevMessage.createdAt).toDateString();
                        
                        return (
                            <div key={message.id}>
                                {showDate && (
                                    <div className={styles.dateLabel}>
                                        {new Date(message.createdAt).toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                )}
                                <div className={`${styles.messageGroup} ${isSent ? styles.sent : styles.received}`}>
                                    {!isSent && (
                                        <div className={styles.messageAvatar}>
                                            {getInitials(message.sender.fullName)}
                                        </div>
                                    )}
                                    <div className={styles.messageContent}>
                                        <div className={styles.messageBubble}>
                                            {renderMessageContent(message.content)}
                                        </div>
                                        <div className={styles.messageTime}>
                                            {formatTime(message.createdAt)}
                                        </div>
                                    </div>
                                    {isSent && (
                                        <div className={styles.messageAvatar}>
                                            {getInitials(message.sender.fullName)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {isTypingNow && (
                <div className={styles.typingIndicator}>
                    <div className={styles.messageAvatar} style={{ width: "32px", height: "32px", fontSize: "12px" }}>
                        {getInitials(activeConversation.otherUser.fullName)}
                    </div>
                    <div className={styles.typingDots}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                    </div>
                </div>
            )}

            <div className={styles.messageInput}>
                <div className={styles.inputContainer}>
                    <textarea
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        style={{
                            height: "auto",
                            minHeight: "44px",
                            maxHeight: "120px"
                        }}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                        }}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        title="Send message (Enter)"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
