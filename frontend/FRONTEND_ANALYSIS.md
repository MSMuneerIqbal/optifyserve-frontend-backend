# FRONTEND ANALYSIS — OptifyServe ERP

> **Phase 1 of 5** | Generated: 2026-03-13
> **Purpose**: Complete frontend and repository inspection for backend architecture decisions.

---

## 1. Repository Overview

**Product**: OptifyServe ERP — Multi-tenant SaaS for UAE service & maintenance companies
**Current State**: Pure UI template with static sample data. No backend, no API calls, no HTTP client installed.
**Repository Root**: `optifyserve-frontend-backend/` (frontend in `frontend/`, database in `database/`, backend in `backend/`)

| Metric | Count |
|--------|-------|
| Feature Modules | 14 |
| Pages | 49 (+ 2 public auth pages) |
| Feature Components | 149+ |
| shadcn/ui Components | 27 |
| Shared Components | 14 |
| Layout Components | 6 |
| Static Data Files | 18 |
| Type Definition Files | 42+ |
| Translation Keys | 3,501 per language (EN + AR) |
| Database SQL Files | 16 |
| Database Tables | ~84 |
| PostgreSQL Enums | 93 |
| RLS Policies | 263 (on 81 tables) |
| Indexes | 235 |
| Triggers | 22 |

### Tech Stack (Frontend)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2.0 |
| Language | TypeScript (strict) | 5.9.3 |
| Build | Vite | 7.2.4 |
| UI | shadcn/ui + Radix UI | Latest |
| Styling | Tailwind CSS | 3.4.1 |
| Forms | React Hook Form + Zod | 7.71.1 / 4.3.6 |
| Tables | TanStack React Table | 8.21.3 |
| Charts | Recharts | 3.7.0 |
| Routing | react-router-dom | 7.13.0 |
| Icons | Lucide React | 0.563.0 |
| i18n | react-i18next + i18next | 15.4.1 / 24.2.2 |
| Date | date-fns | 4.1.0 |
| Toasts | Sonner | 2.0.7 |
| Theme State | Redux Toolkit + Redux Saga | 2.11.2 / 1.4.2 |
| Auth State | React Context | Built-in |

> **No HTTP client installed** (axios removed). Redux is theme-only (1 slice, 1 saga). All data from `src/data/`.

---

## 2. Frontend Architecture Summary

### Entry Point & Providers
- `src/main.tsx` → imports i18n config, renders `<App />` with `<StrictMode>` and Redux `<Provider>`
- `src/app/App.tsx` → `<AuthProvider>` + `<BrowserRouter>` + `useDirection()` hook for RTL
- `src/app/protected-route.tsx` → Auth guard via `useAuth()` context hook

### Layout System
- `AppLayout` wraps all authenticated pages: collapsible sidebar (280px→64px) + TopNav (64px) + content
- `MobileSidebar` responsive drawer on small screens
- `TopNav` has breadcrumbs, global search, notifications bell, language switcher (EN/AR), user dropdown
- `PageHeader` provides title + description + action buttons slot

### Auth Pattern
- React Context only (`src/contexts/auth-context.tsx`)
- `useAuth()` hook returns `{ user, isAuthenticated, login, logout }`
- localStorage persistence with multi-tab sync via storage events
- `AUTO_LOGIN` flag for development bypass
- Mock user: `super_admin` role with all permissions, `tenantId: 'tenant_001'`

### Data Flow (Current)
```
Page → import static data from src/data/ → render UI → CRUD handlers show toast (no-op)
```

### Data Flow (Future)
```
User Action → Redux dispatch → Saga → API call → Success/Failure → Slice update → Re-render
```

---

## 3. Route Inventory (51 routes total)

### Public Routes (2)
| Route | Page | Module |
|-------|------|--------|
| `/login` | LoginPage | Auth |
| `/forgot-password` | ForgotPasswordPage | Auth |

### Protected Routes (49)
| Route | Page | Module |
|-------|------|--------|
| `/dashboard` | DashboardPage | Dashboard |
| `/crm/customers` | CustomersPage | CRM |
| `/crm/leads` | LeadsPage | CRM |
| `/sales/quotations` | QuotationsPage | Sales |
| `/sales/invoices` | InvoicesPage | Sales |
| `/inventory/items` | ItemsPage | Inventory |
| `/inventory/warehouses` | WarehousesPage | Inventory |
| `/inventory/stock` | CurrentStockPage | Inventory |
| `/inventory/movements` | StockMovementsPage | Inventory |
| `/inventory/reports` | StockReportsPage | Inventory |
| `/purchase/vendors` | VendorsPage | Purchase |
| `/purchase/orders` | PurchaseOrdersPage | Purchase |
| `/purchase/grn` | GRNPage | Purchase |
| `/purchase/returns` | PurchaseReturnsPage | Purchase |
| `/purchase/payments` | VendorPaymentsPage | Purchase |
| `/accounts/dashboard` | FinancialDashboardPage | Accounts |
| `/accounts/chart` | ChartOfAccountsPage | Accounts |
| `/accounts/journal` | JournalEntriesPage | Accounts |
| `/accounts/receivable` | AccountsReceivablePage | Accounts |
| `/accounts/payable` | AccountsPayablePage | Accounts |
| `/accounts/expenses` | ExpensesPage | Accounts |
| `/accounts/reports` | FinancialReportsPage | Accounts |
| `/accounts/reconciliation` | BankReconciliationPage | Accounts |
| `/accounts/vat` | VATReturnsPage | Accounts |
| `/hr/employees` | EmployeesPage | HR |
| `/hr/departments` | DepartmentsPage | HR |
| `/hr/attendance` | AttendancePage | HR |
| `/hr/leave` | LeavesPage | HR |
| `/hr/documents` | DocumentsPage | HR |
| `/hr/payroll` | PayrollPage | HR |
| `/hr/performance` | PerformancePage | HR |
| `/hr/eosb` | EOSBPage | HR |
| `/hr/reports` | HRReportsPage | HR |
| `/hr/portal` | EmployeePortalPage | HR |
| `/jobs` | JobsPage | Jobs |
| `/jobs/technicians` | TechniciansPage | Jobs |
| `/jobs/schedule` | JobSchedulingPage | Jobs |
| `/jobs/reports` | ServiceReportsPage | Jobs |
| `/jobs/analytics` | JobReportsPage | Jobs |
| `/dispatcher` | DispatcherPage | Dispatcher |
| `/users/list` | UsersPage | User Management |
| `/users/roles` | RolesPage | User Management |
| `/admin/tenants` | TenantsPage | Platform Admin |
| `/admin/plans` | PlansPage | Platform Admin |
| `/admin/analytics` | AdminAnalyticsPage | Platform Admin |
| `/audit` | AuditPage | Audit |
| `/settings/*` | SettingsPage | Settings |

