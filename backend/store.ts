import type { GameState, Phase, Submission, Team } from "./types";
import {
  DEFAULT_AETHERION_THOUGHT,
  INITIAL_TEAMS,
  QUESTION_DURATION_MS,
} from "./constants";

function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

let state: GameState = {
  phase: "idle",
  questionEndTime: null,
  teams: [...INITIAL_TEAMS],
  submissions: [],
  aetherionThought: DEFAULT_AETHERION_THOUGHT,
};

export function getState(): GameState {
  return JSON.parse(JSON.stringify(state));
}

export function startQuestion(question: 1 | 2): GameState {
  const phase: Phase = question === 1 ? "q1" : "q2";
  state.phase = phase;
  state.questionEndTime = Date.now() + QUESTION_DURATION_MS;
  return getState();
}

/** End current question timer immediately (e.g. everyone answered or admin wants to stop). */
export function endTimer(): GameState {
  if (state.phase === "q1" || state.phase === "q2") {
    state.questionEndTime = Date.now();
  }
  return getState();
}

export function nextQuestion(): GameState {
  if (state.phase === "q1") {
    state.phase = "q2";
    state.questionEndTime = Date.now() + QUESTION_DURATION_MS;
  } else {
    state.phase = "idle";
    state.questionEndTime = null;
  }
  return getState();
}

export function addSubmission(
  teamId: string,
  teamName: string,
  questionNum: number,
  answerSnippet: string,
  isAi: boolean
): GameState {
  // One answer per team per question (skip duplicate; AI can post multiple)
  if (!isAi) {
    const alreadyAnswered = state.submissions.some(
      (s) => s.teamName === teamName && s.questionNum === questionNum
    );
    if (alreadyAnswered) return getState();
  }
  const sub: Submission = {
    id: nextId("sub"),
    teamName,
    questionNum,
    answerSnippet,
    isAi,
    createdAt: Date.now(),
  };
  state.submissions.unshift(sub);
  return getState();
}

export function addPoints(teamId: string, points: number): GameState {
  const team = state.teams.find((t) => t.id === teamId);
  if (team) team.points = Math.max(0, team.points + points);
  return getState();
}

/** Set a team's score to a value (e.g. 0 to clear). */
export function setScore(teamId: string, score: number): GameState {
  const team = state.teams.find((t) => t.id === teamId);
  if (team) team.points = Math.max(0, score);
  return getState();
}

export function setAetherionThought(thought: string): GameState {
  state.aetherionThought = thought;
  return getState();
}

export function postAiAnswer(questionNum: number, answerSnippet: string): GameState {
  return addSubmission(
    "aetherion",
    "Aetherion AI Agent",
    questionNum,
    answerSnippet,
    true
  );
}

export function reset(): GameState {
  state = {
    phase: "idle",
    questionEndTime: null,
    teams: [...INITIAL_TEAMS],
    submissions: [],
    aetherionThought: DEFAULT_AETHERION_THOUGHT,
  };
  return getState();
}
