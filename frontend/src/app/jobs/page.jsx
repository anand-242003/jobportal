"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import { useUser } from "@/context/userContext";
import styles from "./jobs.module.css";
import Link from "next/link";

export default function JobsPage() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experienceLevel: "",
    datePosted: "",
  });
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        search: debouncedSearch,
        sort,
        ...filters,
      };

      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      // Use my-jobs endpoint for employers to see only their jobs
      const endpoint = user?.role === "Employer" ? "/jobs/my-jobs" : "/jobs";
      const { data } = await axiosInstance.get(endpoint, { params });

      // Handle different response formats
      if (user?.role === "Employer") {
        // my-jobs returns array directly
        setJobs(Array.isArray(data) ? data : []);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalJobs: Array.isArray(data) ? data.length : 0
        });
      } else {
        // regular jobs endpoint returns object with jobs array
        if (data.jobs) {
          setJobs(data.jobs);
          setPagination(data.pagination);
        } else {
          setJobs([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, filters, sort, page, user]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      jobType: "",
      experienceLevel: "",
      datePosted: "",
    });
    setSearchTerm("");
    setPage(1);
  };

  return (
    <main className={styles.page}>
      <div className={styles.heroSection}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.heroTitle}>
            {user?.role === "Employer" ? "Your Job Listings" : "Discover Your Next Opportunity"}
          </h1>
          <p className={styles.heroSubtitle}>
            {user?.role === "Employer" 
              ? `${pagination.totalJobs || 0} jobs posted by you`
              : `${pagination.totalJobs || 0} amazing jobs waiting for you`
            }
          </p>
        </motion.div>
      </div>

      <div className={styles.container}>
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, company, or keywords..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filtersRow}>
            <select name="location" onChange={handleFilterChange} value={filters.location} className={styles.filterSelect}>
              <option value="">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Bangalore">Bangalore</option>
              <option value="London">London</option>
            </select>

            <select name="jobType" onChange={handleFilterChange} value={filters.jobType} className={styles.filterSelect}>
              <option value="">Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            <select name="experienceLevel" onChange={handleFilterChange} value={filters.experienceLevel} className={styles.filterSelect}>
              <option value="">Experience</option>
              <option value="0">Entry Level (0-2 years)</option>
              <option value="2">Mid Level (2-5 years)</option>
              <option value="5">Senior (5+ years)</option>
            </select>

            <select name="datePosted" onChange={handleFilterChange} value={filters.datePosted} className={styles.filterSelect}>
              <option value="">Any Time</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>

            <select onChange={(e) => setSort(e.target.value)} value={sort} className={styles.filterSelect}>
              <option value="newest">Newest First</option>
              <option value="salary">Highest Salary</option>
            </select>

            <button onClick={clearFilters} className={styles.clearButton}>
              Clear Filters
            </button>
          </div>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading amazing opportunities...</p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <motion.div
            className={styles.jobsGrid}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                className={styles.jobCard}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.jobCardHeader}>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <span className={styles.jobBadge}>{job.jobType}</span>
                </div>

                <div className={styles.jobMeta}>
                  <span className={styles.metaItem}>
                    <span className={styles.metaIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                    {job.created_by?.fullName || "Company"}
                  </span>
                  <span className={styles.metaItem}>
                    <span className={styles.metaIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                    {job.location}
                  </span>
                  <span className={styles.metaItem}>
                    <span className={styles.metaIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                    {job.experienceLevel}+ years
                  </span>
                </div>

                <p className={styles.jobDescription}>
                  {job.description?.slice(0, 120)}...
                </p>

                {job.requirements && job.requirements.length > 0 && (
                  <div className={styles.skillTags}>
                    {job.requirements.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className={styles.skillTag}>+{job.requirements.length - 3}</span>
                    )}
                  </div>
                )}

                <div className={styles.jobFooter}>
                  <div className={styles.salarySection}>
                    <span className={styles.salaryLabel}>Salary</span>
                    <span className={styles.salary}>{job.salary}</span>
                  </div>
                  <Link href={`/jobs/${job.id}`} className={styles.applyButton}>
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && jobs.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>No jobs found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}

        {!loading && jobs.length > 0 && pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={styles.pageButton}
            >
              ← Previous
            </button>
            <span className={styles.pageInfo}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className={styles.pageButton}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}