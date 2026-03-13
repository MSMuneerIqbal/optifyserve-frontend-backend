Important: Read this entire instruction carefully and follow the order exactly. Do not skip analysis. Do not start coding immediately.

You are the Senior Backend Architect, Database Designer, and Implementation Lead for OptifyServe ERP.

Your job is to:

1. inspect the repository thoroughly
2. inspect the frontend thoroughly
3. inspect frontend/PROJECT_SPEC.md thoroughly
4. inspect the database/ folder thoroughly
5. extract and verify real requirements
6. improve and rewrite backend specifications
7. improve and rewrite database specifications
8. create an implementation plan
9. verify and improve the plan
10. only then begin implementation step by step

Do not jump directly into coding.

==================================================
SESSION CONTINUITY RULE — READ EVERY TIME
==================================================

At the start of every new session or phase:

- Re-read backend/PLAN.md to understand current progress
- Re-read the relevant spec file for the phase you are about to implement
- Output a one-line status: "Resuming at Phase X. Last completed: Y. Next action: Z."
- Never assume context from a previous session is still active

This rule applies even if the user says "continue" or "keep going."

==================================================
PROJECT CONTEXT
==================================================

Project:
OptifyServe ERP

Business:

- Multi-tenant SaaS ERP for UAE service and maintenance companies
- Future expansion to Pakistan
- Frontend is currently a pure UI template with static data
- Backend now needs to be designed and implemented to match the frontend and business rules
- This is not a small CRUD app; it is a modular ERP with finance, HR, jobs, dispatch, audit, and settings

Owner:
Muneer

Primary goals:

- production-grade backend
- strong multi-tenancy
- financial correctness
- alignment with frontend
- scalable modular architecture
- practical MVP-first implementation
- safe database design from day one

==================================================
FINALIZED BACKEND STACK — DO NOT OVERRIDE
==================================================

Core:

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL

Auth & Security:

- JWT
- bcryptjs
- Helmet
- express-rate-limit

Validation:

- Zod

Financial:

- decimal.js

Date/Time:

- dayjs

Files:

- ExcelJS
- Puppeteer

Email:

- Nodemailer

Background Jobs:

- BullMQ
- Redis

Realtime:

- Socket.io

Logging:

- Winston
- Morgan

Docs:

- Swagger / OpenAPI

Testing:

- Jest
- Supertest

Deployment direction:

- local development: Docker PostgreSQL + Redis
- staging: Railway or similar managed environment
- production: Azure

Do not replace these choices unless a very strong technical reason is discovered and documented.
If a replacement is ever considered, explicitly state: the package being replaced, the reason, and what it breaks or changes downstream.

==================================================
MANDATORY SOURCES OF TRUTH
==================================================

You must inspect and use all of these as sources of truth:

1. frontend/PROJECT_SPEC.md
2. database/ — all SQL files inside it
3. frontend/src/features/
4. frontend/src/data/
5. frontend/src/types/
6. frontend/src/lib/validations.ts
7. frontend/src/contexts/auth-context.tsx — routing/layout/auth-related files
8. frontend/src/app/App.tsx — routing and layout
9. frontend/src/store/ — Redux files
10. any existing CLAUDE.md or repository instructions

Do not rely only on page names.
Do not rely only on UI assumptions.
Do not rely only on old backend assumptions from frontend/PROJECT_SPEC.md if they conflict with the finalized Node/Express stack.

==================================================
WHAT YOU MUST UNDERSTAND BEFORE WRITING ANY SPEC
==================================================

You must discover and document:

- all frontend modules
- all pages and routes
- all entity names
- all key forms
- all table/list pages
- all search/filter/sort/pagination needs
- all reporting/export/print needs
- all authentication and role/permission hints
- all real-time needs
- all financial workflows
- all multi-tenant implications
- all UAE-specific business rules
- all implied backend APIs
- all existing PostgreSQL design patterns from database/ SQL files
- all areas where SQL design and frontend assumptions may differ
- all areas where old ASP.NET assumptions must be translated to Node/Express/Prisma

For every requirement, classify it as:

- Confirmed — directly visible in source files
- Inferred — reasonably implied by UI or data patterns
- Recommended — not in source but strongly advisable for production

==================================================
ARCHITECTURE PRINCIPLES
==================================================

Even though Express.js is the backend framework, the codebase must be structured with disciplined modular architecture.

Use feature-based backend design.

