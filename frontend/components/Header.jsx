"use client";
import Link from "next/link";
import styles from "./Header.module.css";
import { useUser } from "../src/context/userContext";

export default function Header() {
  const { user, loading } = useUser();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        <Link href="/" className={styles.logoWrapper}>
          <div className={styles.logoIcon}>JP</div>
          <div className={styles.logoText}>
            <h2>Job<span className={styles.brandSpan}>Portal</span></h2>
            <p>Find your next step</p>
          </div>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/jobs" className={styles.navLink}>
            Jobs
          </Link>
          
          
          {loading ? null : (
            
            user ? (
              <>
                {user.role === "Employer" && (
                  <Link href="/jobs/post" className={styles.navLink}>
                    Post a Job
                  </Link>
                )}
                
                <Link href="/dashboard" className={styles.navLink}>
                  Dashboard
                </Link>
                
                <span className={styles.navLink} style={{ color: "#1d4ed8" }}>
                  Welcome, {user.fullName}!
                </span>
              </>
            ) : (
            
              <>
                <Link href="/companies" className={styles.navLink}>
                  Companies
                </Link>
                <Link href="/auth/login" className={styles.navLink}>
                  Sign in
                </Link>
                <Link href="/auth/signup" className={styles.navButton}>
                  Sign up
                </Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}