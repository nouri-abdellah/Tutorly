# Tutorly

Tutorly is intended to become an Arabic-first, AI-powered personalized mathematics tutor for Algerian Baccalaureate students in the Experimental Sciences (علوم تجريبية) stream.

## Current status

**Phase 2.1 — curriculum database foundation (local).** The repository now includes:

- A local Supabase project with Phase 1 profile and Phase 2.1 curriculum migrations.
- Supabase Auth email/password sign-up and sign-in.
- Backend JWT verification and a request-scoped PostgREST client.
- Row Level Security (RLS) for student-owned profiles.
- `GET /api/v1/me`.
- A minimal Arabic RTL account and profile screen.
- Versioned curriculum, unit, topic, skill, source, topic-skill, and prerequisite tables.

There is no reviewed curriculum content, seed data, exercise bank, diagnostic, learning plan, mastery, grading, AI, or deployment feature yet. The curriculum schema is ready for reviewed imports, but the actual Algerian curriculum remains an open content decision. The application is configured for **local Supabase only**. Do not link or migrate a remote/production project during this phase.

MVP 1.0 is a deterministic learning-and-personalization release: authentication, a limited reviewed diagnostic, a rule-based learning plan, curated exercises with deterministic grading for supported answer types, and skill-level progress. AI tutoring chat, guided learning, image input, and AI-generated exercises are deferred.

## Documentation

- [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) — product scope, architecture, decisions, and roadmap.
- [`AGENTS.md`](./AGENTS.md) — engineering workflow, security rules, and testing requirements.

`PROJECT_CONTEXT.md` is the source of truth for product decisions. The documents use CONFIRMED, PROPOSED, OPEN, and IMPLEMENTED status labels.

## Required tools

