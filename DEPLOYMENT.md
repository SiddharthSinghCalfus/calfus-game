# Neural Arena — Deployment

This app is **not** a static site. It uses **Next.js with API routes** (backend in `src/app/api/`) and in-memory game state, so it needs a **Node.js runtime**.

**Requirements:** Node.js **18+** (and npm). Check with `node -v`. Docker builds use Node 20.

---

## Option 1: Vercel (recommended, fastest)

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo.
3. **Framework Preset:** Next.js. **Root Directory:** `calfus-game` (if the repo root is the parent folder) or leave blank if the repo root is this app.
4. **Build Command:** `npm run build`. **Output Directory:** (default).
5. Deploy. Your app will be at `https://your-project.vercel.app`.

**Note:** Game state is in-memory; it resets on each serverless cold start. For a single live event this is usually fine. For persistent state across restarts, you’d add a database later.

---

## Option 2: AWS (Docker)

The repo includes a **Dockerfile** that builds and runs the app. Use it with **AWS App Runner**, **ECS**, or **EC2**.

### Build and run locally (sanity check)

```bash
cd calfus-game
docker build -t neural-arena .
docker run -p 3000:3000 neural-arena
```

Open `http://localhost:3000`. You should see the login page.

### AWS App Runner

1. **ECR:** Create a repository, build and push the image:
   ```bash
   aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.REGION.amazonaws.com
   docker build -t neural-arena .
   docker tag neural-arena:latest ACCOUNT.dkr.ecr.REGION.amazonaws.com/neural-arena:latest
   docker push ACCOUNT.dkr.ecr.REGION.amazonaws.com/neural-arena:latest
   ```
2. **App Runner:** Create a service → Container registry (ECR) → select the image → Port **3000** → Deploy.

### AWS ECS (Fargate)

1. Push the image to ECR (as above).
2. Create an ECS cluster, task definition (Fargate, 0.5 vCPU, 1 GB RAM), and service. Use the same image and port **3000**.
3. Use an Application Load Balancer or assign a public IP and open port 3000 in the task’s security group.

### EC2

1. Launch an EC2 instance (e.g. Amazon Linux 2), install Docker.
2. Build and run:
   ```bash
   docker build -t neural-arena .
   docker run -d -p 3000:3000 --restart unless-stopped neural-arena
   ```
3. Open port **3000** in the security group. Optionally put Nginx/Caddy in front for HTTPS.

### .dockerignore (optional)

To speed up Docker builds, create a `.dockerignore` in the app root with:

```
node_modules
.next
out
.git
.env*
*.md
!README.md
```

---

## Pre-deploy checklist

- [ ] **Node:** Use Node 18+ locally (`node -v`). Vercel and the Dockerfile use a compatible version.
- [ ] **Build:** Run `npm run build` locally (with Node 18+); fix any errors before deploying.
- [ ] **Credentials:** Passwords are in `src/lib/auth.ts`. Don’t commit changes that expose them; share only with the host.
- [ ] **Question 2:** If you use Q2, set its text in `backend/constants.ts` (QUESTIONS array).
- [ ] **Build:** Run `npm run build` locally; fix any errors before deploying.
- [ ] **HTTPS:** In production, serve the app over HTTPS (Vercel and App Runner provide it; for EC2, use a reverse proxy with SSL).
- [ ] **Reset:** Use **Reset game** on `/admin` to clear state between rounds; no redeploy needed.

---

## Sanity test after deploy

1. Open the deployed URL → should redirect to **Login**.
2. Log in as **Admin** (password in `src/lib/auth.ts`) → should land on `/admin`.
3. Click **Start Question 1** → timer should start; open `/play` in another tab/window → question and timer visible.
4. Log in as **Team 1** (incognito or another browser) → submit an answer → admin should see it under “Answers for Question 1”.
5. Add points, click **Next question** → flow for Q2 works.
6. **Reset game** → scores and submissions clear; can start again.

---

## Summary

| Platform   | Best for           | Notes                          |
|-----------|--------------------|---------------------------------|
| **Vercel** | Easiest, live demos | Connect repo → deploy; HTTPS included |
| **AWS App Runner** | AWS-only, containers | Push image to ECR → create service     |
| **AWS ECS** | Full control        | Same image; more setup          |
| **EC2**   | Self-managed        | Docker run; add HTTPS yourself  |

State is in-memory and resets on process restart; suitable for a single event. For multi-session persistence, add a DB (e.g. Supabase) later.
