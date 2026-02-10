# Neural Arena — Deployment Plan for DevOps

## 1. App summary

| Item | Details |
|------|--------|
| **App name** | Neural Arena (repo folder: `calfus-game`) |
| **Type** | **Not static** — Next.js app with API routes; requires **Node.js runtime** |
| **Stack** | Next.js 16, React 19, Node 18+ |
| **Port** | **3000** (HTTP) |
| **State** | In-memory only (no DB); resets on process restart. Suitable for single live event. |

**Routes:**  
- Pages: `/`, `/login`, `/play`, `/admin`  
- APIs: `/api/game/*` (state, start-question, next-question, submit, end-timer, admin actions)

---

## 2. How you get the code (GitHub / branch)

### Option A: Repo is the app (repo root = `calfus-game`)

- Create a **GitHub repo** (e.g. `neural-arena` or `calfus-game`).
- Push your code. Tell DevOps:
  - **Repo URL:** `https://github.com/<org>/<repo>.git`
  - **Branch to deploy:** `main` (or `release/production` — see below).
  - **App root:** repo root (no subfolder).

### Option B: App lives in a subfolder (e.g. repo = “Leaderboard”, app = `calfus-game`)

- Push the whole repo. Tell DevOps:
  - **Repo URL:** `https://github.com/<org>/<repo>.git`
  - **Branch to deploy:** `main` (or your release branch).
  - **App root for build/Docker:** `calfus-game` (they must `cd calfus-game` before `npm run build` or `docker build`).

### Branch strategy (simple)

| Branch | Use |
|--------|-----|
| **main** | Production-ready; DevOps deploys from here. |
| **develop** (optional) | Integration; merge to `main` when ready for release. |

**One-time setup:**

1. **Create repo on GitHub** (if you haven’t): New repository → add remote → push.
2. **Default branch:** Set `main` (or `master`) as default so DevOps knows what to clone.
3. **Share with DevOps:** Repo URL + read access (invite as collaborator or use org repo permissions). Tell them: “Deploy from branch **main**; app root is **calfus-game** if the repo contains a parent folder.”
4. **Tags (optional):** For a specific release you can tag, e.g. `v1.0.0`, and tell them “deploy tag **v1.0.0**.”

**Commands you run (example):**

```bash
cd /path/to/Leaderboard   # or wherever your project is
git checkout -b main      # if you use another default branch name, use that
git remote add origin https://github.com/<org>/<repo>.git
git add .
git commit -m "Neural Arena - production ready"
git push -u origin main
```

Then send DevOps: **Repo URL**, **branch name** (`main`), and **app root** (`calfus-game` or repo root).

---

## 3. Deployment strategy (platform choice)

| Option | Use when | Effort | HTTPS |
|--------|----------|--------|--------|
| **Vercel** | Fastest go-live, no AWS lock-in | Low | Built-in |
| **AWS App Runner** | Prefer AWS, want managed containers | Medium | Built-in |
| **AWS ECS (Fargate)** | Need control, scaling, or multi-service | Higher | ALB + cert |
| **EC2 + Docker** | Full control, existing EC2 workflows | Medium | You provide (e.g. Nginx + cert) |

**Recommendation:**  
- **Fastest:** Vercel (connect repo → deploy).  
- **AWS-only:** App Runner (ECR image → create service → done) or ECS if you already use it.

---

## 4. Build and artifact

- **Build command:** `npm run build` (requires **Node 18+**).  
- **Start command:** `npm run start` (runs Next.js on port 3000).  
- **Docker:** Dockerfile in app root; produces a single image that runs `node server.js` on port **3000**.  
- **Config:** `next.config.ts` has `output: "standalone"` for Docker/standalone runs.

**Local Docker sanity check:**
```bash
cd calfus-game
docker build -t neural-arena .
docker run -p 3000:3000 neural-arena
# → http://localhost:3000 shows login page
```

---

## 5. AWS deployment (how to)

### 5.1 Prerequisites

