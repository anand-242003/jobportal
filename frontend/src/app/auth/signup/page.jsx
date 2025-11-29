"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./signup.module.css";

export default function SignupPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: "" };
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;

    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { confirmPassword, ...signupData } = data;


      const signupRes = await axiosInstance.post("/auth/signup", signupData);
      console.log("Signup successful:", signupRes.data);


      const loginRes = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      console.log("Auto-login successful:", loginRes.data);


      const userRes = await axiosInstance.get("/users/profile");
      const user = userRes.data;
      console.log("User profile:", user);


      const redirectUrl = user.role === "Employer"
        ? "/dashboard/employer"
        : "/jobs";

      console.log("Redirecting to:", redirectUrl);


      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 500);

    } catch (err) {
      console.error("Signup error:", err);
      setIsError(true);
      setMessage(err.response?.data?.message || "Signup failed. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.illustration}>
          <div className={styles.illustrationContent}>
            <h2 className={styles.illustrationTitle}>Join Us Today!</h2>
            <p className={styles.illustrationText}>
              Create your account and start your journey to finding the perfect job.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>✓ Free account creation</div>
              <div className={styles.feature}>✓ Instant job matching</div>
              <div className={styles.feature}>✓ Career resources</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Sign Up</h1>
          <p className={styles.subtitle}>Create your account to get started</p>

          {message && (
            <div className={isError ? styles.errorMessage : styles.successMessage}>
              {message}
            </div>
          )}

          <button onClick={handleGoogleSignup} className={styles.googleButton}>
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
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                className={styles.input}
                placeholder="John Doe"
              />
              {errors.fullName && <span className={styles.error}>{errors.fullName.message}</span>}
            </div>

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
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                {...register("phoneNumber", { required: "Phone number is required" })}
                className={styles.input}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Role</label>
              <select
                {...register("role", { required: "Role is required" })}
                className={styles.input}
              >
                <option value="">Select your role</option>
                <option value="Student">Job Seeker</option>
                <option value="Employer">Recruiter</option>
              </select>
              {errors.role && <span className={styles.error}>{errors.role.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
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
              {password && (
                <div className={`${styles.passwordStrength} ${styles[`strength${passwordStrength.strength}`]}`}>
                  <div className={styles.strengthBar}>
                    <div className={styles.strengthFill} style={{ width: `${passwordStrength.strength * 25}%` }}></div>
                  </div>
                  <span className={styles.strengthLabel}>{passwordStrength.label}</span>
                </div>
              )}
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", { required: "Please confirm your password" })}
                  className={styles.input}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.passwordToggle}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword.message}</span>}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className={styles.footer}>
            Already have an account? <Link href="/auth/login" className={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}