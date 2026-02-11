import type { Participant } from "./types";
import type { Question, AnswerField } from "./types";

export const AETHERION_ID = "aetherion";

export const INITIAL_PARTICIPANTS: Participant[] = [
  { id: AETHERION_ID, name: "Aetherion AI Agent", rollNumber: "", points: 0, isAi: true },
];

export const DEFAULT_AETHERION_THOUGHT = "Idle — awaiting task.";

const Q1_RULES = {
  prohibited: [
    "ChatGPT (any version)",
    "Google Gemini / Bard",
    "Claude AI",
    "Perplexity",
    "Microsoft Copilot",
    "Any other AI chatbot or LLM tool",
  ],
  allowed: [
    "Google Search (regular search only)",
    "MakeMyTrip website",
    "Goibibo website",
    "EaseMyTrip website",
    "Cleartrip website",
    "Individual airline websites: IndiGo (goindigo.in), Air India (airindia.com), Vistara (airvistara.com), Akasa Air (akasaair.com), SpiceJet (spicejet.com)",
    "Your brain, notepad, calculator",
  ],
  disqualification: [
    "Use of any LLM/AI chatbot tool",
    "Submission after the 3-minute timer ends",
    "Wrong date provided",
    "Wrong route (not PNQ to BLR)",
    "Price exceeds Rs 6,000 budget",
    "Submitting someone else's answer (cheating)",
  ],
};

const Q1_ANSWER_FIELDS: AnswerField[] = [
  { label: "AIRLINE NAME:" },
  { label: "FLIGHT NUMBER (if visible):" },
  {
    label: "TOTAL PRICE (in Rs INR): Rs",
    note: "Must include ALL taxes and fees - final checkout price. Must be BASIC fare - no checked baggage.",
  },
  {
    label: "TOTAL FLIGHT DURATION:",
    note: "e.g. 1 hours 30 minutes (include any layover time)",
  },
  { label: "DEPARTURE TIME (from Pune, HH:MM e.g. 14:30):" },
  { label: "ARRIVAL TIME (in Bangalore, HH:MM e.g. 16:00):" },
  {
    label: "WHERE DID YOU FIND THIS?:",
    note: "MakeMyTrip | Goibibo | EaseMyTrip | Cleartrip | IndiGo | Air India | Vistara | Akasa Air | SpiceJet | Other",
  },
  {
    label: "WHY DO YOU THINK THIS IS THE BEST OPTION? (1-2 sentences):",
    multiline: true,
  },
];

const Q2_RULES = {
  prohibited: [],
  allowed: [
    "Any tools (Google Search, ChatGPT, Gemini, Claude, Perplexity, Copilot, etc.)",
  ],
  disqualification: [
    "Submission after the 3-minute timer ends",
    "Submitting someone else's answer (cheating)",
  ],
};

const Q2_TEXT = `ROUND 2: Research Challenge

You have landed in Bangalore for your Calfus interview. It is Thursday 8 PM; the interview is tomorrow at 10 AM.

The interviewer has sent you the following:

"Tomorrow's case study will focus on our recent partnership with supplywhy.ai. Please research this company thoroughly before the interview."

Your task: Research this company thoroughly before the interview. Time limit: 3 minutes.`;

export const QUESTIONS: Question[] = [
  {
    num: 1,
    text: "Calfus has scheduled an interview for your L1. Find the BEST one-way flight from Pune to Bangalore for day after TOMORROW that fits your budget.",
    rules: Q1_RULES,
    answerFields: Q1_ANSWER_FIELDS,
  },
  {
    num: 2,
    text: Q2_TEXT,
    rules: Q2_RULES,
  },
];

export const QUESTION_DURATION_MS = 3 * 60 * 1000; // 3 minutes per question
