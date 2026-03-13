# PROJECT SPECIFICATION — OptifyServe ERP SaaS Platform

> **Version**: 2.3 | **Last Updated**: 2026-03-11
> **Purpose**: Complete technical specification for rebuilding context across sessions. Read this file first when making any future changes.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Authentication](#5-authentication)
6. [Internationalization (i18n)](#6-internationalization-i18n)
7. [Theme System (Redux)](#7-theme-system-redux)
8. [Feature Modules](#8-feature-modules)
9. [TypeScript Interfaces](#9-typescript-interfaces)
10. [API Endpoints (Backend Reference)](#10-api-endpoints-backend-reference)
11. [Database Schema](#11-database-schema)
12. [Multi-Tenancy & Security](#12-multi-tenancy--security)
13. [Business Rules](#13-business-rules)
14. [UAE-Specific Requirements](#14-uae-specific-requirements)
15. [Changelog](#15-changelog)

---

## 1. System Overview

**Product**: Multi-tenant SaaS ERP for UAE service & maintenance companies
**Current State**: **Pure UI Template** — all pages built with static sample data, no backend API calls
**Target Users**: Maintenance, cleaning, pest control, HVAC, plumbing, electrical, facilities management
**Deployment**: Cloud SaaS (multi-tenant with row-level security — when backend is integrated)

### Modules (14)

| # | Module | Description | Pages |
|---|--------|-------------|-------|
| 1 | **Auth** | Login (split-screen), forgot password | 2 |
| 2 | **Dashboard** | KPIs, charts, urgent jobs, activity feed | 1 |
| 3 | **CRM** | Customers, leads pipeline, follow-ups | 2 |
| 4 | **Sales** | Quotations, invoices, payments | 2 |
| 5 | **Inventory** | Items, warehouses, stock levels, movements | 5 |
| 6 | **Purchase** | Vendors, POs, GRN, returns, vendor payments | 5 |
| 7 | **Accounts** | COA, journal entries, AR, AP, expenses, VAT, bank reconciliation, financial reports | 9 |
| 8 | **HR** | Employees, departments, attendance, leaves, payroll, performance, EOSB, documents | 10 |
| 9 | **Jobs** | Job management, technicians, scheduling, service reports | 5 |
| 10 | **Dispatcher** | Real-time map, job assignment, technician tracking | 1 |
| 11 | **User Management** | User accounts, role & permission management | 2 |
| 12 | **Platform Admin** | Tenant management, subscription plans, platform analytics | 3 |
| 13 | **Audit** | Audit log viewer with filters | 1 |
| 14 | **Settings** | Company profile, notifications, integrations, security, theme | 1 |

**Total**: 49 pages, 149 feature components, 27 shadcn/ui components, 14 shared components, 6 layout components
**i18n**: 3,501 translation keys per language (English + Arabic), 18 namespaces, full RTL support

---

## 2. Tech Stack

### Frontend (Current — UI Template)
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.0 |
| Language | TypeScript (strict) | 5.9.3 |
| Build Tool | Vite | 7.2.4 |
| Theme State | Redux Toolkit + Redux Saga | 2.11.2 / 1.4.2 |
| Auth | React Context | Built-in |
| UI Components | shadcn/ui + Radix UI | Latest |
| Styling | Tailwind CSS | 3.4.1 |
| Forms | React Hook Form + Zod | 7.71.1 / 4.3.6 |
| Tables | TanStack React Table | 8.21.3 |
| Charts | Recharts | 3.7.0 |
| Routing | react-router-dom | 7.13.0 |
| Icons | Lucide React | 0.563.0 |
| i18n | react-i18next + i18next | 15.4.1 / 24.2.2 |
| Language Detection | i18next-browser-languagedetector | 8.0.4 |
| Date Utilities | date-fns | 4.1.0 |
| Notifications | Sonner | 2.0.7 |

> **Note**: Axios has been removed. No HTTP client is installed. Redux is installed but only used for the theme system (1 slice, 1 saga). All UI strings are translated via react-i18next (EN + AR with RTL).

### Backend (Planned)
| Layer | Technology |
|-------|-----------|
| Framework | Express.js (Node.js + TypeScript) |
| ORM | Prisma |
| Database | PostgreSQL 16 |
| Migrations | Prisma Migrate + raw SQL |
| Auth | JWT (access + refresh tokens) |

### Infrastructure
| Layer | Options |
|-------|---------|
| Dev Database | Docker PostgreSQL (local) |
| Staging Database | Railway PostgreSQL |
| Production Database | Azure Database for PostgreSQL |

---

## 3. Project Structure

```
optifyserve-frontend/
├── public/
├── database/                          # PostgreSQL schema (16 SQL files)
│   ├── 00_extensions.sql              # uuid-ossp, pgcrypto, btree_gist, pg_trgm
│   ├── 01_enums.sql                   # ~90 custom enum types
│   ├── 02_tenants_and_auth.sql        # 7 tables
│   ├── 03_crm.sql                     # 6 tables
│   ├── 04_sales.sql                   # 5 tables
│   ├── 05_inventory.sql               # 8 tables
│   ├── 06_purchase.sql                # 11 tables
│   ├── 07_accounts.sql                # 14 tables
│   ├── 08_hr.sql                      # 14 tables
│   ├── 09_jobs.sql                    # 8 tables
│   ├── 10_dispatcher.sql              # 2 tables
│   ├── 11_settings.sql                # 7 tables + sequence_counters
│   ├── 12_rls_policies.sql            # RLS on ~65 tables
│   ├── 13_indexes.sql                 # 235 indexes
│   ├── 14_triggers.sql                # 22 triggers
│   ├── 15_seed.sql                    # Permissions, tenant, admin user, COA, leave types
│   ├── README.md                      # Setup guide
│   ├── LOCAL_SETUP.md                 # Docker/native/Neon setup
│   └── db_knowledge.md                # Node.js + Prisma integration guide
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Router + AuthProvider + Redux Provider (theme)
│   │   └── protected-route.tsx        # Auth guard (uses useAuth context)
│   ├── components/
│   │   ├── layout/                    # AppLayout, Sidebar, TopNav, Breadcrumb, PageHeader, MobileSidebar
│   │   ├── shared/                    # LoadingSpinner, ErrorMessage, StatusBadge, CurrencyDisplay, etc.
│   │   └── ui/                        # 27 shadcn/ui components
│   ├── contexts/
│   │   └── auth-context.tsx           # AuthProvider, useAuth() hook
│   ├── data/                          # 18 static sample data files
│   │   ├── dashboard.data.ts
│   │   ├── customers.data.ts
│   │   ├── leads.data.ts
│   │   ├── quotations.data.ts
│   │   ├── invoices.data.ts
│   │   ├── items.data.ts
│   │   ├── warehouses.data.ts
│   │   ├── stock.data.ts
│   │   ├── vendors.data.ts
│   │   ├── purchase-orders.data.ts
│   │   ├── accounts.data.ts
│   │   ├── employees.data.ts
│   │   ├── jobs.data.ts
│   │   ├── dispatcher.data.ts
│   │   ├── settings.data.ts
│   │   ├── users.data.ts
│   │   ├── admin.data.ts
│   │   └── audit.data.ts
│   ├── features/                      # 14 modules
│   │   ├── auth/                      # components/, types/, pages/
│   │   ├── dashboard/                 # components/, types/, pages/
│   │   ├── crm/                       # components/, types/, pages/
│   │   ├── sales/                     # components/, types/, pages/, hooks/
│   │   ├── inventory/                 # components/, types/, pages/
│   │   ├── purchase/                  # components/, types/, pages/
│   │   ├── accounts/                  # components/, types/, pages/
│   │   ├── hr/                        # components/, types/, pages/
│   │   ├── jobs/                      # components/, types/, pages/
│   │   ├── dispatcher/                # components/, types/, pages/
│   │   ├── user-management/           # components/, types/, pages/
│   │   ├── admin/                     # components/, types/, pages/
│   │   ├── audit/                     # components/, types/, pages/
│   │   └── settings/                  # components/, types/, pages/, theme/
│   ├── hooks/                         # useLocalStorage, useDebounce, usePagination, useModal, useMediaQuery, useDirection
│   ├── i18n/
│   │   ├── index.ts                   # i18next config (EN default, AR, browser detection)
│   │   └── locales/
│   │       ├── en.json                # English translations (2,299 keys)
│   │       └── ar.json                # Arabic translations (2,299 keys)
│   ├── lib/
│   │   ├── utils.ts                   # 30+ utility functions
│   │   ├── constants.ts               # All enum constants + config
│   │   └── validations.ts             # Zod schemas
│   ├── store/                         # Redux (theme only)
│   │   ├── index.ts                   # configureStore + saga middleware
│   │   ├── rootReducer.ts             # theme reducer only
│   │   ├── rootSaga.ts                # theme saga only
│   │   └── hooks.ts                   # useAppDispatch, useAppSelector
│   ├── types/
│   │   ├── common.types.ts            # Shared types
│   │   └── api.types.ts               # API response types (for future use)
│   └── styles/
│       └── globals.css                # Tailwind + theme CSS variables
├── .env                               # VITE_APP_NAME, VITE_APP_VERSION
├── .env.example                       # Template
├── vite.config.ts                     # Path alias: @/ → src/
├── tsconfig.json                      # Strict mode, path aliases
├── CLAUDE.md                          # AI coding instructions
└── PROJECT_SPEC.md                    # THIS FILE
```

### Feature Module Structure (each under `src/features/<module>/`)
```
<module>/
├── components/     # UI components specific to this module
├── types/          # TypeScript interfaces
├── pages/          # Page-level components (route targets)
└── utils/          # Module-specific utilities (optional)
```

> **No `store/` or `api/` directories** exist in feature modules. All data is imported from `src/data/`.
> Only exception: `src/features/sales/hooks/use-vat-calculator.ts` — pure VAT calculation utility.
> Theme files live at `src/features/settings/theme/` (not in a `store/` subdirectory).

---

## 4. Frontend Architecture

### Entry Point
- `src/main.tsx` → imports `./i18n` (i18next init), renders `<App />` with `<StrictMode>` and Redux `<Provider>` (for theme)
- `src/app/App.tsx` → `<AuthProvider>` + `<BrowserRouter>` + `useDirection()` hook for RTL switching

### Layout System
- `AppLayout` wraps all authenticated pages: collapsible sidebar (280px→64px) + TopNav (64px) + content area
- `MobileSidebar` for responsive drawer on small screens
- `TopNav` has breadcrumbs, global search, notifications bell, language switcher (EN/AR), user dropdown
- `PageHeader` provides title + description + action buttons slot

### Routing (49 protected routes + 2 public)
```
/login                          → LoginPage (split-screen with branding)
/forgot-password                → ForgotPasswordPage
/dashboard                      → DashboardPage
/crm/customers                  → CustomersPage
/crm/leads                      → LeadsPage
/sales/quotations               → QuotationsPage
/sales/invoices                 → InvoicesPage
/inventory/items                → ItemsPage
/inventory/warehouses           → WarehousesPage
/inventory/stock                → CurrentStockPage
/inventory/movements            → StockMovementsPage
/inventory/reports              → StockReportsPage
/purchase/vendors               → VendorsPage
/purchase/orders                → PurchaseOrdersPage
/purchase/grn                   → GRNPage
/purchase/returns               → PurchaseReturnsPage
/purchase/payments              → VendorPaymentsPage
/accounts/dashboard             → FinancialDashboardPage
/accounts/chart                 → ChartOfAccountsPage
/accounts/journal               → JournalEntriesPage
/accounts/receivable            → AccountsReceivablePage
/accounts/payable               → AccountsPayablePage
/accounts/expenses              → ExpensesPage
/accounts/reports               → FinancialReportsPage
/accounts/reconciliation        → BankReconciliationPage
/accounts/vat                   → VATReturnsPage
/hr/employees                   → EmployeesPage
/hr/departments                 → DepartmentsPage
/hr/attendance                  → AttendancePage
/hr/leave                       → LeavesPage
/hr/documents                   → DocumentsPage
/hr/payroll                     → PayrollPage
/hr/performance                 → PerformancePage
/hr/eosb                        → EOSBPage
/hr/reports                     → HRReportsPage
/hr/portal                      → EmployeePortalPage
/jobs                           → JobsPage
/jobs/technicians               → TechniciansPage
/jobs/schedule                  → JobSchedulingPage
/jobs/reports                   → ServiceReportsPage
/jobs/analytics                 → JobReportsPage
/dispatcher                     → DispatcherPage
/users/list                     → UsersPage
/users/roles                    → RolesPage
/admin/tenants                  → TenantsPage
/admin/plans                    → PlansPage
/admin/analytics                → AdminAnalyticsPage
/audit                          → AuditPage
/settings/*                     → SettingsPage
```

### Current Data Flow (UI Template Mode)
```
Page imports static data from src/data/
  → const items = sampleItems
  → const isLoading = false
  → Renders UI directly
  → CRUD handlers show toast.success() (no-op)
```

### Future Data Flow (After Backend Integration)
```
User Action → dispatch(xxxRequest(payload))
  → Redux Saga calls API (axios)
  → On success: put(xxxSuccess(data))
  → Slice reducer updates state
  → Component re-renders via useAppSelector
```

---

## 5. Authentication

Auth is handled by React Context (`src/contexts/auth-context.tsx`), not Redux.

### AuthContext API
```typescript
interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
```

### Login Flow (Template Mode)
1. User sees split-screen login page with branding panel
2. **No validation required** — click "Sign In" to enter the app instantly
3. `login()` simulates 600ms delay, creates a mock `User` object
4. User stored in localStorage for persistence across tabs/refreshes
5. `ProtectedRoute` checks `isAuthenticated` via `useAuth()` context hook
6. Logout clears localStorage and redirects to `/login`

### AUTO_LOGIN Flag
Set `const AUTO_LOGIN = true` in `src/contexts/auth-context.tsx` to bypass the login page entirely. When enabled, the app loads directly to the dashboard with the mock user pre-authenticated. Default: `false`.

### Mock User (set on login)
```typescript
const mockUser: User = {
  id: 'usr_001',
  email: '<entered email>',
  name: 'Ahmed Al Maktoum',
  role: 'super_admin',
  permissions: ['manage_users', 'manage_settings', ...all],
  companyId: 'comp_001',
  companyName: 'UAE Service Pro LLC',
  tenantId: 'tenant_001',
  phone: '+971 50 123 4567',
  department: 'Management',
}
```

---

## 6. Internationalization (i18n)

Full bilingual support: English (default) + Arabic with automatic RTL layout mirroring.

### Architecture
```
src/i18n/
├── index.ts           # i18next init: browser detection, localStorage persistence, fallback 'en'
└── locales/
    ├── en.json        # 3,501 English keys across 18 namespaces
    └── ar.json        # 3,501 Arabic keys across 18 namespaces

src/hooks/use-direction.ts         # Sets document.dir (rtl/ltr) + document.lang on language change
src/components/shared/language-switcher.tsx  # Globe icon dropdown (EN/AR) in TopNav
```

### Translation Namespaces (18)
| Namespace | Keys | Covers |
|-----------|------|--------|
| `common` | 309 | Save, Cancel, Delete, Add, Edit, Search, Filter, Export, placeholders, etc. |
| `nav` | 54 | Sidebar navigation labels |
| `topNav` | 16 | TopNav search, notifications, user menu |
| `breadcrumb` | 61 | Breadcrumb segment labels |
| `auth` | 46 | Login page, forgot password |
| `dashboard` | 27 | KPI labels, chart titles |
| `crm` | 204 | Customer/lead forms, table headers |
| `sales` | 226 | Quotation/invoice labels, VAT |
| `inventory` | 303 | Item/warehouse/stock labels, forms, categories |
| `purchase` | 309 | Vendor/PO/GRN labels, approval workflow |
| `accounts` | 225 | COA, journal, AR/AP, expenses, VAT |
| `hr` | 396 | Employee, payroll, leave, EOSB, performance |
| `jobs` | 202 | Job cards, technicians, scheduling, service reports |
| `dispatcher` | 60 | Map view labels, assignment |
| `settings` | 631 | All settings categories and fields |
| `status` | 291 | All status/badge labels (active, paid, etc.) |
| `validation` | 133 | Form validation error messages |
| `emirates` | 7 | UAE emirate names |

### Usage Pattern
```typescript
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
// <Button>{t('common.save')}</Button>
// <p>{t('crm.customerName')}</p>
// Toast: toast.success(t('crm.customerCreated'))
```

### Status Labels Pattern
Type config files use `key` (translation key) instead of hardcoded `label`:
```typescript
// In types file:
export const STATUS_CONFIG = {
  active: { key: 'status.active', variant: 'success' },
  inactive: { key: 'status.inactive', variant: 'secondary' },
}

// In component:
<StatusBadge variant={config.variant}>{t(config.key)}</StatusBadge>
```

### RTL Support
- `useDirection()` hook in App.tsx sets `document.documentElement.dir` to `rtl` when Arabic is active
- All layout uses Tailwind logical properties: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`
- Sidebar, modals, drawers, and all components mirror automatically

### Language Persistence
- Saved to localStorage key `i18nextLng`
- Auto-detected from browser on first visit via `i18next-browser-languagedetector`
- Fallback: English (`en`)

---

## 7. Theme System (Redux)

Redux Toolkit + Redux Saga are used **exclusively** for the theme system.

### Store Configuration (`src/store/`)
```typescript
// rootReducer.ts — theme only
const rootReducer = combineReducers({ theme: themeReducer })

// rootSaga.ts — theme only
function* rootSaga() { yield all([fork(themeSaga)]) }
```

### Theme Architecture
```
src/features/settings/theme/
├── themeTypes.ts        # ThemeColors, ThemePreset, THEME_PRESETS, DEFAULT_THEME_COLORS
├── themeSlice.ts        # Redux slice (setColorPreview, applyPreset, updateThemeRequest, resetThemeRequest)
├── themeSaga.ts         # localStorage persistence (no API calls)
├── useThemeApplicator.ts # Applies ThemeColors → CSS variables on <html>
└── components/
    ├── theme-preset-selector.tsx  # Clickable preset cards with color swatches
    ├── color-customizer.tsx       # Right-side drawer with all pickers
    ├── color-picker-field.tsx     # Individual color picker input
    └── theme-preview.tsx          # Live preview of current colors
```

### Theme Presets (4)
| Preset | Primary | Description |
|--------|---------|-------------|
| Corporate Navy | `#1E3A5F` | Professional blue tones for enterprise |
| Modern Teal | `#0D9488` | Fresh teal palette with vibrant accents |
| UAE Premium | `#1D4ED8` | Elegant blue designed for UAE business (default) |
| OptifyServe | `#1565C0` | Modern blue with futuristic navy sidebar (`#0A1628`) |

### Default Theme Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#1D4ED8` | Buttons, links, active states |
| Secondary | `#0284C7` | Accents, highlights |
| Sidebar BG | `#111827` | Sidebar background |
| Sidebar Text | `#D1D5DB` | Sidebar text and icons |
| Success | `#059669` | Success states |
| Warning | `#B45309` | Warning states |
| Error | `#B91C1C` | Error states |

### Components That Read Redux Theme State
Only these files use `useAppSelector(s => s.theme)`:
- `src/components/layout/sidebar.tsx`
- `src/components/layout/mobile-sidebar.tsx`
- `src/features/settings/components/appearance-settings.tsx`
- `src/features/settings/theme/components/color-customizer.tsx`
- `src/features/settings/theme/components/theme-preset-selector.tsx`
- `src/features/settings/theme/useThemeApplicator.ts`

---

## 8. Feature Modules — Detailed

### 8.1 Auth Module
**Pages**: LoginPage (split-screen), ForgotPasswordPage
**Components**: LoginForm
**Auth**: React Context (`useAuth()`) — not Redux
**Login**: Zero-friction — click Sign In to enter (no validation in template mode)
**Branding**: OptifyServe with feature cards, stats bar, trust badges

### 8.2 Dashboard Module
**Pages**: DashboardPage
**Components**: KPICards, SalesChart (Recharts multi-line by emirate), UrgentJobsList, RecentActivity
**Data**: `src/data/dashboard.data.ts`

### 8.3 CRM Module
**Pages**: CustomersPage, LeadsPage
**Key Components**: CustomerForm, LeadCard, FollowUpForm, LostReasonDialog
**Data**: `src/data/customers.data.ts`, `src/data/leads.data.ts`
**Features**:
- Customer list with DataTable, filters (status, type, emirate), detail panel (Sheet)
- Lead Kanban board with 5 stages (New → Follow-up → Qualified → Won → Lost)
- Follow-up tracking with call/email/meeting types

### 8.4 Sales Module
**Pages**: QuotationsPage, InvoicesPage
**Key Components**: LineItemsTable, VATCalculationCard, PaymentForm, QuotationPreview, InvoicePreview
**Data**: `src/data/quotations.data.ts`, `src/data/invoices.data.ts`
**Hooks**: `src/features/sales/hooks/use-vat-calculator.ts` (pure utility)
**Features**:
- Multi-line item quotations with discount and VAT calculation
- Quotation → Invoice conversion UI
- Invoice payment recording (partial payments)
- PDF-style preview with company branding
- VAT-compliant (5% standard, zero-rated, exempt)

### 8.5 Inventory Module
**Pages**: ItemsPage, WarehousesPage, CurrentStockPage, StockMovementsPage, StockReportsPage
**Data**: `src/data/items.data.ts`, `src/data/warehouses.data.ts`, `src/data/stock.data.ts`
**Features**:
- Item master with SKU, barcode, serial number support
- Multi-warehouse stock tracking
- Stock in/out/transfer/adjustment
- Low stock alerts with reorder suggestions

### 8.6 Purchase Module
**Pages**: VendorsPage, PurchaseOrdersPage, GRNPage, PurchaseReturnsPage, VendorPaymentsPage
**Data**: `src/data/vendors.data.ts`, `src/data/purchase-orders.data.ts`
**Features**:
- Vendor directory with ratings and payment terms
- PO creation with approval workflow UI
- Goods receipt with quality inspection
- Vendor payment recording and statement

### 8.7 Accounts Module
**Pages**: ChartOfAccountsPage, JournalEntriesPage, AccountsReceivablePage, AccountsPayablePage, ExpensesPage, FinancialDashboardPage, FinancialReportsPage, BankReconciliationPage, VATReturnsPage
**Data**: `src/data/accounts.data.ts` (~1400 lines — largest data file)
**Features**:
- Hierarchical chart of accounts (tree view)
- Double-entry journal entries with auto-balance validation
- AR/AP aging analysis (current, 1-30, 31-60, 61-90, 91-120, 120+)
- Expense claims with approval workflow
- Bank reconciliation with statement matching
- VAT return preparation (UAE FTA format)
- Financial reports: trial balance, P&L, balance sheet, cash flow

### 8.8 HR Module
**Pages**: EmployeesPage, DepartmentsPage, AttendancePage, LeavesPage, DocumentsPage, PayrollPage, PerformancePage, EOSBPage, HRReportsPage, EmployeePortalPage
**Data**: `src/data/employees.data.ts` (14 exports)
**Features**:
- Complete employee lifecycle (hire → probation → active → termination)
- Attendance with GPS check-in/check-out, Ramadan shift support
- Leave management with UAE labor law compliance (9 leave types)
- Payroll processing with WPS-ready output
- Performance reviews with goals and ratings
- EOSB gratuity calculation per UAE labor law
- Document management with expiry alerts
- Employee self-service portal

### 8.9 Jobs Module
**Pages**: JobsPage, TechniciansPage, JobSchedulingPage, ServiceReportsPage, JobReportsPage
**Data**: `src/data/jobs.data.ts`
**Features**:
- Job creation with customer, service type, priority, scheduling
- Technician skills and availability management
- Calendar and map views for scheduling
- Service report with checklist, parts, photos, signatures
- Customer feedback with 5-star ratings

### 8.10 Dispatcher Module
**Pages**: DispatcherPage
**Data**: `src/data/dispatcher.data.ts`
**Features**:
- Map placeholder with technician and job markers
- Smart job assignment with scoring (distance, skills, availability)
- Top 3 suggestions with "Best Match" indicator
- Technician utilization dashboard

### 8.11 User Management Module
**Pages**: UsersPage, RolesPage
**Data**: `src/data/users.data.ts`
**Features**:
- User list with search, filters (role, status, department)
- User creation/edit with role assignment
- Role management with granular permissions
- Permission matrix (71 permissions across all modules)

### 8.12 Platform Administration Module (Super Admin)
**Pages**: TenantsPage, PlansPage, AdminAnalyticsPage
**Data**: `src/data/admin.data.ts`
**Features**:
- Tenant management with stats, search, filters, add/edit dialog
- Subscription plan cards with features and pricing
- Platform analytics with KPI cards, module popularity, recent activity

### 8.13 Audit Module
**Pages**: AuditPage
**Data**: `src/data/audit.data.ts`
**Features**:
- Audit log viewer with search, module/action filters
- Activity timeline with user, action, module, timestamp
- Filterable by date range, module, and action type

### 8.14 Settings Module
**Pages**: SettingsPage (drawer with two-panel layout)
**Data**: `src/data/settings.data.ts`
**Features**:
- Company profile with branding and TRN
- Branch management (UAE emirates)
- Notification preferences
- Integration settings
- Security settings
- Theme customization (4 presets + full color picker)
- Subscription & billing view
- Tax configuration

---

## 9. TypeScript Interfaces — Key Types

> All type definitions are preserved in `src/features/<module>/types/`. They define the full data contracts for when the backend is integrated.

### Common Types (`src/types/common.types.ts`)
```typescript
interface PaginatedResponse<T> { data: T[]; total: number; page: number; pageSize: number; }
interface ApiError { message: string; code: string; details?: Record<string, string[]>; }
interface SelectOption { value: string; label: string; }
interface Address { street: string; city: string; emirate: string; country: string; }
```

### Auth Types
```typescript
type UserRole = 'super-admin' | 'admin' | 'manager' | 'staff' | 'technician'
interface User { id: string; email: string; name: string; role: UserRole; permissions: string[]; companyId: string; companyName: string; tenantId: string; avatar?: string; phone?: string; department?: string; }
```

*(Full type definitions for all modules remain in their respective `types/` directories — CRM, Sales, Inventory, Purchase, Accounts, HR, Jobs, Dispatcher, Settings)*

---

## 10. API Endpoints (Backend Reference)

> These endpoints are **not implemented** in the frontend. They serve as the contract for the backend developer building the Node.js + Express.js API. When the backend is ready, the frontend will be updated to call these endpoints.

### Auth
```
POST   /api/auth/login              { email, password } → { user, tokens }
POST   /api/auth/logout             → void
POST   /api/auth/refresh            { refreshToken } → { tokens }
GET    /api/auth/me                 → User
```

### CRM
```
GET    /api/customers               ?search&status&type&emirate&page&pageSize → PaginatedResponse<Customer>
POST   /api/customers               → Customer
PUT    /api/customers/:id           → Customer
DELETE /api/customers/:id           → void
GET    /api/leads                   ?stage&source&assignedTo → Lead[]
POST   /api/leads                   → Lead
PATCH  /api/leads/:id/stage         { stage } → Lead
POST   /api/leads/:id/convert       → Customer
```

### Sales
```
GET    /api/quotations              ?status&customerId → PaginatedResponse<Quotation>
POST   /api/quotations              → Quotation
POST   /api/quotations/:id/convert  → Invoice
GET    /api/invoices                ?status&customerId → PaginatedResponse<Invoice>
POST   /api/invoices                → Invoice
POST   /api/invoices/:id/payments   → InvoicePayment
```

### Inventory
```
GET    /api/items                   ?search&category&status → PaginatedResponse<Item>
POST   /api/items                   → Item
GET    /api/warehouses              → Warehouse[]
GET    /api/stock-levels            ?warehouseId&itemId → StockLevel[]
POST   /api/stock-movements         → StockMovement
```

### Purchase
```
GET    /api/vendors                 ?status&category → PaginatedResponse<Vendor>
POST   /api/vendors                 → Vendor
GET    /api/purchase-orders         ?status&vendorId → PaginatedResponse<PurchaseOrder>
POST   /api/purchase-orders         → PurchaseOrder
POST   /api/purchase-orders/:id/approve → POApproval
POST   /api/grn                     → GoodsReceivedNote
POST   /api/vendor-payments         → VendorPayment
```

### Accounts
```
GET    /api/chart-of-accounts       → ChartOfAccount[] (tree)
POST   /api/journal-entries         → JournalEntry
GET    /api/accounts-receivable     → AccountsReceivable[]
GET    /api/accounts-payable        → AccountsPayable[]
GET    /api/expenses                → PaginatedResponse<Expense>
GET    /api/vat-returns             → VATReturn[]
GET    /api/bank-reconciliations    → BankReconciliation[]
```

### HR
```
GET    /api/employees               ?department&branch&status → PaginatedResponse<Employee>
POST   /api/employees               → Employee
GET    /api/attendance              ?employeeId&dateFrom&dateTo → AttendanceRecord[]
GET    /api/leave-requests          ?status&employeeId → LeaveRequest[]
GET    /api/payroll-runs            ?month&year → PayrollRun[]
GET    /api/performance-reviews     ?employeeId&year → PerformanceReview[]
GET    /api/eosb                    ?employeeId → EOSBRecord[]
```

### Jobs & Dispatcher
```
GET    /api/jobs                    ?status&priority → PaginatedResponse<Job>
POST   /api/jobs                    → Job
POST   /api/jobs/:id/assign         { technicianId } → Job
GET    /api/technicians             → Technician[]
POST   /api/service-reports         → ServiceReport
GET    /api/dispatcher/overview     → { unassignedJobs, technicianLocations, utilization }
```

### Settings
```
GET    /api/company-profile         → CompanyProfile
PUT    /api/company-profile         → CompanyProfile
GET    /api/users                   → User[]
GET    /api/roles                   → Role[]
GET    /api/audit-logs              → PaginatedResponse<AuditLog>
```

---

## 11. Database Schema

### Overview
- **Total Tables**: ~84 + `sequence_counters`
- **Total Enum Types**: ~90
- **Total Indexes**: 235
- **Total Triggers**: 22
- **RLS-Protected Tables**: ~65

### Table Count by Module

| Module | Tables | Key Tables |
|--------|--------|------------|
| Auth | 7 | tenants, users, roles, permissions, user_sessions |
| CRM | 6 | customers, leads, follow_ups, customer_contacts |
| Sales | 5 | quotations, invoices, quotation_items, invoice_items, invoice_payments |
| Inventory | 8 | items, warehouses, stock_levels, stock_movements, item_categories |
| Purchase | 11 | vendors, purchase_orders, po_line_items, goods_received_notes, purchase_returns, vendor_payments |
| Accounts | 14 | chart_of_accounts, journal_entries, journal_lines, accounts_receivable, accounts_payable, expenses, bank_accounts, vat_returns |
| HR | 14 | employees, departments, branches, shifts, attendance_records, leave_types, leave_requests, payroll_runs, payslips, eosb_records, employee_documents, performance_reviews |
| Jobs | 8 | jobs, technicians, technician_skills, service_reports, customer_feedbacks |
| Dispatcher | 2 | technician_locations, job_assignment_logs |
| Settings | 7+1 | company_profiles, integrations, audit_logs, security_settings, sequence_counters |

### Key Design Patterns

| Pattern | Implementation |
|---------|---------------|
| **Primary Keys** | UUID via `gen_random_uuid()` |
| **Money** | `NUMERIC(15,2)` — never FLOAT |
| **Dates** | `TIMESTAMPTZ` everywhere |
| **Multi-tenancy** | `tenant_id UUID NOT NULL` on every business table |
| **Soft Deletes** | `deleted_at TIMESTAMPTZ` on major entities |
| **Audit Columns** | `created_at`, `updated_at`, `created_by`, `updated_by` |
| **Flexible Data** | `JSONB` for addresses, bank details, settings, metadata |
| **Auto Numbers** | `sequence_counters` table + trigger per entity per tenant |

### Seed Data (in `15_seed.sql`)
- 52 permissions (CRUD per module + specialized actions)
- 1 test tenant: OptifyServe Solutions LLC (TRN: 100234567890003)
- 1 admin user: admin@optifyserve.com / Admin@123
- 4 system roles: Administrator, Manager, Staff, Technician
- 9 UAE leave types (annual 30d, sick 90d, maternity 60d, etc.)
- 80+ chart of accounts (UAE standard hierarchy)
- 5 shifts (morning, evening, night, split, Ramadan)

---

## 12. Multi-Tenancy & Security

### Row-Level Security (RLS)
```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION current_tenant_id() RETURNS UUID AS $$
  SELECT current_setting('app.current_tenant')::uuid;
$$ LANGUAGE sql STABLE;
CREATE POLICY tenant_isolation_select ON <table>
  FOR SELECT USING (tenant_id = current_tenant_id());
```

### Auth Flow (When Backend Is Ready)
1. User sends `POST /api/auth/login` with email + password
2. Backend validates, returns JWT access token (15min) + refresh token (7d)
3. Frontend stores tokens, sets in auth context or Redux
4. Every API call includes `Authorization: Bearer <accessToken>`
5. Backend middleware sets `app.current_tenant` on PostgreSQL connection
6. RLS automatically filters all queries to current tenant

### Permission System
- Permissions: `{module}.{action}` (e.g., `crm.create`, `sales.approve`)
- Roles group permissions (Admin has all, Manager has most, Staff limited)
- Frontend checks permissions before showing UI elements
- Backend validates permissions on every API call

---

## 13. Business Rules

### Sales & Invoicing
- VAT: 5% standard rate, with zero-rated and exempt options
- Quotation → Invoice conversion (one-click)
- Partial payments supported with balance tracking

### Inventory
- Stock tracked per warehouse per item
- Movement types: in, out, transfer, adjustment, return, consumption
- Low stock alerts when available_qty < reorder_point

### Purchase
- Multi-level approval workflow (level-1, level-2, level-3)
- PO → GRN → (optional) Purchase Return flow

### Accounts
- Double-entry bookkeeping (total_debit = total_credit)
- AR/AP aging buckets: current, 1-30, 31-60, 61-90, 91-120, 120+
- VAT return: UAE FTA format with boxes 1-9

### HR
- UAE labor law: annual (30d), sick (90d, tiered pay), maternity (60d)
- EOSB gratuity: 21d/yr (first 5 years), 30d/yr (after 5 years)
- Document expiry tracking (visa, emirates ID, labor card, passport)

### Jobs & Dispatch
- Job assignment scoring: distance + skill match + availability + current load
- Service report: checklist, work description, parts, photos, signatures

---

## 14. UAE-Specific Requirements

### Tax & Compliance
- **VAT Rate**: 5% standard (since January 2018)
- **TRN**: Tax Registration Number, 15-digit format (XXX-XXXXXX-XXXXX)
- **VAT Return**: FTA boxes format (quarterly or monthly filing)

### Labor Law
- **Annual Leave**: 30 calendar days after 1 year
- **Sick Leave**: 90 days (15 full pay, 30 half pay, 45 unpaid)
- **Maternity**: 60 days (45 full pay, 15 half pay)
- **EOSB Gratuity**: 21d × years (first 5), 30d × years (after 5)
- **WPS**: Wage Protection System compliance for salary transfers

### Geography
- **7 Emirates**: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah
- **Currency**: AED (UAE Dirham) — `AED 1,234.56`
- **Phone Format**: +971 XX XXX XXXX
- **Business Hours**: Sunday-Thursday, 8AM-5PM

---

## 15. Changelog

### v2.3 — 2026-03-11 (UX Polish + Comprehensive i18n Audit)

**Major**: Added page/button animations, fixed expense view action, fixed Settings drawer positioning, and resolved 1,193 missing translation keys across all modules.

#### UX & Animation Enhancements
- **Page transitions**: Route-change animation with opacity fade and staggered child entrance (`animate-page-enter` + `cardEnter` with 60ms delays per child)
- **Button micro-interactions**: Hover lift (`-translate-y-[1px]`), shadow elevation (`hover:shadow-md`), press feedback (`active:scale-[0.96]`) on all button variants
- **Sidebar animations**: Nav item hover effects, icon micro-animations, submenu expand transitions
- **Theme preset #4 (OptifyServe)**: Refined sidebar to deeper navy-midnight (`#0A1628`) with cool off-white text (`#E8EDF5`)

#### Bug Fixes (3)
- **Expense View action**: Created `expense-detail-modal.tsx` — full read-only expense detail dialog with amount breakdown, approval history, VAT info. Wired into `expenses-page.tsx` with `isViewOpen` state
- **Settings drawer half-showing**: CSS `transform` on animated `<main>` broke `position: fixed` for the Settings drawer. Fixed with `createPortal(... , document.body)` in `settings-drawer.tsx`
- **Audit log raw keys**: Added 20 missing translation keys for audit module/action filters (`settings.allModules`, `settings.auditModule.*`, `settings.auditAction.*`)

#### Comprehensive i18n Audit (+1,193 keys)
- Programmatic audit found 1,196 translation keys used in source code but missing from locale files
- Auto-generated English translations from camelCase key names with 157 manual overrides for critical keys
- Synced all missing keys to Arabic locale (English fallback until professional translation)
- **Total keys**: 2,299 → 3,501 per language (EN + AR)
- All modules now show proper labels instead of raw key names (e.g., `inventory.basicInfo` → "Basic Info")

#### Code Quality Fixes
- Fixed ESLint `prefer-const` in `useThemeApplicator.ts`
- Fixed `as any` type cast in `stock-history-timeline.tsx` (replaced `Badge` with `StatusBadge`)
- TypeScript: zero errors, ESLint: clean

#### Files Created (1)
- `src/features/accounts/components/expense-detail-modal.tsx` — Expense detail view dialog

#### Files Modified (13)
- `src/components/layout/app-layout.tsx` — Page transition animation with `key={location.pathname}`
- `src/components/layout/sidebar.tsx` — Sidebar hover animations, brighter text opacity
- `src/components/layout/mobile-sidebar.tsx` — Same sidebar enhancements
- `src/components/ui/button.tsx` — Hover lift + shadow + press animations on all variants
- `src/styles/globals.css` — Page enter animation, staggered card entrance, sidebar animations
- `src/features/settings/components/settings-drawer.tsx` — `createPortal` fix for position:fixed
- `src/features/settings/theme/themeTypes.ts` — OptifyServe preset color refinement
- `src/features/settings/theme/useThemeApplicator.ts` — ESLint prefer-const fix
- `src/features/inventory/components/stock-history-timeline.tsx` — Badge → StatusBadge type fix
- `src/features/accounts/pages/expenses-page.tsx` — Wired expense detail modal
- `src/features/accounts/components/index.ts` — Added expense-detail-modal export
- `src/i18n/locales/en.json` — +1,193 missing translation keys
- `src/i18n/locales/ar.json` — +1,193 missing translation keys (English fallback)

---

### v2.2 — 2026-03-11 (Module Extraction + Backend Alignment Audit)

**Major**: Extracted User Management, Platform Administration, and Audit Logs from Settings into standalone modules. Comprehensive audit aligned all frontend TypeScript enums with the PostgreSQL database schema.

#### New Modules (3)
- **User Management** (`/users`) — Users list + Roles management (extracted from Settings)
- **Platform Administration** (`/admin`) — Tenant management, Subscription plans, Platform analytics (extracted from Settings super-admin)
- **Audit Logs** (`/audit`) — Standalone audit log viewer with search/filters (extracted from Settings tax & compliance)

#### Files Created (~20)
- `src/features/user-management/` — 7 files (components, types, pages, barrel exports)
- `src/features/admin/` — 9 files (components, types, pages, barrel exports)
- `src/features/audit/` — 6 files (components, types, pages, barrel exports)
- `src/data/users.data.ts` — Sample user + role data
- `src/data/admin.data.ts` — Sample tenant data
- `src/data/audit.data.ts` — Sample audit log data

#### Backend Alignment — Enum Fixes (13 type files)
All frontend TypeScript union types aligned to PostgreSQL `01_enums.sql` (kebab-case convention):
- **Jobs**: `JobStatus` (`'new'`→`'pending'`, snake_case→kebab-case), `JobPriority` (`'urgent'`→`'emergency'`), `ServiceType` (all kebab-case, added `'masonry'`), `TechnicianStatus` (new values: `'offline'`, `'en-route'`, `'on-leave'`)
- **Sales**: `QuotationStatus` (`'approved'`→`'accepted'`, added `'viewed'`), `InvoiceStatus` (`'void'`→`'credited'`, added `'viewed'`), `VatStatus` (added `'out-of-scope'`, `'reverse-charge'`)
- **HR**: `EmployeeStatus` (added `'notice-period'`, `'resigned'`, `'absconded'`, `'suspended'`), `AttendanceStatus` (kebab-case, added `'work-from-home'`), `ReviewStatus`/`ReviewPeriod`/`PerformanceGoal` (kebab-case, added `'acknowledged'`, `'deferred'`)
- **Purchase**: `ApprovalLevel` (`'auto'`/`'manager'`/`'owner'`→`'level-1'`/`'level-2'`/`'level-3'`), `VendorCategory` (aligned to DB)
- **CRM**: `LeadStage` (removed `'contacted'`/`'proposal'`/`'negotiation'` — 5 stages total)
- **Inventory**: `UnitOfMeasure` (12 values aligned to DB)
- **Geography**: `Emirate` (`'ras-al-khaimah'`→`'rak'`, `'umm-al-quwain'`→`'uaq'`)
- **Jobs**: `RecurringFrequency` (added `'daily'`, `'biweekly'`→`'bi-weekly'`)

#### Component Fixes (~25 files)
- Updated all component references to match new enum values
- Rewrote `job-workflow.ts` status transition map
- Fixed Zod schemas in `item-form.tsx` (new UOM values)
- Fixed purchase approval workflow components (3 files)
- Fixed CRM lead kanban (removed 3 stage columns)
- Fixed RTL: `left-3`/`right-1` → `start-3`/`end-1` in data-table-toolbar

#### Sample Data Fixes (8 files)
All `src/data/*.data.ts` files updated to use new enum values

#### i18n Updates (+101 keys)
- Added missing translation keys for new enum values (both EN + AR)
- Replaced hardcoded placeholders with `t()` calls
- Total keys: 2,198 → 2,299 per language (before v2.3 audit)

#### Settings Cleanup
- Removed Super Admin group, Audit Logs item from Settings navigation
- Removed 5 settings categories from `SettingsCategory` type union
- Cleaned up `settings-content.tsx` (removed lazy imports + switch cases)
- Renamed "Tax & Compliance" → "Tax Configuration"

#### Barrel Export Fixes
- Added missing exports to `src/components/shared/index.ts` (4 components)
- Added missing export to `src/hooks/index.ts` (use-direction)

#### Dead Code Removal
- Removed commented-out `handleDeleteLead` in leads-page
- Removed unused `userRole` prop from `SettingsContent`

---

### v2.1 — 2026-03-02 (i18n + RTL + Login Simplification)

**Major**: Added full bilingual support (English + Arabic) with RTL layout mirroring. Simplified login to zero-friction template mode.

#### New Packages
- `react-i18next` (15.4.1) — React bindings for i18next
- `i18next` (24.2.2) — Core i18n framework
- `i18next-browser-languagedetector` (8.0.4) — Auto-detect user language

#### Files Created (~5)
- `src/i18n/index.ts` — i18next configuration
- `src/i18n/locales/en.json` — 2,299 English translation keys
- `src/i18n/locales/ar.json` — 2,299 Arabic translation keys
- `src/hooks/use-direction.ts` — RTL/LTR direction hook
- `src/components/shared/language-switcher.tsx` — Globe icon dropdown (EN/AR)

#### Files Modified (~120)
- All 44 page files: added `useTranslation()` + `t()` calls for all UI strings
- ~60 feature components: replaced hardcoded strings with translation keys
- All type config files: changed `label: 'Text'` to `key: 'status.xxx'` pattern
- `src/main.tsx` — added `import './i18n'`
- `src/app/App.tsx` — added `useDirection()` hook
- `src/components/layout/top-nav.tsx` — added `<LanguageSwitcher />`
- `src/components/layout/sidebar.tsx` — translated all 50 nav labels + RTL fixes
- `src/features/auth/components/login-form.tsx` — removed Zod validation, zero-friction click-to-enter
- `src/contexts/auth-context.tsx` — added `AUTO_LOGIN` flag
- `src/lib/constants.ts` — removed dead `apiUrl` from APP_CONFIG

#### RTL Layout
- All directional Tailwind classes converted to logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`)
- Sidebar, drawers, and modals mirror automatically in Arabic mode

---

### v2.0 — 2026-03-01 (UI Template Conversion)

**Major**: Converted from Redux-heavy application to pure UI template.

#### Architecture Changes
- **Auth**: Moved from Redux slice to React Context (`src/contexts/auth-context.tsx`)
- **Data**: All 44 pages now use static sample data from `src/data/` (15 files)
- **Redux**: Stripped to theme-only (1 slice, 1 saga). Removed 35 feature slices + sagas
- **API**: All `api/` directories deleted. All `store/` directories deleted from feature modules
- **Services**: Entire `src/services/` directory deleted (axios-instance, endpoints, interceptors, token-service, local-storage service)
- **Axios**: Uninstalled from npm. Removed from Vite chunk config
- **Login**: Redesigned with modern split-screen layout, OptifyServe branding

#### Files Deleted (~120)
- 35 Redux slice files + 35 saga files from all feature modules
- ~50 API files from all feature modules
- `src/services/` entire directory
- `src/features/projects/` empty module

#### Files Created (~17)
- `src/contexts/auth-context.tsx`
- 15 static data files in `src/data/`

#### Environment
- Removed: `VITE_API_URL`, `VITE_API_TIMEOUT`, `VITE_ENABLE_MOCK_API`, `VITE_GOOGLE_MAPS_API_KEY`, `VITE_SENTRY_DSN`, `VITE_ENABLE_ANALYTICS`
- Kept: `VITE_APP_NAME`, `VITE_APP_VERSION`

### v1.1 — 2026-02-27 (Cleanup)
- Deleted CRA config, Zustand store, React Query hooks
- Removed unused packages (craco, react-scripts, react-query, zustand)
- Replaced hardcoded `indigo-*` colors with theme-aware `primary` utilities
- Added theme preset system (3 presets) + success/soft button variants

---

*End of PROJECT_SPEC.md — Last generated 2026-03-11*
