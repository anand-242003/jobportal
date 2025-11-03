"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-2 rounded-lg font-bold shadow-sm">
            JP
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              Job<span className="text-blue-600">Portal</span>
            </h2>
            <p className="text-sm text-gray-500">Find your next step</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>

          <Link
            href="/jobs"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Jobs
          </Link>

          <Link
            href="/companies"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Companies
          </Link>

          <Link
            href="/auth/login"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Sign in
          </Link>

          <Link
            href="/auth/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
