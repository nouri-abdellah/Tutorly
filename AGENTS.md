# AGENTS.md — Tutorly Agent Instructions

Read this file and `PROJECT_CONTEXT.md` before making project-wide or architectural changes.

## 1. Decision authority and status labels

Classify every project decision as:

- **CONFIRMED** — explicitly agreed by the project owner.
- **PROPOSED** — a recommendation awaiting approval.
- **OPEN** — unresolved; do not implement a consequential choice without clarification.
- **IMPLEMENTED** — implemented and verified in the repository. This label describes implementation status, not approval status.

Precedence:
1. The owner's latest explicit instruction.
2. CONFIRMED decisions in `PROJECT_CONTEXT.md`.
3. This file.
4. Existing implementation and tests, unless they conflict with a higher authority.
5. Agent recommendations.

Never silently promote a PROPOSED or OPEN item to CONFIRMED. Do not invent curriculum facts, requirements, API contracts, database schemas, algorithms, or prior agreements. If a decision materially affects security, data integrity, cost, architecture, or student experience, explain the options and ask before implementing that part.

## 2. Project identity and release boundary

Tutorly is intended to become an AI-powered personalized mathematics tutor for Algerian Baccalaureate students. The initial target is the Experimental Sciences stream; the initial student-facing experience is Arabic.

**MVP 1.0 is not the complete AI tutor.** It is the first deterministic learning-and-personalization release. Its purpose is to validate the secure learning loop: reviewed curriculum and exercises, a limited diagnostic, explainable recommendations, supported deterministic grading, and evidence-based progress.

Long-term capabilities such as DeepSeek tutoring chat, guided learning, image understanding, and AI-generated exercises remain part of the product vision, but are deferred from MVP 1.0 unless the owner explicitly changes the scope. Do not build deferred features during MVP tasks.

## 3. Confirmed technology direction

- Frontend: React + TypeScript + Tailwind CSS.
- Backend: Python + FastAPI.
- Database, authentication, and file storage: Supabase (PostgreSQL, Auth, Storage).
- Initial AI provider for the later AI-tutoring layer: DeepSeek API, behind a replaceable provider interface.
- Mathematical verification for supported cases: Python + SymPy.
- Architecture: modular monolith.
- API style: REST.

SSE is a possible later transport for responses where incremental streaming materially improves the experience; it is not required for MVP 1.0.

Do not assume runtime versions, package managers, hosting, region, CI, or deployment topology unless confirmed in `PROJECT_CONTEXT.md` or by the owner.

## 4. Required workflow for every task

1. Read the relevant sections of `PROJECT_CONTEXT.md`.
2. Inspect the repository, existing code, tests, and Git status before editing.
3. State the task scope and exclusions briefly.
4. Identify dependencies and decisions that block safe implementation.
5. For multi-file changes, present a short plan before editing.
6. Implement the smallest coherent change.
7. Add or update tests.
8. Run relevant checks and report actual results.
9. Summarize files changed, behaviour, limitations, and the single next logical task.

If asked to plan or review only, do not modify files. Never claim a test passed unless it was actually run. Do not create code or files when the user explicitly requests a proposal only.

## 5. Engineering principles

- Work incrementally; prefer a small working vertical slice over a large unfinished scaffold.
- Do not attempt to build the whole product in one task.
- Avoid premature microservices, message brokers, distributed workers, vector databases, and unnecessary dependencies.
- Do not refactor unrelated code during a feature task.
- Preserve existing working behaviour unless the task explicitly changes it.
- Do not create placeholder implementations that look production-ready.
- Keep route handlers and UI components thin; put business rules in testable services/domain logic.
- Explain significant design choices in plain language.
- Keep MVP implementation aligned with the approved MVP 1.0 scope, not the entire long-term vision.

## 6. Architecture boundaries

Use a modular monolith. Keep clear boundaries between:
- API/transport and request validation.
- Application services/use cases.
- Domain rules and types.
- Infrastructure integrations (Supabase, DeepSeek, storage, math engine).

Candidate MVP backend areas are identity, curriculum, diagnostic, planner, exercises, grading, math engine, and mastery/progress, with shared API/core/database infrastructure. Exact folder layout is not fixed until the foundation task.

