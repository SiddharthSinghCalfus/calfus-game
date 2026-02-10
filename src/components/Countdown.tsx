"use client";

import { useGame } from "@/components/GameProvider";

function formatMs(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Countdown() {
  const { phase, currentQuestion, timeRemainingMs, questionEndTime } = useGame();

  if (phase === "idle" || currentQuestion == null) {
    return (
      <div className="rounded-xl border border-border-400 bg-bg-800 px-4 py-3 text-content-300 text-sm">
        Quiz not started yet.
      </div>
    );
  }

  const isExpired = timeRemainingMs !== null && timeRemainingMs <= 0;

  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        isExpired
          ? "border-alert-content-200/50 bg-bg-800 text-alert-content-200"
          : "border-alert-content-100/40 bg-bg-800 text-alert-content-100 animate-pulse-glow"
      }`}
    >
      <span className="text-content-300 text-sm">Question {currentQuestion} — </span>
      <span className="font-mono text-lg font-bold">
        {timeRemainingMs != null ? formatMs(timeRemainingMs) : "—"}
      </span>
      {isExpired && (
        <span className="ml-2 text-content-200 text-sm">Time&apos;s up!</span>
      )}
    </div>
  );
}
