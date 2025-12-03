"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useChat } from "@/context/chatContext";
import styles from "./Chat.module.css";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";

function ChatContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading } = useUser();
    const { activeConversation, isConnected, getOrCreateConversation, setActiveConversation } = useChat();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        const userId = searchParams.get('userId');
        const applicationId = searchParams.get('applicationId');
        const jobId = searchParams.get('jobId');

        if (user && userId) {
            if (!activeConversation || activeConversation.otherUser.id !== parseInt(userId)) {
                const params = {};
                if (applicationId) params.applicationId = applicationId;
                if (jobId) params.jobId = jobId;

                getOrCreateConversation(userId, params)
                    .then(conversation => {
                        setActiveConversation(conversation);
                        router.replace('/chat', { scroll: false });
                    })
                    .catch(error => {
                        console.error("Failed to open conversation:", error);
                        alert(error.response?.data?.message || "Failed to open conversation");
                    });
            }
        }
    }, [user, searchParams, activeConversation, getOrCreateConversation, setActiveConversation, router]);

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
        </>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div style={{ padding: "40px", textAlign: "center" }}>
                Loading chat...
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
