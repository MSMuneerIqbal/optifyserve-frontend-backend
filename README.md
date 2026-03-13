# OptifyServe — SaaS ERP Platform

> Multi-tenant SaaS ERP for UAE service & maintenance companies

---

## Project Overview

OptifyServe is a full-stack ERP system designed for maintenance, cleaning, pest control, HVAC, plumbing, electrical, and facilities management companies operating in the UAE. It supports multi-tenancy with row-level security, bilingual UI (English + Arabic with RTL), and UAE-specific compliance (VAT, WPS, labor law).

| Stat | Value |
|------|-------|
| Modules | 14 |
| Frontend Pages | 49 |
| Feature Components | 149 |
| Translation Keys | 3,501 per language (EN + AR with RTL) |
| Theme Presets | 4 |
| Database Tables | ~84 with RLS |
| Database Enums | ~90 |

---

## Repository Structure

```
optifyserve-frontend-backend/
├── frontend/                  # React UI Template (complete)
│   ├── src/                   # Application source code
│   ├── PROJECT_SPEC.md        # Detailed technical specification
│   └── CLAUDE.md              # AI coding instructions
├── backend/                   # Node.js + Express + Prisma API (planned)
├── database/                  # PostgreSQL schema (complete)
└── README.md                  # This file
```

---

## Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Frontend** | React 19 + TypeScript 5.9 + Vite 7 | Complete |
| **UI Components** | shadcn/ui + Tailwind CSS 3.4 | Complete |
| **i18n** | react-i18next (English + Arabic with RTL) | Complete |
| **State** | Redux Toolkit + Saga (theme only) + React Context (auth) | Complete |
| **Forms** | React Hook Form + Zod | Complete |
| **Charts** | Recharts | Complete |
| **Tables** | TanStack React Table | Complete |
| **Database** | PostgreSQL 16 (schema designed) | Complete |
| **Backend** | Node.js + Express.js + Prisma ORM | Planned |
| **Auth** | JWT (access + refresh tokens) | Planned |

---

## Modules

| # | Module | Route | Pages | Description |
|---|--------|-------|-------|-------------|
| 1 | Auth | `/login` | 2 | Split-screen login, forgot password |
| 2 | Dashboard | `/dashboard` | 1 | KPIs, charts, urgent jobs, activity feed |
| 3 | CRM | `/crm/*` | 2 | Customers, leads pipeline, follow-ups |
| 4 | Sales | `/sales/*` | 2 | Quotations, invoices, VAT calculation |
| 5 | Inventory | `/inventory/*` | 5 | Items, warehouses, stock levels, movements |
| 6 | Purchase | `/purchase/*` | 5 | Vendors, POs, GRN, returns, payments |
| 7 | Accounts | `/accounts/*` | 9 | COA, journal, AR/AP, expenses, VAT, bank reconciliation |
| 8 | HR | `/hr/*` | 10 | Employees, attendance, leaves, payroll, EOSB |
| 9 | Jobs | `/jobs/*` | 5 | Job management, technicians, scheduling |
| 10 | Dispatcher | `/dispatcher` | 1 | Map view, job assignment, technician tracking |
| 11 | User Management | `/users/*` | 2 | User accounts, roles & permissions |
| 12 | Platform Admin | `/admin/*` | 3 | Tenant management, subscriptions, analytics |
| 13 | Audit | `/audit` | 1 | Audit log viewer with filters |
| 14 | Settings | `/settings/*` | 1 | Company profile, theme, notifications, security |

