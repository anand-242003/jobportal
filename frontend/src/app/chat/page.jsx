"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useChat } from "@/context/chatContext";
import styles from "./Chat.module.css";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";

export default function ChatPage() {
    const router = useRouter();
    const { user, loading } = useUser();
    const { activeConversation, isConnected } = useChat();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <div className={styles.chatContainer}>
                <ConversationList />
                {activeConversation ? (
                    <MessageThread />
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💬</div>
                        <h3>Select a conversation</h3>
                        <p>Choose a conversation from the sidebar to start messaging</p>
                    </div>
                )}
            </div>
            
            {/* Connection Status Indicator */}
            {!isConnected && (
                <div className={styles.connectionIndicator} style={{ 
                    position: 'fixed', 
                    bottom: '20px', 
                    right: '20px',
                    padding: '12px 20px',
                    background: 'rgba(239, 68, 68, 0.95)',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: 'white',
                        animation: 'pulse 2s infinite'
                    }}></span>
                    Connecting to chat server...
                </div>
            )}
        </>
    );
}
