# Database Knowledge Base — UAE ERP

Complete reference for understanding, maintaining, and evolving the PostgreSQL database schema.
**Backend: Node.js + Express.js** | **ORM: Prisma** | **Database: PostgreSQL 16**

---

## Table of Contents

1. [Node.js + Prisma Compatibility](#1-nodejs--prisma-compatibility)
2. [Adding New Modules](#2-adding-new-modules)
3. [Modifying Existing Schema](#3-modifying-existing-schema)
4. [Migration Strategy](#4-migration-strategy)
5. [Enum Handling](#5-enum-handling)
6. [RLS with Node.js](#6-rls-with-nodejs)
7. [Connection & Pooling](#7-connection--pooling)
8. [Backup & Restore](#8-backup--restore)
9. [Cross-Tenant Queries](#9-cross-tenant-queries)
10. [Performance & Scaling](#10-performance--scaling)
11. [Full-Text Search](#11-full-text-search)
12. [Security Best Practices](#12-security-best-practices)
13. [New Tenant Provisioning](#13-new-tenant-provisioning)
14. [Cloud Database Providers](#14-cloud-database-providers)
15. [Serverless vs Traditional PostgreSQL](#15-serverless-vs-traditional-postgresql)
16. [Common Pitfalls & Solutions](#16-common-pitfalls--solutions)

---

## 1. Node.js + Prisma Compatibility

### Is this schema compatible with Node.js + Prisma?

**Yes, 100%.** The schema is pure PostgreSQL SQL -- it works with any backend language. PostgreSQL is the database; Node.js + Express is the application framework. They communicate via Prisma (which uses the `pg` driver under the hood).

### Project Setup

```bash
# Initialize a new Node.js + TypeScript project
mkdir backend && cd backend
npm init -y
npm install express @prisma/client jsonwebtoken bcryptjs zod bullmq dotenv socket.io
npm install -D prisma typescript @types/express @types/jsonwebtoken @types/bcryptjs ts-node nodemon

# Initialize Prisma
npx prisma init --datasource-provider postgresql
```

This creates:
- `prisma/schema.prisma` -- your schema definition file
- `.env` -- with a placeholder `DATABASE_URL`

### Key Packages

| Package | Purpose | When to Use |
|---------|---------|-------------|
| **prisma** | CLI for migrations, schema management, client generation | Dev dependency -- schema changes, code generation |
| **@prisma/client** | Auto-generated type-safe database client | Every database query in your app |
| **express** | HTTP framework | API routes and middleware |
| **jsonwebtoken** | JWT creation and verification | Authentication |
| **bcryptjs** | Password hashing | User registration and login |
| **zod** | Runtime schema validation | Request body validation, type guards |
| **bullmq** | Background job queue (Redis-backed) | Emails, PDF generation, scheduled tasks |
| **dotenv** | Environment variable loading | Configuration management |
| **socket.io** | WebSocket realtime communication | Live updates, notifications |

### Prisma Schema Configuration

```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgcrypto, pg_trgm, btree_gist]
}
```

### Environment Configuration

```bash
# .env
DATABASE_URL="postgresql://erp_app:YourPassword@localhost:5432/erp_db?schema=public"
JWT_SECRET="your-jwt-secret-here"
REDIS_URL="redis://localhost:6379"
PORT=3000
```

### Prisma Client Singleton Pattern

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

### Introspecting the Existing Schema

Since the database schema already exists as raw SQL files (00-15), use introspection to generate the Prisma schema from the existing database:

```bash
# Pull existing schema into prisma/schema.prisma
npx prisma db pull

# Generate the Prisma Client based on the schema
npx prisma generate
```

This reverse-engineers your existing PostgreSQL tables, enums, indexes, and relations into `schema.prisma`. After introspection, you can use Prisma Migrate going forward.

### UUID Primary Keys with Prisma

```prisma
// In schema.prisma
model Customer {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenantId  String   @map("tenant_id") @db.Uuid
  name      String   @db.VarChar(200)
  email     String?  @db.VarChar(200)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt DateTime @default(now()) @map("updated_at") @db.Timestamptz(6)

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, email])
  @@index([tenantId])
  @@map("customers")
}
```

### JSONB Columns with Prisma

```prisma
// In schema.prisma -- JSONB maps to Prisma's Json type
model Customer {
  id      String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  address Json?  @db.JsonB  // Stores { street, city, emirate, country }
  // ...
}
```

```typescript
// In TypeScript -- define an interface for type safety
interface Address {
  street: string;
  city: string;
  emirate: string;
  country: string;
}

// Create with typed JSONB
const customer = await prisma.customer.create({
  data: {
    tenantId: tenantId,
    name: 'Acme LLC',
    address: {
      street: 'Sheikh Zayed Road',
      city: 'Dubai',
      emirate: 'Dubai',
      country: 'UAE',
    } satisfies Address,
  },
});

// Query JSONB field
const dubaiCustomers = await prisma.customer.findMany({
  where: {
    address: {
      path: ['emirate'],
      equals: 'Dubai',
    },
  },
});
```

---

## 2. Adding New Modules

### Example: Adding a "Fleet Management" Module

**Step 1: Create enums (if needed)**
```sql
-- prisma/migrations/<timestamp>_add_fleet_module/migration.sql
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'retired', 'sold');
CREATE TYPE vehicle_type AS ENUM ('van', 'pickup', 'truck', 'motorcycle', 'sedan');
CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'electric', 'hybrid');
```

**Step 2: Create tables**
```sql
CREATE TABLE fleet_vehicles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    vehicle_number  VARCHAR(20) NOT NULL,
    plate_number    VARCHAR(20) NOT NULL,
    type            vehicle_type NOT NULL,
    make            VARCHAR(100),
    model           VARCHAR(100),
    year            INT,
    color           VARCHAR(50),
    fuel_type       fuel_type NOT NULL DEFAULT 'petrol',
    status          vehicle_status NOT NULL DEFAULT 'active',
    assigned_driver_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    insurance_expiry DATE,
    registration_expiry DATE,
    odometer_reading NUMERIC(10,1) NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMPTZ,
    UNIQUE (tenant_id, vehicle_number)
);
```

**Step 3: Add RLS**
```sql
ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_select ON fleet_vehicles FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON fleet_vehicles FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON fleet_vehicles FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON fleet_vehicles FOR DELETE USING (tenant_id = current_tenant_id());
```

**Step 4: Add indexes**
```sql
CREATE INDEX idx_fleet_vehicles_tenant ON fleet_vehicles (tenant_id);
CREATE INDEX idx_fleet_vehicles_tenant_status ON fleet_vehicles (tenant_id, status);
CREATE INDEX idx_fleet_vehicles_driver ON fleet_vehicles (assigned_driver_id);
```

**Step 5: Add auto-number trigger**
```sql
CREATE OR REPLACE FUNCTION trg_vehicle_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vehicle_number IS NULL OR NEW.vehicle_number = '' THEN
        NEW.vehicle_number := generate_sequence_number(NEW.tenant_id, 'VEH');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_fleet_vehicles_auto_number
    BEFORE INSERT ON fleet_vehicles
    FOR EACH ROW EXECUTE FUNCTION trg_vehicle_number();
```

**Step 6: Link to existing tables (if needed)**
```sql
-- Add vehicle reference to jobs table
ALTER TABLE jobs ADD COLUMN vehicle_id UUID REFERENCES fleet_vehicles(id) ON DELETE SET NULL;
CREATE INDEX idx_jobs_vehicle ON jobs (tenant_id, vehicle_id) WHERE vehicle_id IS NOT NULL;
```

**Step 7: Introspect and generate Prisma Client**
```bash
# After applying the raw SQL migration, pull the changes into schema.prisma
npx prisma db pull

# Regenerate the client
npx prisma generate
```

**Step 8: Create the TypeScript service**
```typescript
// src/features/fleet/fleet.service.ts
import prisma from '../../lib/prisma';
import { z } from 'zod';

export const CreateVehicleSchema = z.object({
  plateNumber: z.string().min(1).max(20),
  type: z.enum(['van', 'pickup', 'truck', 'motorcycle', 'sedan']),
  make: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  year: z.number().int().min(1990).max(2030).optional(),
  fuelType: z.enum(['petrol', 'diesel', 'electric', 'hybrid']).default('petrol'),
  assignedDriverId: z.string().uuid().optional(),
});

type CreateVehicleInput = z.infer<typeof CreateVehicleSchema>;

export async function createVehicle(tenantId: string, input: CreateVehicleInput, userId: string) {
  return prisma.fleetVehicle.create({
    data: {
      tenantId,
      plateNumber: input.plateNumber,
      type: input.type,
      make: input.make,
      model: input.model,
      year: input.year,
      fuelType: input.fuelType,
      assignedDriverId: input.assignedDriverId,
      createdBy: userId,
    },
  });
}

export async function getVehicles(tenantId: string) {
  return prisma.fleetVehicle.findMany({
    where: { tenantId, deletedAt: null },
    include: { assignedDriver: true },
    orderBy: { createdAt: 'desc' },
  });
}
```

**Step 9: Create the Express router**
```typescript
// src/features/fleet/fleet.router.ts
import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { CreateVehicleSchema, createVehicle, getVehicles } from './fleet.service';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const vehicles = await getVehicles(req.user.tenantId);
  res.json({ data: vehicles });
});

router.post('/', authenticate, async (req, res) => {
  const parsed = CreateVehicleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const vehicle = await createVehicle(req.user.tenantId, parsed.data, req.user.id);
  res.status(201).json({ data: vehicle });
});

export default router;
```

---

## 3. Modifying Existing Schema

### Common ALTER Operations

```sql
-- Add a column
ALTER TABLE customers ADD COLUMN whatsapp VARCHAR(20);

-- Add column with default
ALTER TABLE invoices ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'AED';

-- Rename a column
ALTER TABLE employees RENAME COLUMN phone TO mobile;

-- Change column type (careful -- may need data migration)
ALTER TABLE items ALTER COLUMN barcode TYPE VARCHAR(200);

-- Make a column nullable
ALTER TABLE quotations ALTER COLUMN expiry_date DROP NOT NULL;

-- Make a column NOT NULL (ensure no NULLs exist first)
UPDATE customers SET company = '' WHERE company IS NULL;
ALTER TABLE customers ALTER COLUMN company SET NOT NULL;

-- Drop a column
ALTER TABLE customers DROP COLUMN IF EXISTS fax_number;

-- Add a check constraint
ALTER TABLE invoices ADD CONSTRAINT chk_invoice_total CHECK (total >= 0);

-- Add a new FK
ALTER TABLE jobs ADD COLUMN vehicle_id UUID REFERENCES fleet_vehicles(id) ON DELETE SET NULL;

-- Add index for new column
CREATE INDEX idx_customers_whatsapp ON customers (tenant_id, whatsapp) WHERE whatsapp IS NOT NULL;
```

### Applying Changes with Prisma Migrate

```bash
# After writing your SQL or editing schema.prisma, create a migration:
npx prisma migrate dev --name add_whatsapp_to_customers

# For production deployment:
npx prisma migrate deploy

# After any migration, regenerate the client:
npx prisma generate
```

If the change is a pure SQL operation (ALTER TABLE, new trigger, etc.), place it directly in the migration SQL file that Prisma creates inside `prisma/migrations/<timestamp>_<name>/migration.sql`.

### NEVER Do These on Production Without Backup

```sql
-- DROP TABLE, DROP COLUMN, DROP TYPE -- always back up first
-- ALTER TYPE ... RENAME VALUE -- not supported, requires workaround
-- TRUNCATE -- deletes all data instantly
-- DROP INDEX CONCURRENTLY -- can cause downtime on large tables
```

---

## 4. Migration Strategy

### Recommended: Prisma Migrate with Raw SQL

Prisma Migrate is ideal because it supports both Prisma schema-level changes and raw SQL for PostgreSQL-specific features (triggers, RLS, extensions, custom functions).

```bash
# Create a new migration (development)
npx prisma migrate dev --name add_fleet_module

# Apply migrations in production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database (development only -- destroys all data)
npx prisma migrate reset
```

### Using Raw SQL in Prisma Migrations

After running `npx prisma migrate dev --create-only`, Prisma creates a `migration.sql` file. You can edit this file to add raw SQL that Prisma cannot express natively:

```sql
-- prisma/migrations/20260301120000_add_fleet_module/migration.sql

-- Prisma-generated schema changes go here...

-- Then add raw SQL for things Prisma does not support:

-- Custom enum
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'retired', 'sold');

-- RLS policies
ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_select ON fleet_vehicles
    FOR SELECT USING (tenant_id = current_tenant_id());

-- Triggers
CREATE OR REPLACE FUNCTION trg_vehicle_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vehicle_number IS NULL OR NEW.vehicle_number = '' THEN
        NEW.vehicle_number := generate_sequence_number(NEW.tenant_id, 'VEH');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_fleet_vehicles_auto_number
    BEFORE INSERT ON fleet_vehicles
    FOR EACH ROW EXECUTE FUNCTION trg_vehicle_number();

-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### Baseline an Existing Database

Since the schema already exists as raw SQL files (00-15), baseline Prisma to track future changes:

```bash
# 1. Run the existing SQL files against your database (if not done already)
# 2. Pull the schema into Prisma
npx prisma db pull

# 3. Create an initial migration without applying it (since the DB already matches)
npx prisma migrate dev --name initial_baseline --create-only

# 4. Mark it as already applied
npx prisma migrate resolve --applied 20260301000000_initial_baseline
```

### Migration Folder Structure

```
prisma/
├── schema.prisma              <- Prisma schema definition
└── migrations/
    ├── 20260301000000_initial_baseline/
    │   └── migration.sql      <- Baseline (existing schema)
    ├── 20260305120000_add_whatsapp_to_customers/
    │   └── migration.sql
    ├── 20260310120000_add_fleet_module/
    │   └── migration.sql
    └── migration_lock.toml    <- Prisma migration lock
```

### Golden Rules for Migrations

1. **Never edit a migration that has been run in production** -- create a new one
2. **Always write reversible changes** -- so you can undo mistakes manually
3. **Test on staging first** -- never run untested migrations on production
4. **Back up before migrating** -- `pg_dump erp_db > backup.sql`
5. **One concern per migration** -- do not mix unrelated changes
6. **Name migrations descriptively** -- `add_fleet_module` not `update`
7. **Use `--create-only` for complex changes** -- edit the SQL before applying

---

## 5. Enum Handling

### PostgreSQL Enum Limitations

```sql
-- CAN add new values
ALTER TYPE job_status ADD VALUE 'rescheduled' AFTER 'on-hold';

-- CANNOT remove values
-- CANNOT rename values
-- CANNOT reorder values
```

### Workaround: Replace an Entire Enum

```sql
-- 1. Rename old enum
ALTER TYPE job_status RENAME TO job_status_old;

-- 2. Create new enum with desired values
CREATE TYPE job_status AS ENUM ('new', 'scheduled', 'in-progress', 'on-hold', 'rescheduled', 'completed', 'cancelled', 'invoiced');

-- 3. Migrate all columns using the old enum
ALTER TABLE jobs ALTER COLUMN status TYPE job_status USING status::text::job_status;
ALTER TABLE job_status_history ALTER COLUMN status TYPE job_status USING status::text::job_status;

-- 4. Drop old enum
DROP TYPE job_status_old;
```

### Prisma Enum Support

Prisma maps PostgreSQL enums to TypeScript enums automatically:

```prisma
// schema.prisma -- generated by `npx prisma db pull`
enum job_status {
  new
  scheduled
  in_progress  @map("in-progress")
  on_hold      @map("on-hold")
  completed
  cancelled
  invoiced
}

model Job {
  id     String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  status job_status @default(new)
  // ...
  @@map("jobs")
}
```

```typescript
// Usage in TypeScript -- fully typed
import { job_status } from '@prisma/client';

const activeJobs = await prisma.job.findMany({
  where: {
    status: { in: [job_status.new, job_status.scheduled, job_status.in_progress] },
  },
});
```

### Zod Schemas for Enum Validation

```typescript
// src/features/jobs/job.schema.ts
import { z } from 'zod';

export const JobStatusEnum = z.enum([
  'new',
  'scheduled',
  'in-progress',
  'on-hold',
  'completed',
  'cancelled',
  'invoiced',
]);

export type JobStatus = z.infer<typeof JobStatusEnum>;

export const UpdateJobStatusSchema = z.object({
  status: JobStatusEnum,
  notes: z.string().max(500).optional(),
});

// Usage in route handler
router.patch('/:id/status', authenticate, async (req, res) => {
  const parsed = UpdateJobStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const job = await prisma.job.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status as job_status },
  });

  res.json({ data: job });
});
```

### Alternative: Use VARCHAR Instead of ENUM

Some teams prefer `VARCHAR(50)` with `CHECK` constraints instead of enums because they are easier to modify:

```sql
-- Easier to change but less type-safe
ALTER TABLE jobs ADD CONSTRAINT chk_job_status
    CHECK (status IN ('pending', 'scheduled', 'in-progress', 'on-hold', 'completed', 'cancelled', 'invoiced'));

-- To add a value: drop and recreate the constraint
ALTER TABLE jobs DROP CONSTRAINT chk_job_status;
ALTER TABLE jobs ADD CONSTRAINT chk_job_status
    CHECK (status IN ('pending', 'scheduled', 'in-progress', 'on-hold', 'rescheduled', 'completed', 'cancelled', 'invoiced'));
```

**This schema uses enums** because they provide stronger type safety and better storage efficiency. The tradeoff is that modifications require the rename-recreate workaround.

---

## 6. RLS with Node.js

### Express Middleware Approach (Recommended)

Row-Level Security in PostgreSQL relies on session variables (`app.current_tenant`, `app.current_user`). With Prisma, you set these via `$executeRawUnsafe` before each request.

```typescript
// src/middleware/tenant-context.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

/**
 * Middleware that sets PostgreSQL session variables for RLS.
 * Must run AFTER the auth middleware (which populates req.user).
 */
export async function tenantContext(req: Request, res: Response, next: NextFunction) {
  try {
    const tenantId = req.user?.tenantId;
    const userId = req.user?.id;

    if (tenantId) {
      // Set PostgreSQL session variables for RLS policies
      await prisma.$executeRawUnsafe(
        `SELECT set_config('app.current_tenant', '${tenantId}', false)`
      );
      await prisma.$executeRawUnsafe(
        `SELECT set_config('app.current_user', '${userId}', false)`
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
```

### Auth Middleware (JWT Verification)

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;        // user ID
  tenantId: string;
  email: string;
  role: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tenantId: string;
        email: string;
        role: string;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = {
      id: decoded.sub,
      tenantId: decoded.tenantId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

### Combining Auth + Tenant Context in Express App

```typescript
// src/app.ts
import express from 'express';
import { authenticate } from './middleware/auth';
import { tenantContext } from './middleware/tenant-context';
import fleetRouter from './features/fleet/fleet.router';
import jobsRouter from './features/jobs/jobs.router';

const app = express();

app.use(express.json());

// Public routes (no auth needed)
app.use('/api/auth', authRouter);

// Protected routes -- auth + tenant context
app.use('/api/fleet', authenticate, tenantContext, fleetRouter);
app.use('/api/jobs', authenticate, tenantContext, jobsRouter);

export default app;
```

### Transaction-Scoped Tenant Context

For operations that need RLS within a Prisma transaction:

```typescript
// src/lib/with-tenant.ts
import { PrismaClient, Prisma } from '@prisma/client';
import prisma from './prisma';

/**
 * Executes a callback within a transaction that has tenant context set.
 * This ensures RLS is enforced for all queries within the transaction.
 */
export async function withTenantContext<T>(
  tenantId: string,
  userId: string,
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `SELECT set_config('app.current_tenant', '${tenantId}', true)`
    );
    await tx.$executeRawUnsafe(
      `SELECT set_config('app.current_user', '${userId}', true)`
    );
    return callback(tx);
  });
}

// Usage
const invoice = await withTenantContext(tenantId, userId, async (tx) => {
  const inv = await tx.invoice.create({
    data: { tenantId, customerId, total: 1500 },
  });
  await tx.invoiceItem.createMany({
    data: items.map((item) => ({ invoiceId: inv.id, ...item })),
  });
  return inv;
});
```

---

## 7. Connection & Pooling

### Prisma Connection URL

```bash
# .env
DATABASE_URL="postgresql://erp_app:YourPassword@localhost:5432/erp_db?schema=public&connection_limit=20&pool_timeout=10"
```

### Connection Pool Settings

Prisma manages its own connection pool. Configure via the `DATABASE_URL` query parameters:

| Parameter | Development | Production | Description |
|-----------|------------|------------|-------------|
| `connection_limit` | 5 | 20 | Maximum connections in the pool |
| `pool_timeout` | 10 | 10 | Seconds to wait for a connection from the pool |
| `connect_timeout` | 10 | 5 | Seconds to wait for a new connection to the database |
| `statement_cache_size` | 100 | 500 | Number of prepared statements to cache |

```bash
# Production DATABASE_URL with pool settings
DATABASE_URL="postgresql://erp_app:xxx@db.example.com:5432/erp_db?schema=public&connection_limit=20&pool_timeout=10&connect_timeout=5&sslmode=require"
```

### For High Load (100+ concurrent users)

Use **PgBouncer** as a connection pooler between your app and PostgreSQL:

```
Node.js App (Prisma) -> PgBouncer (port 6432) -> PostgreSQL (port 5432)
```

When using PgBouncer with Prisma, add the `pgbouncer=true` flag:

```bash
# .env with PgBouncer
DATABASE_URL="postgresql://erp_app:xxx@localhost:6432/erp_db?schema=public&pgbouncer=true&connection_limit=20"

# Direct URL (for migrations -- bypass PgBouncer)
DIRECT_URL="postgresql://erp_app:xxx@localhost:5432/erp_db?schema=public"
```

```prisma
// schema.prisma -- configure both URLs
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // PgBouncer for queries
  directUrl = env("DIRECT_URL")         // Direct for migrations
}
```

PgBouncer reuses connections efficiently, reducing PostgreSQL overhead from thousands of app connections down to ~50 actual DB connections.

### Graceful Shutdown

```typescript
// src/server.ts
import app from './app';
import prisma from './lib/prisma';

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

async function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
```

---

## 8. Backup & Restore

```bash
# Full backup (custom format -- best for restore flexibility)
pg_dump -Fc -h localhost -U erp_app erp_db > erp_backup_$(date +%Y%m%d).dump

# Schema only (no data) -- useful for documentation
pg_dump --schema-only -h localhost -U erp_app erp_db > schema_only.sql

# Data only (no schema)
pg_dump --data-only -h localhost -U erp_app erp_db > data_only.sql

# Single table backup
pg_dump -t customers -h localhost -U erp_app erp_db > customers.sql

# Restore to existing database
pg_restore -h localhost -U erp_app -d erp_db erp_backup_20260226.dump

# Restore to a NEW database
createdb erp_db_restored
pg_restore -h localhost -U erp_app -d erp_db_restored erp_backup_20260226.dump
```

### Automated Backup Script (Linux/cron)

```bash
#!/bin/bash
BACKUP_DIR="/backups/erp"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -Fc -h localhost -U erp_app erp_db > "$BACKUP_DIR/erp_$TIMESTAMP.dump"

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.dump" -mtime +30 -delete
```

### Backup via BullMQ Background Job

```typescript
// src/jobs/backup.job.ts
import { Queue, Worker } from 'bullmq';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const backupQueue = new Queue('database-backup', {
  connection: { url: process.env.REDIS_URL },
});

// Schedule daily backup at 2 AM
await backupQueue.add('daily-backup', {}, {
  repeat: { pattern: '0 2 * * *' },
});

// Worker
const worker = new Worker('database-backup', async (job) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `/backups/erp_${timestamp}.dump`;

  await execAsync(`pg_dump -Fc -h localhost -U erp_app erp_db > ${filename}`);
  console.log(`Backup created: ${filename}`);
}, {
  connection: { url: process.env.REDIS_URL },
});
```

### Cloud Provider Backups

Most cloud providers (Supabase, Neon, AWS RDS) have automated daily backups. You just configure retention period.

---

## 9. Cross-Tenant Queries

### When Do You Need Cross-Tenant Queries?

- Super admin dashboard (total users across all tenants)
- Billing/subscription management
- System health monitoring
- Analytics aggregation

### How to Bypass RLS with Prisma

```typescript
// Option 1: Use a separate superuser Prisma client (bypasses RLS automatically)
// src/lib/prisma-admin.ts
import { PrismaClient } from '@prisma/client';

// This client uses a superuser connection that bypasses RLS
const prismaAdmin = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_ADMIN_URL },
  },
});

export default prismaAdmin;
```

```typescript
// Option 2: Use raw SQL with a BYPASSRLS role
// src/features/admin/admin.service.ts
import prismaAdmin from '../../lib/prisma-admin';

export async function getDashboardStats() {
  const [tenantCount, userCount, activeJobs] = await Promise.all([
    prismaAdmin.tenant.count(),
    prismaAdmin.user.count({ where: { status: 'active' } }),
    prismaAdmin.job.count({ where: { status: { in: ['scheduled', 'in_progress'] } } }),
  ]);

  return { tenantCount, userCount, activeJobs };
}

// Cross-tenant analytics
export async function getRevenueByTenant() {
  const results = await prismaAdmin.$queryRaw<
    { tenant_id: string; tenant_name: string; total_revenue: number }[]
  >`
    SELECT t.id AS tenant_id, t.name AS tenant_name,
           COALESCE(SUM(i.total), 0) AS total_revenue
    FROM tenants t
    LEFT JOIN invoices i ON i.tenant_id = t.id AND i.status = 'paid'
    GROUP BY t.id, t.name
    ORDER BY total_revenue DESC
  `;
  return results;
}
```

```typescript
// Option 3: Create a dedicated platform admin role in PostgreSQL
// CREATE ROLE platform_admin BYPASSRLS LOGIN PASSWORD '...';
```

### Never expose cross-tenant queries in regular API endpoints. Use a separate admin service with a separate database role.

---

## 10. Performance & Scaling

### Table Partitioning (for large tables)

When `audit_logs`, `attendance_records`, or `stock_movements` grow beyond millions of rows:

```sql
-- Partition audit_logs by month
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- ... other columns
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE audit_logs_2026_q1 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');
CREATE TABLE audit_logs_2026_q2 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');
```

### Query Optimization Tips

```sql
-- Use EXPLAIN ANALYZE to check query plans
EXPLAIN ANALYZE SELECT * FROM invoices WHERE tenant_id = '...' AND status = 'overdue';

-- Ensure indexes are being used (should show "Index Scan", not "Seq Scan")
-- If Seq Scan: check that ANALYZE has been run, or add missing index
ANALYZE invoices;
```

### Optimizing Prisma Queries

```typescript
// BAD -- N+1 problem: fetches jobs, then fetches customer for each job
const jobs = await prisma.job.findMany({ where: { tenantId } });
for (const job of jobs) {
  const customer = await prisma.customer.findUnique({ where: { id: job.customerId } });
}

// GOOD -- single query with include (JOIN)
const jobs = await prisma.job.findMany({
  where: { tenantId },
  include: { customer: true, assignedTechnician: true },
});

// GOOD -- select only needed fields to reduce payload
const jobs = await prisma.job.findMany({
  where: { tenantId },
  select: {
    id: true,
    jobNumber: true,
    status: true,
    scheduledDate: true,
    customer: { select: { name: true, phone: true } },
  },
});

// Use cursor-based pagination for large datasets
const jobs = await prisma.job.findMany({
  where: { tenantId },
  take: 20,
  skip: 1,
  cursor: { id: lastJobId },
  orderBy: { createdAt: 'desc' },
});
```

### VACUUM & Maintenance

```sql
-- PostgreSQL auto-vacuum is ON by default
-- But for large bulk operations, run manually:
VACUUM ANALYZE customers;
VACUUM ANALYZE invoices;

-- Full vacuum (reclaims disk space, requires exclusive lock -- run off-hours)
VACUUM FULL audit_logs;
```

### Read Replicas

For heavy reporting workloads, use a read replica:
```
Write queries  -> Primary DB
Read queries (reports, dashboards) -> Read Replica
```

Most cloud providers support this with a toggle.

---

## 11. Full-Text Search

### Basic Trigram Search (already set up)

The schema already has `pg_trgm` extension and a trigram index on `customers.name`:
```sql
-- Fuzzy search
SELECT * FROM customers
WHERE name % 'Ahmed'  -- Trigram similarity
ORDER BY similarity(name, 'Ahmed') DESC;
```

### Querying Full-Text Search with Prisma

```typescript
// src/features/crm/customer.service.ts
import prisma from '../../lib/prisma';

export async function searchCustomers(tenantId: string, query: string) {
  // Trigram similarity search via raw SQL
  const customers = await prisma.$queryRaw<
    { id: string; name: string; email: string; similarity: number }[]
  >`
    SELECT id, name, email, similarity(name, ${query}) AS similarity
    FROM customers
    WHERE tenant_id = ${tenantId}::uuid
      AND name % ${query}
    ORDER BY similarity DESC
    LIMIT 20
  `;
  return customers;
}

// Full-text search (if tsvector column exists)
export async function fullTextSearch(tenantId: string, query: string) {
  const customers = await prisma.$queryRaw<
    { id: string; name: string; email: string; rank: number }[]
  >`
    SELECT id, name, email,
           ts_rank(search_vector, to_tsquery('english', ${query})) AS rank
    FROM customers
    WHERE tenant_id = ${tenantId}::uuid
      AND search_vector @@ to_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT 20
  `;
  return customers;
}
```

### Advanced Full-Text Search (add if needed)

```sql
-- Add tsvector column
ALTER TABLE customers ADD COLUMN search_vector tsvector;

-- Create GIN index
CREATE INDEX idx_customers_fts ON customers USING gin(search_vector);

-- Auto-populate trigger
CREATE OR REPLACE FUNCTION update_customer_search()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        coalesce(NEW.name, '') || ' ' ||
        coalesce(NEW.company, '') || ' ' ||
        coalesce(NEW.email, '') || ' ' ||
        coalesce(NEW.phone, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customer_search
    BEFORE INSERT OR UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_customer_search();

-- Search
SELECT * FROM customers
WHERE search_vector @@ to_tsquery('english', 'dubai & plumbing');
```

---

## 12. Security Best Practices

### Create a Dedicated App User (never use superuser)

```sql
-- Create app role
CREATE ROLE erp_app LOGIN PASSWORD 'strong_random_password_here';

-- Grant access
GRANT CONNECT ON DATABASE erp_db TO erp_app;
GRANT USAGE ON SCHEMA public TO erp_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO erp_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO erp_app;

-- Future tables auto-grant
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO erp_app;

-- erp_app MUST respect RLS (do NOT give BYPASSRLS)
```

### SSL Connections (required for cloud)

```bash
# .env -- SSL is enforced via the sslmode parameter
DATABASE_URL="postgresql://erp_app:xxx@db.example.com:5432/erp_db?schema=public&sslmode=require"
```

### Prevent SQL Injection

Prisma uses parameterized queries by default. This is the primary defense against SQL injection:

```typescript
// SAFE -- Prisma parameterizes automatically
const customer = await prisma.customer.findFirst({
  where: { tenantId, email: userInput },
});

// SAFE -- tagged template literal is parameterized
const results = await prisma.$queryRaw`
  SELECT * FROM customers WHERE tenant_id = ${tenantId} AND email = ${email}
`;

// DANGEROUS -- $queryRawUnsafe with string interpolation
// NEVER do this with user input:
const results = await prisma.$queryRawUnsafe(
  `SELECT * FROM customers WHERE email = '${email}'`  // SQL INJECTION!
);

// SAFE -- if you must use $queryRawUnsafe, use Prisma.sql for parameterization
import { Prisma } from '@prisma/client';
const results = await prisma.$queryRawUnsafe(
  'SELECT * FROM customers WHERE tenant_id = $1 AND email = $2',
  tenantId,
  email
);
```

### Important: RLS Tenant Context and Injection

The tenant context middleware uses `$executeRawUnsafe` with the tenant ID from a verified JWT. Since the JWT is signed and verified server-side, the tenant ID is trusted. Never set tenant context from unverified user input:

```typescript
// SAFE -- tenantId comes from verified JWT
await prisma.$executeRawUnsafe(
  `SELECT set_config('app.current_tenant', '${req.user.tenantId}', false)`
);

// DANGEROUS -- tenantId from query parameter (could be tampered)
await prisma.$executeRawUnsafe(
  `SELECT set_config('app.current_tenant', '${req.query.tenantId}', false)` // NEVER!
);
```

### Password Hashing

```typescript
// src/features/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: { id: string; tenantId: string; email: string; role: string }): string {
  return jwt.sign(
    { sub: user.id, tenantId: user.tenantId, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '8h' }
  );
}
```

### Input Validation with Zod

```typescript
// src/features/auth/auth.schema.ts
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(100),
});

export const RegisterSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  tenantName: z.string().min(2).max(200),
  trn: z.string().regex(/^\d{15}$/, 'TRN must be exactly 15 digits').optional(),
});
```

---

## 13. New Tenant Provisioning

### SQL Function to Provision a New Tenant

```sql
CREATE OR REPLACE FUNCTION provision_tenant(
    p_name VARCHAR,
    p_admin_email VARCHAR,
    p_admin_password_hash VARCHAR,
    p_trn VARCHAR DEFAULT NULL,
    p_plan subscription_plan DEFAULT 'starter'
) RETURNS TABLE(tenant_id UUID, admin_user_id UUID) AS $$
DECLARE
    v_tenant_id UUID;
    v_user_id UUID;
    v_source_tenant UUID := 'a0000000-0000-0000-0000-000000000001';  -- template tenant
BEGIN
    -- 1. Create tenant
    INSERT INTO tenants (name, slug, trn, plan, status, enabled_modules, trial_ends_at)
    VALUES (
        p_name,
        lower(regexp_replace(p_name, '[^a-zA-Z0-9]', '-', 'g')),
        p_trn,
        p_plan,
        'trial',
        ARRAY['dashboard','crm','sales','inventory','purchase','accounts','hr','jobs','settings'],
        now() + interval '14 days'
    ) RETURNING id INTO v_tenant_id;

    -- 2. Create admin user
    INSERT INTO users (tenant_id, email, password_hash, name, role, permissions, status)
    VALUES (v_tenant_id, p_admin_email, p_admin_password_hash, 'Administrator', 'admin', ARRAY['*'], 'active')
    RETURNING id INTO v_user_id;

    -- 3. Copy default roles from template tenant
    INSERT INTO roles (tenant_id, name, description, permissions, is_system)
    SELECT v_tenant_id, name, description, permissions, is_system
    FROM roles WHERE tenant_id = v_source_tenant AND is_system = true;

    -- 4. Copy default leave types
    INSERT INTO leave_types (tenant_id, type_id, name, days_per_year, is_paid, pay_percentage,
        requires_medical_certificate, min_service_days_required, carry_forward, max_carry_forward_days, encashable)
    SELECT v_tenant_id, type_id, name, days_per_year, is_paid, pay_percentage,
        requires_medical_certificate, min_service_days_required, carry_forward, max_carry_forward_days, encashable
    FROM leave_types WHERE tenant_id = v_source_tenant;

    -- 5. Copy default chart of accounts
    INSERT INTO chart_of_accounts (tenant_id, code, name, type, category, is_system_account, description, created_by)
    SELECT v_tenant_id, code, name, type, category, is_system_account, description, v_user_id
    FROM chart_of_accounts WHERE tenant_id = v_source_tenant;

    -- 6. Set parent_id relationships (by matching code)
    UPDATE chart_of_accounts c
    SET parent_id = p.id
    FROM chart_of_accounts src
    JOIN chart_of_accounts p ON p.code = (
        SELECT code FROM chart_of_accounts WHERE id = src.parent_id AND tenant_id = v_source_tenant
    ) AND p.tenant_id = v_tenant_id
    WHERE c.tenant_id = v_tenant_id
      AND src.tenant_id = v_source_tenant
      AND c.code = src.code
      AND src.parent_id IS NOT NULL;

    -- 7. Copy default shifts
    INSERT INTO shifts (tenant_id, name, type, start_time, end_time, break_duration_minutes, grace_minutes)
    SELECT v_tenant_id, name, type, start_time, end_time, break_duration_minutes, grace_minutes
    FROM shifts WHERE tenant_id = v_source_tenant;

    -- 8. Create default settings
    INSERT INTO company_profiles (tenant_id, name, created_by) VALUES (v_tenant_id, p_name, v_user_id);
    INSERT INTO security_settings (tenant_id) VALUES (v_tenant_id);
    INSERT INTO backup_settings (tenant_id) VALUES (v_tenant_id);
    INSERT INTO theme_settings (tenant_id, colors) VALUES (v_tenant_id,
        '{"primary": "#4f46e5", "sidebar": "#0f172a", "success": "#16a34a", "warning": "#d97706", "error": "#dc2626"}');

    RETURN QUERY SELECT v_tenant_id, v_user_id;
END;
$$ LANGUAGE plpgsql;
```

### Call from TypeScript / Express

```typescript
// src/features/auth/auth.service.ts
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';

interface ProvisionResult {
  tenant_id: string;
  admin_user_id: string;
}

export async function provisionTenant(
  name: string,
  adminEmail: string,
  adminPassword: string,
  trn?: string,
  plan: string = 'starter'
): Promise<ProvisionResult> {
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const result = await prisma.$queryRaw<ProvisionResult[]>`
    SELECT * FROM provision_tenant(
      ${name},
      ${adminEmail},
      ${passwordHash},
      ${trn ?? null},
      ${plan}::subscription_plan
    )
  `;

  return result[0];
}
```

```typescript
// src/features/auth/auth.router.ts
import { Router } from 'express';
import { RegisterSchema } from './auth.schema';
import { provisionTenant } from './auth.service';
import { generateToken } from './auth.service';

const router = Router();

router.post('/register', async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const { name, email, password, tenantName, trn } = parsed.data;

  try {
    const result = await provisionTenant(tenantName, email, password, trn);

    const token = generateToken({
      id: result.admin_user_id,
      tenantId: result.tenant_id,
      email,
      role: 'admin',
    });

    res.status(201).json({
      data: {
        tenantId: result.tenant_id,
        userId: result.admin_user_id,
        token,
      },
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email or tenant already exists' });
    }
    throw error;
  }
});

export default router;
```

### Background Job for Post-Provisioning Tasks

```typescript
// src/jobs/tenant-provisioning.job.ts
import { Queue, Worker } from 'bullmq';

const provisioningQueue = new Queue('tenant-provisioning', {
  connection: { url: process.env.REDIS_URL },
});

// Add to queue after tenant creation
export async function schedulePostProvisioningTasks(tenantId: string, adminEmail: string) {
  await provisioningQueue.add('post-provision', { tenantId, adminEmail });
}

// Worker handles async tasks
const worker = new Worker('tenant-provisioning', async (job) => {
  const { tenantId, adminEmail } = job.data;

  // Send welcome email
  // Generate sample data
  // Set up default notification preferences
  console.log(`Post-provisioning tasks completed for tenant ${tenantId}`);
}, {
  connection: { url: process.env.REDIS_URL },
});
```

---

## 14. Cloud Database Providers

### Comparison for Node.js Backend

| Provider | Free Tier | Pricing (Prod) | Extensions | RLS | Backups | Best For |
|----------|-----------|----------------|------------|-----|---------|----------|
| **Neon** | 512 MB, 0.5 GB compute | $19/mo (Scale) | All supported | Yes | Auto PITR | Serverless, auto-scaling, dev branching |
| **Supabase** | 500 MB | $25/mo (Pro) | All supported | Yes (native) | Daily | Full platform (auth, storage, realtime) |
| **AWS RDS** | 12 months free (t3.micro) | $15-50/mo | All supported | Yes | Auto daily | Enterprise, full AWS ecosystem |
| **Railway** | 1 GB trial | $5-20/mo | All supported | Yes | Manual | Simple deploy, fast setup |
| **DigitalOcean Managed DB** | None | $15/mo (1GB) | All supported | Yes | Auto daily | Simple, predictable pricing |
| **Render** | 256 MB (90 days) | $7/mo (Starter) | Most supported | Yes | Daily | Simple, good free tier |

### Recommendation by Stage

| Stage | Provider | Why |
|-------|----------|-----|
| **Learning/Development** | **Neon Free** | 512 MB free forever, instant setup, database branching |
| **MVP/Beta** | **Neon Scale** or **Supabase Pro** | $19-25/mo, auto-scaling, managed backups |
| **Production** | **AWS RDS** or **DigitalOcean** | Best for Node.js ecosystem, great Prisma support, enterprise SLAs |
| **Full-stack platform** | **Supabase** | Built-in auth, storage, realtime -- but you may not need these with your own backend |

### Connection String Examples (DATABASE_URL format)

```bash
# Neon
DATABASE_URL="postgresql://erp_app:xxx@ep-cool-name-123456.us-east-2.aws.neon.tech/erp_db?sslmode=require"

# Supabase (direct connection)
DATABASE_URL="postgresql://postgres:xxx@db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require"

# Supabase (connection pooler -- recommended for serverless/Prisma)
DATABASE_URL="postgresql://postgres:xxx@pooler.abcdefghijklmnop.supabase.co:6543/postgres?pgbouncer=true&sslmode=require"

# AWS RDS
DATABASE_URL="postgresql://erp_app:xxx@erp-db.abc123def456.us-east-1.rds.amazonaws.com:5432/erp_db?sslmode=require"

# Railway
DATABASE_URL="postgresql://postgres:xxx@containers-us-west-1.railway.app:5432/railway?sslmode=require"

# DigitalOcean
DATABASE_URL="postgresql://erp_app:xxx@db-postgresql-nyc1-12345-do-user.db.ondigitalocean.com:25060/erp_db?sslmode=require"

# Render
DATABASE_URL="postgresql://erp_app:xxx@dpg-abc123.oregon-postgres.render.com/erp_db?sslmode=require"
```

---

## 15. Serverless vs Traditional PostgreSQL

### What is "Traditional" PostgreSQL?

A traditional PostgreSQL database runs on a **dedicated server** (physical or virtual) that is **always running**, whether anyone is querying it or not.

```
Traditional: Server is ON 24/7 -> You pay 24/7
             Even at 3 AM when nobody is using it -> Still running, still paying
```

Think of it like renting an office: you pay rent every month whether you're in the office or not.

### What is "Serverless" PostgreSQL?

Serverless PostgreSQL (like **Neon**) separates **storage** from **compute**:

```
Serverless:  Someone sends a query -> Compute spins up (milliseconds) -> Runs query -> Scales down
             Nobody using it at 3 AM -> Compute scales to ZERO -> You pay $0 for compute
             Storage still exists (your data is safe) -> You only pay for storage
```

Think of it like a taxi: you only pay when you ride.

### Visual Comparison

```
TRADITIONAL (AWS RDS, DigitalOcean):
|-- 12 AM ################ Running (paying)
|--  3 AM ################ Running (paying) <-- Nobody using it!
|--  6 AM ################ Running (paying)
|--  9 AM ################ Running (paying) <-- Users active
|-- 12 PM ################ Running (paying) <-- Peak usage
|--  3 PM ################ Running (paying)
|--  6 PM ################ Running (paying) <-- Users leaving
|--  9 PM ################ Running (paying)
|   Cost: ~$50/mo flat regardless of usage

SERVERLESS (Neon):
|-- 12 AM ................ Scaled to zero ($0)
|--  3 AM ................ Scaled to zero ($0)
|--  6 AM ................ Scaled to zero ($0)
|--  9 AM ########........ Scaled up (paying)
|-- 12 PM ################ Peak (paying more)
|--  3 PM ############.... Medium load (paying less)
|--  6 PM ########........ Low usage (paying less)
|--  9 PM ................ Scaled to zero ($0)
|   Cost: ~$10-20/mo (pay only for actual usage)
```

### Why Choose Serverless (Neon)?

| Advantage | Explanation |
|-----------|-------------|
| **Cost savings** | You pay only when queries are running. For a startup/MVP with variable traffic, this can save 50-80% vs a dedicated server. |
| **Auto-scaling** | If 100 users hit your app at once, compute scales up automatically. No manual server resizing. |
| **Scale to zero** | At night, weekends, or low-traffic periods, compute shuts down. Storage (your data) remains safe. |
| **Database branching** | Create instant copies of your database for testing migrations -- like `git branch` for your database. |
| **Instant provisioning** | New database in seconds, not minutes. |
| **No server management** | No patching, no OS updates, no disk management. |

### Why Choose Traditional?

| Advantage | Explanation |
|-----------|-------------|
| **Predictable latency** | Always-on server means zero cold-start delay. Serverless has ~500ms cold start after idle. |
| **Predictable cost** | Flat monthly fee. Easy to budget. Serverless can surprise you if usage spikes. |
| **Sustained workloads** | If your app has 24/7 traffic (e.g., 100+ users always online), traditional is cheaper because serverless billing adds up. |
| **Full control** | You control PostgreSQL config, extensions, version, OS-level tuning. |
| **Connection stability** | No risk of cold-start connection drops. |

### The Cold Start Problem

Serverless databases have a "cold start" -- when the compute has scaled to zero, the first query takes slightly longer:

```
Traditional:  Every query -> ~5ms response
Serverless:   First query after idle -> ~500ms (cold start)
              Subsequent queries -> ~5ms (warm)
              After 5 min idle -> scales to zero again
```

**Mitigation:** Neon lets you configure a "suspend delay" (e.g., keep compute alive for 5 minutes after the last query). For production, set this to 10-15 minutes to avoid cold starts during business hours.

### Decision Matrix

| Your Situation | Choose |
|----------------|--------|
| Building MVP, low budget | **Serverless (Neon)** |
| Variable traffic (busy daytime, quiet nights) | **Serverless (Neon)** |
| Startup, few users, growing | **Serverless (Neon)** |
| 50+ users online 24/7 | **Traditional (AWS RDS)** |
| Enterprise client, SLA required | **Traditional (AWS RDS)** |
| Need database branching for dev | **Serverless (Neon)** |

### For YOUR Project (UAE ERP SaaS)

**Start with Neon (serverless)** because:
- You are building an ERP for UAE service companies -- most users work 8 AM to 6 PM UAE time
- Nights and weekends will have near-zero traffic -- serverless saves money
- Multiple tenants with variable load -- auto-scaling handles spikes
- Database branching -- test schema migrations safely before production
- When you grow to 100+ concurrent users 24/7, migrate to AWS RDS or DigitalOcean

**Migration from Neon to a traditional provider is simple** -- it is all standard PostgreSQL. Just `pg_dump` and `pg_restore`.

---

## 16. Common Pitfalls & Solutions

### Pitfall 1: Forgetting to SET tenant context

```
Problem:  Query returns empty results or affects wrong tenant's data
Solution: ALWAYS set app.current_tenant before any query
Prevention: Use tenantContext middleware (see Section 6) so it is automatic
```

```typescript
// BAD -- forgot tenant context
router.get('/customers', authenticate, async (req, res) => {
  const customers = await prisma.customer.findMany(); // No tenant filter!
  res.json(customers);
});

// GOOD -- tenant context set via middleware
router.get('/customers', authenticate, tenantContext, async (req, res) => {
  const customers = await prisma.customer.findMany({
    where: { tenantId: req.user!.tenantId },
  });
  res.json(customers);
});
```

### Pitfall 2: Adding enum values in the wrong position

```
Problem:  ALTER TYPE ... ADD VALUE cannot specify IF NOT EXISTS in transactions
Solution: Run enum additions outside transactions, or use the rename-recreate pattern
```

### Pitfall 3: Running migrations without backup

```
Problem:  Migration fails halfway, database in inconsistent state
Solution: ALWAYS pg_dump before running migrations
          Use transactions: BEGIN; ... COMMIT; (or ROLLBACK; on error)
          Prisma Migrate wraps each migration in a transaction by default
```

### Pitfall 4: N+1 queries with Prisma

```
Problem:  Looping over results and querying for each item individually
Solution: Use Prisma's `include` or `select` with nested relations
```

```typescript
// BAD -- N+1: one query per job to get customer
const jobs = await prisma.job.findMany({ where: { tenantId } });
for (const job of jobs) {
  job.customer = await prisma.customer.findUnique({ where: { id: job.customerId } });
}

// GOOD -- single query with JOIN
const jobs = await prisma.job.findMany({
  where: { tenantId },
  include: { customer: true },
});
```

### Pitfall 5: JSONB overuse

```
Problem:  Querying deep inside JSONB is slower than querying regular columns
Solution: If you query a JSONB field frequently (e.g., address.emirate),
          consider extracting it to a dedicated column with an index
```

### Pitfall 6: Large text in audit_logs

```
Problem:  audit_logs grows very large because changes JSONB stores full before/after
Solution: Only store changed fields, not the full record
          Implement table partitioning by month/quarter
          Set up automatic archival after 2 years
```

### Pitfall 7: Connection pool exhaustion

```
Problem:  "too many connections" error under load
Solution: Configure Prisma connection pool properly
          Use PgBouncer for high-concurrency scenarios
          Ensure prisma.$disconnect() is called on shutdown
```

```typescript
// GOOD -- Prisma singleton pattern (one client, shared pool)
import prisma from '../lib/prisma';
const customers = await prisma.customer.findMany();

// BAD -- creating a new PrismaClient per request (pool exhaustion!)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // This creates a NEW pool every time!
const customers = await prisma.customer.findMany();
// Forgot to disconnect -- connection leak!
```

### Pitfall 8: Using $queryRawUnsafe with user input

```
Problem:  SQL injection vulnerability
Solution: Use Prisma's tagged template literal ($queryRaw) or parameterized $queryRawUnsafe
```

```typescript
// SAFE -- tagged template (auto-parameterized)
const results = await prisma.$queryRaw`
  SELECT * FROM customers WHERE email = ${userEmail}
`;

// SAFE -- parameterized $queryRawUnsafe
const results = await prisma.$queryRawUnsafe(
  'SELECT * FROM customers WHERE email = $1',
  userEmail
);

// DANGEROUS -- string interpolation in $queryRawUnsafe
const results = await prisma.$queryRawUnsafe(
  `SELECT * FROM customers WHERE email = '${userEmail}'` // SQL INJECTION!
);
```

### Pitfall 9: Not handling Prisma errors properly

```typescript
// GOOD -- handle known Prisma errors gracefully
import { Prisma } from '@prisma/client';

try {
  const customer = await prisma.customer.create({ data: input });
  res.status(201).json(customer);
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A record with that unique field already exists' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found' });
    }
  }
  throw error; // Re-throw unknown errors to the global error handler
}
```

---

## Summary Checklist

Before going to production:

- [ ] Database created on cloud provider (Neon/AWS RDS/Supabase)
- [ ] All SQL files executed in order (00-15) or Prisma migrations applied
- [ ] Dedicated `erp_app` database role created (not superuser)
- [ ] SSL enabled in DATABASE_URL (`?sslmode=require`)
- [ ] Express middleware sets tenant context on every request via `$executeRawUnsafe`
- [ ] Prisma schema introspected and client generated (`npx prisma generate`)
- [ ] Zod schemas defined for all API request validation
- [ ] JWT authentication middleware configured with `jsonwebtoken`
- [ ] Passwords hashed with `bcryptjs` (12+ salt rounds)
- [ ] Prisma connection pooling configured (`connection_limit` in DATABASE_URL)
- [ ] PgBouncer configured for high-concurrency production use
- [ ] Automated backups configured on cloud provider
- [ ] Prisma Migrate set up for future schema changes
- [ ] Seed data verified (permissions, chart of accounts, leave types)
- [ ] RLS tested (tenant A cannot see tenant B's data)
- [ ] All queries use Prisma's built-in parameterization (no raw string interpolation)
- [ ] BullMQ workers configured for background jobs (emails, PDFs, scheduled tasks)
- [ ] Socket.io configured for realtime notifications
- [ ] Graceful shutdown handles `prisma.$disconnect()`
- [ ] Error handling middleware catches Prisma-specific error codes