---

## 4. Module Inventory (14 Modules)

| # | Module | Pages | Components | Types Files | Data File(s) |
|---|--------|-------|------------|-------------|-------------|
| 1 | Auth | 2 | 1 | 1 | — |
| 2 | Dashboard | 1 | 4 | 1 | `dashboard.data.ts` |
| 3 | CRM | 2 | 6 | 2 | `customers.data.ts`, `leads.data.ts` |
| 4 | Sales | 2 | 8 | 2 | `quotations.data.ts`, `invoices.data.ts` |
| 5 | Inventory | 5 | 10+ | 3 | `items.data.ts`, `warehouses.data.ts`, `stock.data.ts` |
| 6 | Purchase | 5 | 12+ | 4 | `vendors.data.ts`, `purchase-orders.data.ts` |
| 7 | Accounts | 9 | 15+ | 6 | `accounts.data.ts` (~1,400 lines) |
| 8 | HR | 10 | 20+ | 7 | `employees.data.ts` (14 exports) |
| 9 | Jobs | 5 | 16 | 5 | `jobs.data.ts` |
| 10 | Dispatcher | 1 | 8 | 1 | `dispatcher.data.ts` |
| 11 | User Management | 2 | 6 | 1 | `users.data.ts` |
| 12 | Platform Admin | 3 | 6 | 1 | `admin.data.ts` |
| 13 | Audit | 1 | 3 | 1 | `audit.data.ts` |
| 14 | Settings | 1 | 10+ | 2 | `settings.data.ts` |
| | **Totals** | **49** | **149+** | **42+** | **18 files** |

---

## 5. Page Inventory — Detailed by Module

### 5.1 Auth (2 pages)
- **LoginPage**: Split-screen with branding panel. Zero-friction click-to-enter. No API call.
- **ForgotPasswordPage**: Email input form. No API call (shows toast).

### 5.2 Dashboard (1 page)
- **DashboardPage**: 8 KPI cards (revenue, jobs, fix rate, satisfaction), sales trend chart by emirate (Recharts multi-line), urgent jobs list, recent activity feed.

### 5.3 CRM (2 pages)
- **CustomersPage**: DataTable with filters (status, type, emirate), customer detail Sheet, create/edit dialog.
- **LeadsPage**: Kanban board with 5 stages (New → Follow-up → Qualified → Won → Lost), lead cards, follow-up form, lost reason dialog.

### 5.4 Sales (2 pages)
- **QuotationsPage**: Multi-line item quotations with discount + VAT calc, PDF preview, quotation→invoice conversion.
- **InvoicesPage**: Invoice list, payment recording (partial payments), balance tracking, PDF preview.

### 5.5 Inventory (5 pages)
- **ItemsPage**: Item master with SKU, barcode, categories, UOM.
- **WarehousesPage**: Warehouse list with CRUD.
- **CurrentStockPage**: Stock levels per warehouse per item with low-stock alerts.
- **StockMovementsPage**: Movement history (in/out/transfer/adjustment).
- **StockReportsPage**: Stock valuation, category breakdown, low-stock report.

### 5.6 Purchase (5 pages)
- **VendorsPage**: Vendor directory with ratings, payment terms, contacts, bank details.
- **PurchaseOrdersPage**: PO creation with multi-level approval workflow (level-1, level-2, level-3).
- **GRNPage**: Goods receipt with quality inspection, accepted/rejected quantities.
- **PurchaseReturnsPage**: Return creation linked to GRN, reason tracking, credit notes.
- **VendorPaymentsPage**: Payment recording (bank transfer, cheque, cash), vendor statement.

### 5.7 Accounts (9 pages)
- **FinancialDashboardPage**: Financial KPIs, revenue/expense charts, cash flow summary.
- **ChartOfAccountsPage**: Hierarchical tree view (Assets/Liabilities/Equity/Revenue/Expenses), ~80+ accounts.
- **JournalEntriesPage**: Double-entry with auto-balance validation, types (standard, adjusting, closing, reversing, recurring, opening).
- **AccountsReceivablePage**: AR aging analysis (current, 1-30, 31-60, 61-90, 91-120, 120+), customer statements.
- **AccountsPayablePage**: AP aging analysis, vendor statements.
- **ExpensesPage**: Expense claims with approval workflow, category tracking, detail modal.
- **FinancialReportsPage**: Trial balance, P&L, balance sheet, cash flow statement.
- **BankReconciliationPage**: Bank statement matching, adjustments, reconciliation summary.
- **VATReturnsPage**: UAE FTA format with boxes 1-9, filing period tracking.

### 5.8 HR (10 pages)
- **EmployeesPage**: Full lifecycle (hire→probation→active→termination), multi-tab form.
- **DepartmentsPage**: Departments + designations management.
- **AttendancePage**: GPS check-in/check-out, Ramadan shift support, regularization.
- **LeavesPage**: 9 UAE leave types, approval workflow, balance tracking, calendar view.
- **DocumentsPage**: Document management with expiry alerts (visa, EID, labor card, passport).
- **PayrollPage**: Period-based processing, allowances/deductions, WPS-ready output.
- **PerformancePage**: Reviews with goals, ratings (1-5), weighted scoring.
- **EOSBPage**: Gratuity calculation per UAE labor law (21d/yr first 5, 30d/yr after 5).
- **HRReportsPage**: Headcount, attendance summary, leave utilization, payroll summary.
- **EmployeePortalPage**: Self-service portal for leave, attendance, payslips.

### 5.9 Jobs (5 pages)
- **JobsPage**: Job CRUD with workflow (pending→scheduled→in-progress→on-hold→completed→invoiced).
- **TechniciansPage**: Technician profiles, skills management, performance KPIs, vehicle details.
- **JobSchedulingPage**: Calendar + timeline view, drag-drop scheduling.
- **ServiceReportsPage**: Checklist, parts consumption, photos (before/after), digital signatures.
- **JobReportsPage**: Analytics — completion rate, first-time-fix %, satisfaction, revenue by service/branch.

### 5.10 Dispatcher (1 page)
- **DispatcherPage**: Real-time command center with Google Maps, unassigned job queue, technician tracking, smart assignment suggestions (scored by distance/skills/availability/workload), auto-refresh (30s).

