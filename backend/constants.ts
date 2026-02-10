import type { Team } from "./types";

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
  {
    num: 1,
    text: "You've been called for an urgent interview by Calfus in Bangalore; can you find the cheapest one-way student-friendly flight from Pune for February 11th?",
  },
  { num: 2, text: "Question 2: (Replace with your second question text.)" },
];

export const QUESTION_DURATION_MS = 3 * 60 * 1000; // 3 minutes fixed
