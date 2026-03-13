# OptifyServe ERP — UI Template

A production-ready **React + TypeScript** UI template for a multi-tenant ERP system designed for UAE service & maintenance companies. Built with modern tooling, full bilingual support (English + Arabic with RTL), and a comprehensive component library — ready for backend integration.

> Think of this as a **ThemeForest-quality** admin template, purpose-built for UAE business operations.

---

## Preview

| Module | Pages | Description |
|--------|-------|-------------|
| **Auth** | Login, Forgot Password | Split-screen login with branding panel |
| **Dashboard** | Overview | KPI cards, revenue charts, recent activities |
| **CRM** | Customers, Leads | Customer management, lead pipeline (5 stages) |
| **Sales** | Quotations, Invoices | Quote-to-invoice flow, VAT calculations |
| **Inventory** | Items, Warehouses, Stock, Movements, Reports | Full warehouse management |
| **Purchase** | Vendors, POs, GRN, Returns, Payments | Procurement lifecycle |
| **Accounts** | COA, Journal Entries, AR, AP, Expenses, Financial Dashboard, Reports, Bank Reconciliation, VAT | Complete accounting suite |
| **HR** | Employees, Departments, Attendance, Leaves, Documents, Payroll, Performance, EOSB, Reports, Portal | Full HR management |
| **Jobs** | Job Cards, Technicians, Scheduling, Service Reports, Reports | Field service management |
| **Dispatcher** | Map View | Real-time technician dispatch |
| **User Management** | Users, Roles | User accounts & permissions |
| **Platform Admin** | Tenants, Plans, Analytics | Super admin platform management |
| **Audit** | Audit Logs | Activity logging & compliance |
| **Settings** | Company, Notifications, Theme | Tenant-level configuration |

**49 pages** | **148 feature components** | **27 shadcn/ui components** | **14 shared components** | **2,299 translation keys** | **EN + AR (RTL)**

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **UI Components** | shadcn/ui + Radix UI primitives |
| **Styling** | Tailwind CSS 3.4 |
| **Icons** | Lucide React |
| **i18n** | react-i18next (English + Arabic RTL) |
| **State (Theme)** | Redux Toolkit + Redux Saga |
| **Auth** | React Context (template mode — click Sign In to enter) |
| **Forms** | React Hook Form + Zod validation |
| **Tables** | TanStack React Table v8 |
| **Charts** | Recharts |
| **Routing** | React Router DOM v7 |

---

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd optifyserve-frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Login

**Template mode**: Click **Sign In** to enter the app instantly — no email or password required. The login page is shown for UI display purposes only.

> **Tip for developers**: Set `AUTO_LOGIN = true` in `src/contexts/auth-context.tsx` to bypass the login page entirely during development.

---

## Project Structure

```
src/
├── app/                    # App.tsx (router), protected-route.tsx
├── components/
│   ├── layout/             # AppLayout, Sidebar, Header, Footer (6 files)
│   ├── shared/             # PageHeader, DataTable, StatusBadge, LanguageSwitcher, etc. (12 files)
│   └── ui/                 # shadcn/ui primitives (27 components)
├── contexts/
│   └── auth-context.tsx    # Authentication via React Context
├── data/                   # Static sample data (18 files, UAE-specific)
├── features/               # 14 feature modules
│   ├── auth/               # Login, forgot password
│   ├── dashboard/          # KPI overview
│   ├── crm/                # Customers, leads
│   ├── sales/              # Quotations, invoices
│   ├── inventory/          # Items, warehouses, stock
│   ├── purchase/           # Vendors, POs, GRN
│   ├── accounts/           # Full accounting suite
│   ├── hr/                 # HR management
│   ├── jobs/               # Field service / job cards
│   ├── dispatcher/         # Technician dispatch
│   ├── user-management/    # Users, roles & permissions
│   ├── admin/              # Platform administration (super admin)
│   ├── audit/              # Audit logs & compliance
│   └── settings/           # Tenant settings + theme system
├── hooks/                  # useLocalStorage, useMediaQuery, useDebounce, useDirection
├── i18n/                   # Internationalization
│   ├── index.ts            # i18next config (EN default, AR, browser detection)
│   └── locales/
│       ├── en.json         # English translations (2,299 keys, 18 namespaces)
│       └── ar.json         # Arabic translations (2,299 keys, 18 namespaces)
├── lib/                    # utils.ts, constants.ts, validations.ts
├── store/                  # Redux store (theme-only)
├── styles/                 # globals.css (CSS variables)
└── types/                  # Shared TypeScript types
```

### Feature Module Structure

Each module under `src/features/<module>/` follows this pattern:

```
<module>/
├── components/     # UI components
├── types/          # TypeScript interfaces
└── pages/          # Route-level page components
```

---

## Architecture

### Current: Pure UI Template

- **No API calls** — all data is static samples from `src/data/`
- **No backend dependencies** — zero axios, no HTTP client installed
- **Auth via React Context** — click Sign In to enter (no validation in template mode)
- **Full i18n** — English + Arabic with automatic RTL layout switching
- **Redux for theme only** — 1 slice (`themeSlice`) + 1 saga (`themeSaga`) for color management
- **All pages render immediately** — no loading states, no async fetching

