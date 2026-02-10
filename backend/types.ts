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

export type Phase = "idle" | "q1" | "q2";

export interface GameState {
  phase: Phase;
  questionEndTime: number | null;
  teams: Team[];
  submissions: Submission[];
  aetherionThought: string;
}
