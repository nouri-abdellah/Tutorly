# Tutorly

Tutorly is intended to become an Arabic-first, AI-powered personalized mathematics tutor for Algerian Baccalaureate students in the Experimental Sciences (علوم تجريبية) stream.

## Current status

**Phase 0.1 — repository baseline.** The repository currently contains project documentation and baseline repository conventions only. No backend or frontend application code exists yet, and the project is not runnable at this stage.

MVP 1.0 is a deterministic learning-and-personalization release: authentication, a limited reviewed diagnostic, a rule-based learning plan, curated exercises with deterministic grading for supported answer types, and skill-level progress. AI tutoring chat, guided learning, image input, and AI-generated exercises are deferred.

## Documentation

- [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) — product scope, architecture, decisions, and roadmap.
- [`AGENTS.md`](./AGENTS.md) — engineering workflow and rules for contributors and coding agents.

`PROJECT_CONTEXT.md` is the source of truth for confirmed product decisions. The documents use CONFIRMED, PROPOSED, OPEN, and IMPLEMENTED status labels.

## Technology direction

- Frontend: React + TypeScript + Tailwind CSS (planned)
- Backend: Python + FastAPI (planned)
- Database, authentication, and storage: Supabase (planned)
- Mathematical verification: Python + SymPy for supported answer types (planned)
- Architecture: modular monolith with a REST API (planned)

Runtime versions, package managers, migration tooling, hosting, and CI/CD are not yet confirmed.

## Development

No local setup or run instructions exist yet. They will be added when the backend and frontend scaffolds are established in a later Phase 0 task.
