"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "./jobDetails.module.css";
import { useUser } from "../../../context/userContext.js";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axiosInstance.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.role !== "Student") {
      setMsg("Only students can apply for jobs");
      setMsgType("error");
      return;
    }

    setApplying(true);
    setMsg("");

    try {
      await axiosInstance.post(`/applications/${id}`);
      setMsg("Application submitted successfully!");
      setMsgType("success");
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to apply");
      setMsgType("error");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading job details...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>Job not found</div>
          <Link href="/jobs" className={styles.backLink}>← Back to Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/jobs" className={styles.backLink}>← Back to Jobs</Link>

        <div className={styles.jobHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.jobTitle}>{job.title}</h1>
            <div className={styles.companyInfo}>
              <span className={styles.companyName}>{job.created_by?.fullName}</span>
            </div>
          </div>

          {user?.role === "Student" && (
            <button
              className={styles.applyButton}
              onClick={handleApply}
              disabled={applying || msgType === "success"}
            >
              {applying ? "Applying..." : msgType === "success" ? "Applied ✓" : "Apply Now"}
            </button>
          )}
        </div>

        <div className={styles.jobMeta}>
          <div className={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{job.location}</span>
          </div>
          <div className={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{job.jobType}</span>
          </div>
          <div className={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{job.experienceLevel}+ years experience</span>
          </div>
          <div className={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{job.position} {job.position === 1 ? 'position' : 'positions'}</span>
          </div>
        </div>

        <div className={styles.salaryBox}>
          <div className={styles.salaryLabel}>Salary Range</div>
          <div className={styles.salaryAmount}>{job.salary}</div>
        </div>

        {msg && (
          <div className={`${styles.message} ${styles[msgType]}`}>
            {msg}
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Job Description</h2>
          <p className={styles.description}>{job.description}</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Requirements</h2>
          <ul className={styles.requirementsList}>
            {job.requirements.map((req, index) => (
              <li key={index} className={styles.requirementItem}>{req}</li>
            ))}
          </ul>
        </div>

        {!user && (
          <div className={styles.loginPrompt}>
            <p>Want to apply for this job?</p>
            <Link href="/auth/login" className={styles.loginButton}>
              Sign in to apply
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}