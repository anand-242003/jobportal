"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.column}>
                        <div className={styles.logo}>
                            <div className={styles.logoContainer}>
                                <Image
                                    src="/job.png"
                                    alt="JobPortal Logo"
                                    width={55}
                                    height={55}
                                    className={styles.logoImage}
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>
                        <p className={styles.description}>
                            Find your next step. Connecting talented individuals with amazing opportunities.
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Quick Links</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/jobs">Browse Jobs</Link></li>
                            <li><Link href="/companies">Companies</Link></li>
                            <li><Link href="/auth/signup">Sign Up</Link></li>
                            <li><Link href="/auth/login">Sign In</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>For Employers</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/jobs/post">Post a Job</Link></li>
                            <li><Link href="/dashboard">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Contact</h4>
                        <ul className={styles.linkList}>
                            <li>Email: contact@jobportal.com</li>
                            <li>Phone: +91 1234567890</li>
                            <li>Location: India</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2024 JobPortal. All rights reserved.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
