"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useUser } from "@/context/userContext";
import styles from "./page.module.css";

export default function HomePage() {
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [stats, setStats] = useState({
        applicationsCount: 0,
        savedJobsCount: 0
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axiosInstance.get("/jobs?limit=3");
                setFeaturedJobs(res.data.jobs || []);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!user || user.role !== "Student") return;
            
            try {
                const [appsRes, savedRes] = await Promise.all([
                    axiosInstance.get("/applications/my-applications").catch(() => ({ data: [] })),
                    axiosInstance.get("/saved-jobs/my-saved-jobs").catch(() => ({ data: [] }))
                ]);
                
                setStats({
                    applicationsCount: appsRes.data.length || 0,
                    savedJobsCount: savedRes.data.length || 0
                });
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
            }
        };

        fetchUserStats();
    }, [user]);

    return (
        <div>
            <section className={styles.heroSection}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroGrid}>
                        <div>
                            <h1 className={styles.heroTitle}>
                                FIND YOUR<br />DREAM JOB
                            </h1>
                            <p className={styles.heroText}>
                                Connect with top employers. Browse thousands of opportunities. Land your next role with confidence.
                            </p>
                            <div className={styles.heroButtons}>
                                <Link href="/jobs">
                                    <button className={styles.btnPrimary}>BROWSE JOBS</button>
                                </Link>
                                {!user && (
                                    <Link href="/auth/signup">
                                        <button className={styles.btnSecondary}>SIGN UP FREE</button>
                                    </Link>
                                )}
                                {user && user.role === "Employer" && (
                                    <Link href="/jobs/post">
                                        <button className={styles.btnSecondary}>POST A JOB</button>
                                    </Link>
                                )}
                                {user && user.role === "Student" && (
                                    <Link href="/applications">
                                        <button className={styles.btnSecondary}>MY APPLICATIONS</button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {!user ? (
                            <div className={styles.searchBox}>
                                <h3 className={styles.searchTitle}>GET STARTED</h3>
                                <p className={styles.searchSubtitle}>Join thousands of job seekers and employers</p>
                                <Link href="/auth/login">
                                    <button className={styles.searchButton}>SIGN IN</button>
                                </Link>
                                <Link href="/auth/signup">
                                    <button className={styles.searchButton} style={{ marginTop: '0.75rem' }}>CREATE ACCOUNT</button>
                                </Link>
                                <Link href="/jobs">
                                    <button className={styles.searchButton} style={{ marginTop: '0.75rem', background: 'white', color: 'black' }}>BROWSE JOBS</button>
                                </Link>
                            </div>
                        ) : user.role === "Student" ? (
                            <div className={styles.searchBox}>
                                <h3 className={styles.searchTitle}>YOUR ACTIVITY</h3>
                                <div className={styles.statsCard}>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue}>{stats.applicationsCount}</div>
                                        <div className={styles.statLabel}>APPLICATIONS</div>
                                    </div>
                                    <div className={styles.statDivider}></div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue}>{stats.savedJobsCount}</div>
                                        <div className={styles.statLabel}>SAVED JOBS</div>
                                    </div>
                                </div>
                                <Link href="/applications">
                                    <button className={styles.searchButton}>VIEW APPLICATIONS</button>
                                </Link>
                                <Link href="/saved-jobs">
                                    <button className={styles.searchButton} style={{ marginTop: '0.75rem' }}>VIEW SAVED JOBS</button>
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.searchBox}>
                                <h3 className={styles.searchTitle}>EMPLOYER ACTIONS</h3>
                                <Link href="/jobs/post">
                                    <button className={styles.searchButton}>POST NEW JOB</button>
                                </Link>
                                <Link href="/dashboard/employer">
                                    <button className={styles.searchButton} style={{ marginTop: '0.75rem' }}>VIEW DASHBOARD</button>
                                </Link>
                                <Link href="/jobs">
                                    <button className={styles.searchButton} style={{ marginTop: '0.75rem' }}>MY JOB LISTINGS</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>HOW IT WORKS</h2>
                    <div className={styles.howItWorksGrid}>
                        <div className={styles.howItWorksCard}>
                            <div className={styles.howItWorksNumber}>01</div>
                            <h3 className={styles.howItWorksTitle}>CREATE PROFILE</h3>
                            <p className={styles.howItWorksText}>
                                Sign up in seconds. Add your experience, skills, and resume. Get discovered by employers.
                            </p>
                        </div>
                        <div className={styles.howItWorksCardBlack}>
                            <div className={styles.howItWorksNumber}>02</div>
                            <h3 className={styles.howItWorksTitle}>APPLY TO JOBS</h3>
                            <p className={styles.howItWorksText}>
                                Browse thousands of opportunities. Filter by location, salary, and type. Apply with one click.
                            </p>
                        </div>
                        <div className={styles.howItWorksCard}>
                            <div className={styles.howItWorksNumber}>03</div>
                            <h3 className={styles.howItWorksTitle}>GET HIRED</h3>
                            <p className={styles.howItWorksText}>
                                Chat directly with employers. Track your applications. Land your dream job.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.jobsHeader}>
                        <h2 className={styles.jobsTitle}>FEATURED JOBS</h2>
                        <Link href="/jobs">
                            <button className={styles.viewAllButton}>VIEW ALL JOBS</button>
                        </Link>
                    </div>

                    <div className={styles.jobsGrid}>
                        {featuredJobs.map((job) => (
                            <div key={job.id} className={styles.jobCard}>
                                <h3 className={styles.jobTitle}>{job.title}</h3>
                                <p className={styles.jobCompany}>{job.employer?.companyName || 'Tech Corp'}</p>
                                <div className={styles.jobDetails}>
                                    <p>▪ {job.location}</p>
                                    <p>▪ {job.salary || '$120k - $150k'}</p>
                                </div>
                                <div className={styles.jobMeta}>
                                    <span className={styles.jobType}>{job.jobType}</span>
                                    <span className={styles.jobDate}>
                                        {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className={styles.jobButtons}>
                                    <Link href={`/jobs/${job.id}`} className={styles.applyButton}>
                                        APPLY NOW
                                    </Link>
                                    <Link href={`/jobs/${job.id}`} className={styles.detailsButton}>
                                        DETAILS
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.statsSection}>
                <div className={styles.container}>
                    <div className={styles.statsGrid}>
                        <div>
                            <div className={styles.statNumber}>1000+</div>
                            <div className={styles.statLabel}>JOBS POSTED</div>
                        </div>
                        <div>
                            <div className={styles.statNumber}>500+</div>
                            <div className={styles.statLabel}>COMPANIES</div>
                        </div>
                        <div>
                            <div className={styles.statNumber}>2500+</div>
                            <div className={styles.statLabel}>CANDIDATES</div>
                        </div>
                        <div>
                            <div className={styles.statNumber}>750+</div>
                            <div className={styles.statLabel}>HIRES MADE</div>
                        </div>
                    </div>
                </div>
            </section>

            {!user && (
                <section className={styles.ctaSection}>
                    <div className={styles.container}>
                        <h2 className={styles.ctaTitle}>READY TO GET STARTED?</h2>
                        <p className={styles.ctaText}>
                            Join thousands of job seekers and employers finding success on JobPortal.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link href="/auth/signup?role=Student">
                                <button className={styles.ctaBtnPrimary}>I'M LOOKING FOR A JOB</button>
                            </Link>
                            <Link href="/auth/signup?role=Employer">
                                <button className={styles.ctaBtnSecondary}>I'M HIRING</button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