### Future: Backend Integration

When connecting to a backend (e.g., Node.js + Express), you would:

1. Install an HTTP client (`axios`, `fetch` wrapper, etc.)
2. Create API service files in each feature module
3. Add Redux slices + sagas (or your preferred state management) for async data
4. Replace static data imports with API calls
5. Add proper loading/error states

The database schema is already designed — see `database/` folder (16 SQL files, ~84 tables).

---

## Theme System

Three built-in presets with full customization:

| Preset | Primary | Secondary | Sidebar |
|--------|---------|-----------|---------|
| **UAE Premium** (default) | #1D4ED8 | #0284C7 | #111827 |
| **Corporate Navy** | #1E3A5F | #2563EB | #0F172A |
| **Modern Teal** | #0D9488 | #06B6D4 | #134E4A |

- All colors use **CSS variables** — dynamically applied via `useThemeApplicator`
- Theme persists in **localStorage**
- Color customizer drawer with live preview
- Access via the floating palette button (bottom-right corner)

### Color Usage

```tsx
// Always use semantic color classes
<div className="bg-primary text-primary-foreground" />
<div className="bg-primary/10 border-primary/20" />
<Button variant="default" />  // Uses primary color
<Button variant="soft" />     // Uses primary/10 background

// Never use hardcoded colors
// bg-indigo-600, text-blue-500, border-violet-300
```

---

## Internationalization (i18n) & RTL

Full bilingual support with automatic RTL layout mirroring.

| Feature | Details |
|---------|---------|
| **Languages** | English (default) + Arabic |
| **Translation Keys** | 2,299 per language across 18 namespaces |
| **RTL Support** | Automatic layout mirroring via Tailwind logical properties |
| **Language Switcher** | Globe icon in TopNav + Settings page |
| **Persistence** | Language preference saved in localStorage |
| **Auto-Detection** | Detects browser language on first visit |

### Namespaces (18)
`common` `nav` `topNav` `breadcrumb` `auth` `dashboard` `crm` `sales` `inventory` `purchase` `accounts` `hr` `jobs` `dispatcher` `settings` `status` `validation` `emirates`

### RTL Layout
When Arabic is selected, the entire UI mirrors: sidebar moves to the right, text aligns right, and all directional spacing/positioning flips automatically using Tailwind CSS logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`).

---

## UAE-Specific Features

- **VAT**: 5% standard rate, zero-rated, and exempt options
- **TRN**: 15-digit Tax Registration Number validation (XXX-XXXXXX-XXXXX)
- **Currency**: AED (UAE Dirham) — formatted as `AED 1,234.56`
- **Phone**: +971 format
- **Emirates**: All 7 emirates supported
- **Labor Law**: 30 days annual leave, EOSB gratuity calculations
- **Work Week**: Sunday–Thursday, Ramadan reduced hours
- **Multi-tenancy**: Database schema supports full tenant isolation via PostgreSQL RLS

---

## Database Schema

Complete PostgreSQL schema in `database/` folder:

```
database/
├── 00_extensions.sql          # uuid-ossp, pgcrypto, btree_gist, pg_trgm
├── 01_enums.sql               # ~90 custom enum types
├── 02_tenants_and_auth.sql    # 7 tables (tenants, users, roles, sessions)
├── 03_crm.sql                 # 6 tables (customers, leads, follow-ups)
├── 04_sales.sql               # 5 tables (quotations, invoices, payments)
├── 05_inventory.sql           # 8 tables (items, warehouses, stock)
├── 06_purchase.sql            # 11 tables (vendors, POs, GRN, returns)
├── 07_accounts.sql            # 14 tables (COA, journals, AR/AP, VAT)
├── 08_hr.sql                  # 14 tables (employees, payroll, leaves)
├── 09_jobs.sql                # 8 tables (jobs, technicians, reports)
├── 10_dispatcher.sql          # 2 tables (locations, assignment logs)
├── 11_settings.sql            # 7 tables + sequence_counters
├── 12_rls_policies.sql        # RLS on ~65 tables
├── 13_indexes.sql             # 235 indexes
├── 14_triggers.sql            # 22 triggers
├── 15_seed.sql                # Permissions, tenant, admin, COA, leave types
├── README.md                  # Setup guide
├── LOCAL_SETUP.md             # Docker/native PostgreSQL setup
└── db_knowledge.md            # Node.js + Prisma integration guide
```

**~84 tables** | **~90 enums** | **UUID primary keys** | **TIMESTAMPTZ dates** | **NUMERIC(15,2) for money**

---

## Scripts

```bash
npm run dev        # Start Vite dev server (port 5173)
npm run build      # Production build with TypeScript check
npm run preview    # Preview production build locally
npm run lint       # ESLint check
```

---

## Environment Variables

```env
VITE_APP_NAME=OptifyServe ERP
VITE_APP_VERSION=1.0.0
```

Only two variables needed for the UI template. Add `VITE_API_URL`, `VITE_API_TIMEOUT`, etc. when integrating a backend.

---

## License

Proprietary — All rights reserved.
