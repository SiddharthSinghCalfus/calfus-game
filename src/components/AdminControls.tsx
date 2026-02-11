"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/components/GameProvider";
import { RotateCcw, Send, Play, SkipForward, StopCircle, Check, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Cpu } from "lucide-react";

const POINTS_OPTIONS = [10, 20, 50] as const;
const SUBTRACT_OPTIONS = [10, 20, 50] as const;
const SCORE_CONFIRM_MS = 2000;

type ScoreFeedback = { participantName: string; type: "add"; points: number } | { participantName: string; type: "subtract"; points: number } | { participantName: string; type: "clear" };

export function AdminControls() {
  const {
    phase,
    currentQuestion,
    timeRemainingMs,
    participants,
    submissions,
    addPoints,
    setScore,
    postAiAnswer,
    setAetherionThought,
    resetGame,
    startQuestion,
    endTimer,
    nextQuestion,
  } = useGame();

  const [aiAnswer, setAiAnswer] = useState("");
  const [questionNum, setQuestionNum] = useState(1);
  const [thought, setThought] = useState("");
  const [scoreFeedback, setScoreFeedback] = useState<ScoreFeedback | null>(null);

  useEffect(() => {
    if (!scoreFeedback) return;
    const t = setTimeout(() => setScoreFeedback(null), SCORE_CONFIRM_MS);
    return () => clearTimeout(t);
  }, [scoreFeedback]);

  const timerExpired = timeRemainingMs !== null && timeRemainingMs <= 0;
  const submissionsForCurrent = submissions.filter(
    (s) => s.questionNum === currentQuestion
  );

  const handlePostAiAnswer = () => {
    const snippet = aiAnswer.trim() || "(No text)";
    postAiAnswer(questionNum, snippet);
    setAiAnswer("");
  };

  const handleSetThought = () => {
    setAetherionThought(thought.trim() || "Idle — awaiting task.");
    setThought("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-content-100 text-xl font-semibold">Admin</h1>
        <Link
          href="/"
          className="text-content-300 text-sm hover:text-content-100"
        >
          ← Back to leaderboard
        </Link>
      </div>

      {/* Round control: start, end timer, next question, reset */}
      <section className="rounded-xl border border-border-400 bg-bg-800 p-4 shadow-elevated-card">
        <h2 className="text-content-200 mb-3 font-medium">Round control</h2>
        <div className="flex flex-wrap gap-3">
          {phase === "idle" && (
            <button
              type="button"
              onClick={() => startQuestion(1)}
              className="inline-flex items-center gap-2 rounded-lg bg-alert-content-100 px-4 py-2 text-bg-100 text-sm font-medium hover:opacity-90"
            >
              <Play className="h-4 w-4" />
              Start Question 1 (3 min timer)
            </button>
          )}
          {(phase === "q1" || phase === "q2") && !timerExpired && (
            <button
              type="button"
              onClick={() => endTimer()}
              className="inline-flex items-center gap-2 rounded-lg border border-alert-content-200 bg-bg-800 px-4 py-2 text-alert-content-200 text-sm hover:bg-bg-700"
              title="Stop timer now (e.g. everyone answered or revert)"
            >
              <StopCircle className="h-4 w-4" />
              End timer / Mark complete
            </button>
          )}
          {(phase === "q1" || phase === "q2") && (
            <button
              type="button"
              onClick={() => nextQuestion()}
              className="inline-flex items-center gap-2 rounded-lg border border-alert-content-100 bg-bg-800 px-4 py-2 text-alert-content-100 text-sm hover:bg-bg-700"
            >
              <SkipForward className="h-4 w-4" />
              {phase === "q1" ? "Next question (Q2)" : "End round"}
            </button>
          )}
        </div>
        <p className="text-content-300 mt-2 text-xs">
          Current: {phase === "idle" ? "No question" : `Question ${currentQuestion}`}
          {phase !== "idle" && timerExpired && " — Time's up. Assign points below, then click Next question or End round."}
        </p>
      </section>

      {/* Admin sees answers for current question as soon as anyone submits; participants see only after timer ends */}
      {phase !== "idle" && submissionsForCurrent.length > 0 && (
        <section className="rounded-xl border border-alert-content-100/30 bg-bg-800 p-4 shadow-elevated-card">
          <h2 className="text-content-200 mb-3 font-medium">
            Answers for Question {currentQuestion} — assign points
          </h2>
          <p className="text-content-400 mb-3 text-xs">
            Visible to admin only; participants see these after the timer ends.
          </p>
          <ul className="mb-4 space-y-3">
            {submissionsForCurrent.map((s) => (
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
                  <span className="font-medium">{s.participantName}</span>
                  {s.participantRollNumber && (
                    <span className="text-content-400">({s.participantRollNumber})</span>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-content-200 text-xs leading-relaxed">
                  {s.answerSnippet}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-border-400 bg-bg-800 p-4 shadow-elevated-card">
        <h2 className="text-content-200 mb-3 font-medium">Add / remove points</h2>
        {scoreFeedback && (
          <p className="mb-3 inline-flex items-center gap-2 rounded-lg bg-alert-content-100/20 px-3 py-2 text-alert-content-100 text-sm">
            <Check className="h-4 w-4" />
            {scoreFeedback.type === "add" && `Added +${scoreFeedback.points} to ${scoreFeedback.participantName}`}
            {scoreFeedback.type === "subtract" && `Removed ${scoreFeedback.points} from ${scoreFeedback.participantName}`}
            {scoreFeedback.type === "clear" && `Cleared ${scoreFeedback.participantName} score`}
          </p>
        )}
        <div className="space-y-3">
          {participants.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-2">
              <span className="text-content-200 w-40 truncate text-sm" title={p.rollNumber ? `${p.name} (${p.rollNumber})` : p.name}>
                {p.name}{p.rollNumber ? ` (${p.rollNumber})` : ""}
              </span>
              {POINTS_OPTIONS.map((pts) => (
                <button
                  key={`+${pts}`}
                  type="button"
                  onClick={async () => {
                    await addPoints(p.id, pts);
                    setScoreFeedback({ participantName: p.name, type: "add", points: pts });
                  }}
                  className="rounded-lg border border-border-400 bg-bg-700 px-3 py-1.5 text-content-200 text-sm hover:bg-bg-600"
                >
                  +{pts}
                </button>
              ))}
              {SUBTRACT_OPTIONS.map((pts) => (
                <button
                  key={`-${pts}`}
                  type="button"
                  onClick={async () => {
                    await addPoints(p.id, -pts);
                    setScoreFeedback({ participantName: p.name, type: "subtract", points: pts });
                  }}
                  className="rounded-lg border border-border-400 border-content-300/50 bg-bg-700 px-3 py-1.5 text-content-300 text-sm hover:bg-bg-600"
                  title="Remove points"
                >
                  <Minus className="inline h-3 w-3" />{pts}
                </button>
              ))}
              <button
                type="button"
                onClick={async () => {
                  await setScore(p.id, 0);
                  setScoreFeedback({ participantName: p.name, type: "clear" });
                }}
                className="rounded-lg border border-alert-content-200/50 bg-bg-700 px-3 py-1.5 text-alert-content-200 text-sm hover:bg-bg-600"
                title="Clear score to 0"
              >
                <Trash2 className="inline h-3 w-3" /> Clear
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border-400 bg-bg-800 p-4 shadow-elevated-card">
        <h2 className="text-content-200 mb-3 font-medium">Post AI answer</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={2}
              value={questionNum}
              onChange={(e) => setQuestionNum(parseInt(e.target.value, 10) || 1)}
              className="w-16 rounded border border-border-400 bg-bg-700 px-2 py-2 text-content-100 text-sm"
            />
            <button
              type="button"
              onClick={handlePostAiAnswer}
              className="inline-flex items-center gap-2 rounded-lg bg-bg-1200 px-4 py-2 text-content-100 text-sm font-medium hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              Post
            </button>
          </div>
          <textarea
            value={aiAnswer}
            onChange={(e) => setAiAnswer(e.target.value)}
            rows={4}
            className="w-full rounded border border-border-400 bg-bg-700 px-3 py-2 text-content-100 text-sm placeholder:text-content-300 resize-y"
            placeholder="AI answer (multiple lines allowed)..."
          />
        </div>
      </section>

      <section className="rounded-xl border border-border-400 bg-bg-800 p-4 shadow-elevated-card">
        <h2 className="text-content-200 mb-3 font-medium">Aetherion thought</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            className="flex-1 rounded border border-border-400 bg-bg-700 px-3 py-2 text-content-100 text-sm placeholder:text-content-300"
            placeholder="e.g. Searching Lufthansa API..."
          />
          <button
            type="button"
            onClick={handleSetThought}
            className="rounded-lg border border-border-400 bg-bg-700 px-4 py-2 text-content-200 text-sm hover:bg-bg-600"
          >
            Update
          </button>
        </div>
      </section>

      <section>
        <button
          type="button"
          onClick={() => resetGame()}
          className="inline-flex items-center gap-2 rounded-lg border border-alert-content-200/50 bg-bg-800 px-4 py-2 text-alert-content-200 text-sm hover:bg-bg-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reset game
        </button>
      </section>
    </div>
  );
}
