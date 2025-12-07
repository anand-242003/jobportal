"use client";
import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

function OAuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      const token = searchParams.get("token");
      const refreshToken = searchParams.get("refreshToken");
      const role = searchParams.get("role");

      if (!token || !refreshToken) {
        router.push("/auth/login?error=oauth_failed");
        return;
      }

      try {
        // Store tokens
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        // Verify token by fetching user profile
        const { data } = await axiosInstance.get("/users/profile");

        if (data) {
          // Token is valid, redirect based on role
          const redirectUrl = role === "Employer" ? "/dashboard/employer" : "/jobs";
          window.location.href = redirectUrl;
        } else {
          throw new Error("Failed to verify user");
        }
      } catch (err) {
        console.error("OAuth verification error:", err);
        setError("Authentication failed. Please try again.");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        setTimeout(() => {
          router.push("/auth/login?error=oauth_failed");
        }, 2000);
      }
    };

    handleOAuthSuccess();
  }, [searchParams, router]);

  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "monospace"
      }}>
        <div style={{ textAlign: "center", color: "#dc2626" }}>
          <h2>⚠️ {error}</h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontFamily: "monospace"
    }}>
      <div style={{ textAlign: "center" }}>
        <h2>✓ Completing sign in...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "monospace"
      }}>
        <div style={{ textAlign: "center" }}>
          <h2>Loading...</h2>
        </div>
      </div>
    }>
      <OAuthSuccessContent />
    </Suspense>
  );
}