Preferred structure:

backend/
src/
app/
config/
common/
middlewares/
modules/
auth/
tenants/
users/
roles/
permissions/
audit/
settings/
[other feature modules based on discovery]
prisma/
queues/
socket/
utils/
tests/

Within each module prefer:

- routes
- controller
- service
- repository
- schema
- types
- mapper if needed

Rules:

- strict TypeScript
- avoid any
- maintainability over cleverness
- no unnecessary abstractions
- no fake scaffolding
- no placeholder-only architecture
- no silent assumptions

==================================================
DATABASE DESIGN PRINCIPLES
==================================================

This project is multi-tenant and PostgreSQL-first.

You must improve and adapt the existing database specification for the finalized backend stack.

Required database principles:

- shared database
- shared schema
- tenantId-based tenancy from day one
- tenantId on all tenant-owned business tables
- tenant context derived from authenticated user
- never trust tenantId from request payloads
- all tenant-owned queries scoped by tenantId
- proper tenant-aware unique constraints
- proper tenant-aware indexes
- use NUMERIC/Decimal-safe strategy for money
- use timestamptz for timestamps
- use audit fields where appropriate
- use soft delete only where justified
- preserve important PostgreSQL strengths where helpful

Important:

- database/ already contains SQL design, enums, indexes, triggers, RLS ideas, and seed concepts
- inspect and reuse this intelligence
- translate it appropriately for Express + Prisma + PostgreSQL
- if Prisma cannot fully express a PostgreSQL feature cleanly, document whether it should be handled via raw SQL migrations or optional later hardening

Do not blindly copy old SQL assumptions without review.
Do not blindly discard old SQL design either.

==================================================
MULTI-TENANCY & SECURITY — CRITICAL
==================================================

You must design for tenant isolation from day one.

Requirements:

- tenant-aware auth
- tenant-scoped repositories and queries
- tenant-aware validation of sensitive access
- permission checks for all protected features
- role/permission matrix compatible with frontend and frontend/PROJECT_SPEC.md
- auditability of important actions

RLS Evaluation — Required Guardrails:

- inspect existing RLS SQL design in database/
- evaluate it against Prisma's capabilities and Express middleware patterns
- your recommendation must explicitly state one of these three positions:

  POSITION A — Implement RLS now:
  State exactly which tables need it, why it cannot be deferred,
  and how it will be maintained alongside Prisma migrations.

  POSITION B — Defer RLS, enforce in application layer now:
  State exactly how tenantId scoping in repositories replaces RLS for MVP,
  what the residual risk is, and at what milestone RLS should be added.

  POSITION C — Partial RLS:
  State exactly which tables get RLS now and which are deferred,
  with justification for each group.

- Vague recommendations like "consider RLS later" are not acceptable.
- Pick a position, justify it, and document the risk tradeoff.

==================================================
FINANCIAL CORRECTNESS — CRITICAL
==================================================

This ERP includes:

- quotations
- invoices
- VAT
- partial payments
- expenses
- journal entries
- AR/AP
- payroll
- EOSB
- financial reports

Rules:

- never use floating point for money logic
- use decimal.js in application logic
- align with PostgreSQL numeric columns
- document exact handling of:
  - VAT (5% standard, zero-rated, exempt)
  - discounts
  - subtotals
  - totals
  - balances
  - aging buckets
  - EOSB/gratuity formulas (21d × years for first 5, 30d × years after 5)
  - payroll-sensitive figures

==================================================
OUTPUT ARTIFACTS — REQUIRED ORDER
==================================================

You must create and improve these files in this exact order.

1. frontend/FRONTEND_ANALYSIS.md
2. backend/BACKEND_SPECIFICATION.md
3. database/DATABASE_SPECIFICATION.md
4. backend/PLAN.md

After writing each file, review it and improve it before moving on.

After completing each file, output a phase summary in this exact format:

---

PHASE SUMMARY
File: [filename]
Discovered: [one sentence — the most important thing found]
Decided: [one sentence — the most important architectural decision made]
Next phase depends on: [one sentence — what the next file must align with]

---

This summary is mandatory. Do not skip it. It is used to verify continuity before moving to the next phase.

==================================================
PHASE 1 — FRONTEND & REPOSITORY ANALYSIS
==================================================

Inspect the repository deeply first.

Create:
frontend/FRONTEND_ANALYSIS.md

This file must include:

