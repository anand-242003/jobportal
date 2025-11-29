"use client";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "Student",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsError(false);
      setMessage("Creating account...");

      const res = await axiosInstance.post("/auth/signup", form);

      setMessage(res.data.message);
      setTimeout(() => router.push("/auth/login"), 1500);

    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Error signing up");
    }
  };

  const getMessageClass = () => {
    if (!message) return styles.message;
    return isError
      ? `${styles.message} ${styles.error}`
      : `${styles.message} ${styles.success}`;
  };

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Create Account</h1>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          value={form.fullName}
          className={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className={styles.input}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          value={form.phoneNumber}
          className={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          className={styles.input}
          required
        />

        <select
          name="role"
          onChange={handleChange}
          value={form.role}
          className={styles.select}
        >
          <option value="Student">I am a Student / Job Seeker</option>
          <option value="Employer">I am an Employer / Recruiter</option>
        </select>

        <button type="submit" className={styles.button}>
          Sign Up
        </button>

        {message && <p className={getMessageClass()}>{message}</p>}

        <p className={styles.loginLink}>
          Already have an account?{" "}
          <Link href="/auth/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}