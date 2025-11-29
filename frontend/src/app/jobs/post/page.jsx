"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  const onSubmit = async (data) => {
    setMsg("Posting job...");
    setErr(false);

    try {
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
        experienceLevel: parseInt(data.experienceLevel),
        position: parseInt(data.position),
      });

      setMsg("Job posted successfully! Redirecting...");

      setTimeout(() => {
        router.push("/dashboard/employer");
      }, 1500);

    } catch (error) {
      console.error(error);
      setMsg(error.response?.data?.message || "Failed to post job.");
      setErr(true);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "Employer") {
    return (
      <div className={styles.page}>
        <div className={styles.accessDenied}>
          <h2>Access Denied</h2>
          <p>Only Employers can post jobs.</p>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.header}
        >
          <h1 className={styles.title}>
            Post a <span className={styles.highlight}>New Job</span>
          </h1>
          <p className={styles.subtitle}>
            Fill in the details to attract top talent
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Senior React Developer"
                className={styles.input}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className={styles.error}>{errors.title.message}</p>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Remote, New York"
                  className={styles.input}
                  {...register("location", { required: "Location is required" })}
                />
                {errors.location && <p className={styles.error}>{errors.location.message}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Salary *</label>
                <input
                  type="text"
                  placeholder="e.g. $100,000 - $120,000"
                  className={styles.input}
                  {...register("salary", { required: "Salary is required" })}
                />
                {errors.salary && <p className={styles.error}>{errors.salary.message}</p>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Job Type *</label>
                <select className={styles.select} {...register("jobType", { required: true })}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Experience Level (Years) *</label>
                <input
                  type="number"
                  placeholder="e.g. 3"
                  className={styles.input}
                  {...register("experienceLevel", { required: "Experience level is required", min: 0 })}
                />
                {errors.experienceLevel && <p className={styles.error}>{errors.experienceLevel.message}</p>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Number of Openings *</label>
              <input
                type="number"
                defaultValue={1}
                className={styles.input}
                {...register("position", { required: true, min: 1 })}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Job Details</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>Job Description *</label>
              <textarea
                placeholder="Describe the role, responsibilities, and company culture..."
                className={styles.textarea}
                rows={6}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <p className={styles.error}>{errors.description.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Requirements (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, TypeScript, AWS"
                className={styles.input}
                {...register("requirements")}
              />
              <small className={styles.hint}>Separate each requirement with a comma</small>
            </div>
          </div>

          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Post Job
          </motion.button>

          {msg && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={err ? styles.errorMessage : styles.successMessage}
            >
              {msg}
            </motion.p>
          )}
        </motion.form>
      </div>
    </main>
  );
}