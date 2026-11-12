# Tutorly — Project Context

**Document status:** Revised product and technical specification  
**Last updated:** 2026-11-12  
**Purpose:** Shared source of truth for the project owner and coding agents.

> **Decision labels:** CONFIRMED = explicitly agreed; PROPOSED = recommendation awaiting approval; OPEN = unresolved; IMPLEMENTED = implemented and verified. A recommendation is not a decision. Implementation status does not imply product approval.

# 1. Product identity

Tutorly is intended to become an AI-powered personalized mathematics tutor for students preparing for the Algerian Baccalaureate. The initial target segment is the **Experimental Sciences (علوم تجريبية)** stream, and the initial student-facing language is Arabic.

The product's educational purpose is to help students understand mathematics, identify knowledge gaps, practise relevant skills, receive useful explanations, and make measurable progress—not merely obtain final answers.

## 1.1 Long-term Product Vision

The long-term product vision includes the following capabilities:

1. Student onboarding and a profile for the target Baccalaureate stream.
2. An adaptive, progressive diagnostic using reviewed questions.
3. A personalized learning plan that changes as reliable evidence accumulates.
4. Free-form mathematics tutoring chat powered by an AI model.
5. Guided learning sessions that explain concepts and guide students step by step.
6. Curated/reviewed exercises and on-demand AI-generated practice exercises.
7. Correction and explanatory feedback.
8. Student uploads of exercise statements and handwritten/typed solutions, followed by transcription and student confirmation where needed.
9. Deterministic mathematical verification for supported answer types, with explicit uncertainty for unsupported cases.
10. Skill-level progress, confidence, and evidence-based recommendations.
11. Later possibilities such as richer diagnostics, misconception support, past-paper practice, reviewer/admin tools, voice, notifications, and mobile experiences.

This section describes the intended destination. It does **not** mean every feature is included in MVP 1.0 or that all detailed behaviours have already been approved. Details not explicitly confirmed remain PROPOSED or OPEN.

# 2. MVP 1.0 — First deterministic learning and personalization release

**MVP 1.0 is not the complete AI tutor.** It is a deliberately limited first release designed to validate the secure educational core before adding AI tutoring and multimodal complexity.

## 2.1 MVP 1.0 goal

Validate this learning loop:

1. A student securely creates an account and accesses their own data.
2. Tutorly presents a limited diagnostic from a small reviewed question bank.
3. The system records reliable evidence against individual skills.
4. A transparent, rule-based planner recommends what to study/practise next.
5. The student practises curated exercises.
6. Supported answers are checked deterministically.
7. The system preserves each attempt and displays verified performance or `insufficient_evidence`.

The first release should prove that this loop is secure, understandable, and educationally useful. It should not attempt to prove that the entire long-term AI tutor is complete.

## 2.2 Included in MVP 1.0

- One stream: Experimental Sciences.
- Arabic-first, RTL student interface.
- Supabase Auth and a student profile with only necessary fields.
- Backend authentication and ownership enforcement.
- User-scoped database access and RLS for student-owned data.
- A small, reviewed subset of the official curriculum, with explicit source/version.
- A limited fixed diagnostic based on reviewed questions.
- A preliminary diagnostic result that clearly states its coverage and limitations.
- A deterministic, rule-based learning plan using skill prerequisites and available evidence.
- A curated exercise bank with one primary assessed skill per exercise.
- Supported deterministic grading for numeric answers, algebraic expressions, finite solution sets, interval/inequality sets, and multiple-choice answers.
- Verdicts: `correct`, `incorrect`, and `unverifiable`.
- Immutable exercise-attempt history and idempotent submission.
- Skill-level verified performance and an `insufficient_evidence` state.
- Topic progress derived from skill data where useful.
- Basic frontend/backend tests, database migrations, staging setup, and operational health/error handling, once tooling decisions are approved.

## 2.3 Explicitly deferred from MVP 1.0

These remain in the long-term vision; they are not deleted or rejected:

