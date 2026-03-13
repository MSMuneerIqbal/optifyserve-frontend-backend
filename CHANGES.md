# OptifyServe — Consolidated Audit Changes

> Merged from: CHANGE.md (technical audit) + CHANGES.md (doc audit)
> All claims verified against actual source code on 2026-03-13
> Canonical SQL counts: 84 tables, 93 enums, 263 RLS policies (81 tables), 235 indexes, 22 triggers, 52 permissions

---

## CRITICAL (must fix before implementation)

### C-1 — ASP.NET references in 7 documentation files

**Files**: `frontend/PROJECT_SPEC.md`, `frontend/CLAUDE.md`, `database/README.md`, `database/LOCAL_SETUP.md`, `database/db_knowledge.md`, `frontend/README.md`, `README.md` (paths)
**Issue**: Repository files still specify ASP.NET Core + Dapper/EF Core as backend, contradicting finalized Node.js + Express + Prisma stack.
**Fix**: Replace all ASP.NET/Dapper/EF Core references with Node.js/Express/Prisma. `db_knowledge.md` requires full rewrite (~1,100 lines).
**Status**: APPLYING

---

### C-2 — Float math in 5 financial calculators

**Files**: `frontend/src/features/accounts/utils/accounting-calculator.ts`, `accounts/utils/vat-calculator.ts`, `sales/hooks/use-vat-calculator.ts`, `hr/utils/payroll-calculator.ts`, `hr/utils/eosb-calculator.ts`
**Issue**: 55 violations — `Math.round(x * 100) / 100`, float accumulation, unrounded intermediates. Violates `decimal.js` mandate.
**Fix**: Add `// DISPLAY-ONLY` header comment to each file. Full migration to `decimal.js` deferred to backend integration phase.
**Status**: APPLYING

---

### C-3 — Permission format inconsistency (`:` vs `.`)

**Files**: `database/15_seed.sql` (colon: `dashboard:view`), `backend/BACKEND_SPECIFICATION.md` + `frontend/src/data/users.data.ts` (dot: `dashboard.view`)
**Issue**: Seed SQL uses colon separator, backend spec and frontend use dot separator.
**Fix**: Normalize seed SQL to dot format (`dashboard.view`) — 2:1 majority favors dot.
**Status**: APPLYING

---

### C-4 — `super_admin` role missing from DB enum

**Files**: `frontend/src/features/auth/types/auth.types.ts` (has `super_admin`), `frontend/src/contexts/auth-context.tsx` (uses `super_admin`), `database/01_enums.sql` (only 4 roles)
**Issue**: Frontend assumes 5-role hierarchy but DB enum has only `admin`, `manager`, `staff`, `technician`.
**Fix**: Add `'super-admin'` to `user_role` enum in `01_enums.sql` (kebab-case per convention). Update frontend to use `'super-admin'` instead of `'super_admin'`.
**Status**: APPLYING

---

### C-5 — README.md paths point to `frontend/database/` instead of `database/`

**File**: `README.md` (root)
**Issue**: 5 references to `frontend/database/` — the database dir was moved to repo root but README not updated.
**Fix**: Replace all `frontend/database/` with `database/`.
**Status**: APPLYING

---

## WARNING (fix before or shortly after implementation)

### W-1 — Stale infrastructure counts in documentation

**Files**: `frontend/FRONTEND_ANALYSIS.md`, `database/DATABASE_SPECIFICATION.md`, `frontend/PROJECT_SPEC.md`, `README.md`, `backend/PLAN.md`
**Issue**: Published counts differ from actual SQL — RLS: ~550 (actual 263), indexes: ~182/~200 (actual 235), triggers: 16+/20+ (actual 22).
**Fix**: Update all files to canonical counts.
**Status**: APPLYING

---

### W-2 — RBAC permission count 71 vs actual 52

**Files**: `README.md` (lines 188, 277), `frontend/PROJECT_SPEC.md` (line 765)
**Issue**: Docs claim 71 permissions but `database/15_seed.sql` seeds exactly 52.
**Fix**: Change 71 to 52 in all locations.
**Status**: APPLYING

---

### W-3 — Frontend enum values differ from DB enums

**Files**: Multiple frontend type files vs `database/01_enums.sql`
**Issue (verified)**:
- Payment method: frontend `card` vs DB `credit-card`
- Stock movement: frontend missing `return`, `consumption` (DB has 6, frontend has 4)
- Leave types: frontend `bereavement` vs DB `compassionate`; frontend missing `study`; leave duration format differs (`full_day` vs `full-day`)
- PO status: frontend adds `rejected`, `confirmed` (DB has 8, frontend has 10)
- GRN status: completely different values (`accepted`/`partially-accepted`/`rejected` vs `completed`/`partial`)
- Vendor payment: frontend `bounced` vs DB `failed`; frontend missing `processing`
**Fix**: Align frontend types to match DB enums exactly.
**Status**: APPLYING

---

### W-4 — Child tables without direct `tenant_id`

**Files**: `database/04_sales.sql`, `database/07_accounts.sql`, `database/09_jobs.sql`, `database/11_settings.sql`, etc.
**Issue**: ~21 child tables (invoice_items, journal_lines, job_technicians, etc.) lack direct `tenant_id`, relying on parent joins.
**Fix**: DEFERRED — architectural decision needed. Document as known pattern.
**Status**: DEFERRED

---

### W-5 — TaxConfiguration model missing from SQL

**File**: `backend/PLAN.md` Phase 5 introduces `TaxConfiguration` model; no table in SQL.
**Issue**: Tax config stored in `company_profiles.settings` JSONB, not standalone table.
**Fix**: DEFERRED — clarify in PLAN.md that tax config uses JSONB, not standalone table.
**Status**: DEFERRED

---

### W-6 — Permission header inconsistency in FRONTEND_ANALYSIS.md

**File**: `frontend/FRONTEND_ANALYSIS.md`
**Issue**: Header says "30+ permissions" but DB has 52 and frontend groups 32.
**Fix**: Update header to reflect both counts.
**Status**: APPLYING

---

## GAP (missing API contracts — cannot fix without backend decisions)

### G-1 — Platform Admin API endpoints not specified
### G-2 — Dashboard aggregation API contract missing
### G-3 — Settings module API scope incomplete (only company/branches/tax in Phase 5)
### G-4 — User Management, Audit, Dispatcher API contracts deferred

**Status**: All DEFERRED to backend implementation phases.

---

## RECOMMENDED

### R-1 — Fix snake_case enum keys in service-report.types.ts
**Fix**: `ac_repair` → `ac-repair`, `plumbing` → `plumbing-repair`, `electrical` → `electrical-repair`
**Status**: APPLYING

### R-2 — Fix snake_case filter in job-list.tsx
**Fix**: `value="in_progress"` → `value="in-progress"`
**Status**: APPLYING

### R-3 — Add Prisma connection examples to LOCAL_SETUP.md
**Status**: APPLYING (with C-1 ASP.NET fix)

---

## SUMMARY

| Priority | Total | Applying | Deferred |
|----------|-------|----------|----------|
| CRITICAL | 5 | 5 | 0 |
| WARNING | 6 | 4 | 2 |
| GAP | 4 | 0 | 4 |
| RECOMMENDED | 3 | 3 | 0 |
| **TOTAL** | **18** | **12** | **6** |
