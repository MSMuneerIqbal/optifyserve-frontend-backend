# CLAUDE CODE INSTRUCTIONS — OptifyServe ERP

## Project Overview

**OptifyServe ERP** — Multi-tenant SaaS ERP for UAE service & maintenance companies.

This is a monorepo with three directories:

| Directory | Purpose | Status |
|-----------|---------|--------|
| `frontend/` | React 19 + TypeScript + Vite 7 UI template | **Complete** |
| `backend/` | Node.js + Express.js + Prisma API | **Planned** |
| `database/` | PostgreSQL 16 schema (16 SQL files) | **Complete** |

---

## Directory-Specific Instructions

### Frontend (`frontend/`)
**Read `frontend/CLAUDE.md`** — it has complete frontend coding rules, patterns, and architecture.

Key facts:
- React 19 + TypeScript 5.9 + Vite 7
- 50 pages, 152 feature components, 15 shared components, 27 shadcn/ui components
- i18n: react-i18next with EN + AR (3,580 keys, 18 namespaces, full RTL)
- Auth: React Context (not Redux) — `useAuth()` for login/register/logout
- Data: Static sample files in `src/data/` — no API calls, no axios
- Theme: Redux Toolkit + Saga (theme system only, 1 slice)
- Forms: React Hook Form + Zod
- Colors: CSS variables only — never hardcode `bg-indigo-600` etc.
- RTL: Tailwind logical properties only — `ms-*`/`me-*`/`start-*`/`end-*`, never `ml-*`/`mr-*`/`left-*`/`right-*`
- Responsive: Mobile-first, WCAG 2.2 Level AA — see `frontend/RESPONSIVE_REQUIREMENTS.md`
- Deployed at: `app.optifyserve.com` (Vercel)

### Backend (`backend/`)
**Read `backend/BACKEND_SPECIFICATION.md`** for architecture and API design.
**Read `backend/PLAN.md`** for the 12-phase implementation plan.

Key facts:
- Node.js + TypeScript (strict mode, no `any`)
- Express.js with modular router structure
- Prisma ORM with PostgreSQL 16
- JWT auth: access tokens (15min) + refresh tokens (7d)
- RBAC: 52 granular permissions
- BullMQ + Redis for async jobs
- Socket.io for real-time (dispatcher, notifications)
- `decimal.js` for all money — never floating point
- `tenantId` enforced at every layer
- All enums in kebab-case (matching database)

### Database (`database/`)
**Read `database/DATABASE_SPECIFICATION.md`** for the complete database spec.
**Read `database/db_knowledge.md`** for Node.js + Prisma integration patterns.
**Read `database/LOCAL_SETUP.md`** for PostgreSQL setup (Docker/native/Neon).

Key facts:
- PostgreSQL 16 with ~84 tables, ~90 enums
- 16 SQL files applied in order (00 through 15)
- Row-Level Security (RLS) on ~65 business tables
- 235 indexes, 22 triggers
- UUID primary keys, `NUMERIC(15,2)` for money, `TIMESTAMPTZ` for dates
- All enums use **kebab-case**: `'in-progress'`, `'on-hold'`, `'ac-repair'`
- Never snake_case for enum values

---

## Global Rules

### Code Quality
- **TypeScript strict mode** — no `any` types, ever
- **No console.log** — remove debug logs before finishing
- **No dead code** — no unused imports, no commented-out blocks
- **No inline styles** — use Tailwind CSS classes

### Naming & Conventions
- **Database enums**: kebab-case (`'in-progress'`, `'half-day'`, `'on-leave'`)
- **TypeScript enums**: match database kebab-case values
- **i18n keys**: always add to both `en.json` and `ar.json`
- **RTL**: logical properties only, test both EN and AR layouts
- **File structure**: follow existing patterns in each directory

### UAE-Specific
- **VAT**: 5% standard rate, zero-rated, exempt
- **TRN**: 15-digit Tax Registration Number (XXX-XXXXXX-XXXXX)
- **Currency**: AED — format as `AED 1,234.56`, use `NUMERIC(15,2)` in DB
- **Phone**: +971 XX XXX XXXX
- **Emirates**: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah
- **Labor Law**: 30 days annual leave, EOSB gratuity (21d/yr first 5 years, 30d/yr after)
- **Work Week**: Sun-Thu, Ramadan reduced hours

### Brand
- **Product**: OptifyServe / OptifyServe ERP
- **Legal entity**: OptifyServe Technical Services LLC
- **Domain**: optifyserve.com
- **App**: app.optifyserve.com
- **Arabic**: أوبتيفاي سيرف

---

## Working Across Directories

When making changes that span frontend and backend:
1. Check `frontend/PROJECT_SPEC.md` for API endpoint contracts
2. Ensure TypeScript types match between frontend and backend
3. Verify enum values match database definitions in `database/01_enums.sql`
4. Test i18n changes in both EN and AR

### Windows Dev Environment
- Use quoted paths: `"E:\optifyserve-frontend-backend\frontend"`
- Frontend build: `cd "E:\optifyserve-frontend-backend\frontend" && npm run build`
- Node.js `-e` fails with backslashes on Windows — use Python instead
