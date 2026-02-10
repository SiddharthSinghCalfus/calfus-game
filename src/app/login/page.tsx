"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { validateLogin, LOGIN_OPTIONS } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const [who, setWho] = useState("team1");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) {
      router.replace(user.role === "admin" ? "/admin" : "/");
    }
  }, [ready, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = validateLogin(who, password);
    if (!user) {
      setError("Invalid credentials. Check login role and password.");
      return;
    }
    login(user);
    if (user.role === "admin") router.push("/admin");
    else router.push("/play");
  };

  if (!ready || user) {
    return (
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <p className="text-content-300 text-sm">Loading…</p>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-sm rounded-2xl border border-border-400 p-6 shadow-elevated-card">
        <h1 className="text-content-100 mb-6 text-center text-xl font-bold">
          Neural Arena — Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-content-200 mb-1 block text-sm font-medium">
              Login as
            </label>
            <select
              value={who}
              onChange={(e) => setWho(e.target.value)}
              className="w-full rounded-lg border border-border-400 bg-bg-800 px-3 py-2 text-content-100 text-sm"
            >
              {LOGIN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-content-200 mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border-400 bg-bg-800 px-3 py-2 text-content-100 text-sm placeholder:text-content-300"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-content-secondary-100 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-bg-1200 px-4 py-2 text-content-100 text-sm font-medium hover:opacity-90"
          >
            Log in
          </button>
        </form>
        <p className="text-content-300 mt-4 text-center text-xs">
          Contact the host for credentials.
        </p>
        <Link
          href="/"
          className="text-content-300 mt-2 block text-center text-sm hover:text-content-100"
        >
          ← Back to leaderboard
        </Link>
      </div>
    </main>
  );
}