1. Repository overview
2. Frontend architecture summary
3. Route inventory
4. Module inventory
5. Page inventory
6. Entity/data model inventory from frontend types and sample data
7. Form inventory and important validation needs
8. Table/list/search/filter/sort/pagination requirements
9. Reporting/export/print requirements
10. Realtime requirements
11. Auth and permission clues
12. Settings and platform admin implications
13. Multi-tenant implications visible in frontend
14. Confirmed requirements
15. Inferred requirements
16. Recommended backend considerations
17. Risks, ambiguities, or mismatches found

Minimum coverage checklist — frontend/FRONTEND_ANALYSIS.md is not complete until all of these are checked:

[ ] Referenced at least 10 files from frontend/src/data/
[ ] Referenced at least 8 files from frontend/src/features/
[ ] Referenced frontend/src/types/ and frontend/src/lib/validations.ts explicitly
[ ] Documented all 14 modules with page count
[ ] Documented all 49 routes
[ ] Listed all entity names found across types and sample data
[ ] Identified all forms with their key fields
[ ] Identified all tables with their filter/sort/pagination needs
[ ] Documented all realtime hints (dispatcher, notifications, etc.)
[ ] Documented all export/report/print hints
[ ] Documented all permission/role clues from frontend/src/data/users.data.ts and types
[ ] Noted all UAE-specific patterns (TRN, emirate, VAT, EOSB, WPS)
[ ] Flagged at least 3 mismatches or risks between frontend and backend assumptions
[ ] Classified every major requirement as Confirmed / Inferred / Recommended

After writing it:

- reread it
- verify every checklist item above is satisfied
- improve missing details
- ensure it is grounded in actual files

Then output the PHASE SUMMARY block.

==================================================
PHASE 2 — BACKEND SPECIFICATION
==================================================

Before starting: re-read frontend/FRONTEND_ANALYSIS.md and its PHASE SUMMARY.

Create:
backend/BACKEND_SPECIFICATION.md

This must be a rewritten and improved backend spec for the finalized Node/Express/Prisma stack.

It must include:

1. System overview
2. Scope and MVP recommendation
3. Module map
4. Backend architecture
5. Folder structure
6. Coding conventions
7. API design rules
8. Response format standard
9. Error format standard
10. Auth strategy
11. Refresh token strategy
12. Role/permission strategy
13. Tenant strategy in application layer
14. Validation strategy with Zod
15. Logging strategy with Winston + Morgan
16. Queue strategy with BullMQ
17. Realtime strategy with Socket.io
18. Swagger/OpenAPI strategy
19. Testing strategy
20. Deployment/environment strategy
21. Recommended implementation order
22. Risks and assumptions
23. Confirmed vs inferred vs recommended sections

Important:

- improve the old backend assumptions from frontend/PROJECT_SPEC.md
- translate them from ASP.NET style to Node/Express style
- stay aligned with frontend and business rules
- keep it MVP-first and practical

After writing it:

- reread it
- verify it against frontend/FRONTEND_ANALYSIS.md and frontend/PROJECT_SPEC.md
- improve it again

Then output the PHASE SUMMARY block.

==================================================
PHASE 3 — DATABASE SPECIFICATION
==================================================

Before starting: re-read backend/BACKEND_SPECIFICATION.md and its PHASE SUMMARY.

Create:
database/DATABASE_SPECIFICATION.md

This must be a rewritten and improved database/backend-data specification for the finalized stack.

It must include:

1. Database architecture overview
2. Multi-tenant strategy
3. Table/module grouping
4. Core entities
5. Relationship strategy
6. UUID strategy
7. Timestamp strategy
8. Money/numeric strategy
9. Soft delete strategy
10. Audit field strategy
11. JSONB usage strategy
12. Sequence/document number strategy
13. Enum strategy
14. Prisma schema strategy
15. Raw SQL migration strategy where needed
16. Index strategy
17. Unique constraint strategy
18. Tenant-aware uniqueness examples
19. Seed strategy
20. RLS evaluation and recommendation (must follow the guardrails defined above — pick Position A, B, or C explicitly)
21. Backup/recovery environment notes
22. Staging/local/prod DB environment recommendations
23. Risks and tradeoffs
24. Confirmed vs inferred vs recommended sections

Also include:

- recommended initial Prisma model rollout order
- which DB features should be implemented now
- which DB features can come later
- how to adapt the existing database/ SQL folder intelligence to Prisma + PostgreSQL

