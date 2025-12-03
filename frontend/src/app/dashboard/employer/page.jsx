"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import styles from "./employer.module.css";

export default function EmployerDashboard() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    recentApplications: [],
  });
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job? This will also delete all applications.")) {
      return;
    }

    try {
      setDeleting(true);
      await axiosInstance.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job.id !== jobId));
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert(error.response?.data?.message || "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          axiosInstance.get("/jobs/my-jobs"),
          axiosInstance.get("/recruiter/stats"),
        ]);
        setJobs(jobsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch dashboard data");
      }
    };

    if (user?.role === "Employer") {
      fetchData();
    }
  }, [user]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!user || user.role !== "Employer") return <div className={styles.error}>Access Denied. Employer access required.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Employer Dashboard</h1>
        <Link href="/jobs/post" className={styles.postButton}>Post New Job</Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Total Jobs Posted</h3>
            <p className={styles.statValue}>{stats.totalJobs}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Total Applications</h3>
            <p className={styles.statValue}>{stats.totalApplications}</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Applications</h2>
        {stats.recentApplications.length === 0 ? (
          <p className={styles.emptyText}>No applications received yet.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job Title</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className={styles.applicantInfo}>
                        <span className={styles.applicantName}>{app.applicant.fullName}</span>
                        <span className={styles.applicantEmail}>{app.applicant.email}</span>
                      </div>
                    </td>
                    <td>{app.job.title}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Jobs</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {jobs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't posted any jobs yet.</p>
            <Link href="/jobs/post" className={styles.postButton}>Post Your First Job</Link>
          </div>
        ) : (
          <div className={styles.jobsGrid}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <p className={styles.jobLocation}>{job.location} • {job.jobType}</p>
                <div className={styles.jobActions}>
                  <Link href={`/dashboard/employer/job/${job.id}`} className={styles.viewButton}>
                    View Applicants
                  </Link>
                  <Link href={`/jobs/${job.id}`} className={styles.viewJobButton}>
                    View Job
                  </Link>
                  <Link href={`/dashboard/employer/edit-job/${job.id}`} className={styles.editButton}>
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteJob(job.id)} 
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