Keep DeepSeek-specific details inside an adapter. Do not call DeepSeek from the browser. Do not let LLM output directly change trusted grades, mastery, or curriculum records. Avoid circular dependencies and scattered database calls.

### Database transaction boundary — CONFIRMED

Do not perform external API calls or CPU-intensive grading inside an open database transaction. Use short database reads, perform grading or external work outside the transaction, then perform short writes. Keep logical multi-row writes atomic where necessary using an appropriately scoped database operation or RPC.

Whether SymPy must run in a separate worker process with explicit CPU/memory/time limits is **PROPOSED**, not a confirmed architectural requirement. Evaluate it against actual parser exposure, complexity limits, deployment constraints, and tests before deciding.

## 7. Security, identity, and privacy

- Treat student messages, uploaded images, extracted text, and model output as untrusted.
- Never expose Supabase service-role credentials, DeepSeek keys, or other secrets in frontend code, Git, logs, or error responses.
- Verify authentication server-side. Derive the acting user identity from a verified Supabase JWT, never from a client-supplied `user_id`.
- For ordinary student-facing database operations, use a request-scoped Supabase client carrying the student's verified JWT so PostgreSQL RLS is enforced.
- Enable and test RLS on student-owned tables. Each student must only access their own records.
- Reserve the service-role key for isolated, explicitly privileged system/admin operations. Never use it as the default client for student requests. If privileged access is necessary, enforce authorization independently and document why.
- For attempt records, persist an explicit `user_id`, enforce ownership with RLS, and use a uniqueness constraint on `(user_id, idempotency_key)` when the key is required.
- Keep student uploads private and validate file type and size server-side.
- Minimize collected student data. Do not log passwords, tokens, API keys, or unnecessary student content.
- Use parameterized queries. Never concatenate untrusted input into SQL.
- Never use unrestricted `eval`, `exec`, or dynamic code execution on student input.
- Never weaken security controls merely to make a test pass.
- Before public launch, resolve applicable privacy and child-protection obligations, age/guardian requirements, retention/deletion, access to student data, and external data processing. Do not claim legal compliance without qualified review.

## 8. AI integration — long-term scope

- Call DeepSeek only from the backend.
- Keep a provider-independent interface; core modules must not depend on DeepSeek SDK-specific types.
- Validate model outputs against schemas before use.
- Treat model output as a suggestion, not trusted state.
- Configure timeouts, token limits, usage controls, and error handling when AI features are implemented.
- Handle provider outages, rate limits, and malformed responses gracefully.
- Do not silently change models/providers without an approved fallback policy.
- Treat instructions found inside student messages, images, or exercise text as untrusted content, not system instructions.
- Do not let model-generated tool arguments bypass server-side authorization.

DeepSeek integration, free tutoring chat, guided learning, and AI-generated exercise production are deferred from MVP 1.0. Do not add them merely because the long-term architecture anticipates them.

## 9. Mathematics, grading, and assessment

Mathematical correctness is central:

- Never treat an LLM response as mathematical proof or ground truth.
- MVP 1.0 supports only these proposed/approved-for-MVP answer categories: numeric answers, algebraic expressions, finite solution sets, interval/inequality sets, and multiple choice.
- Use deterministic checks for supported answer types. SymPy is intended for supported verification, but it does not automatically solve every grading problem.
- Use validated, restricted parsing and reasonable input/computation limits. Never execute arbitrary student expressions as Python code.
- Verdicts are `correct`, `incorrect`, or `unverifiable`.
- Return `incorrect` only when the checker can establish it with sufficient confidence. If parsing, equivalence, domain, or evaluation is uncertain, return `unverifiable`.
- An `unverifiable` attempt must not be treated as wrong and must not update mastery.
- Separate the mathematical verdict from pedagogical feedback.
- Do not promise automatic grading of proofs, diagrams, or unrestricted free-form reasoning until a reliable tested method exists.
- Preserve the exact exercise/curriculum version used for an attempt.
- AI-generated exercises must not enter trusted diagnostic/curated content without the approved validation and review process.