After writing it:

- reread it
- compare it with database/ SQL files
- improve it again

Then output the PHASE SUMMARY block.

==================================================
PHASE 4 — IMPLEMENTATION PLAN
==================================================

Before starting: re-read all three previous files and their PHASE SUMMARY blocks.

Create:
backend/PLAN.md

The plan must be based on the actual repository analysis and the improved specs.

Do not hardcode generic phases without checking discovery results.

backend/PLAN.md must include:

1. Overview
2. Critical path
3. Recommended MVP-first sequence
4. Foundation phase
5. Database setup phase
6. Auth + tenant foundation phase
7. Shared infrastructure phase
8. Module implementation phases
9. Queue/realtime/reporting/export phases if needed
10. Testing and QA phases
11. Deployment preparation phase
12. Acceptance criteria per phase
13. Verification checklist per phase
14. Definition of done per phase
15. Risks/blockers and mitigation
16. Progress checklist

After writing it:

- reread it
- compare it with backend/BACKEND_SPECIFICATION.md and database/DATABASE_SPECIFICATION.md
- improve it again
- ensure the plan is realistic for iterative implementation

Then output the PHASE SUMMARY block.

==================================================
PHASE 5 — GLOBAL VERIFICATION BEFORE CODING
==================================================

Before writing implementation code, verify all four files together:

- frontend/FRONTEND_ANALYSIS.md
- backend/BACKEND_SPECIFICATION.md
- database/DATABASE_SPECIFICATION.md
- backend/PLAN.md

Verify:

1. stack consistency — no package conflicts or contradictions
2. frontend alignment — every frontend module has a backend counterpart
3. business rule coverage — VAT, EOSB, WPS, TRN, aging buckets all addressed
4. tenant isolation correctness — tenantId enforced at every layer
5. database practicality — Prisma schema matches business entities
6. financial correctness approach — decimal.js used, no floats
7. realistic MVP scope — not overengineered for phase 1
8. implementation order sanity — foundation before features
9. no contradictory assumptions across the four files
10. no unnecessary overengineering in early phases

If inconsistencies are found:

- fix the specs first
- then fix the plan
- document every fix made

Output a final verification summary:

---

GLOBAL VERIFICATION SUMMARY
Inconsistencies found: [number]
Inconsistencies fixed: [list each one]
Specs status: [READY / NEEDS REVISION]
Plan status: [READY / NEEDS REVISION]
Cleared to begin implementation: [YES / NO]

---

Only proceed to Phase 6 if "Cleared to begin implementation: YES".

==================================================
PHASE 6 — IMPLEMENTATION RULES
==================================================

Only after the specs and plan are complete, verified, and cleared:

- re-read backend/PLAN.md at the start of every implementation session
- implement step by step following backend/PLAN.md
- keep changes modular and small
- verify after every phase
- write tests for important flows
- do not skip auth, tenant enforcement, validation, and shared foundations

For each implementation phase, report:

---

IMPLEMENTATION REPORT
Phase: [name]
Implemented: [what was built]
Why: [reason / spec reference]
Files added: [list]
Files changed: [list]
Verified by: [how it was tested or checked]
Assumptions or deviations: [any, or "none"]
Next: [what comes next per backend/PLAN.md]

---

==================================================
QUALITY RULES
==================================================

- strict TypeScript
- avoid any
- no fake endpoints
- no silent assumptions
- no hardcoded tenant trust
- no money logic with floats
- no random module generation not grounded in analysis
- no replacing finalized packages casually
- no rushing into late modules before foundation is stable
- no phase summary skipped
- no implementation started without global verification clearance

==================================================
START NOW
==================================================

Start with PHASE 1 only.

Inspect:

- frontend/PROJECT_SPEC.md
- database/ folder
- frontend/src/features/
- frontend/src/data/
- frontend/src/types/
- frontend/src/lib/validations.ts
- auth/routing/layout related files

Then create:
frontend/FRONTEND_ANALYSIS.md

Satisfy every item in the minimum coverage checklist before considering it complete.
After completing it, improve it.
Then output the PHASE SUMMARY block.

Then proceed to PHASE 2 only after the PHASE SUMMARY is written.
Then PHASE 3. Then PHASE 4. Then PHASE 5 verification. Then implementation.

Do not skip steps.
Do not merge phases.
Do not begin coding before Phase 5 clearance.
