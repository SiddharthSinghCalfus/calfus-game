"use client";

import { useAuth } from "@/components/AuthProvider";
import { LiveIndicator } from "@/components/LiveIndicator";
import Link from "next/link";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="relative z-10 mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-content-100 text-xl font-bold sm:text-2xl">
            Neural Arena
          </span>
        </Link>
        <span className="text-content-400 hidden text-sm sm:inline">— Humans vs. AI • Live</span>
      </div>
      <nav className="flex items-center gap-3">
        <LiveIndicator />
        <Link
          href="/play"
          className="text-content-300 text-sm hover:text-content-100"
        >
          Play
        </Link>
        {user ? (
          <>
            <span className="text-content-300 text-sm">
              {user.role === "admin" ? "Admin" : "Participant"}
            </span>
            <Link
              href={user.role === "admin" ? "/admin" : "/play"}
              className="text-content-300 text-sm hover:text-content-100"
            >
              {user.role === "admin" ? "Admin" : "My answer"}
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg border border-border-400 bg-bg-800 px-3 py-1.5 text-content-300 text-sm hover:bg-bg-700 hover:text-content-100"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-lg border border-border-400 bg-bg-800 px-3 py-1.5 text-content-200 text-sm hover:bg-bg-700"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