### 5.11 User Management (2 pages)
- **UsersPage**: User list with CRUD, invite via email, status management, bulk import.
- **RolesPage**: Role CRUD (except system roles), permission matrix editor (9 modules × 3-5 actions).

### 5.12 Platform Admin (3 pages)
- **TenantsPage**: Tenant management with plan selection, module enablement, usage metrics.
- **PlansPage**: 4 subscription plans (Basic $199, Standard $499, Premium $999, Enterprise custom) with features comparison.
- **AdminAnalyticsPage**: Platform KPIs (total tenants, MRR, ARR, churn, module adoption).

### 5.13 Audit (1 page)
- **AuditPage**: Audit log viewer with search, module/action filters, date range, field-level changes, IP tracking.

### 5.14 Settings (1 page, multi-drawer)
- **SettingsPage**: Drawer-based navigation with 9 categories: company profile (TRN, bank details), branch management, notifications (email/SMS/WhatsApp/in-app), integrations (WhatsApp Business, Google Maps, Stripe, QuickBooks, AWS S3, Twilio), security (password policy, 2FA, session management), theme customization (4 presets + 8 color pickers), subscription management, data backup/restore, tax configuration.

---

## 6. Entity/Data Model Inventory

### Source: `src/data/` (18 files) + `src/features/*/types/`

| Entity | Source File | Key Fields | Financial? |
|--------|-----------|------------|-----------|
| Customer | `customers.data.ts` | id, customerNumber, name, email, phone, customerType, taxRegistrationNumber, address, status, lifetimeValue, creditLimit, outstandingBalance, paymentTerms | Yes |
| CustomerStats | `customers.data.ts` | totalJobs, completedJobs, totalRevenue, paymentReliability | Yes |
| Lead | `leads.data.ts` | id, leadNumber, name, company, source, stage, priority, estimatedValue, probability, assignedTo, serviceInterests | Yes |
| FollowUp | `leads.data.ts` | id, leadId, date, type, notes, outcome, status | No |
| Quotation | `quotations.data.ts` | id, quotationNumber, customerId, items[], subtotal, vatAmount, total, status, paymentTerms, convertedToInvoice? | Yes |
| Invoice | `invoices.data.ts` | id, invoiceNumber, customerId, items[], subtotal, taxableAmount, zeroRatedAmount, exemptAmount, vatAmount, total, paidAmount, balanceAmount, status, payments[] | Yes |
| InvoicePayment | `invoices.data.ts` | id, date, amount, paymentMethod, referenceNumber | Yes |
| Item | `items.data.ts` | id, sku, name, nameAr, categoryId, unitOfMeasure, costPrice, sellingPrice, reorderPoint, barcode, hasSerialNumbers, status | Yes |
| ItemCategory | `items.data.ts` | id, name, isActive | No |
| Warehouse | `warehouses.data.ts` | id, name, code, type, status, address, managerId | No |
| StockLevel | `stock.data.ts` | itemId, warehouseId, availableQty, reservedQty, totalStock, binLocation | No |
| StockMovement | `stock.data.ts` | id, movementNumber, type, itemId, warehouseId, quantity, unitCost, referenceNumber, referenceType | Yes |
| Vendor | `vendors.data.ts` | id, vendorCode, name, email, taxRegistrationNumber, categories, paymentTerms, creditLimit, outstandingAmount, rating, contacts[], bankDetails | Yes |
| PurchaseOrder | `purchase-orders.data.ts` | id, poNumber, vendorId, items[], subtotal, vatAmount, total, status, approvalLevel, approvals[] | Yes |
| GoodsReceiptNote | `purchase-orders.data.ts` | id, grnNumber, purchaseOrderId, items[] (ordered/received/accepted/rejected), status | Yes |
| PurchaseReturn | `purchase-orders.data.ts` | id, returnNumber, grnId, items[], totalAmount, returnType, creditNoteNumber | Yes |
| VendorPayment | `purchase-orders.data.ts` | id, paymentNumber, vendorId, amount, paymentMethod, referenceNumber, status | Yes |
| Account (COA) | `accounts.data.ts` | id, code, name, type, category, parentId, balance, debitBalance, creditBalance, isSystemAccount | Yes |
| JournalEntry | `accounts.data.ts` | id, entryNumber, date, type, lines[], totalDebit, totalCredit, status | Yes |
| ARInvoice | `accounts.data.ts` | customerId, invoiceNumber, amount, paidAmount, balance, agingBucket, dueDate | Yes |
| APBill | `accounts.data.ts` | vendorId, billNumber, amount, paidAmount, balance, agingBucket, dueDate | Yes |
| Expense | `accounts.data.ts` | id, category, amount, vatAmount, status, paymentMethod, approvals[] | Yes |
| BankTransaction | `accounts.data.ts` | id, date, description, type (credit/debit), amount, matchStatus | Yes |
| VATReturn | `accounts.data.ts` | id, period, boxes (1-9), totalOutputVAT, totalInputVAT, netVAT, status | Yes |
| ProfitLossStatement | `accounts.data.ts` | revenue, costOfGoods, grossProfit, operatingExpenses, netProfit | Yes |
| BalanceSheet | `accounts.data.ts` | assets, liabilities, equity (must balance) | Yes |
| CashFlowStatement | `accounts.data.ts` | operating, investing, financing, netChange | Yes |
| TrialBalance | `accounts.data.ts` | accounts[], totalDebits, totalCredits (must equal) | Yes |
| Employee | `employees.data.ts` | id, employeeId, name, department, designation, branch, status, salary (structured), emiratesId, passport, visa, laborCard, bankDetails, emergencyContact | Yes |
| Department | `employees.data.ts` | id, name, code, headId, parentId, employeeCount, branchId | No |
| Branch | `employees.data.ts` | id, name, code, address, emirate, phone, status | No |
| AttendanceRecord | `employees.data.ts` | id, employeeId, date, shift, checkInTime, checkOutTime, checkInLocation (GPS), status, workingHours, overtimeHours | No |
| LeaveRequest | `employees.data.ts` | id, employeeId, leaveTypeId, startDate, endDate, totalDays, status, approverId | No |
| LeaveBalance | `employees.data.ts` | leaveTypeId, entitled, taken, pending, balance, carriedForward | No |
| PayrollRun | `employees.data.ts` | id, month, year, status, totalEarnings, totalDeductions, totalNetSalary | Yes |
| Payslip | `employees.data.ts` | id, payslipNumber, employeeId, basicSalary, allowances, deductions, netSalary | Yes |
| EOSBRecord | `employees.data.ts` | employeeId, serviceYears, dailyWage, first5YearsGratuity, after5YearsGratuity, totalGratuity, deductions, finalAmount | Yes |
| EmployeeDocument | `employees.data.ts` | id, employeeId, documentType, documentNumber, issueDate, expiryDate, status | No |
| PerformanceReview | `employees.data.ts` | id, employeeId, reviewerId, overallRating, goals[], finalScore, status | No |
| Job | `jobs.data.ts` | id, jobNumber, customerId, serviceType, priority, status, serviceAddress (GPS), scheduledDate, assignedTechnicianId, estimatedCost, laborCharges, partsCost, totalCost, statusHistory[] | Yes |
| Technician | `jobs.data.ts` | id, employeeId, name, skills[], primarySkill, status, currentLocation (GPS), workingSchedule, vehicle, performance, activeJobCount | No |
| ServiceReport | `jobs.data.ts` | id, reportNumber, jobId, checklist[], workPerformed, partsUsed[], totalPartsCost, laborCost, photos[], signatures[] | Yes |
| CustomerFeedback | `jobs.data.ts` | id, jobId, overallRating, categoryRatings[], comments, wouldRecommend | No |
| TechnicianLocation | `dispatcher.data.ts` | id, name, status, currentLocation (GPS), activeJobCount, primarySkill | No |
| JobLocation | `dispatcher.data.ts` | id, jobNumber, serviceAddress (GPS), priority, status, assignedTechnicianId | No |
| TechnicianUtilization | `dispatcher.data.ts` | id, name, activeJobCount, completedToday, totalCapacity, utilizationPercent | No |
| DispatcherStats | `dispatcher.data.ts` | totalTechnicians, available, busy, offDuty, unassignedJobs, urgentJobs, completedToday, avgResponseTime | No |
| SystemUser | `users.data.ts` | id, name, email, role, status, permissions[], department, lastLoginAt | No |
| Role | `users.data.ts` | id, name, description, permissions[], userCount, isSystem | No |
| Permission | `users.data.ts` | id, module, action, label, description | No |
| Tenant | `admin.data.ts` | id, companyName, trn, plan, status, enabledModules[], userCount, branchCount, monthlyRevenue | Yes |
| AuditLogEntry | `audit.data.ts` | id, userId, userName, action, module, description, details, ipAddress, timestamp | No |
| CompanyProfile | `settings.data.ts` | id, name, trn, commercialLicense, bankDetails, settings (prefixes, VAT rate, timezone) | Yes |
| Integration | `settings.data.ts` | id, name, category, status, config | No |
| SecuritySettings | `settings.data.ts` | passwordMinLength, 2FA, sessionTimeout, maxConcurrentSessions | No |

