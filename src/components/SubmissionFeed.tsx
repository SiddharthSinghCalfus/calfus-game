"use client";

import { useGame } from "@/components/GameProvider";
import { Cpu } from "lucide-react";

/** Answers are visible only after the timer for that question has ended (no copying). */
function hasQuestionEnded(
  questionNum: number,
  phase: "idle" | "q1" | "q2",
  timerExpired: boolean
): boolean {
  if (phase === "idle") return true;
  if (questionNum === 1) return phase === "q2" || (phase === "q1" && timerExpired);
  if (questionNum === 2) return phase === "q2" && timerExpired;
  return false;
}

export function SubmissionFeed() {
  const { submissions, phase, timeRemainingMs } = useGame();
  const timerExpired = timeRemainingMs !== null && timeRemainingMs <= 0;

  const visible = submissions.filter((s) =>
    hasQuestionEnded(s.questionNum, phase, timerExpired)
  );

  return (
    <div className="flex flex-col rounded-xl border border-border-400 bg-bg-800 shadow-elevated-card">
      <div className="border-b border-border-400 bg-bg-700 px-4 py-2">
        <h2 className="text-content-200 font-medium">Latest answers</h2>
        <p className="text-content-400 mt-0.5 text-xs">
          Shown only after each question&apos;s timer ends
        </p>
      </div>
      <div className="max-h-96 overflow-y-auto p-2">
        {visible.length === 0 ? (
          <p className="p-4 text-content-300 text-sm">
            No answers visible yet. Answers appear when the timer for that question ends.
          </p>
        ) : (
          <ul className="space-y-3">
            {visible.map((s) => (
              <li
                key={s.id}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  s.isAi
                    ? "border-alert-content-100/40 bg-bg-1200/10 text-content-100"
                    : "border-border-400 bg-bg-900/50 text-content-200"
                }`}
              >
                <div className="flex items-center gap-2 text-content-300">
                  {s.isAi && <Cpu className="h-3.5 w-3.5 text-alert-content-100" />}
                  <span className="font-medium">{s.teamName}</span>
                  <span>Q{s.questionNum}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-content-200 text-xs leading-relaxed">
                  {s.answerSnippet}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