- DeepSeek integration and AI tutoring chat.
- Guided learning sessions.
- AI-generated exercises.
- Image upload, OCR, handwriting recognition, and image-based grading.
- Advanced adaptive diagnostic selection and sophisticated stopping rules.
- Automated misconception taxonomy.
- Partial-credit grading.
- Proof, diagram, and unrestricted free-form grading.
- Past-paper ingestion or exam-mode claims until source, fidelity, and licensing are validated.
- Full admin/reviewer interface.
- Notifications, voice, and native mobile applications.
- Microservices, distributed workers, vector databases, and other infrastructure not justified by measured MVP needs.

**Important:** Although DeepSeek is the selected initial AI provider for the long-term AI layer, no DeepSeek call is required in MVP 1.0. Do not describe MVP 1.0 as an AI tutoring chat product. It is the deterministic learning-and-personalization foundation on which the AI layer can later be added.

## 2.4 Why this is a reasonable first release

- It validates the educational data model before introducing uncertain AI outputs.
- It builds trust through reviewed content and deterministic grading where supported.
- It gives the project a testable end-to-end student workflow.
- It reduces initial cost, operational complexity, and debugging surface.
- It creates stable interfaces for later tutoring, guided learning, generated exercises, and image workflows.
- It lets the team evaluate whether diagnostic evidence and learning recommendations are useful before adding more features.

The AI layer should later be added through backend application services and provider adapters. It may consume curriculum, skill, exercise, attempt, and progress context, but it must not replace deterministic grading or directly write trusted mastery state. This preserves the core architecture rather than requiring a redesign.

# 3. Confirmed technology direction

| Area | Status | Decision |
|---|---|---|
| Frontend | CONFIRMED | React + TypeScript + Tailwind CSS |
| Backend | CONFIRMED | Python + FastAPI |
| Database | CONFIRMED | Supabase PostgreSQL |
| Authentication | CONFIRMED | Supabase Auth |
| File storage | CONFIRMED | Supabase Storage |
| Long-term initial AI provider | CONFIRMED | DeepSeek API |
| AI architecture | CONFIRMED | Provider-independent interface; replaceable provider |
| Mathematical verification | CONFIRMED | Python + SymPy for supported deterministic checks |
| Architecture | CONFIRMED | Modular monolith |
| API style | CONFIRMED | REST |
| Streaming | PROPOSED | SSE only where incremental output materially improves a later feature |
| Local database migrations | CONFIRMED | Supabase CLI SQL migrations (CLI 3.1.0 implemented locally) |

Runtime versions, package managers, hosting provider, region, CI/CD, and deployment topology still require approval; see the open decisions register. Supabase CLI is confirmed for local database migrations and local Supabase development.

# 4. Product principles

1. Learning and understanding over simply giving answers.
2. Mathematical correctness over confident-sounding output.
3. Personalization based on recorded evidence.
4. Reviewed content for trusted assessment.
5. Explicit uncertainty when an answer or image cannot be interpreted reliably.
6. Privacy and access control by design, especially because the product serves school students.
7. Simple, maintainable architecture before infrastructure complexity.
8. Arabic-first experience with correct RTL and readable mathematical notation.
9. Clear distinction between long-term vision, MVP scope, proposals, and implemented features.

# 5. Intended long-term student journey

This is a product-level vision, not the exact MVP 1.0 flow or final UI specification:

1. Student creates an account and completes onboarding.
2. Student confirms the target stream (initially Experimental Sciences).
3. Student completes an adaptive progressive diagnostic.
4. Questions are selected from a reviewed question bank.
5. Answers are evaluated where reliable and evidence is recorded by skill.
6. Tutorly presents an initial learning plan and explains its priorities.
7. Student learns through free tutoring chat, guided learning, or exercises.
8. Student may upload an exercise statement or solution image.
9. The system extracts mathematical content and asks the student to confirm ambiguous notation.
10. The system checks the answer using an appropriate reliable method.
11. Verified attempts may update skill progress.
12. Recommendations and the learning plan adapt using new evidence.

For MVP 1.0, steps 3–6 and curated exercise practice are intentionally simplified and deterministic. AI tutoring and image workflows are deferred.

# 6. MVP architecture

**CONFIRMED:** modular monolith.

**PROPOSED high-level request flow:**
1. React sends an HTTPS request to FastAPI.
2. Backend verifies the Supabase access token.
3. Backend derives the student identity from the verified JWT.
4. API validates input and authorization.
5. Application service coordinates the use case.
6. Domain rules determine the operation and whether deterministic verification applies.
7. Infrastructure adapters access Supabase or the math engine.
8. The frontend presents the result, including uncertainty where applicable.