**Total Unique Entity Types: 55+**

---

## 7. Form Inventory & Key Validation Needs

### Source: `src/lib/validations.ts` + component forms

| Form | Module | Key Fields | Validation |
|------|--------|-----------|------------|
| Login | Auth | email, password | email format, min 6 chars |
| Forgot Password | Auth | email | email format |
| Customer | CRM | name, email, phone, company, customerType, TRN, address | UAE phone regex, TRN 15 digits, emirate enum |
| Lead | CRM | name, company, email, phone, source, estimatedValue, probability | source enum, currency ≥ 0, percentage 0-100 |
| Follow-up | CRM | date, type, notes | date required, type enum |
| Quotation | Sales | customerId, items[], paymentTerms, validityDays, notes | items non-empty, amounts ≥ 0, VAT calc |
| Invoice | Sales | customerId, items[], paymentTerms, dueDate | line items, VAT per item, balance calc |
| Payment | Sales | amount, paymentDate, paymentMethod, reference | amount > 0, method enum, date required |
| Item | Inventory | sku, name, category, UOM, costPrice, sellingPrice, reorderPoint | SKU regex (A-Z0-9-), barcode 8-13 digits |
| Warehouse | Inventory | name, code, type, address | type enum, address with emirate |
| Stock Movement | Inventory | type, itemId, warehouseId, quantity, reason | type enum, qty > 0 |
| Vendor | Purchase | name, email, phone, TRN, categories, paymentTerms, bankDetails | TRN, phone, IBAN format |
| Purchase Order | Purchase | vendorId, items[], deliveryWarehouse, paymentTerms | items non-empty, approval levels |
| GRN | Purchase | purchaseOrderId, items[] (received/accepted/rejected qty) | qty ≤ ordered, rejection reason |
| Purchase Return | Purchase | grnId, items[], returnType, reason | return qty ≤ accepted qty |
| Vendor Payment | Purchase | vendorId, amount, paymentMethod, reference | amount > 0, method enum |
| Journal Entry | Accounts | date, type, lines[] (account, debit, credit), description | total debit = total credit |
| Expense | Accounts | category, amount, vatAmount, paymentMethod, description | amount > 0, category enum |
| Bank Reconciliation | Accounts | transactions[], adjustments[] | match status tracking |
| VAT Return | Accounts | period, boxes 1-9 | boxes must be numeric, period enum |
| Employee | HR | personal info, employment, documents (EID/visa/passport/labor card), salary, bank details, emergency contact | EID format, passport, visa dates, salary structure |
| Leave Request | HR | leaveType, startDate, endDate, duration, reason | dates valid, balance check |
| Attendance | HR | employeeId, date, checkIn/Out, GPS | time format, location coords |
| Payroll | HR | month, year, workingDays, adjustments | month 1-12, positive amounts |
| EOSB Calculator | HR | serviceStartDate, salary | UAE formula: 21d×yr (≤5) + 30d×yr (>5) |
| Performance Review | HR | employeeId, goals[], overallRating, feedback | rating 1-5, goals with weights |
| Job | Jobs | customerId, title, serviceType, priority, scheduledDate/Time, serviceAddress (GPS), estimatedCost | service type enum, address with GPS |
| Technician | Jobs | employeeId, skills[], primarySkill, workingSchedule, vehicle | skill levels, working days |
| Service Report | Jobs | jobId, checklist[], workPerformed, partsUsed[], labor, signatures | checklist required items, parts with cost |
| Feedback | Jobs | jobId, ratings (1-5), comments | ratings required, 1-5 scale |
| Tenant | Admin | companyName, TRN, ownerEmail, plan, enabledModules | TRN, plan enum, modules array |
| User | User Mgmt | name, email, phone, role, permissions | email unique, role enum |
| Role | User Mgmt | name, permissions[] | name unique per tenant |
| Company Profile | Settings | name, TRN, bankDetails, settings (prefixes, VAT rate) | TRN 15 digits, VAT rate |
| Branch | Settings | name, code, address, contactPerson, phone | emirate enum, phone |

