"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useUser } from "@/context/userContext";
import styles from "./editJob.module.css";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    experienceLevel: 0,
    position: 1,
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axiosInstance.get(`/jobs/${params.id}`);
        
        // Check if user owns this job
        if (data.createdById !== user?.id) {
          setError("You don't have permission to edit this job");
          return;
        }

        setFormData({
          title: data.title,
          description: data.description,
          requirements: Array.isArray(data.requirements) 
            ? data.requirements.join("\n") 
            : data.requirements,
          salary: data.salary,
          location: data.location,
          jobType: data.jobType,
          experienceLevel: data.experienceLevel,
          position: data.position,
        });
      } catch (error) {
        console.error("Error fetching job:", error);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (user && params.id) {
      fetchJob();
    }
  }, [user, params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "experienceLevel" || name === "position" 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const requirements = formData.requirements
        .split("\n")
        .map(req => req.trim())
        .filter(req => req.length > 0);

      const payload = {
        ...formData,
        requirements,
        experienceLevel: parseInt(formData.experienceLevel),
        position: parseInt(formData.position),
      };

      await axiosInstance.put(`/jobs/${params.id}`, payload);
      alert("Job updated successfully!");
      router.push("/dashboard/employer");
    } catch (error) {
      console.error("Error updating job:", error);
      setError(error.response?.data?.message || "Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error && !formData.title) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Back
        </button>
        <h1 className={styles.title}>Edit Job</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Job Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Senior Full Stack Developer"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Job Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="requirements">Requirements (one per line) *</label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
            rows={5}
            placeholder="5+ years of experience with React&#10;Strong knowledge of Node.js&#10;Experience with PostgreSQL"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="salary">Salary Range *</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              placeholder="e.g., $80,000 - $120,000"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., San Francisco, CA or Remote"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="jobType">Job Type *</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="experienceLevel">Experience Level (years) *</label>
            <input
              type="number"
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              required
              min="0"
              max="20"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="position">Number of Positions *</label>
            <input
              type="number"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              min="1"
              max="100"
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelButton}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
