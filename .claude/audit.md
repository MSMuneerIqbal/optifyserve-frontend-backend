Important: Read this entire instruction carefully before doing anything. Follow the order exactly.

You are a senior technical auditor for OptifyServe ERP. You have two jobs in this session:

1. Audit the repository against the finalized specs
2. Create CHANGES.md listing every fix you recommend

Do not make changes to any existing file. Do not fix anything directly. Your only output is the audit report (printed to chat) and one new file: CHANGES.md.

==================================================
SESSION START RULE
==================================================

Before doing anything else, output this line:

"Starting audit. Reading all source files before forming any opinion."

Then read every file listed below. Do not skip any. Do not form opinions before reading.

==================================================
YOUR SOURCES OF TRUTH — READ ALL OF THESE FIRST
==================================================

Read in this order:

1. README.md
2. frontend/PROJECT_SPEC.md
3. frontend/FRONTEND_ANALYSIS.md
4. backend/BACKEND_SPECIFICATION.md
5. database/DATABASE_SPECIFICATION.md
6. backend/PLAN.md
7. database/ — all SQL files (read every one)
8. frontend/src/features/ — all module folders
9. frontend/src/data/ — all static data files
10. frontend/src/types/ — all TypeScript interfaces
11. frontend/src/lib/validations.ts
12. frontend/src/contexts/auth-context.tsx
13. frontend/src/app/App.tsx
14. frontend/src/store/ — all Redux files

If any file does not exist, note it as a gap and continue.

==================================================
FINALIZED STACK — AUDIT AGAINST THIS EXACTLY
==================================================

Backend:

- Node.js
- TypeScript (strict)
- Express.js
- Prisma ORM
- PostgreSQL 16

Auth & Security:

- JWT (access 15min + refresh 7d)
- bcryptjs
- Helmet
- express-rate-limit

Validation:

- Zod

Financial:

- decimal.js (never floating point for money)

Date/Time:

- dayjs

File Generation:

- ExcelJS
- Puppeteer

Email:

- Nodemailer

Background Jobs:

- BullMQ + Redis

Realtime:

- Socket.io

Logging:

- Winston + Morgan

Documentation:

- Swagger / OpenAPI

Testing:

- Jest + Supertest

Deployment:

- Local: Docker (PostgreSQL + Redis)
- Staging: Railway
- Production: Azure

Auto-flag as CRITICAL:

- Any ASP.NET Core / Dapper / EF Core / .NET / C# reference
- Any floating-point money handling
- Any missing tenantId isolation in queries
- Any tenantId trusted from request payload instead of JWT

==================================================
AUDIT SCOPE — 10 SECTIONS
==================================================

SECTION 1 — STACK CONSISTENCY

- Is Node.js + Express + Prisma stated correctly everywhere?
- Any remaining ASP.NET / .NET references in any file?
- Do README, PROJECT_SPEC, BACKEND_SPECIFICATION all agree on stack?
- Are BullMQ, Redis, Socket.io, decimal.js, ExcelJS, Puppeteer, Nodemailer mentioned where relevant?

SECTION 2 — FRONTEND ↔ BACKEND ALIGNMENT

- Does every frontend module have a backend counterpart in backend/BACKEND_SPECIFICATION.md?
- All 14 modules covered: Auth, Dashboard, CRM, Sales, Inventory, Purchase, Accounts, HR, Jobs, Dispatcher, User Management, Platform Admin, Audit, Settings?
- All 49 frontend routes represented in API contracts?
- Do frontend TypeScript enum values match database/DATABASE_SPECIFICATION.md enums?
- Any entity in frontend/src/data/ or frontend/src/types/ missing from backend/BACKEND_SPECIFICATION.md?

SECTION 3 — DATABASE ALIGNMENT

- Does database/DATABASE_SPECIFICATION.md align with the SQL files in frontend/database/?
- All ~84 tables accounted for?
- All ~90 enum types accounted for?
- UUID primary keys used consistently?
- NUMERIC(15,2) for all money columns?
- TIMESTAMPTZ for all timestamps?
- tenant_id on all business tables?
- RLS recommendation explicit (Position A, B, or C — not vague)?
- ~200 indexes and 20+ triggers acknowledged?
- sequence_counters and document numbering strategy addressed?

