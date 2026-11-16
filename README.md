# Tutorly — رياضيات البكالوريا

A production-ready study platform for Algerian Baccalaureate students, covering the complete mathematics syllabus with an Arabic-first, RTL interface and a DeepSeek-powered tutor.

![Stack](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-node%3Asqlite-003b57?logo=sqlite)

## What's inside

- **All 10 chapters / 20 lessons** of the 3AS mathematics syllabus: sequences, limits & continuity, derivatives, exp/log, integrals, complex numbers, space geometry, probability, similarities, differential equations.
- **Rich lesson content** — definitions, theorems, worked examples, common-mistake callouts, quick exercises, and per-chapter formula sheets, all typeset with KaTeX.
- **AI tutor** — streaming chat powered by DeepSeek, with lesson-aware context, SSE streaming, stop/regenerate/copy, and an offline demo mode when no API key is set.
- **Progress tracking** — works instantly as a guest (localStorage), with optional accounts for cross-device sync.
- **Beautiful, fast UI** — warm paper palette, self-hosted Arabic (Tajawal) + Latin (Manrope) fonts, Framer-free CSS motion, fully responsive.
- **SQLite database** via Node 24's built-in `node:sqlite` — zero native dependencies, auto-seeded from typed curriculum files.
- **Security basics** — bcrypt password hashing, signed HttpOnly JWT session cookies, validated API routes, server-side data access.

## Tech choices

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend + backend | **Next.js 16 (App Router) + React 19 + TypeScript** | One codebase, server components for content, route handlers for auth/progress/chat streaming, excellent deployment story. |
| Styling | **Tailwind CSS v4** + custom CSS design system | Fast iteration, consistent RTL spacing, no heavy component library. |
| Database | **SQLite** (`node:sqlite`) | Zero-dependency, ideal for a single-node deployment; schema is trivial to port to Postgres for serverless hosting. |
| Auth | **jose** (JWT) + **bcryptjs** | Small, auditable, no third-party auth service required. |
| AI | **DeepSeek API** (`deepseek-chat`) | Strong Arabic + math reasoning at low cost; OpenAI-compatible streaming API. |
| Math | **KaTeX** + `react-markdown` + `remark-math` | Fast, accessible math rendering with RTL support. |

## Quick start

```bash
npm install
cp .env.example .env.local   # add your DeepSeek key + AUTH_SECRET
npm run dev
```

Open <http://localhost:3000>. The database is created and seeded automatically at `.data/tutorly.db`.

The app works **without any API key**: the AI tutor runs in demo mode with a clear notice. Progress tracking and auth work fully offline.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | For live AI | Key from [platform.deepseek.com](https://platform.deepseek.com). |
| `DEEPSEEK_BASE_URL` | No | Defaults to `https://api.deepseek.com`. |
| `DEEPSEEK_MODEL` | No | Defaults to `deepseek-chat`. |
| `AUTH_SECRET` | Production | Random 32-byte hex string used to sign session JWTs. A development fallback is used if missing. |
| `DATABASE_PATH` | No | Defaults to `./.data/tutorly.db`. Use an absolute path in production. |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Scripts

```bash
npm run dev       # start development server
npm run build     # production build
npm start         # serve the production build
npm run lint      # ESLint
npm run db:reset  # delete the local SQLite database (re-seeded on next start)
```

## Project structure

```
src/
  app/
    page.tsx                     landing dashboard
    lessons/                     chapter library + lesson reader
    formulas/                    printable formula sheet
    chat/                        AI tutor
    progress/                    personal progress dashboard
    login/ register/             auth pages
    api/auth/                    register · login · logout · me
    api/progress/                guest→account progress sync
    api/chat/                    DeepSeek SSE proxy + demo fallback
  components/                    UI, progress, chat, math renderer
  content/
    types.ts                     curriculum types
    chapters/01..10-*.ts         all lesson content (Markdown + LaTeX)
    index.ts                     curriculum aggregator
  lib/
    db.ts                        node:sqlite connection, schema, auto-seed
    curriculum.ts                typed queries (chapters, lessons, formulas)
    users.ts                     users + progress persistence
    auth.ts                      JWT sessions, password hashing, validation
```

## Database

Tables: `chapters`, `lessons`, `users`, `progress`, `meta` (content hash used to reseed only when lessons change). Foreign keys cascade. Lesson content lives in `src/content/chapters/*.ts` and is upserted on startup.

To use PostgreSQL in production, port `src/lib/curriculum.ts`, `src/lib/users.ts`, and the schema in `src/lib/db.ts` — the public types and API routes stay unchanged.

## Deployment notes

- The chat route uses the Node runtime and streams directly from DeepSeek. Set `DEEPSEEK_API_KEY` and `AUTH_SECRET` in your host's environment.
- SQLite requires a persistent volume. On serverless platforms (Vercel), either use a hosted Postgres or set `DATABASE_PATH` to a mounted volume; otherwise content/auth writes are ephemeral.
- `AUTH_SECRET` **must** be set in production; the app refuses to sign sessions without it.
- The assistant includes a system prompt scoped to the Algerian 3AS syllabus and responds in Arabic with LaTeX.

## Content scope

All lessons follow the 3AS mathematics programme for scientific streams (علوم تجريبية، رياضيات، تقني رياضي), with similarities and differential equations marked for maths/technical streams. Content is educational and original; verify official exam scope with your teacher.

---

Built with care for Algerian students. 🇩🇿
