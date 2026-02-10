"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useGame } from "@/components/GameProvider";
import Link from "next/link";
import { Cpu } from "lucide-react";

export default function PlayPage() {
  const { user } = useAuth();
  const {
    phase,
    currentQuestion,
    timeRemainingMs,
    questions = [],
    submissions,
    submitAnswer,
  } = useGame();

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const question = questions.find((q) => q.num === currentQuestion);
  const timerExpired = timeRemainingMs !== null && timeRemainingMs <= 0;

  // One answer per team per question — already answered if we have a submission for this team + question (or just submitted)
  const alreadyAnswered =
    user?.role === "team" &&
    currentQuestion != null &&
    (submissions.some(
      (s) => s.teamName === user.teamName && s.questionNum === currentQuestion
    ) ||
      submitted);

  const canSubmit =
    user?.role === "team" &&
    phase !== "idle" &&
    currentQuestion != null &&
    !timerExpired &&
    !alreadyAnswered;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !user || user.role !== "team" || !answer.trim()) return;
    submitAnswer(user.teamId, user.teamName, currentQuestion!, answer.trim());
    setAnswer("");
    setSubmitted(true);
  };

  // Question visible only when admin has started (phase is q1 or q2)
  if (phase === "idle") {
    return (
      <main className="relative z-10 min-h-screen px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 py-12 text-center">
          <p className="text-content-200 text-lg">
            Wait for the admin to start the quiz.
          </p>
          <Link
            href="/"
            className="text-content-300 text-sm hover:text-content-100"
          >
            ← Back to leaderboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 min-h-screen px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-content-300 text-sm hover:text-content-100">
            ← Leaderboard
          </Link>
          {user?.role === "team" && (
            <span className="text-content-300 text-sm">Logged in as {user.teamName}</span>
          )}
        </div>

        {/* Center: question + timer */}
        <div className="glass-card rounded-2xl border border-border-400 p-6 shadow-elevated-card">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-content-300 text-sm">
              Question {currentQuestion}
            </span>
            <span className="font-mono text-content-100 text-lg font-bold">
              {timeRemainingMs != null && timeRemainingMs > 0
                ? `${Math.floor(timeRemainingMs / 60000)}:${String(
                    Math.floor((timeRemainingMs % 60000) / 1000)
                  ).padStart(2, "0")}`
                : "0:00"}
            </span>
          </div>
          <h1 className="text-content-100 text-xl font-semibold">
            {question?.text ?? "—"}
          </h1>
        </div>

        {/* One answer per team per question: show form only if not already answered */}
        {user?.role === "team" && alreadyAnswered && (
          <div className="glass-card rounded-2xl border border-alert-content-100/40 bg-bg-1200/10 p-6 shadow-elevated-card">
            <p className="text-alert-content-100 text-center text-lg font-medium">
              Answered ✓
            </p>
            <p className="text-content-200 mt-2 text-center text-sm">
              Get ready for the next question.
            </p>
          </div>
        )}

        {user?.role === "team" && !alreadyAnswered && (
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl border border-border-400 p-6 shadow-elevated-card"
          >
            <label className="text-content-200 mb-2 block text-sm font-medium">
              Your answer ({user.teamName})
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border-400 bg-bg-800 px-3 py-2 text-content-100 text-sm placeholder:text-content-300"
              placeholder="Type your answer..."
              disabled={!canSubmit}
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-3 rounded-lg bg-bg-1200 px-4 py-2 text-content-100 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              Submit answer
            </button>
          </form>
        )}

        {!user && (
          <p className="text-content-300 text-center text-sm">
            <Link href="/login" className="text-content-200 hover:underline">
              Log in as a team
            </Link>{" "}
            to submit answers.
          </p>
        )}
      </div>
    </main>
  );
}
