# OptifyServe ERP — SaaS Platform for UAE Service Companies

> Multi-tenant SaaS ERP for maintenance, cleaning, pest control, HVAC, plumbing, electrical, and facilities management companies operating in the UAE.

**Live Demo**: [app.optifyserve.com](https://app.optifyserve.com) (click Sign In to enter, or visit [/signup](https://app.optifyserve.com/signup) for the registration flow)

---

## At a Glance

| Stat | Value |
|------|-------|
| Modules | 14 |
| Frontend Pages | 50 |
| Feature Components | 152 |
| Shared / UI / Layout Components | 15 / 27 / 6 |
| Translation Keys | 3,580 per language (EN + AR with RTL) |
| Translation Namespaces | 18 |
| Theme Presets | 4 (UAE Premium, Corporate Navy, Modern Teal, OptifyServe) |
| Database Tables | ~84 with RLS |
| Database Enums | ~90 (kebab-case) |
| Database Indexes | 235 |
| Database Triggers | 22 |
| License | Apache 2.0 |

---

## Repository Structure

```
optifyserve-frontend-backend/
├── frontend/                     # React UI Template (complete)
│   ├── src/                      # Application source code
│   │   ├── app/                  # App.tsx (router + providers), protected-route.tsx
│   │   ├── components/           # layout/ (6), shared/ (15), ui/ (27 shadcn)
│   │   ├── contexts/             # auth-context.tsx, currency-context.tsx
│   │   ├── data/                 # 18 static sample data files
│   │   ├── features/             # 14 feature modules (components/ types/ pages/)
│   │   ├── hooks/                # 6 custom hooks
│   │   ├── i18n/                 # i18next config + EN/AR translation files
│   │   ├── lib/                  # utils.ts, constants.ts, validations.ts
│   │   ├── store/                # Redux store (theme system only)
│   │   ├── styles/               # globals.css (CSS variables)
│   │   └── types/                # Shared TypeScript types
│   ├── public/                   # Static assets (logos, favicon)
│   ├── CLAUDE.md                 # AI coding instructions
│   ├── PROJECT_SPEC.md           # Detailed frontend specification
│   └── RESPONSIVE_REQUIREMENTS.md # WCAG 2.2 responsive design spec
├── backend/                      # Node.js + Express + Prisma API (planned)
│   ├── BACKEND_SPECIFICATION.md  # Complete backend architecture spec
│   └── PLAN.md                   # 12-phase implementation plan
├── database/                     # PostgreSQL 16 schema (complete)
│   ├── 00_extensions.sql         # uuid-ossp, pgcrypto, btree_gist, pg_trgm
│   ├── 01_enums.sql              # ~90 custom enum types
│   ├── 02_tenants_and_auth.sql   # 7 tables (tenants, users, roles, sessions)
│   ├── 03_crm.sql                # 6 tables (customers, leads, follow-ups)
│   ├── 04_sales.sql              # 5 tables (quotations, invoices, payments)
│   ├── 05_inventory.sql          # 8 tables (items, warehouses, stock)
│   ├── 06_purchase.sql           # 11 tables (vendors, POs, GRN, returns)
│   ├── 07_accounts.sql           # 14 tables (COA, journals, AR/AP, VAT)
│   ├── 08_hr.sql                 # 14 tables (employees, payroll, leaves)
│   ├── 09_jobs.sql               # 8 tables (jobs, technicians, reports)
│   ├── 10_dispatcher.sql         # 2 tables (locations, assignment logs)
│   ├── 11_settings.sql           # 7 tables + sequence_counters
│   ├── 12_rls_policies.sql       # RLS on ~65 tables
│   ├── 13_indexes.sql            # 235 indexes
│   ├── 14_triggers.sql           # 22 triggers
│   ├── 15_seed.sql               # Permissions, tenant, admin, COA, leave types
│   ├── DATABASE_SPECIFICATION.md # Complete database specification
│   ├── db_knowledge.md           # Node.js + Prisma integration guide
│   ├── LOCAL_SETUP.md            # Docker / native PostgreSQL setup
│   └── README.md                 # Database setup guide
├── LICENSE                       # Apache License 2.0
└── README.md                     # This file
```

---

## Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Frontend** | React 19 + TypeScript 5.9 + Vite 7 | Complete |
| **UI Components** | shadcn/ui + Radix UI + Tailwind CSS 3.4 | Complete |
| **i18n** | react-i18next (English + Arabic with automatic RTL) | Complete |
| **State** | Redux Toolkit + Saga (theme) + React Context (auth, currency) | Complete |
| **Forms** | React Hook Form + Zod validation | Complete |
| **Charts** | Recharts with ResponsiveContainer | Complete |
| **Tables** | TanStack React Table v8 | Complete |
| **Routing** | React Router DOM v7 (lazy-loaded pages) | Complete |
| **Toasts** | Sonner | Complete |
| **Database** | PostgreSQL 16 (schema designed, 16 SQL files) | Complete |
| **Backend** | Node.js + Express.js + Prisma ORM | Planned |
| **Auth (Backend)** | JWT (access + refresh tokens) | Planned |
| **Queue** | BullMQ + Redis | Planned |
| **Real-time** | Socket.io | Planned |

---

## Modules

| # | Module | Route | Pages | Description |
|---|--------|-------|-------|-------------|
| 1 | **Auth** | `/login`, `/signup` | 3 | Split-screen login, multi-step signup with plan selection + 15-day trial, forgot password |
| 2 | **Dashboard** | `/dashboard` | 1 | KPIs, revenue charts, urgent jobs, recent activities |
| 3 | **CRM** | `/crm/*` | 2 | Customers, leads pipeline (5 stages), follow-ups |
| 4 | **Sales** | `/sales/*` | 2 | Quotations, invoices, VAT calculation |
| 5 | **Inventory** | `/inventory/*` | 5 | Items, warehouses, stock levels, movements, reports |
| 6 | **Purchase** | `/purchase/*` | 5 | Vendors, POs, GRN, returns, payments |
| 7 | **Accounts** | `/accounts/*` | 9 | Financial dashboard, COA, journal entries, AR/AP, expenses, VAT, bank reconciliation, reports |
| 8 | **HR** | `/hr/*` | 10 | Employees, departments, attendance, leaves, payroll, EOSB, documents, performance, reports, portal |
| 9 | **Jobs** | `/jobs/*` | 5 | Job cards, technicians, scheduling, service reports, analytics |
| 10 | **Dispatcher** | `/dispatcher` | 1 | Map view, job assignment, technician tracking |
| 11 | **User Management** | `/users/*` | 2 | User accounts, roles & permissions (52 granular permissions) |
| 12 | **Platform Admin** | `/admin/*` | 3 | Tenant management, subscription plans, platform analytics |
| 13 | **Audit** | `/audit` | 1 | Audit log viewer with filters |
| 14 | **Settings** | `/settings/*` | 1 | Company profile, theme customizer, notifications, security |

---

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

- **Login**: Click **Sign In** to enter instantly (no credentials needed in template mode)
- **Signup**: Visit `/signup` for the multi-step registration flow with plan selection and 15-day free trial
- **Dev bypass**: Set `AUTO_LOGIN = true` in `src/contexts/auth-context.tsx` to skip login entirely
- **Language**: Toggle EN/AR with the globe icon in the top nav (Arabic enables full RTL layout)

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Database

PostgreSQL schema files are in `database/`. See [`database/LOCAL_SETUP.md`](database/LOCAL_SETUP.md) for Docker, native, and Neon setup instructions.

```bash
# Docker example
docker run -d --name optifyserve-db -p 5432:5432 \
  -e POSTGRES_DB=optifyserve -e POSTGRES_PASSWORD=yourpassword \
  postgres:16

# Apply schema (in order)
cd database
psql -U postgres -d optifyserve -f 00_extensions.sql
psql -U postgres -d optifyserve -f 01_enums.sql
# ... through 15_seed.sql
```

### Backend (Planned)

A Node.js + Express.js + Prisma ORM API will be built in the `backend/` directory. The implementation follows a 12-phase plan documented in [`backend/PLAN.md`](backend/PLAN.md). API endpoint contracts are defined in [`frontend/PROJECT_SPEC.md`](frontend/PROJECT_SPEC.md).

---

## Frontend Architecture

### Current State: Complete UI Template

- **Pure UI template** — all 50 pages use static sample data from `src/data/` (18 files), no API calls
- **Auth**: React Context (`src/contexts/auth-context.tsx`) — login, register, logout with localStorage persistence
- **Theme**: 4 presets (UAE Premium, Corporate Navy, Modern Teal, OptifyServe) + full color customizer with 8 color pickers
- **i18n**: 3,580 keys per language across 18 namespaces with automatic RTL layout mirroring
- **Routing**: All 50 pages lazy-loaded with `React.lazy()` for code splitting
- **Responsive**: Mobile-first (375px+), tested at 7 breakpoints, WCAG 2.2 Level AA compliant
- **RTL**: Full Arabic support using Tailwind logical properties (`ms-*`, `me-*`, `start-*`, `end-*`)

### Key Patterns

```typescript
// Auth — React Context (not Redux)
const { user, isAuthenticated, login, register, logout } = useAuth()

// i18n — always use t() for UI strings
const { t } = useTranslation()
t('crm.customerName')

// Data — static sample files (no API calls)
import { sampleCustomers } from '@/data/customers.data'

// Theme — CSS variables (never hardcoded colors)
<div className="bg-primary text-primary-foreground" />  // correct
<div className="bg-indigo-600" />                        // wrong
```

### Future: Backend Integration

When the Node.js/Express backend is ready:
1. Install HTTP client (`axios`)
2. Create API service files per feature module
3. Add Redux slices + sagas for async data
4. Replace static data imports with API calls
5. Add loading/error states

---

## Database Schema

| Module | Tables | Key Tables |
|--------|--------|------------|
| Auth | 7 | tenants, users, roles, permissions, user_sessions |
| CRM | 6 | customers, leads, follow_ups, customer_contacts |
| Sales | 5 | quotations, invoices, invoice_items, invoice_payments |
| Inventory | 8 | items, warehouses, stock_levels, stock_movements |
| Purchase | 11 | vendors, purchase_orders, goods_received_notes, vendor_payments |
| Accounts | 14 | chart_of_accounts, journal_entries, expenses, vat_returns |
| HR | 14 | employees, attendance_records, leave_requests, payroll_runs, eosb_records |
| Jobs | 8 | jobs, technicians, service_reports, customer_feedbacks |
| Dispatcher | 2 | technician_locations, job_assignment_logs |
| Settings | 8 | company_profiles, audit_logs, sequence_counters |

**Key patterns**: UUID primary keys, `NUMERIC(15,2)` for money, `TIMESTAMPTZ` for dates, `tenant_id` on every business table, RLS policies on ~65 tables, 235 indexes, 22 triggers, all enums in kebab-case.

For setup guide and Node.js integration, see [`database/db_knowledge.md`](database/db_knowledge.md).

---

## Backend Specification

The backend architecture is fully specified and ready for implementation:

- **Architecture**: RESTful API, modular monolith (feature-based folders)
- **Stack**: Node.js + TypeScript (strict) + Express.js + Prisma ORM
- **Auth**: JWT access tokens (15min) + refresh tokens (7d) + RBAC (52 permissions)
- **Queue**: BullMQ + Redis for async jobs (email, PDF generation, reports)
- **Real-time**: Socket.io for dispatcher and notifications
- **Financial**: `decimal.js` for all money operations (never floating point)
- **Multi-tenancy**: `tenantId` enforced at every layer from day one
- **Implementation**: 12-phase plan (~12 weeks) documented in [`backend/PLAN.md`](backend/PLAN.md)

Full specification: [`backend/BACKEND_SPECIFICATION.md`](backend/BACKEND_SPECIFICATION.md)

---

## UAE-Specific Compliance

| Area | Details |
|------|---------|
| **VAT** | 5% standard rate, zero-rated, exempt (FTA format) |
| **TRN** | 15-digit Tax Registration Number validation (XXX-XXXXXX-XXXXX) |
| **Currency** | AED (UAE Dirham) — formatted as `AED 1,234.56` |
| **Labor Law** | 30d annual leave, 90d sick leave, EOSB gratuity calculation |
| **WPS** | Wage Protection System payroll compliance |
| **Emirates** | Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah |
| **Work Week** | Sun-Thu, Ramadan reduced hours support |
| **Phone** | +971 XX XXX XXXX format with validation |
| **Bilingual** | English + Arabic with automatic RTL layout mirroring |

---

## System Architecture

```
┌─────────────┐       HTTPS       ┌──────────────────────────────┐
│ Web Browser │ ◄───────────────► │ React Frontend (Vite 7)      │
│ Mobile/Tab  │                   │ 50 pages, shadcn/ui          │
│ Desktop     │                   │ i18n (EN/AR), RTL            │
└─────────────┘                   │ Lazy-loaded, responsive      │
                                  └─────────────┬────────────────┘
                                                │ REST API (JSON)
                                                ▼
                                  ┌──────────────────────────────┐
                                  │ Node.js + Express.js         │
                                  │ JWT Auth, RBAC (52 perms)    │
                                  │ BullMQ + Redis (queues)      │
                                  │ Socket.io (real-time)        │
                                  └─────────────┬────────────────┘
                                                │ Prisma ORM
                                                ▼
                                  ┌──────────────────────────────┐
                                  │ PostgreSQL 16                │
                                  │ ~84 tables, ~90 enums        │
                                  │ RLS multi-tenant isolation   │
                                  │ 235 indexes, 22 triggers     │
                                  └──────────────────────────────┘
```

---

## Security

| Layer | Mechanism |
|-------|-----------|
| **Multi-tenancy** | Row-Level Security (RLS) on ~65 business tables |
| **Authentication** | JWT access tokens (15min) + refresh tokens (7d) |
| **Authorization** | Role-Based Access Control — 52 granular permissions |
| **Data Isolation** | `tenant_id` on every business table |
| **Passwords** | bcrypt hashing |
| **Audit** | Full audit logging with user, action, timestamp, IP |
| **Frontend** | WCAG 2.2 Level AA, no XSS vectors, CSP-ready |

---

## Verified & Tested

The frontend has been comprehensively tested (129 tests, all passing) covering:

- **Utility functions** — currency formatting, phone/TRN validation, initials, truncation
- **Constants** — all 7 UAE emirates, emirate codes, customer types
- **Zod schemas** — email, phone, TRN, password, login, signup, subscription plans
- **i18n parity** — EN/AR key count match, all 18 namespaces present, no empty values
- **Sample data** — all 18 data files load with required fields
- **Module exports** — all 14 feature modules export correctly
- **Redux store** — theme slice, colors, customization state
- **Shared components** — all 15 shared components export correctly
- **Custom hooks** — all 6 hooks export correctly
- **Theme system** — presets, default colors, slice actions
- **Production build** — 0 TypeScript errors, successful Vite build

---

## Brand

| | |
|---|---|
| **Product** | OptifyServe ERP |
| **Legal Entity** | OptifyServe Technical Services LLC |
| **Domain** | [optifyserve.com](https://optifyserve.com) |
| **App** | [app.optifyserve.com](https://app.optifyserve.com) |
| **Arabic** | أوبتيفاي سيرف |

---

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.