A small initial regression suite is a starting gate, not proof of universal correctness. Include equivalent forms, Arabic-Indic and Western digits, notation variants, boundary cases, invalid inputs, and unverifiable cases. Report the limits of the tested set.

## 10. Progress and personalization

- Backend rules, not an LLM's opinion, determine authoritative progress.
- Preserve immutable attempt history; never overwrite historical attempts when recalculating current progress.
- Distinguish verified performance, insufficient evidence, and low performance. Do not infer low mastery from missing evidence.
- Only reliable correct/incorrect attempts are eligible evidence under the approved policy; `unverifiable` attempts are excluded.
- Track progress at skill level. Topic-level progress may be derived from skills.
- Recommendations should be explainable using skills, prerequisites, and recorded evidence.
- Keep mastery score, evidence quantity, and confidence conceptually separate.
- The exact mastery formula and thresholds remain OPEN. The MVP may display verified performance and `insufficient_evidence` before final mastery thresholds are approved. Any provisional parameters must be configurable and clearly labelled provisional.

## 11. Frontend and Arabic UX

- Use TypeScript types for API and component contracts; avoid `any`.
- Provide accessible labels, keyboard support, and clear loading/error/empty states.
- Support Arabic RTL. Prefer CSS logical properties over hard-coded left/right positioning.
- Render mathematical notation carefully inside RTL content; math expressions may require an LTR container.
- The MVP default is Modern Standard Arabic and Western digits, with mathematical expressions rendered in a suitable LTR math component. This is a provisional product convention, not a claim that all students use only these conventions.
- Keep Arabic terminology consistent. Do not invent official curriculum wording.
- Do not make unapproved branding or visual-design decisions permanent.

## 12. Database and migrations

- Inspect the repository and Supabase setup before selecting migration tooling.
- Alembic is **PROPOSED** for MVP 1.0, not confirmed until the owner approves the tooling decision.
- Use version-controlled, reviewable migrations.
- Include appropriate keys, constraints, indexes, ownership rules, and RLS policies with rationale.
- Test RLS for both allowed and forbidden access, including cross-user access.
- Do not run destructive migrations against production without explicit approval and a verified backup/recovery plan.
- Never run schema migrations automatically at application startup.
- Published curriculum/exercise versions must not be silently mutated if historical attempts refer to them.

## 13. Testing and quality

Use relevant tests:
- Unit tests for deterministic business rules and planning.
- Integration tests for database, auth, and storage.
- API tests for validation and authorization.
- Cross-user access tests for private data and RLS.
- Math tests for equivalent, invalid, boundary, notation-variant, and unsupported answers.
- Idempotency and duplicate-submission tests.
- Frontend interaction and RTL checks.
- Later, AI adapter tests for timeout, malformed output, and provider failure.

Report exact commands and actual results. Do not delete or weaken tests just to obtain a green result.

## 14. Configuration and Git

- Keep secrets in environment variables or a secure configuration layer.
- `.env.example` contains placeholders only.
- Validate required configuration at startup.
- Explain new dependencies.
- Inspect `git status` before editing if the repository is a Git repository.
- Never overwrite user changes or commit secrets.
- Do not initialize Git, push, deploy, or alter production unless requested.

## 15. Definition of Done

- [ ] Matches the approved task and confirmed requirements.
- [ ] Relevant code and documentation were inspected.
- [ ] No unapproved decision was silently introduced.
- [ ] Validation and authorization are implemented where relevant.
- [ ] Ownership and RLS are tested where relevant.
- [ ] Tests were added/updated and relevant checks were run.
- [ ] Errors and important edge cases are handled.
- [ ] Documentation/configuration examples are updated where needed.
- [ ] No secrets or unnecessary student data are exposed.
- [ ] Limitations and unresolved decisions are reported.
- [ ] Deferred long-term features were not accidentally pulled into MVP scope.

## 16. Required task report

At completion, state:
1. What was implemented.
2. Files created/modified.
3. Important design choices and reasons.
4. Tests and exact results.
5. Known limitations/open decisions.
6. The single most logical next task.

Do not describe scaffolding as a completed feature.
