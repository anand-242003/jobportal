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
                        <h4 className={styles.columnTitle}>FOR JOB SEEKERS</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/jobs">Browse Jobs</Link></li>
                            <li><Link href="/auth/signup">Create Account</Link></li>
                            <li><Link href="/applications">My Applications</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>FOR EMPLOYERS</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/jobs/post">Post a Job</Link></li>
                            <li><Link href="/auth/signup?role=Employer">Create Account</Link></li>
                            <li><Link href="/dashboard/employer">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>COMPANY</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/terms">Terms</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>CONNECT</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</Link></li>
                            <li><Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</Link></li>
                            <li><Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2024 JOBPORTAL. ALL RIGHTS RESERVED.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="#">PRIVACY POLICY</Link>
                        <Link href="#">TERMS OF SERVICE</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
