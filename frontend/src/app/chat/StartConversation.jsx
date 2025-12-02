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
                className={styles.newChatButton}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Message
            </button>
        );
    }

    return (
        <div className={styles.searchContainer}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className={styles.searchInput}
                    autoFocus
                />
                <button
                    onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                        setSearchResults([]);
                    }}
                    style={{
                        padding: "8px 16px",
                        background: "#e2e8f0",
                        border: "none",
                        borderRadius: "6px",
                        color: "#1a202c",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}
                >
                    Cancel
                </button>
            </div>

            <div className={styles.searchResults}>
                {searching && (
                    <div style={{ padding: "20px", textAlign: "center", color: "#718096" }}>
                        Searching...
                    </div>
                )}

                {!searching && searchQuery.trim().length > 0 && searchResults.length === 0 && (
                    <div style={{ padding: "20px", textAlign: "center", color: "#718096" }}>
                        No users found
                    </div>
                )}

                {!searching && searchResults.length > 0 && searchResults.map((otherUser) => (
                    <div
                        key={otherUser.id}
                        onClick={() => handleStartConversation(otherUser)}
                        className={styles.searchResultItem}
                    >
                        <div className={styles.avatarCircle} style={{ width: "40px", height: "40px", fontSize: "14px" }}>
                            {getInitials(otherUser.fullName)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: "600", fontSize: "14px", color: "#1a202c" }}>
                                {otherUser.fullName}
                            </div>
                            <div style={{ fontSize: "12px", color: "#718096" }}>
                                {otherUser.role} • {otherUser.email}
                            </div>
                        </div>
                    </div>
                ))}

                {!searching && searchQuery.trim().length < 2 && (
                    <div style={{ padding: "20px", textAlign: "center", color: "#718096", fontSize: "13px" }}>
                        Type at least 2 characters to search
                    </div>
                )}
            </div>
        </div>
    );
}
