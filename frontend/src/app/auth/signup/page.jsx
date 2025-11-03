"use client";
import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/signup", form);
      setMessage(res.data.message);
      setTimeout(() => router.push("/auth/login"), 1500); 
    } catch (err) {
      setMessage(err.response?.data?.message || "Error signing up");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96 border border-gray-200"
      >
        <h1 className="text-2xl font-semibold text-center mb-6 text-blue-600">
          Create Account
        </h1>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          value={form.fullName}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
         <input
          type="number"
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          value={form.phoneNumber}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <select
          name="role"
          onChange={handleChange}
          value={form.role}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="Student">Student</option>
          <option value="Recruiter">Recruiter</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        {message && (
          <p className="text-center mt-3 text-sm text-gray-600">{message}</p>
        )}
      </form>
    </div>
  );
}
