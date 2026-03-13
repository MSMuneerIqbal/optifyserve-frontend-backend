You are a senior technical auditor.

Your job is to audit this repository and produce a structured audit report only.

Create exactly one file:

CHANGE.md

Do not modify any existing files.
Do not generate any code.
Do not fix anything.
Do not refactor anything.
Do not rewrite specifications.
Do not create any files other than CHANGE.md.

Your task is strictly to analyze the repository and report findings.

==================================================
STEP 1 — VERIFY REPOSITORY STRUCTURE
==================================================

Before starting the audit, inspect the repository structure.

Expected structure:

root/
├── frontend/
│ ├── PROJECT_SPEC.md
│ ├── FRONTEND_ANALYSIS.md
│ └── src/
│ ├── features/
│ ├── data/
│ ├── types/
│ └── lib/validations.ts
│
├── backend/
│ ├── BACKEND_SPECIFICATION.md
│ └── PLAN.md
│
├── database/
│ ├── DATABASE_SPECIFICATION.md
│ └── \*.sql
│
└── README.md

If the actual repository structure differs from this:

- report the mismatch as CRITICAL-0
- continue auditing using the actual structure

==================================================
STEP 2 — READ ALL SOURCES OF TRUTH
==================================================

Read the following files in this exact order.

1. README.md
2. frontend/PROJECT_SPEC.md
3. frontend/FRONTEND_ANALYSIS.md
4. backend/BACKEND_SPECIFICATION.md
5. database/DATABASE_SPECIFICATION.md
6. backend/PLAN.md
7. database/ (all SQL files)
8. frontend/src/features/
9. frontend/src/data/
10. frontend/src/types/
11. frontend/src/lib/validations.ts

Rules:

- Do not rely on memory.
- Do not rely on assumptions.
- Only trust actual repository files.

Note:

README.md is a **secondary reference only**.

If README.md conflicts with the finalized stack or specifications,
treat README.md as outdated and report it.

==================================================
FINALIZED STACK — AUDIT AGAINST THIS EXACTLY
==================================================

Backend stack must be:

Node.js  
TypeScript (strict)  
Express.js  
Prisma ORM  
PostgreSQL 16

Auth & Security:

JWT (access + refresh tokens)  
bcryptjs  
Helmet  
express-rate-limit

Validation:

Zod

Financial calculations:

decimal.js  
Floating-point money calculations are forbidden.

Date handling:

dayjs

File generation:

ExcelJS  
Puppeteer

Email:

Nodemailer

Background jobs:

BullMQ  
Redis

Realtime:

Socket.io

Logging:

Winston  
Morgan

Documentation:

Swagger / OpenAPI

Testing:

Jest  
Supertest

Deployment:

Local: Docker (PostgreSQL + Redis)  
Staging: Railway  
Production: Azure

==================================================
CRITICAL ERROR RULES
==================================================

Flag as CRITICAL if any of these appear:

• References to ASP.NET Core  
• References to Dapper  
• References to EF Core  
• References to .NET / C# architecture  
• Floating-point money calculations  
• Missing tenantId isolation  
• Specs contradicting the finalized Node/Express/Prisma stack

If historical references to ASP.NET appear in changelogs or legacy notes,
do NOT mark them critical unless they imply the current backend uses ASP.NET.

==================================================
AUDIT SCOPE
==================================================

Audit the following areas.

SECTION 1 — STACK CONSISTENCY

Verify:

• Backend stack is Node.js + Express + Prisma everywhere  
• No remaining ASP.NET / Dapper / EF Core assumptions  
• README.md does not contradict the stack  
• All required packages appear where relevant

SECTION 2 — FRONTEND ↔ BACKEND ALIGNMENT

Verify:

• Every frontend module has a backend counterpart  
• All 14 modules are covered:

Auth  
Dashboard  
CRM  
Sales  
Inventory  
Purchase  
Accounts  
HR  
Jobs  
Dispatcher  
User Management  
Platform Admin  
Audit  
Settings

Verify:

• All frontend routes are supported by API contracts  
• Enum values in frontend types match database enums  
• Entities in src/data and src/types appear in backend specs

SECTION 3 — DATABASE ALIGNMENT

Compare:

DATABASE_SPECIFICATION.md  
vs  
actual SQL files in database/

Verify:

• ~84 tables accounted for  
• ~90 enums accounted for  
• UUID primary keys used consistently  
• NUMERIC(15,2) used for money  
• TIMESTAMPTZ used for timestamps  
• tenant_id exists on business tables  
• sequence_counters strategy documented  
• indexes (~200) acknowledged  
• triggers (~20+) acknowledged  
• Prisma strategy realistically supports PostgreSQL schema

