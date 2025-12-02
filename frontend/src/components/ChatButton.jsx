"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/chatContext";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./ChatButton.module.css";

export default function ChatButton({ application, onStatusUpdate }) {
    const router = useRouter();
    const { getOrCreateConversation, setActiveConversation, joinConversation, fetchMessages } = useChat();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(application.status);

    const handleAcceptAndChat = async () => {
        try {
            setLoading(true);

            if (status !== 'Accepted') {
                await axiosInstance.put(`/applications/${application.id}/status`, {
                    status: 'Accepted'
                });
                setStatus('Accepted');
                if (onStatusUpdate) {
                    onStatusUpdate(application.id, 'Accepted');
                }
            }

            const conversation = await getOrCreateConversation(
                application.applicant.id,
                {
                    applicationId: application.id,
                    jobId: application.jobId
                }
            );

            if (conversation) {
                setActiveConversation(conversation);
                joinConversation(conversation.id);
                await fetchMessages(conversation.id);
                router.push('/chat');
            }
        } catch (error) {
            console.error('Error starting chat:', error);
            alert(error.response?.data?.message || 'Failed to start conversation');
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = async () => {
        try {
            setLoading(true);

            const conversation = await getOrCreateConversation(
                application.applicant.id,
                {
                    applicationId: application.id,
                    jobId: application.jobId
                }
            );

            if (conversation) {
                setActiveConversation(conversation);
                joinConversation(conversation.id);
                await fetchMessages(conversation.id);
                router.push('/chat');
            }
        } catch (error) {
            console.error('Error starting chat:', error);
            alert(error.response?.data?.message || 'Failed to start conversation');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'Accepted') {
        return (
            <button
                onClick={handleStartChat}
                disabled={loading}
                className={`${styles.chatButton} ${styles.message}`}
            >
                {loading ? (
                    <span className={styles.loading}></span>
                ) : (
                    <>
                        <span className={styles.icon}>💬</span>
                        <span>Message</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleAcceptAndChat}
            disabled={loading || status === 'Rejected'}
            className={`${styles.chatButton} ${status === 'Rejected' ? styles.rejected : styles.acceptAndChat}`}
        >
            {loading ? (
                <span className={styles.loading}></span>
            ) : (
                <>
                    <span className={styles.icon}>✓</span>
                    <span>Accept & Chat</span>
                </>
            )}
        </button>
    );
}
