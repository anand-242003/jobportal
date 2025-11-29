"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { useUser } from "@/context/userContext";

export default function DashboardPage() {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const { user: profile, setUser: setProfile, loading } = useUser();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [stats, setStats] = useState({
    applicationsCount: 0,
    savedJobsCount: 0,
    profileStrength: 0
  });

  useEffect(() => {
    if (!loading && !profile) {
      router.push("/auth/login");
    }
  }, [loading, profile, router]);

  useEffect(() => {
    if (profile) {
      setValue("fullName", profile.fullName || "");
      setValue("profileBio", profile.profileBio || "");
      setValue("skills", profile.skills?.join(", ") || "");
      setValue("phoneNumber", profile.phoneNumber || "");

      let strength = 0;
      if (profile.fullName) strength += 20;
      if (profile.email) strength += 20;
      if (profile.phoneNumber) strength += 15;
      if (profile.profileBio) strength += 15;
      if (profile.skills && profile.skills.length > 0) strength += 15;
      if (profile.resume) strength += 15;

      setStats(prev => ({ ...prev, profileStrength: strength }));
    }
  }, [profile, setValue]);

  useEffect(() => {
    const fetchApplicationStats = async () => {
      if (!profile || profile.role === "Employer" || loading) return;

      try {
        const res = await axiosInstance.get("/applications/my-applications");
        setStats(prev => ({
          ...prev,
          applicationsCount: res.data.length || 0
        }));
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        if (error.response?.status === 401) {
          console.log("User not authenticated yet");
        }
      }
    };

    fetchApplicationStats();
  }, [profile, loading]);

  const submit = async (data) => {
    setMsg("Updating...");
    setErr(false);
    try {
      const skillArr = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await axiosInstance.put("/users/profile", {
        fullName: data.fullName,
        profileBio: data.profileBio,
        skills: skillArr,
        phoneNumber: data.phoneNumber,
      });
      setProfile(res.data.user);
      setMsg(res.data.message);
    } catch (e) {
      setMsg(e.response?.data?.message || "Failed to update.");
      setErr(true);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMsg(`Uploading ${type === 'resume' ? 'resume' : 'photo'}...`);
    setErr(false);

    try {
      const endpoint = type === 'resume' ? '/users/resume' : '/users/profile-photo';
      const res = await axiosInstance.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data.user);
      setMsg(res.data.message);
    } catch (error) {
      console.error(error);
      setMsg("Upload failed.");
      setErr(true);
    } finally {
      setUploading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setProfile(null);
      router.push("/auth/login");
    } catch {
      setMsg("Failed to logout.");
      setErr(true);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className={styles.page}>
      <div className={styles.welcomeHeader}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>
            Welcome back, <span className={styles.highlight}>{profile.fullName}</span>!
          </h1>
          <p className={styles.welcomeSubtitle}>Here's your dashboard overview</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <Link href="/applications" className={styles.statCardLink}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <h3>Applications</h3>
              <p className={styles.statNumber}>{stats.applicationsCount}</p>
            </div>
          </div>
        </Link>

        <Link href="/jobs" className={styles.statCardLink}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, var(--accent), var(--danger))' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <h3>Saved Jobs</h3>
              <p className={styles.statNumber}>{stats.savedJobsCount}</p>
            </div>
          </div>
        </Link>

        <div className={styles.statCard} onClick={() => setShowProfileEdit(true)} style={{ cursor: 'pointer' }}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, var(--secondary), var(--accent))' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <h3>Profile Strength</h3>
            <p className={styles.statNumber}>{stats.profileStrength}%</p>
          </div>
        </div>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <h2>Your Profile</h2>
          <button
            className={styles.editButton}
            onClick={() => setShowProfileEdit(!showProfileEdit)}
          >
            {showProfileEdit ? "Close" : "Edit Profile"}
          </button>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <img
              src={profile.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random&color=fff&size=200`}
              alt="Profile"
              className={styles.avatar}
            />
            <label className={styles.uploadPhotoBtn}>
              {uploading ? "Uploading..." : "Change Photo"}
              <input type="file" hidden onChange={(e) => handleFileUpload(e, 'photo')} accept="image/*" />
            </label>
          </div>

          {!showProfileEdit && (
            <div className={styles.profileInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{profile.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Phone:</span>
                <span className={styles.infoValue}>{profile.phoneNumber || "Not provided"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Bio:</span>
                <span className={styles.infoValue}>{profile.profileBio || "No bio yet"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Skills:</span>
                <span className={styles.infoValue}>{profile.skills?.join(", ") || "No skills added"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Resume:</span>
                {profile.resume ? (
                  <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={styles.resumeLink}>
                    View Resume ({profile.resumeOriginalname || "Download"})
                  </a>
                ) : (
                  <span className={styles.infoValue}>No resume uploaded</span>
                )}
              </div>
              <label className={styles.uploadResumeBtn}>
                {uploading ? "Uploading..." : profile.resume ? "Update Resume" : "Upload Resume"}
                <input type="file" hidden onChange={(e) => handleFileUpload(e, 'resume')} accept=".pdf,.doc,.docx" />
              </label>
            </div>
          )}

          {showProfileEdit && (
            <form onSubmit={handleSubmit(submit)} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input type="email" defaultValue={profile.email} readOnly className={styles.inputReadonly} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input type="text" {...register("fullName")} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input type="tel" {...register("phoneNumber")} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Profile Bio</label>
                <textarea {...register("profileBio")} className={styles.textarea} rows="4" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Skills (comma-separated)</label>
                <input type="text" {...register("skills")} className={styles.input} placeholder="React, Node.js, Python" />
              </div>

              <button type="submit" className={styles.submitButton}>Update Profile</button>
              {msg && <p className={err ? styles.error : styles.success}>{msg}</p>}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
