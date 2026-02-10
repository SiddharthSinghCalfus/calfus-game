"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { SubmissionFeed } from "@/components/SubmissionFeed";
import { AetherionThought } from "@/components/AetherionThought";
import { Countdown } from "@/components/Countdown";
import Link from "next/link";

export default function Home() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <p className="text-content-300 text-sm">Loading…</p>
      </main>
    );
  }

  return (
    <main className="relative z-10 min-h-screen px-4 py-6 sm:px-6 md:px-8">
      <Header />

      <div className="mb-6">
        <Countdown />
      </div>

      <div className="mb-4 text-center">
        <Link
          href="/play"
          className="text-content-200 text-sm font-medium hover:text-content-100"
        >
          Go to round →
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <LeaderboardTable />
          <SubmissionFeed />
        </div>
        <div>
          <AetherionThought />
        </div>
      </div>
    </main>
  );
}
