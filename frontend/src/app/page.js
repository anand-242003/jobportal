"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./page.module.css";

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [featuredJobs, setFeaturedJobs] = useState([]);

    useEffect(() => {
        // Fetch real job data for carousel
        const fetchJobs = async () => {
            try {
                const res = await axiosInstance.get("/jobs?limit=6");
                setFeaturedJobs(res.data.jobs || []);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    return (
        <main className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className={styles.heroTitle}>
                        Find Your <span className={styles.highlight}>Dream Job</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Discover opportunities that match your skills and passion
                    </p>

                    {/* Search Bar */}
                    <div className={styles.searchContainer}>
                        <div className={styles.searchBar}>
                            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search jobs, companies, or skills..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Link href="/jobs" className={styles.searchButton}>
                                Search
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsGrid}>
                        <motion.div
                            className={styles.statCard}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.statNumber}>10K+</div>
                            <div className={styles.statLabel}>Active Jobs</div>
                        </motion.div>
                        <motion.div
                            className={styles.statCard}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.statNumber}>5K+</div>
                            <div className={styles.statLabel}>Companies</div>
                        </motion.div>
                        <motion.div
                            className={styles.statCard}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.statNumber}>50K+</div>
                            <div className={styles.statLabel}>Hired</div>
                        </motion.div>
                    </div>

                    {/* CTA Buttons */}
                    <div className={styles.ctaGroup}>
                        <Link href="/jobs" className={styles.ctaPrimary}>
                            Explore Jobs →
                        </Link>
                        <Link href="/auth/signup" className={styles.ctaSecondary}>
                            Sign Up Free
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Featured Jobs Carousel */}
            {featuredJobs.length > 0 && (
                <section className={styles.featuredSection}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.highlight}>Featured</span> Opportunities
                    </h2>
                    <div className={styles.jobsCarousel}>
                        {featuredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                className={styles.jobCard}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                            >
                                <div className={styles.jobHeader}>
                                    <h3 className={styles.jobTitle}>{job.title}</h3>
                                    <span className={styles.jobBadge}>{job.jobType}</span>
                                </div>
                                <p className={styles.jobLocation}>{job.location}</p>
                                <p className={styles.jobDescription}>
                                    {job.description?.slice(0, 100)}...
                                </p>
                                <div className={styles.jobFooter}>
                                    <span className={styles.jobSalary}>
                                        ₹{job.salary?.toLocaleString() || 'Competitive'}
                                    </span>
                                    <Link href={`/jobs/${job.id}`} className={styles.applyBtn}>
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className={styles.viewAllContainer}>
                        <Link href="/jobs" className={styles.viewAllBtn}>
                            View All Jobs →
                        </Link>
                    </div>
                </section>
            )}
        </main>
    );
}