---

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` — click **Sign In** to enter (no credentials required in template mode).

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

A Node.js + Express.js + Prisma ORM Web API will be added in the `backend/` directory. The frontend is pre-designed with API endpoint contracts documented in [`frontend/PROJECT_SPEC.md`](frontend/PROJECT_SPEC.md#10-api-endpoints-backend-reference).

---

## Frontend Architecture

- **Pure UI Template** — all pages use static sample data from `src/data/` (18 files), no API calls
- **Auth**: React Context (`src/contexts/auth-context.tsx`) — zero-friction login for template mode
- **Theme**: 4 presets (Corporate Navy, Modern Teal, UAE Premium, OptifyServe) + full color customizer
- **i18n**: 3,501 keys per language across 18 namespaces with automatic RTL layout mirroring
- **Animations**: Page transitions, staggered card entrances, button micro-interactions

For full technical details, see [`frontend/PROJECT_SPEC.md`](frontend/PROJECT_SPEC.md).

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

**Key patterns**: UUID primary keys, `NUMERIC(15,2)` for money, `TIMESTAMPTZ` for dates, `tenant_id` on every business table, RLS policies on ~65 tables, 235 indexes, 22 triggers.

For setup guide and Node.js integration, see [`database/db_knowledge.md`](database/db_knowledge.md).

---

## UAE-Specific Compliance

| Area | Details |
|------|---------|
| **VAT** | 5% standard rate, zero-rated, exempt (FTA format) |
| **TRN** | 15-digit Tax Registration Number |
| **Currency** | AED (UAE Dirham) — `AED 1,234.56` |
| **Labor Law** | 30d annual leave, 90d sick leave, EOSB gratuity |
| **WPS** | Wage Protection System payroll compliance |
| **Emirates** | Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah |
| **Work Week** | Sun–Thu, Ramadan reduced hours support |

---

## System Architecture

```
┌─────────────┐       HTTPS       ┌──────────────────────────┐
│ Web Browser │ ◄───────────────► │ React Frontend (Vite)    │
│             │                   │ 49 pages, shadcn/ui      │
└─────────────┘                   │ i18n (EN/AR), RTL        │
                                  └────────────┬─────────────┘
                                               │ REST API (JSON)
                                               ▼
                                  ┌──────────────────────────┐
                                  │ Node.js + Express.js     │
                                  │ JWT Auth, RBAC           │
                                  │ Business Logic           │
                                  └────────────┬─────────────┘
                                               │ Prisma ORM
                                               ▼
                                  ┌──────────────────────────┐
                                  │ PostgreSQL 16            │
                                  │ ~84 tables, RLS          │
                                  │ Multi-tenant isolation   │
                                  └──────────────────────────┘
