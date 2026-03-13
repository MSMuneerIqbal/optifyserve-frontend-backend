# DATABASE SPECIFICATION — OptifyServe ERP

> **Phase 3 of 5** | Generated: 2026-03-13
> **Purpose**: Complete database and data-layer specification for Prisma + PostgreSQL.
> **Depends on**: FRONTEND_ANALYSIS.md (Phase 1) + BACKEND_SPECIFICATION.md (Phase 2)

---

## 1. Database Architecture Overview

**Engine**: PostgreSQL 16
**ORM**: Prisma (primary data access)
**Raw SQL**: Where Prisma cannot express PostgreSQL features (RLS, triggers, custom functions)
**Multi-tenancy**: Shared database, shared schema, `tenantId`-based row scoping
**Money**: `NUMERIC(15,2)` in DB, `Decimal` type in Prisma, `decimal.js` in application
**Timestamps**: `TIMESTAMPTZ` everywhere
**Primary Keys**: UUID (`gen_random_uuid()`)

### Existing SQL Design Intelligence
The `database/` folder contains 16 SQL files with a production-grade schema:
- `00_extensions.sql` — uuid-ossp, pgcrypto, btree_gist, pg_trgm
- `01_enums.sql` — 93 enum types (kebab-case)
- `02-11` — 84 business tables across 10 module groups
- `12_rls_policies.sql` — 263 RLS policies on 81 tables
- `13_indexes.sql` — 235 indexes
- `14_triggers.sql` — 22 triggers (auto-numbering, balance updates, audit)
- `15_seed.sql` — Default data (permissions, roles, tenant, COA, leave types, shifts)

**Strategy**: Adapt this existing SQL intelligence into Prisma schema + raw SQL migrations. Do not discard; translate intelligently.

---

## 2. Multi-Tenant Strategy

### Architecture: Shared Database, Shared Schema, Row-Level Isolation

```
All tenants share one PostgreSQL database and one schema (public).
Every business table has a tenant_id UUID column.
All queries are scoped by tenant_id in the application layer (repository).
```

### Tenant Context Flow
1. User authenticates → JWT contains `tenantId`
2. Middleware extracts `tenantId` from JWT → attaches to request
3. Repository layer adds `WHERE tenantId = ?` to all queries
4. Create operations auto-set `tenantId` from context
5. **Never trust tenantId from request payloads**

### Tables WITHOUT tenant_id (Global/Platform)
| Table | Reason |
|-------|--------|
| `tenants` | The tenant itself |
| `permissions` | Global seed data, shared across all tenants |
| `subscription_plans` | Platform-level configuration |

### Tables WITH tenant_id (All Business Tables)
All other ~80+ tables have `tenantId` as a required non-nullable UUID column with a foreign key to `tenants.id`.

---

## 3. Table/Module Grouping

### Group 1: Platform & Auth (7 tables)
| Table | tenant_id | Purpose |
|-------|-----------|---------|
| `tenants` | No | Tenant organizations |
| `permissions` | No | Global permission seed |
| `roles` | Yes | Tenant-specific roles |
| `users` | Yes | User accounts |
| `user_sessions` | No (via user→tenant) | JWT refresh sessions |
| `password_reset_tokens` | No (via user→tenant) | Password reset |
| `user_invitations` | Yes | Pending user invites |

### Group 2: CRM (6 tables)
| Table | Purpose |
|-------|---------|
| `customers` | Customer directory (address + billing_address as JSONB) |
| `customer_contacts` | Multiple contacts per customer |
| `customer_activities` | Customer activity log |
| `leads` | Sales pipeline (address as JSONB) |
| `lead_service_interests` | Services of interest per lead |
| `follow_ups` | Lead follow-up activities |

### Group 3: Sales (5 tables)
| Table | Purpose |
|-------|---------|
| `quotations` | Price quotations |
| `quotation_items` | Line items on quotations |
| `invoices` | Tax invoices |
| `invoice_items` | Line items on invoices |
| `invoice_payments` | Payment records against invoices |

### Group 4: Inventory (8 tables)
| Table | Purpose |
|-------|---------|
| `item_categories` | Hierarchical item categories |
| `items` | Item master |
| `warehouses` | Warehouse locations |
| `warehouse_locations` | Bin/shelf locations within warehouses |
| `stock_levels` | Per-item per-warehouse stock |
| `stock_movements` | Stock in/out/transfer/adjust/return/consumption |
| `stock_batches` | Batch tracking for items |
| `low_stock_alerts` | Low stock alert records |

### Group 5: Purchase (11 tables)
| Table | Purpose |
|-------|---------|
| `vendors` | Vendor directory |
| `vendor_contacts` | Multiple contacts per vendor |
| `purchase_orders` | POs |
| `po_line_items` | PO line items |
| `po_approvals` | Multi-level PO approvals |
| `goods_received_notes` | GRN headers |
| `grn_line_items` | GRN line items |
| `purchase_returns` | Returns to vendor |
| `purchase_return_items` | Return line items |
| `vendor_payments` | Payments to vendors |
| `vendor_statement_entries` | Vendor statement line items |