**IMPLEMENTED locally in Phase 1:** steps 1–4 and 7 for `GET /api/v1/me`, using Supabase Auth, JWKS token verification, and a request-scoped PostgREST client. The full flow remains PROPOSED for later modules.

Later, AI and storage adapters may be added to this flow. Browser code must never call DeepSeek directly.

## 6.1 Candidate MVP backend modules

- `identity` — authentication context and profiles.
- `curriculum` — versioned curriculum, topics, skills, prerequisites.
- `diagnostic` — fixed diagnostic sessions and responses.
- `planner` — deterministic learning-plan generation.
- `exercises` — curated exercise retrieval and versioning.
- `grading` — answer-type routing and verdict policy.
- `math_engine` — restricted deterministic mathematical checks.
- `mastery` — skill evidence and derived progress.
- Shared `api`, `core`, and `db` infrastructure.

These are conceptual boundaries, not an approved folder tree. Inspect the repository before deciding exact structure.

## 6.2 Long-term modules

Later modules may include `tutoring`, `guided_learning`, `ai`, `uploads`, `transcription`, `admin/content_review`, and analytics if justified. Do not scaffold all future modules during MVP foundation work.

# 7. Curriculum and skills

Represent the approved mathematics curriculum as versioned curriculum versions, topics/units, skills, and prerequisite relationships.

**OPEN:**
- Authoritative source for the Experimental Sciences mathematics curriculum.
- Exact taxonomy, coverage, official wording, and ordering.
- Prerequisite graph and subject-expert validation.
- Exercise coverage and difficulty labels.

Do not invent official curriculum facts. MVP 1.0 should import only a small subset whose source and correctness have been checked by the owner or a qualified mathematics reviewer. Clearly label the subset as limited; do not imply full curriculum coverage.

# 8. Diagnostic

## Long-term vision

The long-term diagnostic is adaptive and progressive: later questions may depend on earlier answers and estimated skill confidence.

## MVP 1.0

Use a fixed, reviewed diagnostic blueprint over a limited curriculum subset. A preliminary proposal is 12–16 questions, with roughly two questions per selected skill where the bank permits. This is a starting design, not a confirmed universal rule or a full-curriculum assessment.

The result must state:
- Which skills were assessed.
- Which skills have some verified evidence.
- Which skills have insufficient evidence.
- That the diagnostic is preliminary and limited in coverage.

**OPEN:** final question count, selected skills, scoring details, and diagnostic acceptance criteria. Advanced adaptive selection and stopping rules are deferred.

# 9. Personalized learning plan

**CONFIRMED product direction:** Tutorly should provide an adaptive learning plan.

**MVP 1.0 implementation:** a deterministic, explainable rule-based plan using the limited skill/prerequisite graph and verified diagnostic/practice evidence. The plan should explain why a skill is recommended.

Exact ranking weights, scheduling, student controls, and update frequency remain OPEN. Do not use an LLM to determine authoritative priorities in MVP 1.0.

# 10. Exercises and attempts

MVP 1.0 serves curated/reviewed exercises. Each exercise should have one primary assessed skill to keep evidence attribution clear.

Published exercises must be versioned and immutable. Editing a published exercise creates a new version/record; historical attempts continue to reference the exact version they used.

AI-generated exercises are part of the long-term vision but deferred from MVP 1.0. Later generated items must be schema-validated and independently checked; unverified generated content must not enter trusted assessment banks.

# 11. Mathematical verification and grading

## 11.1 Supported MVP answer types

1. Numeric answer.
2. Algebraic expression.
3. Finite solution set.
4. Interval/inequality set.
5. Multiple choice.

This limited set does not imply that all mathematical forms in these categories are automatically easy to verify. Each checker needs explicit normalization, parsing, domain, and equivalence rules.

## 11.2 Verdict policy

- `correct`: the supported checker establishes equivalence/correctness.
- `incorrect`: the checker establishes that the submitted answer does not satisfy the expected answer specification.
- `unverifiable`: parsing or equivalence is unsupported or uncertain.

Do not turn uncertainty into an incorrect verdict. Unverifiable attempts are excluded from mastery evidence.

## 11.3 Safety and reliability