```

---

## Security

- **Multi-tenancy**: Row-Level Security (RLS) on ~65 business tables
- **Authentication**: JWT access tokens (15min) + refresh tokens (7d)
- **Authorization**: Role-Based Access Control — 52 granular permissions
- **Data**: `tenant_id` isolation, soft deletes, full audit logging

---

## Software Requirements Specification (SRS)

**ISO/IEC/IEEE 29148:2018 Compliant**

### 1. Introduction

#### 1.1 Purpose

This document provides a detailed Software Requirements Specification for a SaaS-based ERP system designed for service-based and maintenance companies operating in the UAE. It defines functional and non-functional requirements for developers, testers, project managers, and stakeholders.

#### 1.2 Document Conventions

- **shall** — mandatory requirement
- **should** — recommended feature
- **may** — optional feature

#### 1.3 Intended Audience

- Internal Development Team
- QA and Testing Team
- Project Managers
- Stakeholders and Product Owners

#### 1.4 Product Scope

The ERP system provides modules for CRM, Sales, Inventory, Purchase, Accounts, HR, Job/Service Management, Dispatcher, User Management, Platform Administration, Audit, and Settings with multi-company and multi-branch support.

#### 1.5 Definitions, Acronyms, Abbreviations

| Term | Definition |
|------|------------|
| ERP | Enterprise Resource Planning |
| CRM | Customer Relationship Management |
| VAT | Value Added Tax (5% in UAE) |
| TRN | Tax Registration Number |
| WPS | Wage Protection System |
| EOSB | End of Service Benefits |
| RLS | Row-Level Security |
| GRN | Goods Received Note |
| API | Application Programming Interface |

---

### 2. Overall Description

#### 2.1 Product Perspective

Web-based SaaS ERP application: React frontend, Node.js + Express.js backend with Prisma ORM, PostgreSQL database. Multi-tenant architecture with row-level security.

#### 2.2 Product Functions

- User and role management with granular permissions
- Customer and lead management (CRM)
- Quotation, invoicing, and payment tracking
- Inventory and multi-warehouse stock management
- Purchase orders, GRN, and vendor management
- Double-entry accounting, AR/AP, expenses, VAT returns
- HR: employees, attendance, leave, payroll, EOSB
- Job scheduling, technician dispatch, service reports
- Platform administration and audit logging
- Configurable settings with theme customization

#### 2.3 User Classes

| User Class | Description |
|------------|-------------|
| Super Admin | Platform-level access: tenants, subscriptions, analytics |
| Admin | Full tenant system access and configuration |
| Manager | Operational control, approvals, and reporting |
| Staff | Module-based limited access for daily operations |
| Technician | Job and service-related access (mobile-ready) |

#### 2.4 Operating Environment

- Web browsers: Chrome, Edge, Firefox, Safari
- Responsive: desktop (1920px), tablet (768px), mobile (375px)
- Cloud-hosted (Azure / AWS / Vercel)

---

### 3. System Features

#### 3.1 Core System
- Consolidated dashboard with KPIs, charts, urgent jobs, and activity feed
- Role-based access control with 52 granular permissions
- Secure JWT authentication with refresh tokens

#### 3.2 CRM Module
- Customer profiles with service history and contact management
- Lead pipeline with 5 stages (New, Follow-up, Qualified, Won, Lost)
- Follow-up tracking (call, email, meeting)

#### 3.3 Sales Module
- Quotation creation with multi-line items, discounts, VAT
- Quotation-to-invoice conversion
- Invoice payment recording with partial payment support
- PDF-style preview with company branding

#### 3.4 Inventory Management
- Item master with SKU, barcode, serial number tracking
- Multi-warehouse stock levels
- Stock in/out/transfer/adjustment movements
- Low stock alerts with reorder recommendations

#### 3.5 Purchase Module
- Vendor directory with ratings and payment terms
- Purchase orders with multi-level approval workflow
- Goods receipt with quality inspection
- Purchase returns and vendor payment recording

#### 3.6 Accounts & Finance
- Hierarchical chart of accounts (tree view)
- Double-entry journal entries with auto-balance validation
- AR/AP aging analysis (6 buckets)
- Expense claims with approval workflow
- Bank reconciliation with statement matching
- VAT return preparation (UAE FTA format)
- Financial reports: trial balance, P&L, balance sheet, cash flow

#### 3.7 HR Management
- Employee lifecycle management
- Attendance with GPS check-in/check-out, Ramadan shift support
- Leave management (9 types per UAE labor law)
- Payroll processing (WPS-ready)
- Performance reviews with goals and ratings
- EOSB gratuity calculation per UAE labor law
- Document management with expiry alerts
- Employee self-service portal

#### 3.8 Job & Service Management
- Job creation with customer, service type, priority, scheduling
- Technician skills and availability management
- Calendar and map views for scheduling
- Service reports with checklist, parts, photos, signatures
- Customer feedback with 5-star ratings

#### 3.9 Dispatcher
- Map view with technician and job markers
- Smart job assignment with scoring (distance, skills, availability)
- Technician utilization dashboard

---

### 4. External Interface Requirements

#### 4.1 User Interfaces
- Web-based responsive SPA (React)
- Bilingual: English + Arabic with automatic RTL layout

#### 4.2 Software Interfaces
- WhatsApp Business API (planned)
- Google Maps API (planned)
- Email/SMS Gateway (planned)

---

### 5. Non-Functional Requirements

#### 5.1 Performance
- Response time under 2 seconds for standard operations (100 concurrent users)
- Up to 500 concurrent users with response times under 5 seconds
- Database queries within 1 second for standard operations

#### 5.2 Security
- JWT authentication with role-based authorization
- Row-Level Security for tenant isolation
- Encrypted sensitive data (bcrypt for passwords)
- Full audit logging

#### 5.3 Availability
- High availability with automated backup and recovery
- Zero-downtime deployments

---

### 6. Architecture

See [System Architecture](#system-architecture) section above.

---

### 7. Database Schema

See [Database Schema](#database-schema) section above. Full schema files in [`frontend/database/`](frontend/database/).

---

## License

See the [LICENSE](LICENSE) file for details.
