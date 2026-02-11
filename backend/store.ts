import type { GameState, Participant, Phase, Submission } from "./types";
import {
  AETHERION_ID,
  DEFAULT_AETHERION_THOUGHT,
  INITIAL_PARTICIPANTS,
  QUESTION_DURATION_MS,
} from "./constants";

function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

let state: GameState = {
  phase: "idle",
  questionEndTime: null,
  participants: [...INITIAL_PARTICIPANTS],
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

function findOrCreateParticipant(name: string, rollNumber: string): Participant {
  const existing = state.participants.find(
    (p) => !p.isAi && p.name === name.trim() && p.rollNumber === rollNumber.trim()
  );
  if (existing) return existing;
  const newParticipant: Participant = {
    id: nextId("p"),
    name: name.trim(),
    rollNumber: rollNumber.trim(),
    points: 0,
    isAi: false,
  };
  state.participants.push(newParticipant);
  return newParticipant;
}

export function addSubmission(
  participantName: string,
  participantRollNumber: string,
  questionNum: number,
  answerSnippet: string,
  isAi: boolean
): GameState {
  if (!isAi) {
    const key = `${participantName.trim()}|${participantRollNumber.trim()}`;
    const alreadyAnswered = state.submissions.some(
      (s) =>
        !s.isAi &&
        s.participantName.trim() === participantName.trim() &&
        s.participantRollNumber.trim() === participantRollNumber.trim() &&
        s.questionNum === questionNum
    );
    if (alreadyAnswered) return getState();
    const participant = findOrCreateParticipant(participantName, participantRollNumber);
    const sub: Submission = {
      id: nextId("sub"),
      participantId: participant.id,
      participantName: participant.name,
      participantRollNumber: participant.rollNumber,
      questionNum,
      answerSnippet,
      isAi: false,
      createdAt: Date.now(),
    };
    state.submissions.unshift(sub);
    return getState();
  }
  const sub: Submission = {
    id: nextId("sub"),
    participantId: AETHERION_ID,
    participantName: "Aetherion AI Agent",
    participantRollNumber: "",
    questionNum,
    answerSnippet,
    isAi: true,
    createdAt: Date.now(),
  };
  state.submissions.unshift(sub);
  return getState();
}

export function addPoints(participantId: string, points: number): GameState {
  const p = state.participants.find((t) => t.id === participantId);
  if (p) p.points = Math.max(0, p.points + points);
  return getState();
}

export function setScore(participantId: string, score: number): GameState {
  const p = state.participants.find((t) => t.id === participantId);
  if (p) p.points = Math.max(0, score);
  return getState();
}

export function setAetherionThought(thought: string): GameState {
  state.aetherionThought = thought;
  return getState();
}

export function postAiAnswer(questionNum: number, answerSnippet: string): GameState {
  return addSubmission("", "", questionNum, answerSnippet, true);
}

export function reset(): GameState {
  state = {
    phase: "idle",
    questionEndTime: null,
    participants: [...INITIAL_PARTICIPANTS],
    submissions: [],
    aetherionThought: DEFAULT_AETHERION_THOUGHT,
  };
  return getState();
}