### Group 6: Accounts (14 tables)
| Table | Purpose |
|-------|---------|
| `chart_of_accounts` | Hierarchical COA |
| `journal_entries` | JE headers |
| `journal_lines` | JE debit/credit lines |
| `accounts_receivable` | AR records |
| `customer_payments` | Customer payments against AR invoices |
| `accounts_payable` | AP records |
| `ap_payments` | Vendor payments against AP bills |
| `expenses` | Expense claims |
| `expense_approvals` | Expense approval workflow |
| `bank_accounts` | Bank account registry |
| `bank_reconciliations` | Reconciliation sessions |
| `bank_transactions` | Imported bank statements |
| `reconciliation_adjustments` | Reconciliation adjustment entries |
| `vat_returns` | VAT return filings (boxes 1-9 as JSONB) |

### Group 7: HR (15 tables)
| Table | Purpose |
|-------|---------|
| `branches` | Company branches |
| `departments` | Organizational departments |
| `designations` | Job titles |
| `employees` | Employee master |
| `shifts` | Work shifts (incl. Ramadan) |
| `attendance_records` | Daily attendance |
| `attendance_regularizations` | Correction requests |
| `leave_types` | UAE leave type config |
| `leave_balances` | Per-employee leave balance |
| `leave_requests` | Leave applications |
| `payroll_runs` | Monthly payroll batches |
| `payslips` | Individual payslips |
| `eosb_records` | Gratuity calculations |
| `employee_documents` | Document registry with expiry |
| `performance_reviews` | Performance evaluations (goals as JSONB) |

### Group 8: Jobs (8 tables)
| Table | Purpose |
|-------|---------|
| `jobs` | Service jobs |
| `job_technicians` | Multi-technician assignment per job |
| `job_attachments` | Job photos/documents |
| `job_status_history` | Status transitions |
| `technicians` | Technician profiles (extends employees) |
| `technician_skills` | Skills per technician |
| `service_reports` | Service completion reports (parts_used as JSONB) |
| `customer_feedbacks` | Customer ratings |

### Group 9: Dispatcher (2 tables)
| Table | Purpose |
|-------|---------|
| `technician_locations` | Real-time GPS (upsert) |
| `job_assignment_logs` | Assignment history |

### Group 10: Settings & Platform (7 + 1 tables)
| Table | Purpose |
|-------|---------|
| `company_profiles` | Per-tenant company info |
| `notification_preferences` | Notification preferences per user |
| `integrations` | Third-party integrations |
| `theme_settings` | Per-tenant theme/color config |
| `security_settings` | Password policy, 2FA |
| `backup_settings` | Backup configuration |
| `audit_logs` | Immutable audit trail |
| `sequence_counters` | Auto-numbering per entity per tenant |

**Total: 83 business tables + 1 sequence_counters = 84 tables**

---

## 4. Core Entities — Prisma Model Overview

### Key Models (top-level, not exhaustive)

```prisma
model Tenant {
  id              String   @id @default(uuid()) @db.Uuid
  name            String   @db.VarChar(255)
  nameAr          String?  @db.VarChar(255)
  slug            String   @unique @db.VarChar(100)
  trn             String?  @db.VarChar(15)
  status          String   @default("trial") @db.VarChar(20)
  plan            String   @default("starter") @db.VarChar(20)
  enabledModules  String[] @default([])
  maxUsers        Int      @default(5)
  settings        Json     @default("{}")
  trialEndsAt     DateTime? @db.Timestamptz
  createdAt       DateTime @default(now()) @db.Timestamptz
  updatedAt       DateTime @updatedAt @db.Timestamptz

  // Relations
  users           User[]
  roles           Role[]
  // ... all tenant-scoped relations

  @@map("tenants")
}

model User {
  id            String    @id @default(uuid()) @db.Uuid
  tenantId      String    @db.Uuid
  email         String    @db.VarChar(255)
  passwordHash  String    @db.VarChar(255)
  name          String    @db.VarChar(255)
  role          String    @default("staff") @db.VarChar(20)
  roleId        String?   @db.Uuid
  permissions   String[]  @default([])
  status        String    @default("active") @db.VarChar(20)
  avatarUrl     String?
  phone         String?   @db.VarChar(20)
  department    String?   @db.VarChar(100)
  lastLoginAt   DateTime? @db.Timestamptz
  createdAt     DateTime  @default(now()) @db.Timestamptz
  updatedAt     DateTime  @updatedAt @db.Timestamptz
  createdBy     String?   @db.Uuid
  updatedBy     String?   @db.Uuid
  deletedAt     DateTime? @db.Timestamptz

  // Relations
  tenant        Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  roleRef       Role?     @relation(fields: [roleId], references: [id], onDelete: SetNull)

  @@unique([tenantId, email])
  @@map("users")
}

model Customer {
  id                    String    @id @default(uuid()) @db.Uuid
  tenantId              String    @db.Uuid
  customerNumber        String    @db.VarChar(20)
  name                  String    @db.VarChar(255)
  email                 String?   @db.VarChar(255)
  phone                 String?   @db.VarChar(20)
  customerType          String    @db.VarChar(20)
  taxRegistrationNumber String?   @db.VarChar(15)
  address               Json?
  status                String    @default("active") @db.VarChar(20)
  creditLimit           Decimal   @default(0) @db.Decimal(15, 2)
  paymentTerms          String    @default("net-30") @db.VarChar(20)
  tags                  String[]  @default([])
  notes                 String?
  assignedSalesRepId    String?   @db.Uuid
  createdAt             DateTime  @default(now()) @db.Timestamptz
  updatedAt             DateTime  @updatedAt @db.Timestamptz
  createdBy             String?   @db.Uuid
  updatedBy             String?   @db.Uuid
  deletedAt             DateTime? @db.Timestamptz

  @@unique([tenantId, customerNumber])
  @@unique([tenantId, email])
  @@map("customers")
}
```

