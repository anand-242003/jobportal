"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import styles from "./applications.module.css";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawing, setWithdrawing] = useState(false);
    const [filter, setFilter] = useState("all"); // all, pending, accepted, rejected
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        // Check if user is authenticated
        if (!user) {
            router.push("/auth/login");
            return;
        }

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
    }, [router, user]);

    const handleWithdraw = async (applicationId) => {
        if (!confirm("Are you sure you want to withdraw this application?")) {
            return;
        }

        try {
            setWithdrawing(true);
            await axiosInstance.delete(`/applications/${applicationId}`);
            setApplications(applications.filter(app => app.id !== applicationId));
            alert("Application withdrawn successfully!");
        } catch (error) {
            console.error("Error withdrawing application:", error);
            alert(error.response?.data?.message || "Failed to withdraw application");
        } finally {
            setWithdrawing(false);
        }
    };

    if (loading || !user) {
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
                    <>
                        <div className={styles.filterTabs}>
                            <button 
                                className={`${styles.filterTab} ${filter === "all" ? styles.activeTab : ""}`}
                                onClick={() => setFilter("all")}
                            >
                                All ({applications.length})
                            </button>
                            <button 
                                className={`${styles.filterTab} ${filter === "pending" ? styles.activeTab : ""}`}
                                onClick={() => setFilter("pending")}
                            >
                                Pending ({applications.filter(a => a.status === "Pending").length})
                            </button>
                            <button 
                                className={`${styles.filterTab} ${filter === "accepted" ? styles.activeTab : ""}`}
                                onClick={() => setFilter("accepted")}
                            >
                                Accepted ({applications.filter(a => a.status === "Accepted").length})
                            </button>
                            <button 
                                className={`${styles.filterTab} ${filter === "rejected" ? styles.activeTab : ""}`}
                                onClick={() => setFilter("rejected")}
                            >
                                Rejected ({applications.filter(a => a.status === "Rejected").length})
                            </button>
                        </div>

                        <div className={styles.applicationsGrid}>
                        {applications
                            .filter(app => filter === "all" || app.status?.toLowerCase() === filter)
                            .map((app, index) => (
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

                                <div className={styles.companyInfo}>
                                    <span className={styles.companyName}>{app.job?.created_by?.fullName || "Company"}</span>
                                </div>

                                <div className={styles.jobInfo}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Location</span>
                                        <span className={styles.infoValue}>{app.job?.location || "N/A"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Job Type</span>
                                        <span className={styles.infoValue}>{app.job?.jobType || "N/A"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Salary</span>
                                        <span className={styles.infoValue}>{app.job?.salary || "N/A"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Applied On</span>
                                        <span className={styles.infoValue}>{new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {app.status === "Rejected" && (
                                    <div className={styles.rejectionMessage}>
                                        <p>Unfortunately, your application was not selected for this position. Keep applying to other opportunities!</p>
                                    </div>
                                )}

                                {app.status === "Accepted" && (
                                    <div className={styles.acceptedMessage}>
                                        <p>Congratulations! Your application has been accepted. The employer may contact you soon.</p>
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
                                    {app.status === "Pending" && (
                                        <button
                                            onClick={() => handleWithdraw(app.id)}
                                            className={styles.withdrawButton}
                                            disabled={withdrawing}
                                        >
                                            Withdraw Application
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
