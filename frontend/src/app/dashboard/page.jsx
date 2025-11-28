"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import { useUser } from "@/context/userContext";

export default function DashboardPage() {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();

  const { user: profile, setUser: setProfile, loading } = useUser();

 
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (profile) {
      setValue("fullName", profile.fullName || "");
      setValue("profileBio", profile.profileBio || "");
      setValue("skills", profile.skills.join(", ") || "");
      setValue("phoneNumber", profile.phoneNumber || "");
    }
  }, [profile, setValue])

  const submit = async (data) => {
    setMsg("Updating...");
    setErr(false);

    try {
      const skillArr = data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

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

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setProfile(null)
      router.push("/auth/login");
    } catch {
      setMsg("Failed to logout.");
      setErr(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>You must be logged in to view this page.</div>;
  }
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome, {profile.fullName}</h1>
        <button className={styles.logoutButton} onClick={logout}>
          Sign Out
        </button>
      </div>

      <form onSubmit={handleSubmit(submit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            defaultValue={profile.email}
            readOnly
            className={styles.inputReadonly}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Full Name</label>
          <input
            type="text"
            {...register("fullName")}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number</label>
          <input
            type="tel"
            {...register("phoneNumber")}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Profile Bio</label>
          <textarea
            {...register("profileBio")}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Skills</label>
          <input
            type="text"
            {...register("skills")}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Update Profile
        </button>

        {msg && (
          <p className={err ? styles.error : styles.success}>{msg}</p>
        )}
      </form>
    </main>
  );
}
