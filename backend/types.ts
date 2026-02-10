export interface Team {
  id: string;
  name: string;
  points: number;
  isAi: boolean;
}

export interface QuestionRules {
  prohibited: string[];
  allowed: string[];
  disqualification: string[];
}

export interface AnswerField {
  label: string;
  note?: string;
  multiline?: boolean;
}

export interface Question {
  num: number;
  text: string;
  rules?: QuestionRules;
  answerFormat?: string;
  answerFields?: AnswerField[];
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
