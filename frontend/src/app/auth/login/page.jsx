"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./login.module.css";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {

      const res = await axiosInstance.post("/auth/login", data);
      console.log("Login successful:", res.data);


      const userRes = await axiosInstance.get("/users/profile");
      const user = userRes.data;
      console.log("User profile loaded:", user);


      setMessage("Login successful! Redirecting...");
      setIsError(false);


      await new Promise(resolve => setTimeout(resolve, 1000));


      const redirectUrl = user.role === "Employer"
        ? "/dashboard/employer"
        : "/jobs";

      console.log("Redirecting to:", redirectUrl);
      window.location.href = redirectUrl;

    } catch (err) {
      console.error("Login error:", err);
      setIsError(true);
      if (err.response?.status === 401) {
        setMessage("Invalid email or password. Please try again.");
      } else if (err.response?.status === 500) {
        setMessage("Server error. Please try again later.");
      } else {
        setMessage(err.response?.data?.message || "Login failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.illustration}>
          <div className={styles.illustrationContent}>
            <h2 className={styles.illustrationTitle}>Welcome Back!</h2>
            <p className={styles.illustrationText}>
              Sign in to access thousands of job opportunities and connect with top employers.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>✓ Browse 10,000+ jobs</div>
              <div className={styles.feature}>✓ Apply with one click</div>
              <div className={styles.feature}>✓ Track your applications</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>Enter your credentials to access your account</p>

          {message && (
            <div className={isError ? styles.errorMessage : styles.successMessage}>
              {message}
            </div>
          )}

          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className={styles.input}
                placeholder="you@example.com"
              />
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className={styles.input}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className={styles.footer}>
            Don't have an account? <Link href="/auth/signup" className={styles.link}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}