SECTION 4 — MULTI-TENANCY CORRECTNESS

- Tenant isolation enforced at every layer (middleware → repository → query)?
- Any spec trusting tenantId from payload instead of JWT?
- Tenant-aware unique constraints documented (document numbers, emails, SKUs)?
- Super admin vs tenant admin correctly separated?

SECTION 5 — FINANCIAL CORRECTNESS

- decimal.js mandated for all money in backend/BACKEND_SPECIFICATION.md?
- Floating-point explicitly forbidden?
- VAT (5% standard, zero-rated, exempt, FTA format) covered?
- EOSB: 21d × years (first 5), 30d × years (after 5)?
- Partial payments, AR/AP aging (6 buckets), payroll, WPS covered?
- Discounts, subtotals, totals, outstanding balances all addressed?

SECTION 6 — UAE-SPECIFIC REQUIREMENTS

- All 7 emirates in enums (Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah)?
- TRN 15-digit validation documented?
- AED currency format (AED 1,234.56) specified?
- Work week (Sunday–Thursday) and Ramadan shift support mentioned?
- All 9 UAE leave types in HR spec?
- Phone format (+971 XX XXX XXXX) in validation?

SECTION 7 — SECURITY & AUTH

- JWT access (15min) + refresh (7d) documented?
- bcryptjs for password hashing?
- 71 granular permissions covered?
- 5-role hierarchy: Super Admin, Admin, Manager, Staff, Technician?
- Audit logging for important actions?
- express-rate-limit specified?
- Helmet for HTTP security headers?

SECTION 8 — REALTIME & BACKGROUND JOBS

- Socket.io for dispatcher real-time tracking?
- BullMQ + Redis for background jobs?
- Queue use cases identified (email, PDF, payroll, notifications)?

SECTION 9 — backend/PLAN.md QUALITY

- Realistic MVP-first sequence?
- Foundation → auth → tenant → modules in correct order?
- Acceptance criteria per phase?
- Verification checklist per phase?
- Definition of done per phase?
- References backend/BACKEND_SPECIFICATION.md and database/DATABASE_SPECIFICATION.md?

SECTION 10 — CROSS-DOCUMENT CONSISTENCY

- Do all four spec files agree with each other?
- Any contradictions between any two files?
- Any frontend requirement that no spec addresses?
- Does README correctly reflect current state?

==================================================
PART 1 — AUDIT REPORT (print to chat)
==================================================

Print this report to the chat after completing your file review.

---

OPTIFYSERVE — TECHNICAL AUDIT REPORT
Audited by: Claude
Sources: backend/BACKEND_SPECIFICATION.md, database/DATABASE_SPECIFICATION.md, backend/PLAN.md, frontend/FRONTEND_ANALYSIS.md + all files listed above

---

## AUDIT SUMMARY TABLE

| #   | Section                      | Status | Critical | Warnings | Gaps | OK  |
| --- | ---------------------------- | ------ | -------- | -------- | ---- | --- |
| 1   | Stack Consistency            |        |          |          |      |     |
| 2   | Frontend ↔ Backend Alignment |        |          |          |      |     |
| 3   | Database Alignment           |        |          |          |      |     |
| 4   | Multi-Tenancy Correctness    |        |          |          |      |     |
| 5   | Financial Correctness        |        |          |          |      |     |
| 6   | UAE-Specific Requirements    |        |          |          |      |     |
| 7   | Security & Auth              |        |          |          |      |     |
| 8   | Realtime & Background Jobs   |        |          |          |      |     |
| 9   | Plan Quality                 |        |          |          |      |     |
| 10  | Cross-Document Consistency   |        |          |          |      |     |
|     | **TOTAL**                    |        |          |          |      |     |

Status: ✅ PASS | ⚠️ WARNINGS | ❌ CRITICAL

---

Then print each section with its findings.
Then print all CRITICAL issues.
Then print all WARNINGS.
Then print all GAPS.
Then print CONFIRMED CORRECT items.

Use these formats:

### CRITICAL-[N]: [short title]

- File: [exact filename and section]
- Issue: [what is wrong]
- Impact: [what breaks if not fixed]

### WARN-[N]: [short title]