- Never use arbitrary Python `eval` or `exec` on student input.
- Use a restricted parser and validated expression grammar.
- Apply reasonable input-size and computation limits.
- Treat SymPy as a tool for supported cases, not a universal proof system.
- Separate the mathematical verdict from explanatory feedback.
- Do not grade proofs, diagrams, or unrestricted free-form reasoning in MVP 1.0.

An initial test suite of 30–50 carefully selected cases may be useful as a starting point, but it is not proof of general reliability. Include equivalent expressions, notation variants, Arabic-Indic and Western digits, boundary cases, malformed inputs, and cases that must return `unverifiable`. A release gate of zero known false-correct and zero known false-incorrect results applies only to the reviewed test set, not all possible inputs.

# 12. Attempt evidence and idempotency

**PROPOSED MVP record shape, subject to schema review:**

`exercise_attempts` should include at least:
- `id`
- `user_id` — required owner, referencing the authenticated user.
- `exercise_id` and exact `exercise_version_id` (or an equivalent immutable version reference).
- `curriculum_version_id`.
- `primary_skill_id`.
- `source` (for example curated exercise or diagnostic).
- submitted raw answer and normalized answer where appropriate.
- answer type.
- verdict (`correct`, `incorrect`, `unverifiable`).
- grading method and math-engine version.
- bounded structured grading details and an error code where relevant.
- `idempotency_key`.
- creation timestamp.

Use a unique constraint on `(user_id, idempotency_key)` for attempt submissions. A retry with the same key must not create a second attempt. Define how a repeated key with a different payload is rejected.

Ownership and RLS:
- `user_id` is assigned by the backend from the verified JWT, never trusted from the request body.
- Student-facing requests use a Supabase client carrying that student's JWT.
- RLS policies restrict select/insert/update/delete to rows whose `user_id` equals the authenticated database user.
- Test both permitted same-user access and denied cross-user access.
- Historical attempt records are immutable to ordinary student clients. Corrections to data must use a controlled, auditable administrative process rather than rewriting history.

The exact physical schema, foreign keys, retention policy, and whether all fields belong in one table or related tables require migration-level review.

# 13. Progress and mastery

**CONFIRMED policy:**
- Progress is skill-based; topic progress can be derived from skills.
- Preserve immutable attempt evidence.
- Do not let an LLM determine authoritative mastery.
- Unverifiable attempts do not count as correct or incorrect evidence and do not update mastery.
- Distinguish insufficient evidence from low performance.

**MVP 1.0 recommendation:** derive current progress from immutable attempts on read initially, unless measured performance requires snapshots or caching.

Keep these concepts separate:
- Verified performance/score.
- Evidence quantity and coverage.
- Confidence in the estimate.
- Mastery state.

The exact formula, weights, thresholds, recency/decay, and minimum evidence remain OPEN. Do not block the entire MVP on a final mastery formula: display verified performance and `insufficient_evidence` while parameters remain provisional and configurable. Do not claim mastery when evidence is insufficient.

# 14. Database authorization and transaction boundaries

## 14.1 Student data access — CONFIRMED

Ordinary student-facing database operations must use a request-scoped Supabase client carrying the student's verified JWT, with RLS enabled and tested on student-owned tables.

The Service Role key bypasses RLS. It is reserved for isolated privileged system/admin operations, not ordinary student requests. Any privileged operation must independently enforce authorization.

**IMPLEMENTED locally in Phase 1:** the `profiles` table has RLS enabled. Authenticated students have only `SELECT`, with an ownership policy requiring `auth.uid() = id`. No profile fields are student-editable, so there is no student `UPDATE` grant or policy; the `updated_at` trigger remains for future trusted database updates. `anon` and `service_role` have no profile table privileges. The FastAPI `/api/v1/me` path uses the public anon key plus the student's JWT, and the Service Role key is absent from backend application configuration.

## 14.2 Transaction boundaries — CONFIRMED

Do not call external APIs or run CPU-intensive grading while a database transaction is open. Use a short read, perform grading/external work outside the transaction, then perform a short write. Use a single atomic database operation or a narrow RPC for a logical multi-row write where appropriate.

## 14.3 SymPy process isolation — PROPOSED

