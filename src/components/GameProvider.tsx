"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const POLL_MS = 1500;
const API = "/api/game";

export type Phase = "idle" | "q1" | "q2";

export interface Team {
  id: string;
  name: string;
  points: number;
  isAi: boolean;
}

export interface Submission {
  id: string;
  teamName: string;
  questionNum: number;
  answerSnippet: string;
  isAi: boolean;
  createdAt: number;
}

export interface GameState {
  phase: Phase;
  questionEndTime: number | null;
  teams: Team[];
  submissions: Submission[];
  aetherionThought: string;
  questions?: { num: number; text: string }[];
}

type GameContextValue = GameState & {
  timeRemainingMs: number | null;
  currentQuestion: 1 | 2 | null;
  startQuestion: (question: 1 | 2) => Promise<void>;
  endTimer: () => Promise<void>;
  nextQuestion: () => Promise<void>;
  submitAnswer: (teamId: string, teamName: string, questionNum: number, answerSnippet: string) => Promise<void>;
  addPoints: (teamId: string, points: number) => Promise<void>;
  setScore: (teamId: string, score: number) => Promise<void>;
  setAetherionThought: (thought: string) => Promise<void>;
  postAiAnswer: (questionNum: number, answerSnippet: string) => Promise<void>;
  resetGame: () => Promise<void>;
  fetchState: () => Promise<void>;
};

const initial: GameState = {
  phase: "idle",
  questionEndTime: null,
  teams: [],
  submissions: [],
  aetherionThought: "Idle — awaiting task.",
  questions: [],
};

const GameContext = createContext<GameContextValue | null>(null);

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initial);
  const [timeRemainingMs, setTimeRemainingMs] = useState<number | null>(null);

  const fetchState = useCallback(async () => {
    try {
      const data = await fetchJson<GameState>(`${API}/state`);
      setState(data);
    } catch (e) {
      console.error("Failed to fetch game state", e);
    }
  }, []);

  useEffect(() => {
    fetchState();
    const id = setInterval(fetchState, POLL_MS);
    return () => clearInterval(id);
  }, [fetchState]);

  useEffect(() => {
    const endTime = state.questionEndTime;
    if (endTime == null) {
      setTimeRemainingMs(null);
      return;
    }
    const tick = () => {
      const now = Date.now();
      if (now >= endTime) {
        setTimeRemainingMs(0);
        return;
      }
      setTimeRemainingMs(endTime - now);
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [state.questionEndTime]);

  const currentQuestion =
    state.phase === "q1" ? 1 : state.phase === "q2" ? 2 : null;

  const startQuestion = useCallback(async (question: 1 | 2) => {
    const data = await fetchJson<GameState>(`${API}/start-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    setState(data);
  }, []);

  const endTimer = useCallback(async () => {
    const data = await fetchJson<GameState>(`${API}/end-timer`, {
      method: "POST",
    });
    setState(data);
  }, []);

  const nextQuestion = useCallback(async () => {
    const data = await fetchJson<GameState>(`${API}/next-question`, {
      method: "POST",
    });
    setState(data);
  }, []);

  const submitAnswer = useCallback(
    async (
      teamId: string,
      teamName: string,
      questionNum: number,
      answerSnippet: string
    ) => {
      const data = await fetchJson<GameState>(`${API}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId,
          teamName,
          questionNum,
          answerSnippet,
        }),
      });
      setState(data);
    },
    []
  );

  const addPoints = useCallback(async (teamId: string, points: number) => {
    const data = await fetchJson<GameState>(`${API}/admin/add-points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, points }),
    });
    setState(data);
  }, []);

  const setScore = useCallback(async (teamId: string, score: number) => {
    const data = await fetchJson<GameState>(`${API}/admin/set-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, score }),
    });
    setState(data);
  }, []);

  const setAetherionThought = useCallback(async (thought: string) => {
    const data = await fetchJson<GameState>(`${API}/admin/set-thought`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thought }),
    });
    setState(data);
  }, []);

  const postAiAnswer = useCallback(
    async (questionNum: number, answerSnippet: string) => {
      const data = await fetchJson<GameState>(`${API}/admin/post-ai-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionNum, answerSnippet }),
      });
      setState(data);
    },
    []
  );

  const resetGame = useCallback(async () => {
    const data = await fetchJson<GameState>(`${API}/admin/reset`, {
      method: "POST",
    });
    setState(data);
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      ...state,
      timeRemainingMs,
      currentQuestion,
      startQuestion,
      endTimer,
      nextQuestion,
      submitAnswer,
      addPoints,
      setScore,
      setAetherionThought,
      postAiAnswer,
      resetGame,
      fetchState,
    }),
    [
      state,
      timeRemainingMs,
      currentQuestion,
      startQuestion,
      endTimer,
      nextQuestion,
      submitAnswer,
      addPoints,
      setScore,
      setAetherionThought,
      postAiAnswer,
      resetGame,
      fetchState,
    ]
  );

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