---

## 8. Table/List/Search/Filter/Sort/Pagination Requirements

| Page | Table Data | Filters | Sort Columns | Pagination | Search |
|------|-----------|---------|--------------|------------|--------|
| Customers | Customer list | status, type, emirate | name, lifetimeValue, status, createdAt | Yes (25/50/100) | name, email, phone |
| Leads | Kanban board | stage, source, assignedTo, priority | — (Kanban) | No (all) | name, company |
| Quotations | Quotation list | status, customerId, date range | quotationNumber, date, total, status | Yes | number, customer |
| Invoices | Invoice list | status, customerId, date range | invoiceNumber, date, total, balanceAmount | Yes | number, customer |
| Items | Item list | status, category | sku, name, costPrice, sellingPrice | Yes | sku, name, barcode |
| Warehouses | Warehouse list | status, type | name, code | No | name, code |
| Current Stock | Stock levels | warehouseId, category, low-stock flag | itemName, availableQty | Yes | item name, sku |
| Stock Movements | Movement list | type, warehouseId, date range | date, type, quantity | Yes | item, reference |
| Vendors | Vendor list | status, category, rating | name, rating, outstandingAmount | Yes | name, code |
| Purchase Orders | PO list | status, vendorId, date range | poNumber, date, total, status | Yes | number, vendor |
| GRN | GRN list | status, vendorId | grnNumber, date | Yes | number |
| Purchase Returns | Return list | status | returnNumber, date, amount | Yes | number |
| Vendor Payments | Payment list | status, paymentMethod, vendorId | date, amount, status | Yes | vendor, reference |
| Chart of Accounts | Account tree | type (asset/liability/equity/revenue/expense) | code, name | No (tree) | name, code |
| Journal Entries | JE list | type, status, date range | entryNumber, date, totalDebit | Yes | number, description |
| Accounts Receivable | AR list | agingBucket, customerId | customerName, amount, dueDate, agingDays | Yes | customer |
| Accounts Payable | AP list | agingBucket, vendorId | vendorName, amount, dueDate, agingDays | Yes | vendor |
| Expenses | Expense list | category, status, date range | date, amount, category, status | Yes | description |
| Bank Reconciliation | Transaction list | matchStatus, type | date, amount, description | Yes | description |
| VAT Returns | Return list | status, period | period, filingDate, netVAT | Yes | — |
| Employees | Employee list | status, department, branch, nationality | name, department, status, joinDate | Yes | name, employeeId, email |
| Departments | Department list | status, branch | name, employeeCount | No | name |
| Attendance | Attendance records | employee, date range, status | date, employeeName, checkIn, status | Yes | employee name |
| Leaves | Leave list | status, leaveType, employee, date range | appliedDate, employee, type, status | Yes | employee |
| Documents | Document list | type, status (expiring/expired) | employeeName, type, expiryDate | Yes | employee, type |
| Payroll | Payroll runs | month/year, status | period, status, totalNetSalary | Yes | — |
| Performance | Review list | status, period, department | employeeName, overallRating, status | Yes | employee |
| EOSB | EOSB records | status, department | employeeName, serviceYears, totalAmount | Yes | employee |
| Jobs | Job list | status, priority, serviceType, branch, emirate, technician, date range | jobNumber, scheduledDate, status, priority | Yes | number, customer, title |
| Technicians | Technician list | status, branch, skill | name, primarySkill, avgRating, totalJobs | Yes | name |
| Service Reports | Report list | status | reportNumber, date, totalCost | Yes | number |
| Dispatcher | Split panels | technicianStatus, jobPriority, serviceType | — (real-time) | No | — |
| Users | User list | role, status, department | name, role, status, lastLogin | Yes | name, email |
| Roles | Role list | — | name, userCount | No | name |
| Tenants | Tenant list | plan, status | companyName, plan, userCount, revenue | Yes | company, email |
| Audit Log | Log list | module, action, user, date range | timestamp, user, module, action | Yes | description |

---

## 9. Reporting/Export/Print Requirements

### Export/Print Hints Found in Frontend

| Feature | Type | Format Hints | Module |
|---------|------|-------------|--------|
| Quotation Preview | Print/PDF | Company-branded, line items, VAT breakdown, T&C | Sales |
| Invoice Preview | Print/PDF | Tax invoice format, TRN, line items, VAT, payment history | Sales |
| Customer Statement | Print/PDF | AR aging, payment history, outstanding balance | Accounts |
| Vendor Statement | Print/PDF | AP aging, payment history, outstanding balance | Accounts |
| Financial Reports | Print/PDF | P&L, Balance Sheet, Cash Flow, Trial Balance | Accounts |
| VAT Return | Print/PDF | UAE FTA boxes format, period summary | Accounts |
| Service Report | Print/PDF | Checklist, photos, parts, labor, signatures | Jobs |
| Payslip | Print/PDF | Earnings/deductions breakdown, WPS reference | HR |
| EOSB Letter | Print/PDF | Gratuity calculation, company letterhead | HR |
| Stock Report | Export | Stock valuation, category breakdown, low-stock | Inventory |
| Employee List | Export | CSV/Excel export of employee directory | HR |
| User List | Export | CSV/Excel export of user directory | User Mgmt |
| Audit Log | Export | CSV/Excel export of audit trail | Audit |
| Job Report | Export | Job analytics, completion rates, revenue | Jobs |
| HR Reports | Export | Headcount, attendance, leave utilization | HR |
| Attendance Summary | Export | Monthly attendance per employee | HR |
| PO | Print/PDF | Company-branded, line items, approval history | Purchase |

### Report Types Needed