- Docker Engine with a running daemon.
- Node.js 24 and `npm` (root tooling and the frontend).
- Python 3.12 and [`uv`](https://docs.astral.sh/uv/).
- The Supabase CLI is a root development dependency. Use `npx supabase ...`; a global installation is not required.

Install the root CLI tooling and frontend dependencies:

```bash
npm install
cd frontend && npm install && cd ..
```

## Local Supabase

Start the local stack:

```bash
npx supabase start
```

The first start pulls Docker images and may take several minutes. Check the local URLs and keys with:

```bash
npx supabase status
npx supabase status -o env
```

The default local endpoints are:

- API/Auth/PostgREST: `http://127.0.0.1:54321`
- Database: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- Studio: `http://127.0.0.1:54323`

Never connect these commands to a remote project. The project uses local Supabase configuration only.

Reset the local database and reapply all migrations:

```bash
npx supabase db reset
```

Create a new migration:

```bash
npx supabase migration new <migration_name>
```

Migrations live in `supabase/migrations/` and are applied by Supabase CLI commands. **FastAPI never runs migrations at startup.**

Stop the stack:

```bash
npx supabase stop
```

`npx supabase stop --no-backup` discards local data; use it only when that is intended.

## Backend setup

```bash
cd backend
uv sync
cp .env.example .env
```

Fill `backend/.env` with local values from `npx supabase status -o env`:

- `SUPABASE_URL` — local API URL.
- `SUPABASE_ANON_KEY` — local public anon/publishable key.
- `SUPABASE_JWKS_URL` — local Auth JWKS endpoint for the asymmetric signing keys used by Supabase CLI 3.x. For a symmetric HS256 deployment, use `SUPABASE_JWT_SECRET` instead. Configure exactly one of the two, never both.
- `FRONTEND_ORIGINS` — comma-separated browser origins allowed by CORS.

The backend does **not** accept or load a Service Role key. Do not add one to `backend/.env`.

Load the environment and start the API:

```bash
set -a
source .env
set +a
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Endpoints:

- `GET /health` — unauthenticated process health.
- `GET /api/v1/me` — requires `Authorization: Bearer <Supabase access token>` and returns the authenticated student's profile.

There is intentionally **no PATCH /api/v1/me** in this phase. The approved profile schema has no editable personal fields.

Example response from `/api/v1/me`:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "created_at": "2026-11-12T20:00:00+00:00",
  "updated_at": "2026-11-12T20:00:00+00:00"
}
```

Errors use a consistent envelope:

```json
{
  "error": {
    "code": "UNAUTHENTICATED",
    "message_key": "errors.unauthenticated",
    "request_id": "..."
  }
}
```

## Frontend setup

```bash
cd frontend
cp .env.example .env.local
```

Set these public browser values in `frontend/.env.local`:

- `VITE_SUPABASE_URL` — local Supabase API URL.
- `VITE_SUPABASE_ANON_KEY` — local public anon/publishable key.
- `VITE_API_URL` — FastAPI base URL, normally `http://127.0.0.1:8000`.

Do not put a Service Role key, JWT secret, or any other privileged credential in frontend variables. Anything prefixed with `VITE_` is bundled into browser JavaScript.

Start the frontend:

```bash
npm run dev
```

The app opens at `http://127.0.0.1:5173`. It provides Arabic RTL sign-up, sign-in, sign-out, session loading, and a profile view fetched from FastAPI.

## Authentication architecture

1. The React app authenticates with Supabase Auth using email and password.
2. Supabase JS keeps the session in browser storage and refreshes it automatically.
3. The frontend sends the current access token to FastAPI as a Bearer token.
4. FastAPI verifies the token before doing any student work:
   - Signature.
   - Expiry/not-before.
   - Issuer.
   - Audience (`authenticated`).
   - Required subject (`sub`).
   - Role (`authenticated` only; service-role tokens are rejected).
5. The student identity is derived **only** from the verified `sub` claim. Query parameters, request bodies, and client headers are never accepted as identity.
6. FastAPI uses a request-scoped PostgREST client with the public anon key and the student's JWT. It does not use a shared or Service Role client for student requests.
7. PostgreSQL RLS independently enforces ownership.

### JWT verification

The current Supabase CLI local stack signs Auth access tokens asymmetrically (ES256) and exposes the public keys at `http://127.0.0.1:54321/auth/v1/.well-known/jwks.json`. The backend therefore uses `SUPABASE_JWKS_URL` by default. PyJWT's `PyJWKClient` verifies the token and caches the signing keys with bounded lifespan and key counts.

For a symmetric HS256 deployment, set `SUPABASE_JWT_SECRET` instead. The backend requires exactly one verification mode and rejects startup configuration that provides both or neither. In JWKS mode it accepts only the supported asymmetric algorithms; in HS256 mode it accepts only HS256. It never accepts an unsigned or algorithm-confused token.

Invalid, expired, malformed, or incorrectly signed tokens receive HTTP 401. Access tokens and secrets are never logged.

### Browser session storage and XSS

Supabase JS persists the session in browser storage by default (normally `localStorage`) and refreshes access tokens automatically. This is convenient, but it is **not completely secure**: any cross-site scripting (XSS) vulnerability that executes on the site can read browser storage and steal a session.

Current mitigations and expectations:

- Do not render untrusted HTML.
- Do not put secrets in frontend code.
- Keep dependencies reviewed and updated.
- A production deployment should add a restrictive Content Security Policy and other browser hardening.
- Access tokens are short-lived; refresh tokens still require protection.

This phase does not claim that browser token storage is inherently secure.

## RLS and database security model

The Phase 1 migration creates `public.profiles`:

- `id uuid` primary key, referencing `auth.users(id)` with `ON DELETE CASCADE`.
- `created_at timestamptz not null default now()`.
- `updated_at timestamptz not null default now()`.
- No name, age, school, phone, or other personal fields.

An `AFTER INSERT` trigger on `auth.users` creates exactly one profile per new Auth user. It is `SECURITY DEFINER` with `search_path = ''`, inserts with `ON CONFLICT (id) DO NOTHING`, and is not executable by `anon` or `authenticated`.

`updated_at` is maintained by a `BEFORE UPDATE` trigger for future trusted database updates. Students receive only:

- `SELECT` on `profiles`.

They receive no `INSERT`, `UPDATE`, or `DELETE` privileges. RLS adds:

- SELECT policy: `auth.uid() = id`.

Anonymous users have no profile table privileges and no policies. A student cannot read or update another student's row, update their own row, insert profiles, delete profiles, change ownership, or change `created_at`.

RLS is tested through real local Auth and PostgREST requests with two independent users, not through mocks.

### Curriculum foundation (Phase 2.1)

The curriculum migration adds these tables:

| Table | Purpose |
|---|---|
| `curricula` | Curriculum definition for a country, grade level, stream, and subject. |
| `curriculum_versions` | Academic-year version with `draft`, `reviewed`, `published`, or `archived` status. |
| `curriculum_sources` | Provenance metadata for curriculum documents; no PDF binaries are stored. |
| `curriculum_units` | Ordered units inside one curriculum version. |
| `topics` | Ordered lessons/topics inside one unit. |
| `skills` | Independently assessable skills inside one curriculum version. |
| `topic_skills` | Many-to-many links between topics and skills. |
| `skill_prerequisites` | Directed prerequisite edges between skills. |

Relationships and integrity:

- Units belong to a curriculum version; topics belong to a unit; skills belong to a curriculum version.
- Topic-skill links and prerequisite edges must connect records in the same curriculum version.
- A unit, topic, or skill may reference a curriculum source only when the source belongs to the same curriculum version. A `NULL` source reference remains valid. This is enforced on insert and when `source_id` changes.
- Structural parent links are immutable. Reassigning a unit, topic, skill, or relationship to another parent/version is rejected.
- Display order is unique within a version for units and within a unit for topics.
- Skill codes are unique within a curriculum version. `difficulty_level` is currently constrained to `1..5` as a provisional scale pending owner approval and has not been validated against the official curriculum.
- Deleting referenced curriculum records is prevented with `ON DELETE RESTRICT`; dependent rows must be handled explicitly.
- The `updated_at` fields are maintained by a trigger. A separate trigger rejects direct and indirect prerequisite cycles.
- Prerequisite writes take a per-curriculum-version advisory transaction lock so concurrent transactions cannot both miss an edge and jointly create a cycle. Integration tests cover cycle-creating inserts, cycle-creating updates, and concurrent opposite edges.

Visibility and grants:

- Anonymous and authenticated users receive only `SELECT` on curriculum tables.
- RLS exposes only rows whose curriculum version has `status = 'published'`. Draft, reviewed, and archived content is hidden.
- `curricula` is visible only when it has at least one published version.
- Students cannot insert, update, delete, publish, or change prerequisite relationships.
- The Service Role has privileged DML for trusted imports, administration, and integration-test setup. It is not used in student request paths and is not part of backend application configuration.

No curriculum units, lessons, skills, or prerequisite facts are seeded. Only synthetic integration-test data is created temporarily and deleted by the test.

## Tests

### Backend unit and API tests

```bash
cd backend
uv run pytest -q -m "not integration"
```

### Real local RLS integration tests

Start local Supabase first, then run:

```bash
./scripts/run-local-rls-tests.sh
```

The script reads the local `API_URL`, `ANON_KEY`, and `SERVICE_ROLE_KEY` from `npx supabase status -o env`. The Service Role key is used only by the test harness to create and delete temporary Auth users and curriculum fixtures. It is not part of backend application configuration or student request paths. The FastAPI integration case derives the local JWKS URL from `API_URL` and verifies the real local ES256 signing key; no symmetric fallback secret is configured.

The real local integration suite includes the Phase 1 profile/RLS tests and the Phase 2.1 curriculum tests: table creation and linking, duplicate constraints, cross-version source/relationship rejection, prerequisite cycle inserts and updates, concurrent opposite prerequisite inserts, published visibility, hidden unpublished content, and student write denial.

The script refuses non-local URLs and exits with an error if it cannot read the local credentials. The pytest integration module also skips when those credentials are not configured. A skipped test is not evidence that RLS works; run the script against the local stack and report the actual result.

### Frontend checks and bundle scan

```bash
cd frontend
npm run typecheck
npm run build
if grep -R "service_role" dist; then
  echo "unexpected service-role material in frontend bundle" >&2
  exit 1
fi
```

The frontend should contain only the public anon/publishable key. The bundle must never contain the local JWT secret or Service Role key.

## Technology direction

- Frontend: React + TypeScript + Tailwind CSS + Vite.
- Backend: Python 3.12 + FastAPI.
- Database, authentication, and storage: Supabase.
- Mathematical verification: Python + SymPy for supported answer types (future phase).
- Architecture: modular monolith with a REST API.
- Local database migrations: Supabase CLI SQL migrations (confirmed for this phase).

Hosting, region, CI/CD, deployment topology, and production migration tooling beyond the confirmed local Supabase CLI direction remain OPEN.

## Deferred scope

Not implemented in this phase:

- Reviewed curriculum content, curriculum seed data, and curriculum UI.
- Exercises, attempts, diagnostics, learning plans, mastery, or progress.
- SymPy grading or any answer checking.
- DeepSeek/AI integrations or tutoring chat.
- Student image uploads or OCR.
- Production deployment, real student data, or remote Supabase projects.
