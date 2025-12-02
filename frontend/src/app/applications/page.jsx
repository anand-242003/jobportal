"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./applications.module.css";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axiosInstance.get("/applications/my-applications");
                setApplications(res.data || []);
            } catch (error) {
                console.error("Error fetching applications:", error);
                if (error.response?.status === 401) {
                    router.push("/auth/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [router]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading your applications...</p>
            </div>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        My <span className={styles.highlight}>Applications</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Track all your job applications in one place
                    </p>
                </div>

                {applications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <h3>No Applications Yet</h3>
                        <p>You haven't applied to any jobs yet. Start exploring opportunities!</p>
                        <Link href="/jobs" className={styles.exploreButton}>
                            Explore Jobs
                        </Link>
                    </div>
                ) : (
                    <div className={styles.applicationsGrid}>
                        {applications.map((app, index) => (
                            <motion.div
                                key={app.id}
                                className={styles.appCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.01 }}
                            >
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.jobTitle}>{app.job?.title || "Job Title"}</h3>
                                    <span className={`${styles.statusBadge} ${styles[app.status?.toLowerCase()]}`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className={styles.cardMeta}>
                                    <span className={styles.metaItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        {app.job?.created_by?.fullName || "Company"}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        {app.job?.location || "Location"}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {app.status === "Rejected" && (
                                    <div className={styles.rejectionMessage}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <p>Unfortunately, your application was not selected for this position. Keep applying to other opportunities!</p>
                                    </div>
                                )}

                                <div className={styles.cardActions}>
                                    <Link href={`/jobs/${app.jobId}`} className={styles.viewButton}>
                                        View Job Details
                                    </Link>
                                    {app.status === "Accepted" && app.job?.created_by?.id && (
                                        <Link 
                                            href={`/chat?userId=${app.job.created_by.id}&applicationId=${app.id}&jobId=${app.jobId}`} 
                                            className={styles.chatButton}
                                        >
                                            Message Employer
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