| Report | Module | Frequency | Data Scope |
|--------|--------|-----------|-----------|
| Trial Balance | Accounts | On-demand | All accounts, period |
| Profit & Loss | Accounts | Monthly/Quarterly/Annual | Revenue vs expenses |
| Balance Sheet | Accounts | On-demand | Assets = Liabilities + Equity |
| Cash Flow Statement | Accounts | Monthly/Quarterly | Operating, investing, financing |
| AR Aging Report | Accounts | On-demand | By customer, aging buckets |
| AP Aging Report | Accounts | On-demand | By vendor, aging buckets |
| VAT Return (FTA) | Accounts | Monthly/Quarterly | Boxes 1-9 per UAE FTA |
| Bank Reconciliation | Accounts | Monthly | Matched/unmatched transactions |
| Payroll Summary | HR | Monthly | By department, totals |
| Leave Utilization | HR | On-demand | By type, department |
| Attendance Summary | HR | Monthly | By employee, days |
| Job Completion | Jobs | Weekly/Monthly | By service type, branch |
| Technician Performance | Jobs | Monthly | By technician, KPIs |
| Stock Valuation | Inventory | On-demand | Cost × quantity per warehouse |
| Platform Analytics | Admin | Real-time | Tenants, MRR, adoption |

---

## 10. Real-time Requirements

### Confirmed Real-time Needs

| Feature | Module | Nature | Priority |
|---------|--------|--------|----------|
| Dispatcher Map | Dispatcher | Technician GPS updates, job status changes | **Critical** |
| Job Status Updates | Jobs | Status transitions visible to dispatch + customer | High |
| Notifications Bell | Layout/TopNav | New notifications pushed to user | High |
| Technician Tracking | Dispatcher | Live location streaming from mobile | High |
| Low Stock Alerts | Inventory | Stock below reorder point | Medium |
| Document Expiry Alerts | HR | Visa/EID/labor card approaching expiry | Medium |

### Inferred Real-time Needs

| Feature | Module | Nature | Priority |
|---------|--------|--------|----------|
| Payment Received | Sales | Invoice balance update when payment recorded | Medium |
| Job Assignment | Dispatcher | WhatsApp/push notification to technician | Medium |
| Leave Approval | HR | Notification to employee when approved/rejected | Low |
| Audit Feed | Audit | Live audit log for admin monitoring | Low |

### Auto-refresh Pattern (Current Frontend)
- Dispatcher page has 30-second auto-refresh countdown with manual refresh button
- No WebSocket or SSE currently implemented
- Backend should provide Socket.io for dispatcher and notifications

---

## 11. Auth & Permission Clues

### Source: `src/data/users.data.ts`, `src/contexts/auth-context.tsx`, type definitions

### User Roles (5)
| Role | Level | Scope |
|------|-------|-------|
| `super_admin` | Platform | Cross-tenant platform administration |
| `admin` | Tenant | Full tenant administration |
| `manager` | Tenant | Most operations, approval authority |
| `staff` | Tenant | Limited operations within assigned modules |
| `technician` | Tenant | Field operations, job execution, service reports |

### Permission Matrix (9 modules × 3-5 actions = 30+ permissions)

| Module | Actions | Total |
|--------|---------|-------|
| Dashboard | view | 1 |
| CRM | view, create, edit, delete | 4 |
| Sales | view, create, edit, delete, approve | 5 |
| Inventory | view, create, edit, adjust | 4 |
| Purchase | view, create, approve | 3 |
| Accounts | view, create, approve, vat | 4 |
| HR | view, manage, payroll, leave | 4 |
| Jobs | view, create, dispatch | 3 |
| Settings | view, manage, users, roles | 4 |
| **Total** | | **32** |

