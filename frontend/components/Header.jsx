"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./Header.module.css";
import { useUser } from "../src/context/userContext";
import { useTheme } from "../src/context/themeContext";
import { useChat } from "../src/context/chatContext";
import axiosInstance from "../src/utils/axiosInstance";

export default function Header() {
  const { user, loading, setUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { totalUnreadCount } = useChat();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link href="/" className={styles.logoWrapper}>
          <div className={styles.logoText}>
            <h2 className={styles.logoTitle}>JOBPORTAL</h2>
          </div>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            HOME
          </Link>
          
          {loading ? null : (
            user ? (
              <>
                {user.role === "Employer" && (
                  <>
                    <Link href="/jobs/post" className={styles.navLink}>
                      POST JOB
                    </Link>
                  </>
                )}

                {(user.role === "Student" || user.role === "Seeker") && (
                  <>
                    <Link href="/jobs" className={styles.navLink}>
                      FIND JOBS
                    </Link>
                    <Link href="/applications" className={styles.navLink}>
                      APPLICATIONS
                    </Link>
                  </>
                )}

                <Link href="/chat" className={styles.navLink} style={{ position: "relative" }}>
                  MESSAGES
                  {totalUnreadCount > 0 && (
                    <span style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-8px",
                      background: "#fbbf24",
                      color: "black",
                      borderRadius: "0",
                      padding: "2px 6px",
                      fontSize: "10px",
                      fontWeight: "700",
                      minWidth: "18px",
                      textAlign: "center",
                      border: "1px solid black"
                    }}>
                      {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                    </span>
                  )}
                </Link>

                <Link href={user.role === "Employer" ? "/dashboard/employer" : "/dashboard"} className={styles.navLink}>
                  DASHBOARD
                </Link>

                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  disabled={loggingOut}
                >
                  {loggingOut ? "LOGGING OUT..." : "SIGN OUT"}
                </button>
              </>
            ) : (
              <>
                <Link href="/jobs" className={styles.navLink}>
                  FIND JOBS
                </Link>
                <Link href="/auth/login" className={styles.navLink}>
                  SIGN IN
                </Link>
                <Link href="/auth/signup" className={styles.navButton}>
                  SIGN UP
                </Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
}