> Note: Full Prisma schema will be generated during implementation. Above shows the pattern.

---

## 5. Relationship Strategy

### Foreign Key Patterns
- **Tenant cascade**: `ON DELETE CASCADE` from tenant → all child tables
- **Soft reference**: `ON DELETE SET NULL` for optional references (e.g., `assignedSalesRepId`)
- **Strict reference**: `ON DELETE RESTRICT` for financial records (prevent deleting customer with invoices)
- **Self-reference**: `parentId` for hierarchical tables (COA, departments, categories)

### Many-to-Many
- No join tables in current design — use arrays or JSONB where simple
- Exception: `technician_skills` is a proper junction table (technician × service_type × skill_level)

### Denormalization
- Acceptable: `customerName` on Invoice (for historical accuracy — customer name at time of invoice)
- Acceptable: `assignedTechnicianName` on Job (for quick listing)
- Not acceptable: Duplicating balances that should be computed

---

## 6. UUID Strategy

- **All primary keys**: UUID v4 via `gen_random_uuid()` (PostgreSQL native)
- **Prisma**: `@id @default(uuid()) @db.Uuid`
- **Format**: Standard UUID (8-4-4-4-12 hex)
- **Why**: No sequential ID prediction, safe for multi-tenant, no collision across replicas
- **Frontend compatibility**: Frontend already uses string IDs (`'cust_001'` format in sample data → will be real UUIDs in production)

---

## 7. Timestamp Strategy

- **All timestamps**: `TIMESTAMPTZ` (timestamp with time zone)
- **Prisma**: `@db.Timestamptz`
- **Storage**: UTC in database
- **Display**: Convert to `Asia/Dubai` (UTC+4) in API response or let frontend handle
- **Standard fields** on all business tables:
  - `createdAt` — auto-set on creation (`@default(now())`)
  - `updatedAt` — auto-set on update (`@updatedAt`)

### Optional Audit Fields
On tables that need user attribution:
- `createdBy` — UUID of creating user (set by service layer / Prisma middleware)
- `updatedBy` — UUID of last updating user (set by service layer / Prisma middleware)

> **Note**: The SQL `set_audit_columns()` trigger uses `app.current_user` session variable, which is incompatible with Prisma's connection pooling. Do NOT use this trigger. Instead, use Prisma middleware to set `createdBy`/`updatedBy` from the request context.

---

## 8. Money/Numeric Strategy

### Database
- **Type**: `NUMERIC(15,2)` for all money columns
- **Prisma**: `Decimal @db.Decimal(15,2)`
- **Range**: -9,999,999,999,999.99 to +9,999,999,999,999.99
- **Never**: `FLOAT`, `DOUBLE PRECISION`, `REAL`

