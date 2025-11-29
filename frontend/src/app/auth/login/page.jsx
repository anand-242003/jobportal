"use client";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsError(false);
      setMessage("Logging in...");

      const res = await axiosInstance.post("/auth/login", form);

      setMessage("Login successful!");
      setTimeout(() => router.push("/dashboard"), 1000);

    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Invalid credentials");
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
        <h1 className={styles.title}>Sign In</h1>

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
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button}>
          Sign In
        </button>

        {message && (
          <p className={getMessageClass()}>
            {message}
          </p>
        )}

        <p className={styles.signupLink}>
          Don’t have an account?{" "}
          <Link href="/auth/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}