SECTION 4 — MULTI-TENANCY CORRECTNESS

Verify:

• tenantId enforced in middleware → repository → query layers  
• tenantId is never trusted from request payload  
• tenant-aware unique constraints documented  
• platform admin is separated from tenant admin

SECTION 5 — FINANCIAL CORRECTNESS

Verify:

• decimal.js mandated for money  
• floating point explicitly forbidden  
• VAT flows defined correctly  
• partial payments supported  
• AR/AP aging defined  
• EOSB formula correct  
• payroll references WPS compliance

SECTION 6 — UAE-SPECIFIC REQUIREMENTS

Verify:

• All 7 emirates present  
• TRN 15-digit validation defined  
• AED formatting specified  
• Ramadan shifts supported  
• UAE leave types included  
• UAE phone validation documented

SECTION 7 — SECURITY & AUTH

Verify:

• JWT access token 15 min  
• refresh token 7 days  
• bcryptjs password hashing  
• 71 permission RBAC system  
• 5 role hierarchy  
• audit logging defined  
• rate limiting defined  
• helmet security headers defined

SECTION 8 — REALTIME & BACKGROUND JOBS

Verify:

• Socket.io used for dispatcher  
• BullMQ + Redis used for queues  
• queue use cases identified

SECTION 9 — PLAN.md QUALITY

Verify:

• realistic MVP-first implementation order  
• correct dependency order  
• foundation → auth → tenant → modules  
• acceptance criteria per phase  
• verification checklist per phase  
• definition of done per phase

SECTION 10 — DOCUMENTATION CONSISTENCY

Verify:

FRONTEND_ANALYSIS.md  
BACKEND_SPECIFICATION.md  
DATABASE_SPECIFICATION.md  
PLAN.md

Confirm:

• no contradictions  
• naming consistency  
• module coverage  
• database coverage

==================================================
OUTPUT FORMAT
==================================================

Create one file:

CHANGE.md

Follow this exact structure.

---

OPTIFYSERVE — TECHNICAL AUDIT REPORT  
Audited against: BACKEND_SPECIFICATION.md, DATABASE_SPECIFICATION.md, PLAN.md, FRONTEND_ANALYSIS.md  
Date: [today]

---

## AUDIT SUMMARY

| Category                     | Status | Critical | Warnings | OK  |
| ---------------------------- | ------ | -------- | -------- | --- |
| Stack Consistency            |        |          |          |     |
| Frontend ↔ Backend Alignment |        |          |          |     |
| Database Alignment           |        |          |          |     |
| Multi-Tenancy Correctness    |        |          |          |     |
| Financial Correctness        |        |          |          |     |
| UAE Requirements             |        |          |          |     |
| Security & Auth              |        |          |          |     |
| Realtime & Background Jobs   |        |          |          |     |
| Plan Quality                 |        |          |          |     |
| Documentation Consistency    |        |          |          |     |
| TOTAL                        |        |          |          |     |

Status values:

✅ PASS  
⚠️ WARNINGS  
❌ CRITICAL

---

## SECTION FINDINGS

Report findings for each section.

---

## CRITICAL ISSUES

Format:

CRITICAL-[N]

Found in: [file + section]

Issue: description

Impact: why it breaks implementation

Fix required: what must change

---

## WARNINGS

Format:

WARN-[N]

Found in: file

Issue: description

Risk: what could go wrong later

Recommendation: suggested improvement

---

## GAPS

Format:

GAP-[N]

Frontend evidence: file

Missing from: spec file

Required for: module or feature

---

## CONFIRMED CORRECT

List components that are correctly aligned across:

Frontend  
Backend spec  
Database spec  
Plan

---

## RECOMMENDED IMPROVEMENTS

Optional improvements that would strengthen the architecture.

---

## AUDIT VERDICT

Overall status:

READY TO IMPLEMENT  
or  
NEEDS FIXES BEFORE IMPLEMENTATION

List:

Critical issues count  
Warnings count  
Gaps count  
Confirmed correct items

If critical issues exist:

Implementation must not start until CRITICAL items are resolved.

==================================================
AUDIT RULES
==================================================

• Do not change any files  
• Do not generate code  
• Do not modify specifications  
• Only produce CHANGE.md  
• Only report findings that are supported by actual repository files  
• Reference exact files and sections for every finding  
• Do not invent issues  
• Classify every finding as CRITICAL, WARNING, or GAP