Running SymPy in a separate worker process with resource limits is a separate implementation decision, not implied by the transaction rule. Evaluate and approve it based on actual threat model, parser restrictions, resource limits, deployment environment, and testing.

# 15. Authentication and student privacy

Supabase Auth is confirmed. Email/password is **CONFIRMED for MVP 1.0 Phase 1 and IMPLEMENTED locally**.

The approved Phase 1 profile schema is minimal: `id uuid` (ownership, referencing `auth.users(id)`), `created_at`, and `updated_at`. No personal profile fields are approved or implemented. The Auth-user trigger creates exactly one profile, and there is no student-facing profile editing endpoint until editable fields are approved.

Because Tutorly serves school students, before public launch resolve:
- Applicable privacy and child-protection obligations in Algeria and any later target markets.
- Whether age gates, parental/guardian consent, or additional flows are required.
- Data minimization and purpose limitation.
- Retention and deletion for profiles, diagnostic responses, attempts, messages, and images.
- Who may review student content and under what permissions.
- Security incident and account deletion procedures.
- External processing and cross-border transfer implications if student content is later sent to DeepSeek or another provider.

Collect only necessary data. Keep student content out of logs by default. Do not claim legal compliance without qualified review. These are public-launch gates, not optional polish.

# 16. Long-term AI tutoring layer

DeepSeek is the selected initial provider, behind a replaceable backend interface. This layer is deferred from MVP 1.0.

When implemented, the AI layer may:
- Answer mathematics questions in Arabic.
- Explain concepts and guide reasoning.
- Use relevant curriculum, skill, exercise, and progress context.
- Support guided learning.
- Generate structured practice content subject to validation.
- Produce pedagogical feedback after deterministic grading.

The LLM must not:
- Become the authority for mathematical correctness.
- Directly write trusted mastery state.
- Publish unreviewed content into trusted diagnostic banks.
- Bypass authorization or access another student's data.

Exact DeepSeek model, fallback, quotas, token budgets, prompt versions, rate limits, and cost ceiling remain OPEN.

# 17. Long-term image workflow

Image input is part of the product vision but deferred from MVP 1.0.

Proposed future workflow:
1. Authorize the upload.
2. Store it in private storage.
3. Validate metadata, type, and size.
4. Send it through a selected vision/transcription adapter.
5. Preserve uncertainty in extracted text and mathematics.
6. Ask the student to confirm ambiguous notation.
7. Use confirmed content for tutoring or supported grading.

Handwriting recognition and Arabic/mathematical OCR are not assumed solved. Provider, formats, limits, retention, deletion, and confirmation UX remain OPEN.

# 18. API conventions

REST is CONFIRMED. The following are PROPOSED conventions for MVP 1.0:
- Version routes (for example `/api/v1`).
- Validate request and response schemas with Pydantic.
- Use a consistent error envelope, proposed as `{code, message_key, request_id, details}`.
- Use appropriate HTTP status codes for authentication, not-found, conflict, validation, rate-limit, and server errors.
- Require `Idempotency-Key` for attempt submission.
- Never accept client-supplied `user_id` as the identity authority.
- Paginate growing collections.
- Publish OpenAPI contracts.

**IMPLEMENTED locally in Phase 1:** `GET /health` and authenticated `GET /api/v1/me`. The profile endpoint derives identity only from the verified JWT and rejects missing or invalid bearer credentials with 401. Phase 1 error responses use `{"error": {"code", "message_key", "request_id"}}`. There is no `PATCH /api/v1/me` while no editable profile fields are approved.

Exact endpoint paths and payloads should be designed with each feature, not invented speculatively. SSE remains deferred until a feature needs incremental output.

# 19. Content governance and versioning

**PROPOSED for MVP 1.0:**
- Seed/import reviewed curriculum and exercise data through a version-controlled command or reviewed data files.
- No full admin UI in MVP 1.0.
- Curriculum versions are immutable once used by student evidence.
- Published exercises are immutable; edits create a new version.
- Suggested content states: `draft`, `reviewed`, `published`, `retired`.
- Attempts reference exact exercise and curriculum versions.

The content reviewer/owner process, source permissions, and publication criteria require owner approval. Past-paper material must not be used without checking source reliability and licensing.

# 20. Testing and educational evaluation

