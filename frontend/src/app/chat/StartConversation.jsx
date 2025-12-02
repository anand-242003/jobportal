"use client";

import { useState } from "react";
import { useChat } from "@/context/chatContext";
import { useUser } from "@/context/userContext";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./Chat.module.css";

export default function StartConversation() {
    const { user } = useUser();
    const { getOrCreateConversation, setActiveConversation, joinConversation, fetchMessages } = useChat();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const handleSearch = async (query) => {
        setSearchQuery(query);

        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const { data } = await axiosInstance.get(`/chat/users/search?search=${encodeURIComponent(query)}`);
            setSearchResults(data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleStartConversation = async (otherUser) => {
        try {
            const conversation = await getOrCreateConversation(otherUser.id);
            if (conversation) {
                setActiveConversation(conversation);
                joinConversation(conversation.id);
                await fetchMessages(conversation.id);
                setShowSearch(false);
                setSearchQuery("");
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Error starting conversation:", error);
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

    if (!showSearch) {
        return (
            <button
                onClick={() => setShowSearch(true)}
                style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    marginTop: "12px"
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(102, 126, 234, 0.4)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                ➕ Start New Conversation
            </button>
        );
    }

    return (
        <div style={{ marginTop: "12px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search users by name..."
                    style={{
                        flex: 1,
                        padding: "10px 12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                        fontSize: "14px"
                    }}
                    autoFocus
                />
                <button
                    onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                        setSearchResults([]);
                    }}
                    style={{
                        padding: "10px 16px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    Cancel
                </button>
            </div>

            <div style={{
                maxHeight: "300px",
                overflowY: "auto",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "8px",
                padding: "8px"
            }}>
                {searching && (
                    <div style={{ padding: "20px", textAlign: "center", color: "var(--foreground-muted)" }}>
                        Searching...
                    </div>
                )}

                {!searching && searchQuery.trim().length > 0 && searchResults.length === 0 && (
                    <div style={{ padding: "20px", textAlign: "center", color: "var(--foreground-muted)" }}>
                        No users found
                    </div>
                )}

                {!searching && searchResults.length > 0 && searchResults.map((otherUser) => (
                    <div
                        key={otherUser.id}
                        onClick={() => handleStartConversation(otherUser)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: "transparent",
                            marginBottom: "4px"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "14px",
                            flexShrink: 0
                        }}>
                            {getInitials(otherUser.fullName)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--foreground)" }}>
                                {otherUser.fullName}
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>
                                {otherUser.role} • {otherUser.email}
                            </div>
                        </div>
                    </div>
                ))}

                {!searching && searchQuery.trim().length < 2 && (
                    <div style={{ padding: "20px", textAlign: "center", color: "var(--foreground-muted)", fontSize: "13px" }}>
                        Type at least 2 characters to search
                    </div>
                )}
            </div>
        </div>
    );
}
