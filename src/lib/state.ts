// Types and initial data. Swap this module for Supabase later.

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

export const TEAM_IDS = {
  TEAM_1: "team-1",
  TEAM_2: "team-2",
  TEAM_3: "team-3",
  TEAM_4: "team-4",
  AETHERION: "aetherion",
} as const;

export const INITIAL_TEAMS: Team[] = [
  { id: TEAM_IDS.TEAM_1, name: "Team 1", points: 0, isAi: false },
  { id: TEAM_IDS.TEAM_2, name: "Team 2", points: 0, isAi: false },
  { id: TEAM_IDS.TEAM_3, name: "Team 3", points: 0, isAi: false },
  { id: TEAM_IDS.TEAM_4, name: "Team 4", points: 0, isAi: false },
  { id: TEAM_IDS.AETHERION, name: "Aetherion AI Agent", points: 0, isAi: true },
];

export const DEFAULT_AETHERION_THOUGHT = "Idle — awaiting task.";

export const QUESTIONS: { num: number; text: string }[] = [
  { num: 1, text: "Question 1: (Replace with your first question text.)" },
  { num: 2, text: "Question 2: (Replace with your second question text.)" },
];

export const DEFAULT_QUESTION_DURATION_MS = 2 * 60 * 1000; // 2 minutes

function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createSubmission(
  teamName: string,
  questionNum: number,
  answerSnippet: string,
  isAi: boolean
): Submission {
  return {
    id: nextId("sub"),
    teamName,
    questionNum,
    answerSnippet,
    isAi,
    createdAt: Date.now(),
  };
}