MVP test categories:
- Unit tests for domain rules, planning, and progress.
- Integration tests for Supabase auth, RLS, and persistence.
- Cross-user authorization tests.
- API validation and idempotency tests.
- Mathematical equivalence, notation, invalid-input, boundary, and unverifiable cases.
- Frontend interaction, accessibility, Arabic RTL, and math-rendering checks.
- Migration tests against a non-production database.

Later AI evaluation categories:
- Arabic explanation quality and correctness.
- Hallucination and uncertainty handling.
- Guided-learning usefulness.
- Generated exercise validity and difficulty.
- OCR/transcription accuracy and confirmation behaviour.

Diagnostic length and a small grading regression set are not evidence of full curriculum coverage or universal grading reliability. Define educational success metrics before public beta; do not claim learning improvement without evaluation.

# 21. Deployment and operations

No production hosting provider or region is confirmed.

**PROPOSED MVP toolchain:** Python 3.12, `uv`, Ruff, mypy, pytest; Vite, TypeScript strict mode, Tailwind, Vitest, ESLint; GitHub Actions; Supabase for managed database/auth/storage; one backend PaaS and one static frontend host.

**CONFIRMED and IMPLEMENTED locally:** Supabase CLI for local database migrations and local Supabase development. The repository pins Supabase CLI `3.1.0` as a root development dependency. Alembic is not used for the confirmed local migration path.

These are recommendations, not approved decisions. Confirm compatibility with the existing repository and the owner's environment before adding dependencies or creating deployment resources.

Use separate local/development, test/staging, and production environments. Never test destructive migrations against production. Keep secrets out of Git. Hosting, region, backups, monitoring, CI/CD, and release process remain OPEN.

# 22. Open decisions register

| ID | Decision | Status / note |
|---|---|---|
| OD-01 | Official Experimental Sciences mathematics curriculum source | OPEN; key content dependency |
| OD-02 | Exact topic/skill hierarchy and prerequisite graph | OPEN; depends on OD-01 |
| OD-03 | MVP diagnostic subset, question count, and blueprint | OPEN; fixed preliminary diagnostic for MVP |
| OD-04 | Advanced adaptive diagnostic algorithm and stopping rule | OPEN; deferred beyond MVP |
| OD-05 | Mastery formula, evidence weights, recency, thresholds | OPEN; do not block basic verified progress |
| OD-06 | Detailed equivalence rules and tolerances for each supported answer type | OPEN; required before each checker ships |
| OD-07 | SymPy process isolation and resource-limit implementation | PROPOSED; separate from confirmed transaction rule |
| OD-08 | Exact attempt schema, retention, and deletion behaviour | PROPOSED schema principles; exact schema OPEN |
| OD-09 | Curriculum/exercise version schema and publication workflow | PROPOSED |
| OD-10 | API error envelope and endpoint contracts | PROPOSED overall; Phase 1 implements `GET /api/v1/me` and a narrower `{error: {code, message_key, request_id}}` envelope |
| OD-11 | Authentication method and minimum profile fields | CONFIRMED and IMPLEMENTED locally for Phase 1: Supabase email/password; profile fields limited to `id`, `created_at`, `updated_at` |
| OD-12 | Age gate, guardian consent, privacy/legal review | OPEN; public-launch gate |
| OD-13 | Arabic terminology, numeral conventions, and math rendering | PROPOSED defaults: MSA, Western digits, LTR math isolation |
| OD-14 | Migration tooling and runtime/package versions | Supabase CLI CONFIRMED and implemented for local migrations; runtime/package versions and non-local migration tooling remain OPEN/PROPOSED |
| OD-15 | Hosting, region, CI/CD, backups, and monitoring | OPEN |
| OD-16 | AI model/version, budgets, rate limits, fallback, and cost ceiling | OPEN; long-term layer |
| OD-17 | Image/OCR provider, formats, limits, retention, and confirmation UX | OPEN; deferred |
| OD-18 | Admin/reviewer roles and permissions | OPEN; full UI deferred |
| OD-19 | Past-paper source, licensing, and exam-mode fidelity | OPEN; deferred |
| OD-20 | MVP acceptance criteria and educational evaluation metrics | OPEN |
| OD-21 | Whether derived progress needs snapshots/caching | PROPOSED: derive on read first |

# 23. MVP 1.0 development roadmap

