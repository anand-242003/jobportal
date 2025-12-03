"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./savedJobs.module.css";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axiosInstance.get("/saved-jobs/my-saved-jobs");
        setSavedJobs(res.data || []);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        if (error.response?.status === 401) {
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [router]);

  const handleUnsave = async (jobId) => {
    if (!confirm("Remove this job from saved jobs?")) {
      return;
    }

    try {
      setRemoving(true);
      await axiosInstance.delete(`/saved-jobs/${jobId}`);
      setSavedJobs(savedJobs.filter(saved => saved.jobId !== jobId));
    } catch (error) {
      console.error("Error removing saved job:", error);
      alert(error.response?.data?.message || "Failed to remove saved job");
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your saved jobs...</p>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Saved <span className={styles.highlight}>Jobs</span>
          </h1>
          <p className={styles.subtitle}>
            Jobs you've bookmarked for later
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3>No Saved Jobs Yet</h3>
            <p>Start saving jobs you're interested in to view them here!</p>
            <Link href="/jobs" className={styles.exploreButton}>
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className={styles.jobsGrid}>
            {savedJobs.map((saved, index) => (
              <motion.div
                key={saved.id}
                className={styles.jobCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.jobTitle}>{saved.job.title}</h3>
                  <button
                    onClick={() => handleUnsave(saved.jobId)}
                    className={styles.unsaveButton}
                    disabled={removing}
                    title="Remove from saved"
                  >
                    ❤️
                  </button>
                </div>

                <div className={styles.companyInfo}>
                  <span className={styles.companyName}>
                    {saved.job.created_by.fullName}
                  </span>
                </div>

                <div className={styles.jobMeta}>
                  <span className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {saved.job.location}
                  </span>
                  <span className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {saved.job.jobType}
                  </span>
                  <span className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {saved.job.salary}
                  </span>
                </div>

                <p className={styles.jobDescription}>
                  {saved.job.description.length > 150
                    ? saved.job.description.substring(0, 150) + "..."
                    : saved.job.description}
                </p>

                <div className={styles.cardFooter}>
                  <span className={styles.savedDate}>
                    Saved {new Date(saved.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/jobs/${saved.jobId}`} className={styles.viewButton}>
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
