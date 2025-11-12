"use client";
import Link from "next/link";
import styles from "./Header.module.css"; 
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
       
        <Link href="/" className={styles.logoWrapper}>
          <div className={styles.logoIcon}>JP</div>
          <div className={styles.logoText}>
            <h2>
              Job<span className={styles.brandSpan}>Portal</span>
            </h2>
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

          <Link href="/companies" className={styles.navLink}>
            Companies
          </Link>

          <Link href="/auth/login" className={styles.navLink}>
            Sign in
          </Link>

          <Link href="/auth/signup" className={styles.navButton}>
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}