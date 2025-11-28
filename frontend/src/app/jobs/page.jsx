"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./jobs.module.css";
import Link from "next/link";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    const fetchJobs = async () => {

      try {
        const { data } = await axiosInstance.get("/jobs");
        console.log("Fetched Jobs Data:", data);
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          console.error("API did not return an array:", data);
          setJobs([]);
        }

      } catch (error) {

        console.error("Failed to fetch jobs", error);
        
      } finally {

        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter Logic
  const filteredJobs = jobs.filter((job) => {
    // 1. If search is empty, return everything
    if (!searchTerm || searchTerm.trim() === "") return true;
    
    const term = searchTerm.toLowerCase().trim();
    
    // 2. Safe access to properties (handle nulls)
    const title = (job.title || "").toLowerCase();
    const location = (job.location || "").toLowerCase();
    const type = (job.jobType || "").toLowerCase();
    const company = (job.created_by?.fullName || "").toLowerCase();

    // 3. Check for matches
    return (
      title.includes(term) ||
      location.includes(term) ||
      type.includes(term) ||
      company.includes(term)
    );
  });

  if (loading) return <div className={styles.container}>Loading jobs...</div>;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Latest Job Openings</h1>
        <p>Find your dream job from {jobs.length} active listings</p>
        
        <input 
          type="text" 
          placeholder="Search by title, location, or type..." 
          className={styles.searchInput} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {filteredJobs.map((job) => (
          <Link href={`/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.jobTitle}>{job.title}</h2>
                  <p className={styles.company}>Posted by {job.created_by?.fullName || "Unknown"}</p>
                </div>
                <span className={styles.tag}>{job.jobType}</span>
              </div>

              <div className={styles.tags}>
                <span className={styles.tag}>{job.location}</span>
                <span className={styles.tag}>{job.experienceLevel} Years Exp</span>
              </div>

              <div className={styles.footer}>
                <span className={styles.salary}>{job.salary}</span>
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}

        {filteredJobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            {jobs.length === 0 
              ? "No jobs have been posted yet." 
              : `No jobs found matching "${searchTerm}".`}
          </div>
        )}
      </div>
    </main>
  );
}