"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { AdminControls } from "@/components/AdminControls";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) return; // still loading
    if (user?.role !== "admin") {
      router.replace("/login");
    }
  }, [user, router]);

  if (user === null) {
    return (
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <p className="text-content-300">Loading...</p>
      </main>
    );
  }

  if (user?.role !== "admin") {
    return null; // redirecting
  }

  return (
    <main className="relative z-10 min-h-screen bg-bg-100 px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl">
        <AdminControls />
      </div>
    </main>
  );
}