### Application Layer
- **Library**: `decimal.js` (arbitrary-precision decimal arithmetic)
- **All calculations**: Use `Decimal` operations (add, sub, mul, div)
- **Rounding**: `Decimal.ROUND_HALF_UP` (banker's rounding for VAT)

### VAT Calculation Formula
```typescript
const subtotal = lineItems.reduce((sum, item) => {
  const lineTotal = new Decimal(item.quantity).mul(item.unitPrice)
  const discount = lineTotal.mul(item.discountPercent).div(100)
  return sum.add(lineTotal.sub(discount))
}, new Decimal(0))

const vatAmount = subtotal.mul(0.05).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
const total = subtotal.add(vatAmount)
```

### Monetary Fields in Key Tables
| Table | Monetary Columns |
|-------|-----------------|
| `invoices` | subtotal, totalDiscount, taxableAmount, zeroRatedAmount, exemptAmount, vatAmount, total, paidAmount, balanceAmount |
| `invoice_items` | unitPrice, discountAmount, vatAmount, total, totalWithVat |
| `quotations` | subtotal, totalDiscount, vatAmount, total |
| `purchase_orders` | subtotal, totalDiscount, vatAmount, total |
| `expenses` | amount, vatAmount, totalAmount |
| `payslips` | basicSalary, housingAllowance, transportAllowance, otherAllowances, totalEarnings, totalDeductions, netSalary |
| `eosb_records` | dailyWage, first5YearsGratuity, after5YearsGratuity, totalGratuity, deductions, finalAmount |
| `bank_transactions` | amount |
| `vendor_payments` | amount |
| `items` | costPrice, sellingPrice |

---

## 9. Soft Delete Strategy

### Tables with Soft Delete (`deletedAt TIMESTAMPTZ`)
- `users` — preserve audit trail of who did what
- `customers` — referenced by invoices, jobs
- `vendors` — referenced by POs, payments
- `employees` — referenced by attendance, payroll
- `items` — referenced by stock, POs, invoices
- `jobs` — referenced by service reports, payments

### Tables WITHOUT Soft Delete (Hard Delete OK)
- `follow_ups` — can be truly deleted
- `job_status_history` — append-only, no delete
- `invoice_payments` — append-only, no delete
- `customer_payments` — append-only, no delete
- `ap_payments` — append-only, no delete
- `audit_logs` — append-only, never delete
- `technician_locations` — upsert pattern, old data irrelevant
- `stock_movements` — append-only ledger

### Prisma Pattern for Soft Delete
```typescript
// Repository method
async findMany(tenantId: string, filters: CustomerFilters) {
  return prisma.customer.findMany({
    where: {
      tenantId,
      deletedAt: null,  // exclude soft-deleted
      ...filters,
    },
  })
}

// Soft delete
async softDelete(tenantId: string, id: string) {
  return prisma.customer.update({
    where: { id, tenantId },
    data: { deletedAt: new Date() },
  })
}
```

---

## 10. Audit Field Strategy

### Standard Audit Fields (on all business tables)
```prisma
createdAt  DateTime  @default(now()) @db.Timestamptz
updatedAt  DateTime  @updatedAt @db.Timestamptz
createdBy  String?   @db.Uuid    // set by service layer
updatedBy  String?   @db.Uuid    // set by service layer
```

### Audit Log Table (Separate — for compliance)
```prisma
model AuditLog {
  id          String   @id @default(uuid()) @db.Uuid
  tenantId    String   @db.Uuid
  userId      String   @db.Uuid
  userName    String   @db.VarChar(255)
  action      String   @db.VarChar(50)   // created, updated, deleted, approved, etc.
  module      String   @db.VarChar(50)   // crm, sales, hr, etc.
  entityType  String   @db.VarChar(50)   // customer, invoice, employee, etc.
  entityId    String   @db.Uuid
  description String?
  changes     Json?                       // { field: { old: x, new: y } }
  ipAddress   String?  @db.VarChar(45)   // IPv4 or IPv6
  userAgent   String?
  createdAt   DateTime @default(now()) @db.Timestamptz

  // No updatedAt — audit logs are immutable
  // No deletedAt — audit logs are never deleted
  // No tenantId FK — keep it denormalized for performance

  @@index([tenantId, createdAt])
  @@index([tenantId, module])
  @@index([tenantId, entityType, entityId])
  @@map("audit_logs")
}
```

---

## 11. JSONB Usage Strategy

### Where JSONB is Appropriate
| Table | Column | Content | Why JSONB |
|-------|--------|---------|-----------|
| `customers` | `address` | street, city, emirate, country | Structured but not queried by field |
| `employees` | `salary` | basic, housing, transport, mobile, other | Structured sub-object |
| `employees` | `emiratesId` | number, expiryDate, verified | Document sub-object |
| `employees` | `passport` | number, nationality, issueDate, expiryDate | Document sub-object |
| `employees` | `visa` | number, type, issueDate, expiryDate | Document sub-object |
| `employees` | `laborCard` | number, issueDate, expiryDate | Document sub-object |
| `employees` | `bankDetails` | bankName, accountNumber, iban, swift | Financial sub-object |
| `employees` | `emergencyContact` | name, relationship, phone | Person sub-object |
| `company_profiles` | `bankDetails` | bankName, accountNumber, iban, swift | Financial sub-object |
| `company_profiles` | `settings` | prefixes, vatRate, timezone, dateFormat | Configuration |
| `company_profiles` | `businessHours` | sun-sat open/close times | Schedule |
| `tenants` | `settings` | tenant-level configuration | Flexible config |
| `vat_returns` | `boxes` | box1-box9 amounts | UAE FTA format |
| `audit_logs` | `changes` | old/new values per field | Arbitrary structure |
| `service_reports` | `checklist` | array of checklist items | Dynamic per service type |
| `service_reports` | `parts_used` | array of parts consumed | Variable per job (no separate table) |
| `performance_reviews` | `goals` | array of performance goals | Variable per review (no separate table) |
| `jobs` | `serviceAddress` | building, street, area, emirate, lat, lng | Address with GPS |

### Where JSONB is NOT Appropriate
- **Financial line items** — use proper tables (invoice_items, po_line_items) for querying and aggregation
- **Permissions** — use `String[]` array for flat permission lists
- **Status enums** — use proper enum/varchar columns for indexing

### Prisma JSONB
```prisma
address     Json?     // Typed in application as Address interface
salary      Json?     // Typed as SalaryStructure interface
```

Application layer: Parse and validate JSONB with Zod schemas.

---

## 12. Sequence/Document Number Strategy

### Pattern
Each business document has a tenant-scoped auto-incrementing number:
- `CUST-00001`, `CUST-00002`, ... (per tenant)
- `INV-2026-0001`, `INV-2026-0002`, ... (per tenant)

### Implementation: `sequence_counters` Table
```prisma
model SequenceCounter {
  id        String @id @default(uuid()) @db.Uuid
  tenantId  String @db.Uuid
  entityType String @db.VarChar(50)  // 'customer', 'invoice', 'quotation', etc.
  prefix    String @db.VarChar(20)  // 'CUST', 'INV', 'QTN', etc.
  counter   Int    @default(0)
  year      Int?                     // Optional year component
  format    String @default("{prefix}-{counter:5}") @db.VarChar(100)

  @@unique([tenantId, entityType, year])
  @@map("sequence_counters")
}
```

### Generation Logic (in service layer)
```typescript
async function generateDocNumber(tenantId: string, entityType: string): Promise<string> {
  const result = await prisma.$executeRaw`
    INSERT INTO sequence_counters (id, tenant_id, entity_type, prefix, counter)
    VALUES (gen_random_uuid(), ${tenantId}, ${entityType}, ${getPrefix(entityType)}, 1)
    ON CONFLICT (tenant_id, entity_type, year)
    DO UPDATE SET counter = sequence_counters.counter + 1
    RETURNING counter, prefix
  `
  return formatDocNumber(result.prefix, result.counter)
}
```

### Auto-Numbered Entities (14)
| Entity | Prefix | Format |
|--------|--------|--------|
| Customer | CUST | CUST-00001 |
| Lead | LEAD | LEAD-2026-001 |
| Quotation | QTN | QTN-2026-0001 |
| Invoice | INV | INV-2026-0001 |
| PO | PO | PO-2026-0001 |
| GRN | GRN | GRN-2026-0001 |
| Return | RET | RET-2026-0001 |
| Vendor Payment | VPAY | VPAY-2026-0001 |
| Job | JOB | JOB-2026-001 |
| Service Report | SR | SR-2026-001 |
| Payroll Run | PR | PR-2026-01 |
| Payslip | PS | PS-2026-01-001 |
| Journal Entry | JE | JE-2026-0001 |
| Expense | EXP | EXP-2026-0001 |

---

## 13. Enum Strategy

### Convention: Kebab-case Strings (NOT PostgreSQL ENUM Types)
**Decision**: Use `String` columns with application-level validation instead of PostgreSQL `CREATE TYPE ... AS ENUM`.

**Reasoning**:
1. Prisma has limited support for PostgreSQL custom enum types (adding values requires raw SQL migration)
2. Enum evolution (adding/renaming values) is simpler with varchar + validation
3. Frontend already validates enum values via TypeScript union types
4. Backend validates via Zod `z.enum([...])` schemas
5. Performance: varchar with check constraint is equivalent to enum for small value sets

**Implementation**:
```prisma
// In Prisma schema — use String, not Prisma enum
status  String  @default("active") @db.VarChar(20)
```

```typescript
// In Zod schema — runtime validation
const customerStatusSchema = z.enum(['active', 'inactive', 'blocked'])
```

```sql
-- Optional DB-level check constraint (via raw migration)
ALTER TABLE customers ADD CONSTRAINT chk_customer_status
  CHECK (status IN ('active', 'inactive', 'blocked'));
```

### All Enum Values (Source of Truth: `database/01_enums.sql`)
The existing SQL file defines 93 enum types. All values use kebab-case:
- `'in-progress'`, `'on-hold'`, `'ac-repair'`, `'half-day'`, `'on-leave'`
- Never: `'in_progress'`, `'onHold'`, `'AC Repair'`

Backend Zod schemas must match these exact values.

---

## 14. Prisma Schema Strategy

### Single Schema File vs Multi-File
**Decision**: Single `schema.prisma` file for MVP. Prisma does not natively support multi-file schemas.

> If schema becomes unwieldy (>2000 lines), use `prisma-merge` or the Prisma multi-file preview feature.

### Model Naming
- **Prisma model**: PascalCase (`Customer`, `InvoiceItem`, `PurchaseOrder`)
- **Database table**: snake_case via `@@map("customers")`, `@@map("invoice_items")`
- **Column mapping**: camelCase in Prisma → snake_case in DB via `@map("tenant_id")`

### Example Mapping
```prisma
model InvoiceItem {
  id            String  @id @default(uuid()) @db.Uuid
  tenantId      String  @map("tenant_id") @db.Uuid
  invoiceId     String  @map("invoice_id") @db.Uuid
  itemId        String? @map("item_id") @db.Uuid
  itemCode      String  @map("item_code") @db.VarChar(50)
  itemName      String  @map("item_name") @db.VarChar(255)
  description   String?
  quantity      Decimal @db.Decimal(15, 2)
  unit          String  @db.VarChar(20)
  unitPrice     Decimal @map("unit_price") @db.Decimal(15, 2)
  discount      Decimal @default(0) @db.Decimal(5, 2)
  discountAmount Decimal @map("discount_amount") @default(0) @db.Decimal(15, 2)
  vatStatus     String  @map("vat_status") @default("standard") @db.VarChar(20)
  vatRate       Decimal @map("vat_rate") @default(5) @db.Decimal(5, 2)
  vatAmount     Decimal @map("vat_amount") @default(0) @db.Decimal(15, 2)
  total         Decimal @default(0) @db.Decimal(15, 2)
  totalWithVat  Decimal @map("total_with_vat") @default(0) @db.Decimal(15, 2)

  // Relations
  invoice       Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@map("invoice_items")
}
```

---

## 15. Raw SQL Migration Strategy

### What Needs Raw SQL (Cannot Express in Prisma Schema)

| Feature | SQL File | Prisma Approach |
|---------|----------|----------------|
| Extensions (uuid-ossp, pgcrypto, btree_gist, pg_trgm) | `00_extensions.sql` | Raw migration: `CREATE EXTENSION IF NOT EXISTS` |
| Check constraints | Various | Raw migration: `ALTER TABLE ADD CONSTRAINT CHECK(...)` |
| Partial indexes | `13_indexes.sql` | Raw migration: `CREATE INDEX WHERE ...` |
| GIN indexes (JSONB, arrays, trigram) | `13_indexes.sql` | Raw migration: `CREATE INDEX USING gin(...)` |
| Triggers | `14_triggers.sql` | Raw migration: `CREATE FUNCTION` + `CREATE TRIGGER` |
| RLS policies (if adopted) | `12_rls_policies.sql` | Raw migration |
| Sequence counter upsert | `14_triggers.sql` | Application layer (service) or raw migration |
| Custom functions | Various | Raw migration |

### Migration Approach
1. **Prisma migrations** for table/column/relation changes (99% of DDL)
2. **Raw SQL files** in `prisma/migrations/` for PostgreSQL-specific features
3. Version-controlled, repeatable, testable

### Trigger Migration Example
```sql
-- prisma/migrations/20260313_triggers/migration.sql

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all major tables
CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Invoice balance auto-update on payment
CREATE OR REPLACE FUNCTION update_invoice_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices SET
    paid_amount = (SELECT COALESCE(SUM(amount), 0) FROM invoice_payments WHERE invoice_id = NEW.invoice_id),
    balance_amount = total - (SELECT COALESCE(SUM(amount), 0) FROM invoice_payments WHERE invoice_id = NEW.invoice_id),
    status = CASE
      WHEN total - (SELECT COALESCE(SUM(amount), 0) FROM invoice_payments WHERE invoice_id = NEW.invoice_id) <= 0 THEN 'paid'
      WHEN (SELECT COALESCE(SUM(amount), 0) FROM invoice_payments WHERE invoice_id = NEW.invoice_id) > 0 THEN 'partially-paid'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = NEW.invoice_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_payment_balance
  AFTER INSERT ON invoice_payments
  FOR EACH ROW EXECUTE FUNCTION update_invoice_balance();
```

---

## 16. Index Strategy

### Automatic Indexes (Prisma creates these)
- Primary keys (`@id`)
- Unique constraints (`@unique`, `@@unique`)
- Foreign keys (Prisma doesn't auto-index FKs — must add explicitly)

### Manual Indexes Needed

#### Composite Tenant Indexes (Critical)
Every business table needs `(tenant_id, <common_filter>)` composite indexes:
```prisma
@@index([tenantId, status])
@@index([tenantId, createdAt])
@@index([tenantId, customerNumber])
```

#### Full-Text Search Indexes (Raw SQL)
```sql
CREATE INDEX idx_customers_name_trgm ON customers USING gin(name gin_trgm_ops);
CREATE INDEX idx_items_name_trgm ON items USING gin(name gin_trgm_ops);
```

#### Partial Indexes (Raw SQL)
```sql
-- Only index non-deleted records
CREATE INDEX idx_customers_active ON customers(tenant_id, status)
  WHERE deleted_at IS NULL;

-- Low stock alert
CREATE INDEX idx_stock_low ON stock_levels(item_id, warehouse_id)
  WHERE available_qty < 10;
```

#### JSONB Indexes (Raw SQL)
```sql
CREATE INDEX idx_employees_salary ON employees USING gin(salary);
```

### Index Priority for MVP
1. **P0**: All `(tenant_id, ...)` composites on frequently queried tables
2. **P0**: Unique constraints (tenant_id + email, tenant_id + customerNumber, etc.)
3. **P1**: Foreign key columns (Prisma doesn't auto-index these)
4. **P1**: Status + date combinations for filtered listings
5. **P2**: Trigram search on name fields
6. **P3**: JSONB and partial indexes

---

## 17. Unique Constraint Strategy

### Tenant-Aware Unique Constraints
All business uniqueness is scoped per tenant:

```prisma
model Customer {
  @@unique([tenantId, customerNumber])
  @@unique([tenantId, email])
}

model User {
  @@unique([tenantId, email])
}

model Role {
  @@unique([tenantId, name])
}

model Item {
  @@unique([tenantId, sku])
}

model Warehouse {
  @@unique([tenantId, code])
}

model StockLevel {
  @@unique([tenantId, itemId, warehouseId])
}

model Employee {
  @@unique([tenantId, employeeId])
  @@unique([tenantId, email])
}
```

### Global Unique Constraints (No tenant scope)
```prisma
model Tenant {
  slug  String @unique
}

model Permission {
  @@unique([module, action])
}
```

---

## 18. Tenant-Aware Uniqueness Examples

### Scenario: Two Tenants, Same Customer Email
```
Tenant A: customer email = info@alfuttaim.ae ✅
Tenant B: customer email = info@alfuttaim.ae ✅  (different tenant)
Tenant A: customer email = info@alfuttaim.ae ❌  (duplicate within tenant)
```

### Scenario: Document Numbers Reset Per Tenant
```
Tenant A: INV-2026-0001, INV-2026-0002, ...
Tenant B: INV-2026-0001, INV-2026-0002, ...  (independent sequence)
```

### Scenario: SKU Uniqueness Per Tenant
```
Tenant A: SKU "AC-COMP-001" ✅
Tenant B: SKU "AC-COMP-001" ✅  (different tenant)
Tenant A: SKU "AC-COMP-001" ❌  (duplicate within tenant)
```

---

## 19. Seed Strategy

### Seed Script (`prisma/seed.ts`)

Seed data runs once per environment setup. Idempotent (safe to re-run).

### Seed Order
1. **Permissions** (52 records) — global, no tenant (10 modules × ~5 actions)
2. **Default tenant** (1 record) — OptifyServe Solutions LLC
3. **Admin user** (1 record) — admin@optifyserve.com / Admin@123
4. **System roles** (4 per tenant) — Administrator, Manager, Staff, Technician
5. **Leave types** (9 per tenant) — UAE labor law compliant
6. **Chart of accounts** (78 per tenant) — UAE standard hierarchy
7. **Default shifts** (5 per tenant) — Morning, evening, night, split, flexible
8. **Company profile** (1 per tenant)
9. **Security settings** (1 per tenant)
10. **Backup settings** (1 per tenant)
11. **Theme settings** (1 per tenant)
12. **Default branch** (1 per tenant) — Head Office
13. **Default warehouse** (1 per tenant) — Main Warehouse

### Seed Data Source
Adapt from `database/15_seed.sql`:
- 52 permissions (CRUD per module + specialized actions)
- 4 system roles with permission assignments
- 9 leave types with UAE labor law parameters
- 78 chart of accounts (UAE standard)
- 5 shifts with times
- 1 company profile, 1 security settings, 1 backup settings, 1 theme settings
- 1 default branch, 1 default warehouse

### Tenant Onboarding Seed
When a new tenant is created via Platform Admin, automatically seed:
- 4 system roles (copy from template)
- 9 leave types
- 78 COA entries
- 5 shifts
- 1 company profile (template)
- 1 security settings (defaults)
- 1 backup settings (defaults)
- 1 theme settings (defaults)
- 1 default branch
- 1 default warehouse

---

## 20. RLS Evaluation & Recommendation

### Existing RLS Design
The `database/12_rls_policies.sql` file implements 263 RLS policies on 81 tables using:
```sql
CREATE FUNCTION current_tenant_id() RETURNS UUID AS $$
  SELECT current_setting('app.current_tenant')::uuid;
$$ LANGUAGE sql STABLE;

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_select ON customers
  FOR SELECT USING (tenant_id = current_tenant_id());
```

### Prisma + RLS Compatibility Analysis

**Challenge**: Prisma uses a connection pool. To use RLS, every query would need to:
1. Set `app.current_tenant` session variable before the query
2. Ensure the session variable is set on the same connection
3. Reset after the query

Prisma's `$executeRaw` can set session variables, but Prisma's query engine doesn't guarantee connection affinity between `$executeRaw` and subsequent `findMany()` calls.

**Options Evaluated**:
- **Prisma `$transaction`**: Can batch `SET` + query, but adds overhead to every single query
- **Prisma middleware**: Can intercept queries but cannot inject `SET` into the same connection
- **pgBouncer session mode**: Forces connection-per-session, defeats pooling benefits
- **Prisma `$extends`**: Can add `WHERE tenant_id = ?` to all queries programmatically

### **POSITION B — Defer RLS, Enforce in Application Layer for MVP**

**Decision**: Do NOT enable PostgreSQL RLS for the MVP. Instead, enforce tenant isolation in the application layer (repository + Prisma extension).

**Justification**:
1. **Prisma compatibility**: Prisma cannot reliably set PostgreSQL session variables per-query within its connection pool. Forcing session mode would sacrifice connection pooling performance.
2. **Development velocity**: Application-layer scoping with Prisma `$extends` is simpler to implement, test, and debug during rapid MVP development.
3. **Testing**: Application-layer tenant scoping is easily unit-testable. RLS requires a real PostgreSQL instance with session variables set.
4. **Sufficient for MVP**: With disciplined repository patterns and integration tests verifying tenant isolation, application-layer scoping provides adequate security for initial deployment.

**Residual Risk**:
- A bug in any single repository method could leak cross-tenant data
- Mitigation: Integration tests that create data in Tenant A and verify it's invisible from Tenant B
- Mitigation: Code review checklist item: "Does this query include tenantId filter?"
- Mitigation: Prisma `$extends` auto-scoping reduces risk of forgotten filters

**RLS Addition Milestone**: Consider enabling RLS as a hardening measure after MVP launch, once:
1. Prisma has better RLS support (or we add a raw connection layer for sensitive tables)
2. The application is stable and the repository layer is proven
3. Security audit identifies specific tables that need DB-level enforcement

**Partial RLS Consideration (Position C Alternative)**:
If security requirements escalate before the milestone above, enable RLS on the 5 most sensitive tables first:
- `users` (authentication data)
- `invoices` (financial data)
- `invoice_payments` (financial data)
- `employees` (personal data, salary)
- `payslips` (salary data)

This would require a dedicated raw SQL connection for these 5 tables, separate from Prisma's pooled connection.

---

## 21. Backup/Recovery Environment Notes

### Local Development
- Docker volume persistence (`pgdata:/var/lib/postgresql/data`)
- `pg_dump` for manual backups
- Disposable — can recreate from migrations + seed

### Staging
- Railway automated daily backups (7-day retention)
- Can restore from Railway dashboard
- Test migration rollbacks here

### Production
- Azure Database for PostgreSQL automated backups
- Point-in-time recovery (PITR) up to 35 days
- Geo-redundant backup storage
- Weekly full backup + continuous WAL archiving
- Recovery Time Objective (RTO): < 1 hour
- Recovery Point Objective (RPO): < 5 minutes

---

## 22. Staging/Local/Prod DB Environment Recommendations

| Setting | Local | Staging | Production |
|---------|-------|---------|-----------|
| PostgreSQL Version | 16 (Docker) | 16 (Railway) | 16 (Azure) |
| Connection Pooling | Prisma default (10) | Prisma default (10) | PgBouncer + Prisma (50) |
| SSL | Off | On | On (enforced) |
| Extensions | All 4 | All 4 | All 4 |
| RLS | Off | Off (MVP) | Off (MVP), evaluate post-launch |
| Backups | Manual | Daily (7d) | Continuous PITR (35d) |
| Monitoring | None | Basic (Railway) | Azure Monitor + alerts |
| Max Connections | 100 | 100 | 200+ |

---

## 23. Risks & Tradeoffs

| Risk | Impact | Decision |
|------|--------|----------|
| No RLS for MVP | Medium | Mitigated by app-layer scoping + tests |
| Prisma enum limitations | Low | Use varchar + Zod validation instead |
| Large schema (~84 tables) in single Prisma file | Low | Manageable for MVP; split later if needed |
| JSONB not queryable by Prisma natively | Low | Use raw queries for JSONB search if needed |
| Trigger logic in DB vs app | Medium | Keep balance-update triggers in DB; keep business logic in app |
| Decimal precision | High | Always use Decimal type; test edge cases |
| Seed script complexity | Medium | Make idempotent; test in CI |

---

## 24. Confirmed vs Inferred vs Recommended

### Confirmed
- PostgreSQL 16 with uuid-ossp, pgcrypto, btree_gist, pg_trgm
- 84 tables across 10 module groups (from SQL files)
- 93 enum types in kebab-case (from `01_enums.sql`)
- UUID primary keys with `gen_random_uuid()`
- `NUMERIC(15,2)` for all monetary columns
- `TIMESTAMPTZ` for all timestamps
- `tenant_id` on all business tables
- JSONB for addresses, salary structures, settings
- Audit fields (createdAt, updatedAt, createdBy, updatedBy)
- Soft delete on major entities
- Sequence counters for auto-numbering

### Inferred
- ~100+ composite indexes needed for tenant-scoped queries
- Trigram indexes for name search
- Check constraints for enum validation at DB level
- Partial indexes for soft-deleted records
- Foreign key indexes (Prisma doesn't auto-create)

### Recommended
- Position B for RLS (defer, enforce in app layer for MVP)
- Varchar + Zod instead of PostgreSQL ENUM types (for Prisma compatibility)
- Single Prisma schema file for MVP (split later)
- Idempotent seed script
- Transaction-based test isolation
- Regular `ANALYZE` for query planner statistics

---

## Recommended Initial Prisma Model Rollout Order

### Phase 1: Foundation
1. `Tenant`
2. `Permission`
3. `Role`
4. `User`
5. `UserSession`
6. `PasswordResetToken`
7. `UserInvitation`
8. `SequenceCounter`
9. `AuditLog`

### Phase 2: Core Business (MVP)
10. `CompanyProfile`
11. `Branch`
12. `TaxConfiguration`
13. `Customer` + `CustomerContact` + `CustomerActivity`
14. `Lead` + `LeadServiceInterest` + `FollowUp`
15. `Item` + `ItemCategory`
16. `Warehouse` + `WarehouseLocation` + `StockLevel` + `StockMovement` + `StockBatch` + `LowStockAlert`
17. `Quotation` + `QuotationItem`
18. `Invoice` + `InvoiceItem` + `InvoicePayment`
19. `Job` + `JobStatusHistory` + `JobAttachment`
20. `Technician` + `TechnicianSkill`
21. `ServiceReport` + `JobTechnician`
22. `CustomerFeedback`

### Phase 3: Operations
23. `Vendor` + `VendorContact`
24. `PurchaseOrder` + `PoLineItem` + `PoApproval`
25. `GoodsReceivedNote` + `GrnLineItem`
26. `PurchaseReturn` + `PurchaseReturnItem`
27. `VendorPayment` + `VendorStatementEntry`
28. `ChartOfAccounts`
29. `JournalEntry` + `JournalLine`
30. `AccountsReceivable` + `CustomerPayment` + `AccountsPayable` + `ApPayment`
31. `Expense` + `ExpenseApproval`
32. `Employee` + `Department` + `Designation`
33. `AttendanceRecord` + `LeaveRequest` + `LeaveBalance`
34. `TechnicianLocation` + `JobAssignmentLog`

### Phase 4: Advanced
35. `PayrollRun` + `Payslip`
36. `EosbRecord`
37. `EmployeeDocument`
38. `PerformanceReview`
39. `BankAccount` + `BankTransaction` + `BankReconciliation` + `ReconciliationAdjustment`
40. `VatReturn`
41. `NotificationPreference` + `Integration` + `SecuritySettings`
42. `ThemeSettings` + `BackupSettings`

---

## PHASE SUMMARY

**File**: DATABASE_SPECIFICATION.md
**Discovered**: Prisma cannot reliably support PostgreSQL RLS with connection pooling, making application-layer tenant scoping the pragmatic MVP choice (Position B).
**Decided**: Use varchar + Zod validation instead of PostgreSQL ENUM types for Prisma compatibility, and defer RLS to a post-MVP hardening milestone.
**Next phase depends on**: PLAN.md must sequence the 42-model rollout into realistic implementation phases with verification checkpoints.

---

*End of DATABASE_SPECIFICATION.md*
