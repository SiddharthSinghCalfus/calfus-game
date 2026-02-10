This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

**Neural Arena** — Humans vs. AI • Live leaderboard. Public view at `/`, admin at `/admin`, play at `/play`.

## Game flow (backend-driven)

- **Backend:** Game state lives in **`backend/`** (in-memory store) and is exposed via **`src/app/api/game/`** (Next.js API routes). One source of truth so admin and teams stay in sync.
- **Host starts the round:** Only the admin can start. On **`/admin`**, click **"Start Question 1 (3 min timer)"**. The question and a 3-minute timer become visible to everyone on **`/play`**.
- **Teams answer:** Teams log in at **`/login`** (Team 1–4; credentials in `src/lib/auth.ts`). On **`/play`** they see the current question and submit their answer. Timer is fixed at 3 minutes (no options).
- **After timer ends:** On the admin screen, all answers for that question are shown. Admin manually adds points for each team (and AI) using the **Add points** section, then clicks **"Next question (Q2)"** (or **"End round"** after Q2).
- **Question 2:** Same process: question + 3 min timer, teams submit, admin sees answers and assigns points, then **End round**.
- **Round control:** **End timer / Mark complete** — stops the current question timer immediately. **Next question** — move to Q2 or end round. **Add / remove points** — +10/+20/+50, −10/−20/−50, and **Clear** (set that team’s score to 0). **Reset game** — full reset: all scores go to 0, submissions and phase cleared, so you can run another round without redeploying.
- **Admin sees answers immediately:** Answers for the current question are visible to the admin as soon as anyone submits. Participants still see answers only after the timer ends (no copying).
- **Answers visible only after timer:** Teams’ answers appear in the public feed and on admin only **after** that question’s timer has ended (or admin clicked End timer), so no one can copy another team’s answer during the round.
- **Score confirmation:** When admin adds points (+10 / +20 / +50), a brief “Added +10 to Team 1” message appears for 2 seconds.
- **Leaderboard:** Sorted by points descending (highest first).

## Backend folder

- **`backend/store.ts`** — In-memory game state (phase, questionEndTime, teams, submissions, aetherionThought) and mutators (startQuestion, nextQuestion, addSubmission, addPoints, reset, etc.).
- **`backend/constants.ts`** — INITIAL_TEAMS, QUESTIONS (edit question text here), QUESTION_DURATION_MS (3 min).
- **`backend/types.ts`** — Types for Team, Submission, Phase, GameState.
- API routes in **`src/app/api/game/`** call into the backend and return JSON. Frontend polls **GET /api/game/state** every 1.5 s and uses POST endpoints for actions.

## Assets (images & CSS)

- **Holo-blobs:** Already in **`public/holo-blobs.png`** and used as a subtle background in `globals.css` (body::before).
- **Calfus logo:** The app expects a PNG (PDF cannot be used as a background image). Export your Calfus logo as **`calfus-logo.png`**, put it in **`public/`**, then you can use `<Image src="/calfus-logo.png" />` in the header (e.g. in `src/components/Header.tsx`).
- **Other PNGs:** Put any image in **`public/`** and reference as `url('/filename.png')` in CSS or `<Image src="/filename.png" />` in components.
- **Custom CSS:** Add your rules in **`src/app/globals.css`**. Lively/glassmorphism classes: `.glass-card`, `.glass-card-bright`, `.glow-ai`, `.animate-pulse-glow`.

## What was taken from Sombrero (you can delete `sombrero/` after this)

- **`sombrero/src/app/globals.css`** → All of it is now in **`calfus-game/src/app/globals.css`** (full theme: light + dark vars, search-pill, graph, shadow-elevated-card, avatar-surface).
- **`sombrero/src/components/sidebar-gradient-bg.css`** → Not used by the leaderboard (sidebar gradient). If you ever want it, copy that file into `calfus-game/src/components/` and import it where needed.
- No other CSS files exist in Sombrero. You can safely delete the entire **`sombrero`** folder and run the app from **`calfus-game`**.

## How to test (admin + team at the same time)

Auth uses a single user in localStorage, so one login overwrites the other in the same browser. To act as both admin and a team:

1. **Normal window** — Log in as **Admin** (password in `src/lib/auth.ts`). Use for `/admin` (start round, add points, next question).
2. **Incognito/Private window** — Same URL in a private window. Log in as **Team 1** (password in `src/lib/auth.ts`). Use for `/play` (see question, submit answer).

Each window has its own storage. To test more teams, use another incognito window or browser and log in as Team 2, etc.

## Production checklist

- **Credentials:** Stored in **`src/lib/auth.ts`** (CREDENTIALS). Admin and each team have separate passwords; do not commit changes that expose them publicly.
- **Question 2:** Edit **`backend/constants.ts`** — replace the placeholder text for Question 2 in the QUESTIONS array before running the second question.
- **Reset:** Use **Reset game** on `/admin` to clear scores and start a new round without redeploying.
- **Console:** One `console.error` in GameProvider logs API fetch failures; safe to keep for debugging.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
