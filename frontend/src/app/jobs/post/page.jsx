"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import styles from "./postJob.module.css";
import { useUser } from "../../../context/userContext";

export default function PostJobPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);

  // Submit Handler
  const onSubmit = async (data) => {
    setMsg("Posting job...");
    setErr(false);

    try {
      // Convert requirements string to array
      const requirementsArray = data.requirements
        .split(",")
        .map((req) => req.trim())
        .filter(Boolean);

      await axiosInstance.post("/jobs", {
        title: data.title,
        description: data.description,
        requirements: requirementsArray,
        salary: data.salary,
        location: data.location,
        jobType: data.jobType,
        experienceLevel: parseInt(data.experienceLevel), // Ensure number
        position: parseInt(data.position), // Ensure number
      });

      setMsg("Job posted successfully! Redirecting...");
      
      // Redirect to jobs page after 1.5 seconds
      setTimeout(() => {
        router.push("/jobs");
      }, 1500);

    } catch (error) {
      console.error(error);
      setMsg(error.response?.data?.message || "Failed to post job.");
      setErr(true);
    }
  };

  // Access Control: Only Employers can see this page
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  if (user.role !== "Employer") {
    return <div className={styles.page}>Access Denied. Only Employers can post jobs.</div>;
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Post a New Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        
        {/* Title */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Job Title</label>
          <input
            type="text"
            placeholder="e.g. Senior React Developer"
            className={styles.input}
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className={`${styles.message} ${styles.error}`}>{errors.title.message}</p>}
        </div>

        {/* Two Column Row: Location & Salary */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Location</label>
            <input
              type="text"
              placeholder="e.g. Remote, New York"
              className={styles.input}
              {...register("location", { required: "Location is required" })}
            />
             {errors.location && <p className={`${styles.message} ${styles.error}`}>{errors.location.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Salary</label>
            <input
              type="text"
              placeholder="e.g. $100,000 - $120,000"
              className={styles.input}
              {...register("salary", { required: "Salary is required" })}
            />
             {errors.salary && <p className={`${styles.message} ${styles.error}`}>{errors.salary.message}</p>}
          </div>
        </div>

        {/* Two Column Row: Job Type & Experience */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Job Type</label>
            <select className={styles.select} {...register("jobType", { required: true })}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Experience Level (Years)</label>
            <input
              type="number"
              placeholder="e.g. 3"
              className={styles.input}
              {...register("experienceLevel", { required: "Experience level is required", min: 0 })}
            />
             {errors.experienceLevel && <p className={`${styles.message} ${styles.error}`}>{errors.experienceLevel.message}</p>}
          </div>
        </div>
        
        {/* Positions */}
        <div className={styles.formGroup}>
            <label className={styles.label}>Number of Openings</label>
            <input
              type="number"
              defaultValue={1}
              className={styles.input}
              {...register("position", { required: true, min: 1 })}
            />
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Job Description</label>
          <textarea
            placeholder="Describe the role, responsibilities, and company culture..."
            className={styles.textarea}
            {...register("description", { required: "Description is required" })}
          />
           {errors.description && <p className={`${styles.message} ${styles.error}`}>{errors.description.message}</p>}
        </div>

        {/* Requirements */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Requirements (Comma separated)</label>
          <input
            type="text"
            placeholder="e.g. React, Node.js, TypeScript, AWS"
            className={styles.input}
            {...register("requirements")}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Post Job
        </button>

        {msg && (
          <p className={err ? `${styles.message} ${styles.error}` : `${styles.message} ${styles.success}`}>
            {msg}
          </p>
        )}
      </form>
    </main>
  );
}