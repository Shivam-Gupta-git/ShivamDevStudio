# Interactive Code Practice Module — Setup Guide

This module adds a full coding practice environment to your React Learn dashboard with:
- **Monaco Editor** (syntax highlighting, line numbers, auto-indent)
- **Sandboxed code execution** via Judge0 (Python, JavaScript, Java, C++)
- **Automated test case checking**
- **AI code explanation** and **efficiency analysis** (OpenAI-compatible API)

---

## Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│  React Frontend     │  /api   │  Node.js Backend     │
│  (Vite + Monaco)    │ ──────► │  (Express)           │
│  /practice route    │         │                      │
└─────────────────────┘         │  ┌────────────────┐  │
                                │  │ Judge0 API     │  │──► Sandboxed containers
                                │  └────────────────┘  │
                                │  ┌────────────────┐  │
                                │  │ OpenAI API     │  │──► LLM explanations
                                │  └────────────────┘  │
                                └──────────────────────┘
```

---

## Quick Start

### 1. Install dependencies

```bash
# Frontend (project root)
npm install

# Backend
cd server && npm install && cd ..
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173

# Judge0 — Option A: Self-hosted (recommended for local dev)
JUDGE0_BASE_URL=http://localhost:2358

# Judge0 — Option B: RapidAPI (cloud, no Docker needed)
# JUDGE0_BASE_URL=https://judge0-ce.p.rapidapi.com
# JUDGE0_RAPIDAPI_KEY=your_key
# JUDGE0_RAPIDAPI_HOST=judge0-ce.p.rapidapi.com

# LLM (optional — fallback templates used without this)
OPENAI_API_KEY=sk-your-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

### 3. Start Judge0 (Docker)

```bash
# Requires Docker Desktop
docker run -d --name judge0 -p 2358:2358 judge0/judge0:1.13.0
```

Verify: `curl http://localhost:2358/about`

### 4. Run both servers

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open http://localhost:5173/practice or click **Code Practice** in the sidebar.

---

## Integration into Your Existing System

The module is already integrated. Here's what was added:

| File | Purpose |
|------|---------|
| `src/pages/CodePracticePage.jsx` | Main practice UI |
| `src/components/CodePractice/*` | Editor, output, test results, AI panels |
| `src/services/codePracticeApi.js` | Frontend API client |
| `server/src/index.js` | Express server entry |
| `server/src/routes/*` | REST API routes |
| `server/src/services/judge0.js` | Sandboxed code execution |
| `server/src/services/llm.js` | AI explanation & analysis |
| `server/src/data/problems.js` | Practice problems + test cases |

**Routing** (`src/App.jsx`):
- `/` — existing React Learn dashboard
- `/practice` — Code Practice module

**Sidebar** — "Code Practice" button links to `/practice`

**Vite proxy** (`vite.config.js`) — forwards `/api/*` to `http://localhost:3001`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service status (Judge0, LLM) |
| GET | `/api/problems` | List all practice problems |
| GET | `/api/problems/:id` | Problem details + starter code |
| POST | `/api/execute/run` | Run code with custom stdin |
| POST | `/api/execute/test` | Run against all test cases |
| POST | `/api/ai/explain` | Step-by-step code explanation |
| POST | `/api/ai/analyze` | Big O + optimization analysis |

---

## Required Packages

### Frontend (`package.json`)
- `@monaco-editor/react` — Code editor with syntax highlighting

### Backend (`server/package.json`)
- `express` — HTTP server
- `cors` — Cross-origin requests
- `dotenv` — Environment variables
- `axios` — HTTP client for Judge0 & LLM APIs
- `express-rate-limit` — Abuse prevention

### Third-party services
| Service | Required? | Purpose |
|---------|-----------|---------|
| Judge0 (Docker or RapidAPI) | **Yes** (for code execution) | Sandboxed code runner |
| OpenAI API (or compatible) | Optional | AI explanations & analysis |

---

## Adding New Practice Problems

Edit `server/src/data/problems.js`:

```js
{
  id: 'my-problem',
  title: 'My Problem',
  difficulty: 'Easy',
  category: 'Arrays',
  description: 'Problem description...',
  examples: [{ input: '1 2', output: '3' }],
  testCases: [
    { input: '1 2', expectedOutput: '3' },
    { input: '5 10', expectedOutput: '15' },
  ],
  starterCode: {
    javascript: '// JS starter...',
    python: '# Python starter...',
    java: '// Java starter...',
    cpp: '// C++ starter...',
  },
}
```

All problems use **stdin/stdout** so the same test cases work across all four languages.

---

## Security Notes

- User code **never executes on your Node.js server** — it runs inside isolated Judge0 Docker containers
- Rate limiting: 30 executions/min, 10 AI requests/min
- Request body limited to 100KB
- Judge0 enforces CPU time (2s), memory (128MB), and wall time (5s) limits

---

## Production Deployment

1. Deploy the Express backend (Railway, Render, Fly.io, etc.)
2. Set `CLIENT_ORIGIN` to your production frontend URL
3. Use RapidAPI Judge0 or self-host Judge0 on your server
4. Set `VITE_API_URL=https://your-api.com/api` in frontend `.env.production`
5. Build frontend: `npm run build`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Judge0 unavailable" | Start Docker: `docker start judge0` or configure RapidAPI keys |
| "Failed to load problems" | Ensure backend is running on port 3001 |
| AI shows "fallback" responses | Add `OPENAI_API_KEY` to `server/.env` |
| CORS errors | Match `CLIENT_ORIGIN` in `.env` to your frontend URL |
| Java compilation error | Ensure class is named `Main` with `public static void main` |