## Phase 0 — Foundation
- Inspect repository and current files before changes.
- Confirm runtime/tooling and migration approach.
- Establish Git workflow, frontend/backend skeleton, formatting, linting, type checks, and tests.
- Configure development/test Supabase environments.
- Add health endpoint, request IDs, and agreed error handling.
- Build a minimal staging walking skeleton.

**Exit:** application runs locally and basic automated checks pass; no student feature is falsely described as complete.

## Phase 1 — Identity and secure platform
- Integrate Supabase Auth.
- Verify JWTs on the backend.
- Create user-scoped Supabase access.
- Define profile ownership, RLS, and migrations.
- Add cross-user access tests.

**IMPLEMENTED locally (2026-11-12):** Supabase email/password sign-up/sign-in, Arabic RTL auth/profile UI, backend JWT verification with exactly one configured mode (local ES256/JWKS; HS256 secret mode supported for symmetric deployments), request-scoped PostgREST access using the anon key and student JWT, a minimal `profiles` migration with Auth-user creation and `updated_at` triggers, select-only student profile access enforced by RLS, and authenticated `GET /api/v1/me`. No profile PATCH endpoint exists because no editable fields are approved.

**Verification:** 23 backend unit/API tests passed; 11 real local Auth/PostgREST/RLS integration tests passed with two independent users, including a FastAPI request through the real local JWKS and PostgREST path. Effective grants and policies were inspected. Frontend typecheck/build passed and the bundle contained no Service Role material.

**Exit:** met locally for the implemented `profiles` scope; any later student-owned table must add its own RLS, grants, and cross-user tests. No remote/production Supabase project was used.

## Phase 2 — Curriculum, exercises, and math core
- Confirm and import a small reviewed curriculum subset.
- Define the supported answer types and per-type rules.
- Add versioned curated exercises.
- Implement restricted deterministic grading.
- Build the initial math regression suite.

**Exit:** supported answers are checked within documented limits; uncertain cases are `unverifiable`.

## Phase 3 — Practice and attempt evidence
- Serve curated exercises.
- Implement idempotent attempt submission.
- Persist immutable attempts with user ownership and exact content versions.
- Test duplicate submissions and RLS.

**Exit:** a student can practise and retrieve their own attempt history without duplicate records.

## Phase 4 — Fixed diagnostic
- Create a reviewed diagnostic blueprint for the approved subset.
- Record diagnostic responses and skill evidence.
- Display coverage and limitations.

**Exit:** student completes the preliminary diagnostic and sees an honest evidence summary.

## Phase 5 — Progress and learning plan
- Derive verified skill performance.
- Display `insufficient_evidence` where appropriate.
- Implement the explainable rule-based plan.
- Keep provisional mastery parameters configurable.

**Exit:** recommendations are traceable to skills and recorded evidence.

## Phase 6 — MVP hardening and beta readiness
- Security and RLS review.
- Privacy/deletion and age/guardian requirements review.
- Arabic/RTL and math-rendering QA.
- Performance, reliability, and cost checks.
- Student feedback and educational evaluation.

**Exit:** approved MVP acceptance criteria are met and limitations are communicated. Public launch remains blocked until privacy and child-safety requirements are resolved.

## Post-MVP sequence — subject to validation and reprioritization
1. DeepSeek tutoring chat.
2. Guided learning.
3. Image upload and transcription confirmation.
4. Validated AI-generated exercises.
5. More adaptive diagnostics.
6. Misconception taxonomy.
7. Past-paper practice and reviewer/admin tooling where justified.
8. Voice, notifications, or mobile only if user evidence supports them.

# 24. Change log

| Date | Change |
|---|---|
| 2026-11-12 | Initial specification assembled from project discussions. |
| 2026-11-12 | Separated long-term Product Vision from MVP 1.0; clarified deterministic first release, security/transaction rules, attempt ownership/idempotency, grading uncertainty, provisional mastery, versioning, privacy gates, and phased roadmap. |
| 2026-11-12 | Implemented and verified Phase 1 locally: Supabase CLI migrations, minimal `profiles` with RLS, email/password Auth, JWT/JWKS verification, request-scoped PostgREST access, `GET /api/v1/me`, Arabic RTL auth/profile UI, and real two-user RLS integration tests. |
