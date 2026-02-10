"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useGame } from "@/components/GameProvider";
import Link from "next/link";

type QuestionRules = {
  prohibited: string[];
  allowed: string[];
  disqualification: string[];
};

type AnswerField = {
  label: string;
  note?: string;
  multiline?: boolean;
};

type QuestionWithMeta = {
  num: number;
  text: string;
  rules?: QuestionRules;
  answerFormat?: string;
  answerFields?: AnswerField[];
};

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
  const [fieldValues, setFieldValues] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const question = questions.find((q) => q.num === currentQuestion) as QuestionWithMeta | undefined;
  const timerExpired = timeRemainingMs !== null && timeRemainingMs <= 0;

  // Pre-fill submission when question has answerFormat (string) but no answerFields
  useEffect(() => {
    if (question?.answerFields != null) {
      setFieldValues(question.answerFields.map(() => ""));
      setAnswer("");
    } else if (question?.answerFormat != null) {
      setAnswer(question.answerFormat);
      setFieldValues([]);
    } else {
      setAnswer("");
      setFieldValues([]);
    }
  }, [currentQuestion, question?.num, question?.answerFormat, question?.answerFields]);

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
    if (!canSubmit || !user || user.role !== "team") return;
    const payload =
      question?.answerFields != null && question.answerFields.length > 0
        ? question.answerFields
            .map((f, i) => `${f.label} ${(fieldValues[i] ?? "").trim()}`.trim())
            .join("\n\n")
        : answer.trim();
    if (!payload) return;
    submitAnswer(user.teamId, user.teamName, currentQuestion!, payload);
    setAnswer("");
    setFieldValues(question?.answerFields?.map(() => "") ?? []);
    setSubmitted(true);
  };

  const canSubmitForm =
    canSubmit &&
    (question?.answerFields != null
      ? fieldValues.some((v) => v.trim().length > 0)
      : answer.trim().length > 0);

  if (phase === "idle") {
    return (
      <main className="relative z-10 min-h-screen px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 py-12 text-center">
          <p className="text-content-200 text-lg">
            Wait for the host to start the round.
          </p>
          <Link
            href="/"
            className="text-content-300 text-sm hover:text-content-100"
          >
            Back to leaderboard
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
            Leaderboard
          </Link>
          {user?.role === "team" && (
            <span className="text-content-300 text-sm">Logged in as {user.teamName}</span>
          )}
        </div>

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
          <div className="text-content-100 text-xl font-semibold whitespace-pre-wrap leading-relaxed">
            {question?.text ?? "—"}
          </div>
        </div>

        {question?.rules && (
          <div className="glass-card rounded-xl border border-border-400 p-3 shadow-elevated-card">
            <button
              type="button"
              onClick={() => setRulesOpen((o) => !o)}
              className="flex w-full items-center justify-between text-left text-content-200 text-xs font-semibold uppercase tracking-wide"
            >
              Rules and guardrails
              <span className="text-content-400">{rulesOpen ? " Hide" : " Show"}</span>
            </button>
            {rulesOpen && (
              <div className="mt-3 space-y-3 border-t border-border-400 pt-3 text-xs">
                <div>
                  <span className="text-content-400 font-medium">Prohibited:</span>
                  <p className="mt-0.5 text-content-300">{question.rules.prohibited.join("; ")}</p>
                </div>
                <div>
                  <span className="text-content-400 font-medium">Allowed:</span>
                  <p className="mt-0.5 text-content-300">{question.rules.allowed.join("; ")}</p>
                </div>
                <div>
                  <span className="text-content-400 font-medium">Disqualification:</span>
                  <p className="mt-0.5 text-content-300">{question.rules.disqualification.join("; ")}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {user?.role === "team" && alreadyAnswered && (
          <div className="glass-card rounded-2xl border border-alert-content-100/40 bg-bg-1200/10 p-6 shadow-elevated-card">
            <p className="text-alert-content-100 text-center text-lg font-medium">
              Submission received
            </p>
            <p className="text-content-200 mt-2 text-center text-sm">
              Await the next round.
            </p>
          </div>
        )}

        {user?.role === "team" && !alreadyAnswered && (
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl border border-border-400 p-6 shadow-elevated-card"
          >
            <p className="text-content-200 mb-4 text-sm font-medium">
              Your submission ({user.teamName}) — fill in the fields below and submit
            </p>
            {question?.answerFields != null && question.answerFields.length > 0 ? (
              <div className="space-y-4">
                {question.answerFields.map((field, i) => (
                  <div key={i} className="border-b border-border-400/60 pb-4 last:border-0 last:pb-0">
                    <div className="mb-1.5 select-none border-l-2 border-content-500/40 bg-bg-800/40 py-1 pl-2 font-medium text-content-500 text-xs uppercase tracking-wide">
                      {field.label}
                    </div>
                    {field.note && (
                      <p className="mb-1.5 text-content-500 text-xs">{field.note}</p>
                    )}
                    {field.multiline ? (
                      <textarea
                        value={fieldValues[i] ?? ""}
                        onChange={(e) => {
                          const next = [...(fieldValues ?? [])];
                          next[i] = e.target.value;
                          setFieldValues(next);
                        }}
                        rows={3}
                        className="w-full rounded-md border border-border-400 bg-bg-800 px-3 py-2 text-content-100 text-sm placeholder:text-content-500"
                        placeholder="Type your answer here..."
                        disabled={!canSubmit}
                      />
                    ) : (
                      <input
                        type="text"
                        value={fieldValues[i] ?? ""}
                        onChange={(e) => {
                          const next = [...(fieldValues ?? [])];
                          next[i] = e.target.value;
                          setFieldValues(next);
                        }}
                        className="w-full rounded-md border border-border-400 bg-bg-800 px-3 py-2 text-content-100 text-sm placeholder:text-content-500"
                        placeholder="Type your answer here..."
                        disabled={!canSubmit}
                      />
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={!canSubmitForm}
                  className="mt-4 rounded-lg bg-bg-1200 px-4 py-2 text-content-100 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  Submit answer
                </button>
              </div>
            ) : (
              <>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={12}
                  className="w-full rounded-lg border border-border-400 bg-bg-800 px-3 py-2 text-content-100 text-sm font-mono leading-relaxed"
                  disabled={!canSubmit}
                />
                <button
                  type="submit"
                  disabled={!canSubmitForm}
                  className="mt-3 rounded-lg bg-bg-1200 px-4 py-2 text-content-100 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  Submit answer
                </button>
              </>
            )}
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
