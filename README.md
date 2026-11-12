# Tutorly

Tutorly is intended to become an Arabic-first, AI-powered personalized mathematics tutor for Algerian Baccalaureate students in the Experimental Sciences (علوم تجريبية) stream.

## Current status

**Phase 0.2 — minimal application skeleton.** A minimal FastAPI backend with a `GET /health` endpoint and a minimal React + TypeScript + Vite Arabic RTL landing page are available. The applications are not connected to Supabase, an AI provider, or a database, and contain no student functionality.

MVP 1.0 is a deterministic learning-and-personalization release: authentication, a limited reviewed diagnostic, a rule-based learning plan, curated exercises with deterministic grading for supported answer types, and skill-level progress. AI tutoring chat, guided learning, image input, and AI-generated exercises are deferred.

## Documentation

- [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) — product scope, architecture, decisions, and roadmap.
- [`AGENTS.md`](./AGENTS.md) — engineering workflow and rules for contributors and coding agents.

`PROJECT_CONTEXT.md` is the source of truth for confirmed product decisions. The documents use CONFIRMED, PROPOSED, OPEN, and IMPLEMENTED status labels.

## Technology direction

- Frontend: React + TypeScript + Tailwind CSS + Vite
- Backend: Python 3.12 + FastAPI
- Database, authentication, and storage: Supabase (planned)
- Mathematical verification: Python + SymPy for supported answer types (planned)
- Architecture: modular monolith with a REST API (planned)

The scaffold uses Python 3.12 managed by `uv` and Node.js 24 with `npm`. Migration tooling, hosting, and CI/CD are not yet configured.

## Development

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The health endpoint is available at `http://127.0.0.1:8000/health`.

Run the backend tests with:

```bash
cd backend
uv run pytest
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Check and build the frontend with:

```bash
cd frontend
npm run typecheck
npm run build
```