- AWS CLI configured; Docker installed for building/pushing.
- **ECR** repository (e.g. `neural-arena`) in the target region.
- **App Runner**, or **ECS cluster + ALB**, or **EC2** with Docker, depending on chosen option.

### 5.2 Build and push image to ECR

Replace `ACCOUNT`, `REGION`, and repo name as needed.

```bash
cd calfus-game

# Login to ECR
aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.REGION.amazonaws.com

# Build and tag
docker build -t neural-arena .
docker tag neural-arena:latest ACCOUNT.dkr.ecr.REGION.amazonaws.com/neural-arena:latest

# Push
docker push ACCOUNT.dkr.ecr.REGION.amazonaws.com/neural-arena:latest
```

### 5.3 AWS App Runner

1. **App Runner** → Create service → **Container registry** → Amazon ECR.
2. Select the **image** and **tag** (e.g. `neural-arena:latest`).
3. **Port:** `3000`.
4. **CPU/Memory:** e.g. 1 vCPU, 2 GB (or minimum allowed).
5. Deploy; App Runner provides URL and HTTPS.

**No env vars required** for basic run. Credentials are in app code (`src/lib/auth.ts`); do not put secrets in repo.

### 5.4 AWS ECS (Fargate)

1. Push image to ECR (as in 5.2).
2. **Task definition:** Fargate, e.g. 0.5 vCPU, 1 GB RAM; image = ECR URI; port **3000**; container name e.g. `neural-arena`.
3. **Service:** Create ECS service from task definition; attach to **Application Load Balancer** (target group port 3000).
4. **Security group:** Allow inbound 80/443 on ALB; allow 3000 from ALB to task.
5. **HTTPS:** Add ACM certificate to ALB and listener (443 → target group 3000).

### 5.5 EC2

1. Launch EC2 (e.g. Amazon Linux 2), install Docker.
2. Pull/run image (or build on box from repo):
   ```bash
   docker pull ACCOUNT.dkr.ecr.REGION.amazonaws.com/neural-arena:latest
   docker run -d -p 3000:3000 --restart unless-stopped --name neural-arena ACCOUNT.dkr.ecr.REGION.amazonaws.com/neural-arena:latest
   ```
3. **Security group:** Allow inbound **3000** (or 80/443 if you put Nginx/Caddy in front).
4. **HTTPS:** Use Nginx/Caddy as reverse proxy with SSL certificate (e.g. Let’s Encrypt).

---

## 6. Pre-deploy checklist (DevOps)

- [ ] **Node 18+** used in CI/build (or use Docker for build).
- [ ] **Build:** `npm run build` succeeds (or Docker build succeeds).
- [ ] **Port:** App listens on **3000**; platform/ALB/security group expose 3000 (or 80/443 with reverse proxy).
- [ ] **HTTPS:** Enabled (App Runner/ALB/ACM or reverse proxy on EC2).
- [ ] **Credentials:** Not committed; only in `src/lib/auth.ts` (or future env-based secrets). Share with event host only.
- [ ] **Single instance:** In-memory state = one process; no session persistence across restarts. OK for one live event.

---

## 7. Post-deploy sanity test

1. Open deployed URL → redirects to **Login**.
2. Log in as **Admin** (password in `src/lib/auth.ts`) → lands on `/admin`.
3. **Start Question 1** → timer starts; open `/play` in another tab → question and timer visible.
4. Log in as **Team 1** (incognito/other browser) → submit answer → admin sees it under “Answers for Question 1”.
5. Add points, **Next question** → Q2 flow works.
6. **Reset game** → scores/submissions clear; can start again.

---

## 8. One-liner for your DevOps team

**“Neural Arena is a Next.js app (not static). It must run on Node 18+ and listen on port 3000. We have a production Dockerfile; build and push to ECR, then run it on **AWS App Runner** (easiest), **ECS Fargate**, or **EC2**. Use HTTPS in production. State is in-memory only; no DB. Sanity test: login → admin → start question → play → submit → reset.”**

For full commands and options, see **DEPLOYMENT.md** in the repo.
