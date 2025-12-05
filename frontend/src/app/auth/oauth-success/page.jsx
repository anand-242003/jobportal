"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OAuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const role = searchParams.get("role");

    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      const redirectUrl = role === "Employer" ? "/dashboard/employer" : "/jobs";
      
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 100);
    } else {
      router.push("/auth/login?error=oauth_failed");
    }
  }, [searchParams, router]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      fontFamily: "monospace"
    }}>
      <div style={{ textAlign: "center" }}>
        <h2>Completing sign in...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
