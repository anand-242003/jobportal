"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./Header.module.css";
import { useUser } from "../src/context/userContext";
import { useTheme } from "../src/context/themeContext";
import axiosInstance from "../src/utils/axiosInstance";

export default function Header() {
  const { user, loading, setUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link href="/" className={styles.logoWrapper}>
          <div className={styles.logoContainer}>
            <Image
              src="/job.png"
              alt="JobPortal Logo"
              width={65}
              height={65}
              className={styles.logoImage}
              priority
              unoptimized
            />
          </div>
          <div className={styles.logoText}>
            <p className={styles.tagline}>Find your next step</p>
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

          {loading ? null : (
            user ? (
              <>
                {user.role === "Employer" && (
                  <Link href="/jobs/post" className={styles.navLink}>
                    Post a Job
                  </Link>
                )}

                <Link href={user.role === "Employer" ? "/dashboard/employer" : "/dashboard"} className={styles.navLink}>
                  Dashboard
                </Link>

                <div className={styles.userProfile}>
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&color=fff&size=128`}
                    alt={user.fullName}
                    width={32}
                    height={32}
                    className={styles.avatar}
                    unoptimized
                  />
                  <span className={styles.welcome}>
                    {user.fullName}
                  </span>
                </div>

                <button onClick={toggleTheme} className={styles.themeToggle} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Logging out..." : "Sign Out"}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={styles.navLink}>
                  Sign In
                </Link>
                <Link href="/auth/signup" className={styles.navButton}>
                  Sign Up
                </Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}