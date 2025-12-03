"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./applicants.module.css";

export default function JobApplicantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (applicationId, status) => {
    if (updating) return;
    
    try {
      setUpdating(true);
      await axiosInstance.put(`/applications/${applicationId}/status`, { status });
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      alert(`Application ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(error.response?.data?.message || "Failed to update application status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/applications/job/${id}`);
        setApplications(data);

        try {
          const jobResponse = await axiosInstance.get(`/jobs/${id}`);
          setJobTitle(jobResponse.data.title);
        } catch (err) {
          console.error("Failed to fetch job details:", err);
        }
      } catch (error) {
        console.error(error);
        if (error.response?.status === 403) {
          setError("You are not authorized to view these applications");
        } else if (error.response?.status === 404) {
          setError("Job not found");
        } else {
          setError("Failed to fetch applicants");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicants();
    }
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading applicants...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/dashboard/employer" className={styles.backLink}>
            ← Back to My Jobs
          </Link>
          <h1 className={styles.title}>
            {jobTitle ? `Applicants for: ${jobTitle}` : "Applicants"}
          </h1>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {applications.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No applicants yet.</p>
          <p className={styles.emptySubtext}>
            Share this job posting to attract more candidates.
          </p>
        </div>
      ) : (
        <div className={styles.applicantsList}>
          {applications.map((app) => (
            <div key={app.id} className={styles.applicantCard}>
              <div className={styles.applicantHeader}>
                <h3 className={styles.applicantName}>
                  {app.applicant.fullName}
                </h3>
                <span
                  className={`${styles.status} ${app.status === "Accepted"
                      ? styles.statusAccepted
                      : app.status === "Rejected"
                        ? styles.statusRejected
                        : styles.statusPending
                    }`}
                >
                  {app.status}
                </span>
              </div>

              <div className={styles.applicantInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Email:</span>
                  <a
                    href={`mailto:${app.applicant.email}`}
                    className={styles.emailLink}
                  >
                    {app.applicant.email}
                  </a>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Phone:</span>
                  <a
                    href={`tel:${app.applicant.phoneNumber}`}
                    className={styles.phoneLink}
                  >
                    {app.applicant.phoneNumber}
                  </a>
                </div>

                {app.applicant.skills && app.applicant.skills.length > 0 && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Skills:</span>
                    <div className={styles.skillsList}>
                      {app.applicant.skills.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {app.applicant.profileBio && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Bio:</span>
                    <p className={styles.bio}>{app.applicant.profileBio}</p>
                  </div>
                )}

                {app.applicant.resume && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Resume:</span>
                    <a
                      href={app.applicant.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.resumeLink}
                    >
                      {app.applicant.resumeOriginalname || "View Resume"}
                    </a>
                  </div>
                )}

                <div className={styles.infoRow}>
                  <span className={styles.label}>Applied on:</span>
                  <span className={styles.date}>
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {app.status === "Pending" && (
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => handleStatusUpdate(app.id, "Accepted")}
                    className={styles.acceptButton}
                    disabled={updating}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(app.id, "Rejected")}
                    className={styles.rejectButton}
                    disabled={updating}
                  >
                    Reject
                  </button>
                </div>
              )}

              {app.status === "Rejected" && (
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => handleStatusUpdate(app.id, "Pending")}
                    className={styles.undoButton}
                    disabled={updating}
                  >
                    Undo Rejection
                  </button>
                </div>
              )}

              {app.status === "Accepted" && (
                <div className={styles.actionButtons}>
                  <Link
                    href={`/chat?userId=${app.applicant.id}&applicationId=${app.id}&jobId=${app.jobId}`}
                    className={styles.chatButton}
                  >
                    Message Candidate
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
