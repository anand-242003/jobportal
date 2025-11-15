"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    profileBio: "",
    skills: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  da
  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get("/users/profile");
        const data = res.data;

        setProfile(data);

        // Pre-fill the form with current data
        setFormData({
          fullName: data.fullName || "",
          profileBio: data.profileBio || "",
          skills: data.skills ? data.skills.join(", ") : "",
          phoneNumber: data.phoneNumber || "",
        });

      } catch (error) {
        console.log("Error loading profile:", error);

        if (error.response?.status !== 401) {
          setMessage("Failed to load profile.");
          setIsError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  // -----------------------------------------
  // Update form data when user types
  // -----------------------------------------
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // -----------------------------------------
  // Update profile when user submits form
  // -----------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("Updating...");
    setIsError(false);

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const res = await axiosInstance.put("/users/profile", {
        fullName: formData.fullName,
        profileBio: formData.profileBio,
        skills: skillsArray,
        phoneNumber: formData.phoneNumber,
      });

      setProfile(res.data.user);
      setMessage(res.data.message);

    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Update failed");
      setIsError(true);
    }
  };

  // -----------------------------------------
  // Logout function
  // -----------------------------------------
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      router.push("/auth/login");
    } catch (error) {
      console.log(error);
      setMessage("Logout failed");
      setIsError(true);
    }
  };

  // -----------------------------------------
  // Style the message
  // -----------------------------------------
  const getMessageClass = () => {
    if (!message) return styles.message;
    return isError
      ? `${styles.message} ${styles.error}`
      : `${styles.message} ${styles.success}`;
  };

  // -----------------------------------------
  // RENDERING
  // -----------------------------------------

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  if (!profile) {
    return <div>Could not load profile. Try logging in again.</div>;
  }

  return (
    <main className={styles.page}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome, {formData.fullName || profile.fullName}!
        </h1>

        <button onClick={handleLogout} className={styles.logoutButton}>
          Sign Out
        </button>
      </div>

      <p>Update your professional profile below.</p>

      {/* FORM */}
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* EMAIL (read only) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className={styles.inputReadonly}
          />
        </div>

        {/* FULL NAME */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        {/* PHONE NUMBER */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        {/* PROFILE BIO */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Profile Bio</label>
          <textarea
            name="profileBio"
            value={formData.profileBio}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="e.g., Full stack developer..."
          ></textarea>
        </div>

        {/* SKILLS */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className={styles.input}
            placeholder="React, Node.js, Prisma"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button type="submit" className={styles.submitButton}>
          Update Profile
        </button>

        {/* MESSAGE */}
        {message && <p className={getMessageClass()}>{message}</p>}
      </form>
    </main>
  );
}
