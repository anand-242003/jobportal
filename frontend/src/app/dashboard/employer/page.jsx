"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { useUser } from "@/context/userContext";
import styles from "./employer.module.css";

export default function EmployerDashboard() {
  const { user, loading } = useUser();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const { data } = await axiosInstance.get("/jobs/my-jobs");
        setJobs(data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch jobs");
      }
    };

    if (user?.role === "Employer") {
      fetchMyJobs();
    }
  }, [user]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user || user.role !== "Employer") {
    return <div className={styles.error}>Access Denied. Employer access required.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Posted Jobs</h1>
        <Link href="/jobs/post" className={styles.postButton}>
          Post New Job
        </Link>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {jobs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't posted any jobs yet.</p>
          <Link href="/jobs/post" className={styles.postButton}>
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className={styles.jobsGrid}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <h3 className={styles.jobTitle}>{job.title}</h3>
              <p className={styles.jobLocation}>
                {job.location} • {job.jobType}
              </p>
              <p className={styles.jobSalary}>Salary: {job.salary}</p>
              <p className={styles.jobDescription}>
                {job.description.substring(0, 100)}...
              </p>
              <div className={styles.jobActions}>
                <Link
                  href={`/dashboard/employer/job/${job.id}`}
                  className={styles.viewButton}
                >
                  View Applicants
                </Link>
                <Link
                  href={`/jobs/${job.id}`}
                  className={styles.viewJobButton}
                >
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