- File: [exact filename and section]
- Issue: [what is wrong]
- Risk: [what could go wrong later]

### GAP-[N]: [short title]

- Frontend evidence: [which file implies this is needed]
- Missing from: [which spec]
- Needed for: [which module]

End the report with:

---

AUDIT VERDICT
Overall: [READY TO IMPLEMENT / NEEDS FIXES BEFORE IMPLEMENTATION]
Critical: [N] | Warnings: [N] | Gaps: [N] | Confirmed correct: [N]

---

==================================================
PART 2 — CREATE CHANGES.md
==================================================

After printing the audit report, create a new file called CHANGES.md in the root of the repository.

This file must contain every fix you recommend based on the audit findings. It is the single source of truth for what needs to change before implementation begins.

CHANGES.md must follow this exact structure:

---

# OptifyServe — Recommended Changes

> Generated by Claude audit | Based on: backend/BACKEND_SPECIFICATION.md, database/DATABASE_SPECIFICATION.md, backend/PLAN.md, frontend/FRONTEND_ANALYSIS.md
> Status: Pending review by Muneer

---

## How to Use This File

- Review each change below
- Mark each as APPROVED ✅ or REJECTED ❌ or DEFERRED ⏳
- Once approved, apply changes to the relevant spec file
- Do not begin implementation until all CRITICAL changes are resolved

---

## CRITICAL CHANGES (must fix before implementation)

For each critical issue found, add an entry:

### CHANGE-[N] — [short title]

**Priority**: CRITICAL
**Status**: Pending
**Affects file**: [exact filename]
**Section**: [exact section name or line reference]
**What is wrong**:
[clear description of the problem]
**What to change**:
[exact text to remove or add — be specific enough that it can be applied without ambiguity]
**Why it matters**:
[what breaks or risks occur if this is not fixed]

---

## WARNING CHANGES (fix before or shortly after implementation starts)

For each warning found:

### CHANGE-[N] — [short title]

**Priority**: WARNING
**Status**: Pending
**Affects file**: [exact filename]
**Section**: [exact section name]
**What is wrong**:
[description]
**What to change**:
[specific recommendation]
**Risk if deferred**:
[what could go wrong]

---

## GAP CHANGES (missing spec coverage — add before implementing the relevant module)

For each gap found:

### CHANGE-[N] — [short title]

**Priority**: GAP
**Status**: Pending
**Affects file**: [which spec file needs to be updated]
**Frontend evidence**: [which frontend file implies this is needed]
**What to add**:
[what section or content needs to be added to the spec]
**Needed before implementing**: [module name]

---

## RECOMMENDED IMPROVEMENTS (optional — beneficial but not blocking)

For each optional improvement:

### CHANGE-[N] — [short title]

**Priority**: RECOMMENDED
**Status**: Pending
**Affects file**: [filename]
**What to improve**:
[description]
**Benefit**:
[why this would help]

---

## CHANGES SUMMARY

| ID       | Title | Priority | File | Status  |
| -------- | ----- | -------- | ---- | ------- |
| CHANGE-1 | ...   | CRITICAL | ...  | Pending |
| CHANGE-2 | ...   | WARNING  | ...  | Pending |
| ...      |       |          |      |         |

**Total changes**: [N]
**Critical**: [N]
**Warnings**: [N]
**Gaps**: [N]
**Recommended**: [N]

---

## SIGN-OFF

- [ ] All CRITICAL changes resolved
- [ ] All WARNING changes reviewed
- [ ] All GAP changes scheduled
- [ ] Muneer approved to begin implementation

==================================================
RULES FOR CHANGES.md
==================================================

- Every finding from the audit report must appear as a CHANGE entry
- Do not add changes that are not grounded in the audit findings
- Be specific enough that each change can be applied by someone who did not read the audit
- Do not rewrite entire spec files — describe targeted changes only
- Number changes sequentially starting from CHANGE-1
- The summary table at the end must match all entries above it

==================================================
COMPLETION
==================================================

After creating CHANGES.md, output this final line:

"Audit complete. Report printed above. CHANGES.md created with [N] total recommended changes ([N] critical, [N] warnings, [N] gaps, [N] recommended). Ready for Muneer review."
