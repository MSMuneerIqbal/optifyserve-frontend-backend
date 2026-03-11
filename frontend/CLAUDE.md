# CLAUDE CODE INSTRUCTIONS — OptifyServe ERP UI Template

## Quick Context

**Read `PROJECT_SPEC.md` first** — it has the complete system specification (frontend + backend + database) in one file.

This is a **pure UI template** for a multi-tenant SaaS ERP targeting UAE service & maintenance companies. Think of it like a ThemeForest template — all pages are built with static sample data, ready for a backend developer to integrate real APIs.

- **Frontend**: React 19 + TypeScript 5.9 + Vite 7
- **i18n**: react-i18next (English + Arabic) with RTL support — 3,501 translation keys
- **Auth**: React Context (`src/contexts/auth-context.tsx`) — not Redux
- **Data**: Static sample data in `src/data/` (18 files) — no API calls
- **Theme**: Redux Toolkit + Redux Saga (theme system only)
- **Backend** (planned): ASP.NET Core + PostgreSQL 16
- **Database**: Complete schema in `database/` folder (16 SQL files, ~84 tables)

---

## Project Status — UI Template Complete

All 14 frontend modules are **COMPLETE** with static sample data:
- Auth, Dashboard, CRM, Sales, Inventory, Purchase, Accounts, HR, Jobs, Dispatcher, User Management, Platform Admin, Audit, Settings
- 49 pages, 149 feature components
- **Full i18n**: English + Arabic with RTL support (3,501 translation keys, 18 namespaces)
- **No Redux in components** — only the theme system uses Redux (1 slice, 1 saga)
- **No API calls** — all data comes from `src/data/` files
- **No axios** — package fully removed
- **No services directory** — deleted
- Login page: modern split-screen design, zero-friction click-to-enter (no validation required)
- `AUTO_LOGIN` flag in auth-context.tsx — set `true` to bypass login entirely during development
- Branding: **OptifyServe**
- Database schema designed and verified (16 SQL files)

**Next milestone**: ASP.NET Core backend development + Redux integration

---

## Rules

### Code Quality
- **TypeScript strict mode** — no `any` types ever
- **No inline styles** — use Tailwind CSS classes only
- **No hardcoded colors** — use `primary`, `secondary`, `destructive` etc. (never `indigo-*`, `blue-*` etc.)
- **Reusable components** — prefer composition over duplication
- **No console.log** — remove debug logs before finishing
- **No dead code** — don't leave unused imports or commented-out blocks

### Authentication — React Context
Auth is handled by `src/contexts/auth-context.tsx`, NOT Redux.

```typescript
// Reading auth state
const { user, isAuthenticated, login, logout } = useAuth()

// Login — template mode: click Sign In to enter (no validation)
await login(email, password)

// Logout
logout()
```

> **AUTO_LOGIN flag**: Set `const AUTO_LOGIN = true` in auth-context.tsx to skip the login page entirely during development. Default is `false` (login page shown, but no validation — just click Sign In).

### Internationalization (i18n)
All UI strings use `react-i18next`. Two languages: English (default) + Arabic (RTL).

```typescript
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
// Usage: t('common.save'), t('crm.customerName'), t('validation.required')
```

**Key rules:**
- **Never hardcode UI strings** — always use `t('namespace.key')`
- **RTL**: Use Tailwind logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) instead of `ml-*`/`mr-*`/`pl-*`/`pr-*`/`left-*`/`right-*`
- **Language switcher**: Globe icon in TopNav, also accessible in Settings
- **Persistence**: Language preference saved in localStorage, auto-detected on first visit
- **Status labels**: Type configs use `key: 'status.active'` pattern, rendered with `t(config.key)` — not hardcoded `label` strings
- **Zod validation**: Schemas that need translated messages are built inside components using `useMemo` + `t()`

### Data — Static Sample Files
All page data comes from `src/data/*.data.ts` files. No API calls, no Redux dispatches for data.

```typescript
// Page pattern (current)
import { sampleCustomers } from '@/data/customers.data'

const CustomersPage = () => {
  const customers = sampleCustomers  // static data
  const isLoading = false            // no loading state needed
  // ... render UI
}
```

### State Management — Redux (Theme Only)
Redux Toolkit + Redux Saga are installed but **only used by the theme system**.
- Store: `src/store/` — rootReducer has only `theme` slice, rootSaga has only `themeSaga`
- Theme reads: `useAppSelector(s => s.theme)` — used by sidebar, mobile-sidebar, appearance-settings
- Do NOT add new slices until backend integration begins

### Forms — React Hook Form + Zod
All forms use React Hook Form with Zod validation schemas in `src/lib/validations.ts`.

### UI — shadcn/ui + Tailwind CSS
Use shadcn/ui components (in `src/components/ui/`). Shared components in `src/components/shared/`.

### Theme Colors — CSS Variable Based
All colors use Tailwind's CSS-variable classes. **Never** use hardcoded color names.

```
OK: bg-primary, text-primary, border-primary, bg-primary/10
BAD: bg-indigo-600, text-blue-500, border-violet-300
```

Status-semantic colors (green for success, red for error, amber for warning, blue for info) in badges/indicators are acceptable.

Button variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `success`, `soft`

---

## File Structure

