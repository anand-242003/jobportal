"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter, useParams } from "next/navigation";
import styles from "../jobs.module.css"; // Reusing existing styles
import { useUser } from "../../../context/userContext.js";
export default function JobDetailsPage() {
  const { id } = useParams();
  const { user } = useUser(); // Get logged-in user
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [msg, setMsg] = useState("");

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
    // 1. Check if user is logged in
    if (!user) {
      alert("Please log in to apply.");
      return;
    }
    // 2. Check if user is a Student (Employers can't apply)
    if (user.role !== "Student") {
      alert("Only students can apply for jobs.");
      return;
    }

    setApplying(true);
    setMsg("");

    try {
      // 3. Send request to backend
      await axiosInstance.post(`/applications/${id}`);
      setMsg("Application submitted successfully! 🎉");
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading details...</div>;
  if (!job) return <div className={styles.container}>Job not found.</div>;

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{job.title}</h1>
        <p className={styles.company}>Posted by {job.created_by?.fullName}</p>
        
        <div className={styles.tags} style={{ marginTop: '1rem' }}>
          <span className={styles.tag}>{job.location}</span>
          <span className={styles.tag}>{job.jobType}</span>
          <span className={styles.salary}>{job.salary}</span>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Description</h3>
          <p style={{ lineHeight: '1.6' }}>{job.description}</p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Requirements</h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Apply Button Logic */}
        <div style={{ marginTop: '2rem' }}>
          {user?.role === "Student" ? (
            <>
              <button 
                className={styles.submitButton} // Uses existing style from jobs.module.css
                onClick={handleApply} 
                disabled={applying || msg.includes("success")}
                style={{ width: 'fit-content', opacity: applying ? 0.7 : 1 }}
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
              {msg && <p style={{ marginTop: '1rem', color: msg.includes("success") ? "green" : "red" }}>{msg}</p>}
            </>
          ) : (
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
              <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>
                {user ? "Logged in as Employer (Cannot apply)" : "Please log in as a Student to apply."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}