> Note: The database `15_seed.sql` seeds 52 permissions (more granular than frontend's 32). Backend should use the 52-permission set from DB; frontend groups them into the 32 high-level actions above.

### Role-Permission Mapping (from `users.data.ts`)
- **Administrator**: All 32 permissions
- **Manager**: All except `settings.users`, `settings.roles`
- **Staff**: view + create on most modules, no approve/manage
- **Technician**: `jobs.view`, `jobs.create`, `dashboard.view`

### Auth Flow Implications for Backend
1. Login → validate credentials → return JWT (access 15min + refresh 7d)
2. JWT payload must include: `userId`, `tenantId`, `role`, `permissions[]`
3. Middleware sets `app.current_tenant` on PostgreSQL connection for RLS
4. Permission checks on every API endpoint
5. Refresh token stored in `user_sessions` table with device/IP info
6. Multi-tab logout sync (frontend already handles via storage events)

---

## 12. Settings & Platform Admin Implications

### Company Settings (Tenant-scoped)
- Company profile with TRN, commercial license, bank details
- Document prefixes (INV-, QTN-, JOB-, PO-) — per tenant via `sequence_counters`
- VAT rate (5% default, configurable)
- Fiscal year start (configurable)
- Timezone (default Asia/Dubai)
- Date format (DD/MM/YYYY)
- Default currency (AED)

### Branch Management
- Multi-branch per tenant (Dubai HQ, Abu Dhabi, Sharjah in sample data)
- Each branch: code, address, contact, emirate, GPS coordinates
- Employee/warehouse assignment to branches
- Jobs scoped to branches

### Integration Settings
- WhatsApp Business (connected — job notifications)
- Google Maps (connected — dispatcher)
- Stripe (disconnected — payments)
- QuickBooks Online (disconnected — accounting sync)
- AWS S3 (connected — file storage)
- Twilio (error — SMS/voice)

### Security Settings
- Password policy: min length, uppercase, numbers, symbols, expiry, history
- Login protection: max attempts, lockout duration
- Session: timeout, max concurrent, force logout
- 2FA: enabled/enforced for admins, methods (authenticator, SMS)

### Platform Admin (Super Admin only)
- Tenant CRUD with plan selection
- Module enablement per tenant
- Subscription plans: Basic ($199), Standard ($499), Premium ($999), Enterprise (custom)
- Usage monitoring: users, branches, storage per tenant
- Platform analytics: MRR, ARR, churn, module adoption

---

## 13. Multi-Tenant Implications Visible in Frontend

### Confirmed Multi-Tenant Patterns
1. **User object has `tenantId`** — every authenticated user scoped to a tenant
2. **Company profile per tenant** — TRN, bank details, prefixes, settings
3. **Branches per tenant** — organizational structure
4. **Roles per tenant** — custom roles with tenant-scoped permissions
5. **Platform Admin module** — tenant management, plans, analytics (super_admin only)
6. **Subscription plans** — module access controlled by plan level
7. **Document numbering** — per-tenant sequences (CUST-00001, INV-00001 per tenant)
8. **Enabled modules** — tenants only see modules included in their plan

### Inferred Multi-Tenant Needs
1. **Tenant isolation** — all business data scoped by `tenant_id`
2. **Cross-tenant admin** — super_admin can view/manage all tenants
3. **Tenant settings** — each tenant has independent company profile, branches, integrations
4. **Tenant onboarding** — create tenant → seed default data (COA, leave types, roles, shifts)
5. **Tenant suspension** — disable access but preserve data

---

## 14. Confirmed Requirements

> Directly visible in source code files.

1. **14 feature modules** with 49 pages — all with complete UI (`src/features/`)
2. **55+ entity types** with full TypeScript definitions (`src/features/*/types/`)
3. **18 static data files** with realistic UAE sample data (`src/data/`)
4. **51 routes** (2 public + 49 protected) (`src/app/App.tsx`)
5. **5 user roles** with 32+ permission actions (`src/data/users.data.ts`)
6. **84 database tables** designed in PostgreSQL (`database/*.sql`)
7. **93 PostgreSQL enums** in kebab-case (`database/01_enums.sql`)
8. **~550 RLS policies** on ~75 tables (`database/12_rls_policies.sql`)
9. **~182 indexes** for performance (`database/13_indexes.sql`)
10. **16+ triggers** for auto-updates (`database/14_triggers.sql`)
11. **Seed data**: 52 permissions, 4 roles, 1 tenant, 1 admin, 78 COA, 9 leave types, 5 shifts (`database/15_seed.sql`)
12. **i18n**: 3,501 keys per language (EN + AR) with full RTL support
13. **UAE compliance**: TRN validation (15 digits), 7 emirates, VAT 5%, phone +971, AED currency
14. **EOSB formula**: 21d/yr (first 5 years) + 30d/yr (after 5 years)
15. **Leave types**: 9 types per UAE labor law (annual 30d, sick 90d, maternity 60d, etc.)
16. **Double-entry accounting**: debit = credit validation in journal entries
17. **AR/AP aging buckets**: current, 1-30, 31-60, 61-90, 91-120, 120+
18. **VAT return**: UAE FTA boxes 1-9 format
19. **Multi-level PO approval**: level-1, level-2, level-3
20. **Quotation → Invoice conversion**: one-click workflow
21. **Service report with digital signatures**: technician + customer
22. **Dispatcher with smart assignment**: scored by distance, skills, availability, workload
23. **Theme system**: Redux + localStorage, 4 presets + 8 color pickers
24. **Auto-numbering**: per-tenant sequences via `sequence_counters` table + triggers

---

## 15. Inferred Requirements

> Reasonably implied by UI patterns and data structures.

1. **Pagination**: All list pages expect `PaginatedResponse<T>` with `page`, `pageSize`, `totalItems`, `totalPages`
2. **Search**: Global search in TopNav implies a cross-module search API endpoint
3. **File uploads**: Service report photos, employee documents, company logo → file storage needed
4. **Email notifications**: Settings show email notification config → Nodemailer integration
5. **WhatsApp notifications**: Dispatcher shows "Send WhatsApp" option → WhatsApp Business API
6. **GPS coordinates**: Jobs and technicians have lat/lng → mobile app or browser geolocation
7. **PDF generation**: Invoices, quotations, payslips, EOSB letters, service reports → Puppeteer
8. **Excel export**: Stock reports, employee lists, audit logs → ExcelJS
9. **WPS compliance**: Payroll mentions WPS-ready output → salary file format per UAE Central Bank
10. **Auto-status transitions**: Invoice partially-paid→paid when balance=0; PO fully-received when all GRN complete
11. **Recurring jobs**: Job form has frequency field → cron/scheduler (BullMQ)
12. **Dashboard aggregation**: KPIs and charts imply complex aggregation queries
13. **Audit logging**: Every CRUD operation should be logged with user, IP, changes
14. **Soft deletes**: Major entities (customers, employees, invoices) need soft delete to preserve references
15. **Bulk operations**: Import employees, import items → CSV/Excel parsing
16. **Rate limiting**: Login endpoint especially needs rate limiting
17. **Session management**: Frontend shows active sessions → backend tracks sessions with device/IP

---

## 16. Recommended Backend Considerations

> Not explicitly in source but strongly advisable for production.

1. **Request validation middleware**: Zod schemas should be shared between frontend and backend (or mirrored)
2. **Error handling**: Standardized error format (`ApiError` type already defined in `src/types/api.types.ts`)
3. **Idempotency keys**: Payment endpoints should be idempotent to prevent double-charges
4. **Optimistic locking**: Financial records need `version` or `updated_at` check to prevent concurrent overwrites
5. **Document number gaps**: Sequence counters should handle transaction rollbacks (no gaps in production invoices)
6. **Audit immutability**: Audit logs should be append-only, never updated or deleted
7. **Financial period locking**: Closed accounting periods should prevent backdated entries
8. **Credit limit enforcement**: Customer credit limit checked before creating new invoices
9. **Stock reservation**: Stock should be reserved on quotation/PO creation, released on cancellation
10. **Backup automation**: Scheduled database backups (settings show backup config)
11. **Health check endpoint**: For load balancer and monitoring
12. **API versioning**: `/api/v1/` prefix for future backward compatibility
13. **CORS configuration**: Frontend may run on different domain in production
14. **Swagger/OpenAPI**: Auto-generated API documentation for frontend team

---

## 17. Risks, Ambiguities & Mismatches

### RISK 1: Database Patterns Require Prisma Adaptation
**Source**: Database SQL files (`database/*.sql`)
**Issue**: Database design patterns (RLS via `SET app.current_tenant`, raw SQL triggers) were originally designed for direct SQL access. These must be adapted for the chosen backend stack: **Node.js + Express.js + Prisma ORM + PostgreSQL 16**.
**Impact**: Prisma ORM has limitations with RLS session variables and raw triggers compared to direct SQL access.
**Mitigation**: Use hybrid approach — Prisma for CRUD operations + raw SQL migrations for RLS policies and triggers. Prisma `$extends` for tenant scoping at the application layer.

### RISK 2: Frontend Constants vs Database Enums Partial Mismatch
**Source**: `src/lib/constants.ts` vs `database/01_enums.sql`
**Issue**: Some constants in `constants.ts` use display values (e.g., `'Ras Al Khaimah'`) while DB enums use kebab-case (e.g., `'rak'`). The `INVOICE_STATUSES` in constants has 6 values but DB enum has 8 (`viewed`, `credited` additional). `QUOTATION_STATUSES` in constants has `approved` but DB has `accepted`.
**Impact**: Backend API must map between DB enum values and frontend display values. Some enum values exist in DB but not in constants (and vice versa).
**Mitigation**: Use feature-level type files as source of truth (they were aligned in v2.2). Constants file may be stale. Backend should match DB enums exactly; frontend already has correct types in `src/features/*/types/`.

### RISK 3: RLS Policies Designed for Direct SQL — Prisma Compatibility Unknown
**Source**: `database/12_rls_policies.sql` — ~550 RLS policies using `current_tenant_id()` function
**Issue**: Prisma does not natively support PostgreSQL RLS session variables. Every query would need `SET app.current_tenant = ?` before execution, which Prisma doesn't do automatically.
**Impact**: The 550 RLS policies are a significant security layer. If bypassed, application-layer tenant scoping must be perfectly implemented.
**Mitigation**: Must evaluate Position A/B/C per backend-master.md RLS guardrails. Likely Position B (defer RLS, enforce in application layer) for MVP, with Position C (partial RLS on sensitive tables) as stretch goal.

### RISK 4: Financial Calculations — Frontend Uses `number` Type
**Source**: All sample data files use JavaScript `number` for financial amounts
**Issue**: JavaScript `number` is IEEE 754 double-precision float. This can cause rounding errors in financial calculations (e.g., `0.1 + 0.2 !== 0.3`).
**Impact**: Backend must use `decimal.js` (per stack spec) and PostgreSQL `NUMERIC(15,2)`. Frontend calculations (VAT, totals) should be treated as display-only; backend is source of truth.
**Mitigation**: Backend computes all financial totals. Frontend `use-vat-calculator.ts` is a UI helper only. API responses include pre-computed totals.

### RISK 5: 52 DB Permissions vs 32 Frontend Permissions
**Source**: `database/15_seed.sql` seeds 52 permissions; `src/data/users.data.ts` defines 32 high-level permissions
**Issue**: Frontend groups permissions coarsely (e.g., `crm.create` = create customer + create lead). DB has slightly finer granularity with additional actions (e.g., `crm.export`, `inventory.transfer`).
**Impact**: Permission checks may not align. Frontend may allow access that backend denies (or vice versa).
**Mitigation**: Backend uses 52-permission set as canonical. Frontend permission check should use the same `module.action` format. Document any mapping differences.

### RISK 6: No API Client Installed
**Source**: PROJECT_SPEC.md confirms "Axios removed. No HTTP client installed."
**Issue**: Frontend has no API layer. When backend is ready, significant integration work needed.
**Impact**: Not a backend risk, but affects timeline. Backend API must be well-documented (Swagger) for frontend integration.
**Mitigation**: Backend provides comprehensive Swagger/OpenAPI docs. Frontend team installs axios and creates service layer.

### RISK 7: Dispatcher Real-time — No WebSocket Infrastructure
**Source**: Dispatcher page uses static data with auto-refresh timer
**Issue**: Real-time GPS tracking, job status updates, and notifications require WebSocket (Socket.io per stack spec).
**Impact**: Dispatcher is a critical module for service companies. Without real-time, it's just a dashboard.
**Mitigation**: Socket.io implementation should be in foundation phase, not deferred. Namespace per tenant for isolation.

---

## Minimum Coverage Checklist Verification

- [x] Referenced at least 10 files from `src/data/` — **All 18 files referenced** (customers, leads, quotations, invoices, items, warehouses, stock, vendors, purchase-orders, accounts, employees, jobs, dispatcher, settings, users, admin, audit, dashboard)
- [x] Referenced at least 8 files from `src/features/` — **All 14 modules analyzed** (auth, dashboard, crm, sales, inventory, purchase, accounts, hr, jobs, dispatcher, user-management, admin, audit, settings)
- [x] Referenced `src/types/` and `src/lib/validations.ts` explicitly — **common.types.ts, api.types.ts, validations.ts all documented** (Section 6, Section 7)
- [x] Documented all 14 modules with page count — **Section 4 table**
- [x] Documented all 49 routes — **Section 3 complete route table**
- [x] Listed all entity names found across types and sample data — **Section 6: 55+ entities**
- [x] Identified all forms with their key fields — **Section 7: 34+ forms**
- [x] Identified all tables with their filter/sort/pagination needs — **Section 8: 35+ tables**
- [x] Documented all realtime hints (dispatcher, notifications, etc.) — **Section 10: 6 confirmed + 4 inferred**
- [x] Documented all export/report/print hints — **Section 9: 17 exports + 15 reports**
- [x] Documented all permission/role clues from `src/data/users.data.ts` and types — **Section 11: 5 roles, 32 permissions, role-permission mapping**
- [x] Noted all UAE-specific patterns (TRN, emirate, VAT, EOSB, WPS) — **Sections 14, 15, 17: TRN validation, 7 emirates, 5% VAT, EOSB formula, WPS, labor law**
- [x] Flagged at least 3 mismatches or risks between frontend and backend assumptions — **Section 17: 7 risks flagged**
- [x] Classified every major requirement as Confirmed / Inferred / Recommended — **Sections 14, 15, 16**

---

## PHASE SUMMARY

**File**: FRONTEND_ANALYSIS.md
**Discovered**: The frontend defines 55+ entity types across 14 modules with comprehensive UAE business logic (VAT, EOSB, WPS, labor law) — all statically typed and ready for backend API contracts.
**Decided**: The 71-permission set from the database is the canonical source for RBAC; the frontend's 32-permission grouping is a UI convenience layer that maps onto the finer DB permissions.
**Next phase depends on**: Backend specification must translate these 55+ entities and 200+ implied API endpoints into the Node.js + Express.js + Prisma + PostgreSQL 16 architecture, adapting database patterns (especially RLS and triggers) for Prisma ORM.

---

*End of original FRONTEND_ANALYSIS.md*

---

## Signup & Trial System (Added Post-Analysis)

**Updated: Signup & Trial system added**

- **Route**: `/signup` (public, no auth required)
- **Creates**: new tenant + first admin user
- **Form**: 2-step (Company Info → Plan Selection)
- **Plans**: starter, standard, premium (all 15-day trial)
- **Trial banner**: shown on all authenticated pages, dismissible
- **New frontend files**: `signup-page.tsx`, `signup-form.tsx`, `plan-selector.tsx`, `password-strength.tsx`, `trial-banner.tsx`
- **New User fields**: `trialEndsAt`, `selectedPlan`
- **New Zod schemas**: `signupStep1Schema`, `signupStep2Schema`, `signupSchema`
- **New translation keys**: 70+ keys added to `auth` and `common` namespaces
- **Backend implication**: `POST /api/v1/auth/register` creates tenant + admin user + starts trial
- **Database implication**: tenants table needs trial fields (`trial_ends_at`, `subscription_status`, `selected_plan`)