```
src/
├── app/           # App.tsx (router + providers), protected-route.tsx
├── components/    # layout/ (6), shared/ (14 incl. language-switcher), ui/ (27 shadcn)
├── contexts/      # auth-context.tsx (login/logout/user), currency-context.tsx
├── data/          # 18 static sample data files (one per module)
├── features/      # 14 modules, each with: components/ types/ pages/ [utils/]
├── hooks/         # useLocalStorage, useDebounce, usePagination, useModal, useMediaQuery, useDirection
├── i18n/          # i18next config + translation files
│   ├── index.ts   # i18next initialization
│   └── locales/   # en.json (2,299 keys), ar.json (2,299 keys)
├── lib/           # utils.ts, constants.ts, validations.ts
├── store/         # index.ts, rootReducer.ts (theme only), rootSaga.ts (theme only), hooks.ts
├── types/         # common.types.ts, api.types.ts
└── styles/        # globals.css (CSS variables for theme)
```

### Feature Module Structure (each under `src/features/<module>/`)
```
<module>/
├── components/     # UI components specific to this module
├── types/          # TypeScript interfaces
├── pages/          # Page-level components (route targets)
└── utils/          # Module-specific utilities (optional)
```

> **No `store/` or `api/` directories** in feature modules. All data comes from `src/data/`.
> Only exception: `src/features/sales/hooks/use-vat-calculator.ts` — pure VAT calculation utility.

### Theme System (under `src/features/settings/theme/`)
```
theme/
├── themeTypes.ts            # ThemeColors, ThemePreset, THEME_PRESETS, DEFAULT_THEME_COLORS
├── themeSlice.ts            # Redux slice (setColorPreview, applyPreset, update/reset)
├── themeSaga.ts             # localStorage persistence (no API calls)
├── useThemeApplicator.ts    # Applies colors → CSS variables on <html>
└── components/
    ├── theme-preset-selector.tsx  # 4 clickable preset cards
    ├── color-customizer.tsx       # Drawer with all 8 color pickers
    ├── color-picker-field.tsx     # Single color picker input
    └── theme-preview.tsx          # Live component preview
```

### Sample Data Files (`src/data/`)
```
dashboard.data.ts       — KPIs, charts, activities
customers.data.ts       — 5-8 customers
leads.data.ts           — 5-8 leads
quotations.data.ts      — 5-8 quotations
invoices.data.ts        — 5-8 invoices
items.data.ts           — 8-10 inventory items
warehouses.data.ts      — 3 warehouses
stock.data.ts           — stock levels, movements
vendors.data.ts         — 5-8 vendors
purchase-orders.data.ts — 5-8 POs
accounts.data.ts        — COA, JEs, AR, AP, expenses, bank, VAT, financial data
employees.data.ts       — employees, departments, attendance, leaves, payroll, etc.
jobs.data.ts            — jobs, technicians, scheduling, service reports
dispatcher.data.ts      — technician locations, unassigned jobs
settings.data.ts        — company profile, branches, integrations
users.data.ts           — users, roles, permissions
admin.data.ts           — tenants, subscription data
audit.data.ts           — audit log entries
```

---

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Template mode | Pure UI, no API calls | Backend developer integrates later |
| Auth | React Context | Simple, no Redux overhead for auth |
| i18n | react-i18next + EN/AR | Enterprise bilingual support with RTL |
| Theme state | Redux Toolkit + Saga | Persists to localStorage, applies CSS vars |
| Build tool | Vite | Fast dev server, ESM-native |
| UI lib | shadcn/ui | Composable, customizable, Radix primitives |
| Forms | RHF + Zod | Type-safe validation, good DX |
| Colors | CSS variables + Tailwind | Theme-aware, no hardcoded colors |
| Theme default | UAE Premium (#1D4ED8) | Professional blue for UAE business |
| DB | PostgreSQL + RLS | Multi-tenant isolation at DB level |
| Backend | ASP.NET Core | Client preference, enterprise ecosystem |

---

## UAE-Specific

- **VAT**: 5% standard rate, zero-rated, exempt options
- **TRN**: 15-digit Tax Registration Number (XXX-XXXXXX-XXXXX)
- **Currency**: AED (UAE Dirham) — format: `AED 1,234.56`
- **Phone**: +971 XX XXX XXXX
- **Emirates**: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah
- **Labor Law**: 30 days annual leave, EOSB gratuity (21d/yr first 5 years, 30d/yr after)
- **Work Week**: Sun-Thu, Ramadan reduced hours

---

## When Making Changes

1. **Read `PROJECT_SPEC.md`** for the module you're changing
2. **Follow existing patterns** — check similar files in the same module
3. **Import data from `src/data/`** — do not create API calls or Redux slices
4. **Add types first** before writing components
5. **Use theme-aware colors** — `primary`, `destructive`, etc. Never hardcode color names
6. **Use `useAuth()`** for auth state — not Redux
7. **Use `t()` for all UI strings** — never hardcode English/Arabic text
8. **Use logical CSS properties** — `ms-*`/`me-*`/`ps-*`/`pe-*`/`start-*`/`end-*` for RTL compatibility
9. **Test at 3 breakpoints**: 375px (mobile), 768px (tablet), 1920px (desktop)
10. **Test both languages**: Switch EN ↔ AR to verify RTL layout and translations
11. **No dead code** — don't leave unused imports, console.logs, or commented-out blocks

## When Adding Backend Integration (Future)

When the ASP.NET Core backend is ready:
1. Install axios: `npm install axios`
2. Create `src/services/api/axios-instance.ts` with interceptors
3. Create Redux slices + sagas per module in `src/features/<module>/store/`
4. Register slices in `src/store/rootReducer.ts` and sagas in `src/store/rootSaga.ts`
5. Replace static data imports with `useAppSelector` + `dispatch(fetchXxxRequest())`
6. Replace `useAuth()` context with Redux auth slice (or keep context — your choice)
