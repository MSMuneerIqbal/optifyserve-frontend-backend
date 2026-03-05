# Database Knowledge Base — UAE ERP

Complete reference for understanding, maintaining, and evolving the PostgreSQL database schema.
**Backend: ASP.NET Core** | **ORM: Dapper or EF Core** | **Database: PostgreSQL 13+**

---

## Table of Contents

1. [ASP.NET Core Compatibility](#1-aspnet-core-compatibility)
2. [Adding New Modules](#2-adding-new-modules)
3. [Modifying Existing Schema](#3-modifying-existing-schema)
4. [Migration Strategy](#4-migration-strategy)
5. [Enum Handling](#5-enum-handling)
6. [RLS with ASP.NET Core](#6-rls-with-aspnet-core)
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

## 1. ASP.NET Core Compatibility

### Is this schema compatible with ASP.NET Core?

**Yes, 100%.** The schema is pure PostgreSQL SQL — it works with any backend language. PostgreSQL is the database; ASP.NET Core is the application framework. They communicate via the Npgsql driver.

### Recommended .NET Packages

```xml
<!-- In your .csproj -->
<PackageReference Include="Npgsql" Version="8.*" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.*" />
<PackageReference Include="Dapper" Version="2.*" />
```

| Package | Purpose | When to Use |
|---------|---------|-------------|
| **Npgsql** | PostgreSQL ADO.NET driver | Always required — the core driver |
| **Npgsql.EntityFrameworkCore.PostgreSQL** | EF Core provider for PostgreSQL | If using Entity Framework Core |
| **Dapper** | Micro-ORM for raw SQL | If you prefer raw SQL with mapping |

### ORM Choice: EF Core vs Dapper

| Factor | EF Core | Dapper |
|--------|---------|--------|
| Learning curve | Higher | Lower |
| Generated SQL control | Less control | Full control |
| Enum mapping | Built-in with Npgsql plugin | Manual mapping |
| JSONB support | Via `.HasColumnType("jsonb")` | Via `JsonConvert` |
| RLS (SET commands) | Via interceptors | Via raw SQL before queries |
| Performance | Slower (abstraction overhead) | Faster (near raw SQL) |
| Migrations | Built-in `dotnet ef` | Need separate tool (DbUp/FluentMigrator) |
| **Recommendation** | Good for CRUD-heavy modules | Good for complex queries/reports |

**You can use both together.** EF Core for simple CRUD, Dapper for complex reports and queries.

### Mapping PostgreSQL Enums in ASP.NET Core

**With EF Core + Npgsql:**
```csharp
// 1. Define C# enum matching PostgreSQL enum
public enum CustomerType
{
    Individual,
    Corporate,
    Government
}

// 2. Register in DbContext
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.HasPostgresEnum<CustomerType>("customer_type");

    modelBuilder.Entity<Customer>(entity =>
    {
        entity.ToTable("customers");
        entity.Property(e => e.CustomerType)
              .HasColumnName("customer_type")
              .HasColumnType("customer_type");
    });
}

// 3. Register in NpgsqlDataSource (Program.cs)
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
dataSourceBuilder.MapEnum<CustomerType>("customer_type");
// ... map all enums
var dataSource = dataSourceBuilder.Build();
```

**With Dapper:**
```csharp
// Register custom type handler
public class PostgresEnumHandler<T> : SqlMapper.TypeHandler<T> where T : struct, Enum
{
    public override T Parse(object value) => Enum.Parse<T>(value.ToString()!, true);
    public override void SetValue(IDbDataParameter parameter, T value)
    {
        parameter.Value = value.ToString().ToLower();
        parameter.DbType = DbType.String;
    }
}

// Register once at startup
SqlMapper.AddTypeHandler(new PostgresEnumHandler<CustomerType>());
SqlMapper.AddTypeHandler(new PostgresEnumHandler<JobStatus>());
// ... register all enums
```

### Mapping JSONB Columns in ASP.NET Core

```csharp
// C# model
public class Customer
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public Address Address { get; set; }  // Maps to JSONB column
}

public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
    public string Emirate { get; set; }
    public string Country { get; set; }
}

// EF Core configuration
modelBuilder.Entity<Customer>(entity =>
{
    entity.Property(e => e.Address)
          .HasColumnType("jsonb")
          .HasConversion(
              v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
              v => JsonSerializer.Deserialize<Address>(v, (JsonSerializerOptions)null));
});

// Dapper — use a custom handler
public class JsonTypeHandler<T> : SqlMapper.TypeHandler<T>
{
    public override T Parse(object value) =>
        JsonSerializer.Deserialize<T>(value.ToString()!);
    public override void SetValue(IDbDataParameter parameter, T value)
    {
        parameter.Value = JsonSerializer.Serialize(value);
        ((NpgsqlParameter)parameter).NpgsqlDbType = NpgsqlTypes.NpgsqlDbType.Jsonb;
    }
}
```

### UUID Primary Keys in ASP.NET Core

```csharp
// PostgreSQL gen_random_uuid() generates the ID — let the DB handle it
public class Customer
{
    public Guid Id { get; set; }  // Maps to UUID
}

// EF Core — tell it the DB generates the value
modelBuilder.Entity<Customer>(entity =>
{
    entity.Property(e => e.Id)
          .HasDefaultValueSql("gen_random_uuid()");
});

// Dapper — omit Id in INSERT, let DB generate
await connection.ExecuteAsync(
    "INSERT INTO customers (tenant_id, name, email) VALUES (@TenantId, @Name, @Email) RETURNING id",
    new { TenantId = tenantId, Name = "Test", Email = "test@test.com" });
```

---

## 2. Adding New Modules

### Example: Adding a "Fleet Management" Module

**Step 1: Create enums (if needed)**
```sql
-- database/migrations/005_fleet_enums.sql
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'retired', 'sold');
CREATE TYPE vehicle_type AS ENUM ('van', 'pickup', 'truck', 'motorcycle', 'sedan');
CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'electric', 'hybrid');
```

**Step 2: Create tables**
```sql
-- database/migrations/006_fleet_tables.sql
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

-- Change column type (careful — may need data migration)
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

### NEVER Do These on Production Without Backup

```sql
-- DROP TABLE, DROP COLUMN, DROP TYPE — always back up first
-- ALTER TYPE ... RENAME VALUE — not supported, requires workaround
-- TRUNCATE — deletes all data instantly
-- DROP INDEX CONCURRENTLY — can cause downtime on large tables
```

---

## 4. Migration Strategy

### Recommended for ASP.NET Core: DbUp

DbUp is the best fit because it runs raw SQL files — exactly what this schema uses.

```bash
dotnet add package DbUp-PostgreSQL
```

```csharp
// Program.cs or a dedicated migration runner
using DbUp;

var connectionString = "Host=localhost;Database=erp_db;Username=erp_app;Password=xxx";

var upgrader = DeployChanges.To
    .PostgresqlDatabase(connectionString)
    .WithScriptsFromFileSystem("database/")  // Runs 00-15 in order
    .LogToConsole()
    .Build();

var result = upgrader.PerformUpgrade();

if (!result.Successful)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine(result.Error);
    return -1;
}

Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine("Database migration successful!");
```

DbUp automatically tracks which scripts have been run in a `schemaversions` table.

### Alternative: EF Core Migrations

If you prefer code-first with EF Core:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

But since the schema already exists as raw SQL, **DbUp is simpler** — it runs the SQL files directly without needing to reverse-engineer C# models.

### Alternative: FluentMigrator

```bash
dotnet add package FluentMigrator
dotnet add package FluentMigrator.Runner
dotnet add package FluentMigrator.Runner.Postgres
```

```csharp
[Migration(20260301)]
public class AddWhatsappToCustomers : Migration
{
    public override void Up()
    {
        Alter.Table("customers").AddColumn("whatsapp").AsString(20).Nullable();
    }

    public override void Down()
    {
        Delete.Column("whatsapp").FromTable("customers");
    }
}
```

### Migration Folder Structure (Production)

```
database/
├── schema/              ← Original 00-15.sql (run once on fresh DB)
│   ├── 00_extensions.sql
│   ├── 01_enums.sql
│   └── ...
└── migrations/          ← Incremental changes (run in order)
    ├── 001_20260301_add_whatsapp_to_customers.sql
    ├── 002_20260305_add_fleet_module.sql
    ├── 003_20260310_fix_invoice_enum.sql
    └── 004_20260315_add_customer_search_vector.sql
```

### Golden Rules for Migrations

1. **Never edit a migration that has been run in production** — create a new one
2. **Always write a rollback** — so you can undo mistakes
3. **Test on staging first** — never run untested migrations on production
4. **Back up before migrating** — `pg_dump erp_db > backup.sql`
5. **One concern per migration** — don't mix unrelated changes
6. **Name files descriptively** — `003_add_fleet_module.sql` not `003_update.sql`

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

## 6. RLS with ASP.NET Core

### Middleware Approach (Recommended)

```csharp
// TenantContextMiddleware.cs
public class TenantContextMiddleware
{
    private readonly RequestDelegate _next;

    public TenantContextMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        // Extract tenant and user from JWT claims
        var tenantId = context.User.FindFirst("tenant_id")?.Value;
        var userId = context.User.FindFirst("sub")?.Value;

        if (!string.IsNullOrEmpty(tenantId))
        {
            // Store in HttpContext for later use
            context.Items["TenantId"] = tenantId;
            context.Items["UserId"] = userId;
        }

        await _next(context);
    }
}

// DbConnectionFactory.cs — creates connection with tenant context
public class DbConnectionFactory : IDbConnectionFactory
{
    private readonly string _connectionString;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DbConnectionFactory(string connectionString, IHttpContextAccessor httpContextAccessor)
    {
        _connectionString = connectionString;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<NpgsqlConnection> CreateConnectionAsync()
    {
        var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var tenantId = _httpContextAccessor.HttpContext?.Items["TenantId"]?.ToString();
        var userId = _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString();

        if (!string.IsNullOrEmpty(tenantId))
        {
            await using var cmd = connection.CreateCommand();
            cmd.CommandText = "SELECT set_config('app.current_tenant', @tenantId, false), " +
                              "set_config('app.current_user', @userId, false)";
            cmd.Parameters.AddWithValue("tenantId", tenantId);
            cmd.Parameters.AddWithValue("userId", userId ?? "");
            await cmd.ExecuteNonQueryAsync();
        }

        return connection;
    }
}

// Program.cs registration
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IDbConnectionFactory>(sp =>
    new DbConnectionFactory(
        builder.Configuration.GetConnectionString("DefaultConnection")!,
        sp.GetRequiredService<IHttpContextAccessor>()));
```

### EF Core Interceptor Approach

```csharp
// TenantInterceptor.cs
public class TenantInterceptor : DbConnectionInterceptor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantInterceptor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public override async Task ConnectionOpenedAsync(
        DbConnection connection, ConnectionEndEventData eventData, CancellationToken ct)
    {
        var tenantId = _httpContextAccessor.HttpContext?.Items["TenantId"]?.ToString();
        var userId = _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString();

        if (!string.IsNullOrEmpty(tenantId))
        {
            await using var cmd = connection.CreateCommand();
            cmd.CommandText = $"SET app.current_tenant = '{tenantId}'; SET app.current_user = '{userId}';";
            await cmd.ExecuteNonQueryAsync(ct);
        }
    }
}

// In Program.cs
builder.Services.AddDbContext<ErpDbContext>((sp, options) =>
{
    options.UseNpgsql(connectionString)
           .AddInterceptors(sp.GetRequiredService<TenantInterceptor>());
});
```

---

## 7. Connection & Pooling

### ASP.NET Core Connection String

```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=erp_db;Username=erp_app;Password=YourPassword;Pooling=true;MinPoolSize=5;MaxPoolSize=100;ConnectionIdleLifetime=300;ConnectionPruningInterval=10"
  }
}
```

### Connection Pool Settings

| Setting | Development | Production | Description |
|---------|------------|------------|-------------|
| `MinPoolSize` | 2 | 10 | Minimum open connections |
| `MaxPoolSize` | 20 | 100 | Maximum open connections |
| `ConnectionIdleLifetime` | 300 | 300 | Seconds before idle connection is closed |
| `Timeout` | 30 | 15 | Connection timeout in seconds |
| `CommandTimeout` | 30 | 30 | Query timeout in seconds |

### For High Load (100+ concurrent users)

Use **PgBouncer** as a connection pooler between your app and PostgreSQL:

```
ASP.NET Core App → PgBouncer (port 6432) → PostgreSQL (port 5432)
```

PgBouncer reuses connections efficiently, reducing PostgreSQL overhead from thousands of app connections down to ~50 actual DB connections.

---

## 8. Backup & Restore

```bash
# Full backup (custom format — best for restore flexibility)
pg_dump -Fc -h localhost -U erp_app erp_db > erp_backup_$(date +%Y%m%d).dump

# Schema only (no data) — useful for documentation
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

### Cloud Provider Backups

Most cloud providers (Supabase, Neon, AWS RDS) have automated daily backups. You just configure retention period.

---

## 9. Cross-Tenant Queries

### When Do You Need Cross-Tenant Queries?

- Super admin dashboard (total users across all tenants)
- Billing/subscription management
- System health monitoring
- Analytics aggregation

### How to Bypass RLS

```csharp
// Option 1: Use a superuser connection (bypasses RLS automatically)
var superConnection = new NpgsqlConnection(superuserConnectionString);
var totalUsers = await superConnection.QueryAsync<int>("SELECT count(*) FROM users");

// Option 2: Set an empty tenant (returns nothing — safe)
// Then run query without RLS via superuser role

// Option 3: Create a dedicated "platform admin" role
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

### VACUUM & Maintenance

```sql
-- PostgreSQL auto-vacuum is ON by default
-- But for large bulk operations, run manually:
VACUUM ANALYZE customers;
VACUUM ANALYZE invoices;

-- Full vacuum (reclaims disk space, requires exclusive lock — run off-hours)
VACUUM FULL audit_logs;
```

### Read Replicas

For heavy reporting workloads, use a read replica:
```
Write queries → Primary DB
Read queries (reports, dashboards) → Read Replica
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

```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.example.com;Database=erp_db;Username=erp_app;Password=xxx;SslMode=Require;TrustServerCertificate=false"
  }
}
```

### Prevent SQL Injection

```csharp
// ALWAYS use parameterized queries
// GOOD
await connection.QueryAsync<Customer>(
    "SELECT * FROM customers WHERE tenant_id = @TenantId AND email = @Email",
    new { TenantId = tenantId, Email = email });

// BAD — never do this
await connection.QueryAsync<Customer>(
    $"SELECT * FROM customers WHERE email = '{email}'");  // SQL INJECTION!
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

### Call from ASP.NET Core

```csharp
var result = await connection.QuerySingleAsync<(Guid TenantId, Guid AdminUserId)>(
    "SELECT * FROM provision_tenant(@Name, @Email, @PasswordHash, @Trn, @Plan::subscription_plan)",
    new { Name = "Acme LLC", Email = "admin@acme.ae", PasswordHash = hashedPassword, Trn = "100123456789003", Plan = "starter" });
```

---

## 14. Cloud Database Providers

### Comparison for ASP.NET Core Backend

| Provider | Free Tier | Pricing (Prod) | Extensions | RLS | Backups | Best For |
|----------|-----------|----------------|------------|-----|---------|----------|
| **Neon** | 512 MB, 0.5 GB compute | $19/mo (Scale) | All supported | Yes | Auto PITR | Serverless, auto-scaling, dev branching |
| **Supabase** | 500 MB | $25/mo (Pro) | All supported | Yes (native) | Daily | Full platform (auth, storage, realtime) |
| **AWS RDS** | 12 months free (t3.micro) | $15-50/mo | All supported | Yes | Auto daily | Enterprise, full AWS ecosystem |
| **Azure Database for PostgreSQL** | $200 credit | $25-60/mo | All supported | Yes | Auto daily | .NET ecosystem, Azure DevOps |
| **Railway** | 1 GB trial | $5-20/mo | All supported | Yes | Manual | Simple deploy, fast setup |
| **DigitalOcean Managed DB** | None | $15/mo (1GB) | All supported | Yes | Auto daily | Simple, predictable pricing |
| **Render** | 256 MB (90 days) | $7/mo (Starter) | Most supported | Yes | Daily | Simple, good free tier |

### Recommendation by Stage

| Stage | Provider | Why |
|-------|----------|-----|
| **Learning/Development** | **Neon Free** | 512 MB free forever, instant setup, database branching |
| **MVP/Beta** | **Neon Scale** or **Supabase Pro** | $19-25/mo, auto-scaling, managed backups |
| **Production** | **Azure Database for PostgreSQL** or **AWS RDS** | Best for ASP.NET Core ecosystem, enterprise SLAs |
| **If already on Azure** | **Azure Database** | Native integration with Azure App Service, DevOps |

### Connection String Examples

```
# Neon
Host=ep-cool-name-123456.us-east-2.aws.neon.tech;Database=erp_db;Username=erp_app;Password=xxx;SslMode=Require

# Supabase
Host=db.abcdefghijklmnop.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=xxx;SslMode=Require

# AWS RDS
Host=erp-db.abc123def456.us-east-1.rds.amazonaws.com;Port=5432;Database=erp_db;Username=erp_app;Password=xxx;SslMode=Require

# Azure
Host=erp-server.postgres.database.azure.com;Port=5432;Database=erp_db;Username=erp_app;Password=xxx;SslMode=Require
```

---

## 15. Serverless vs Traditional PostgreSQL

### What is "Traditional" PostgreSQL?

A traditional PostgreSQL database runs on a **dedicated server** (physical or virtual) that is **always running**, whether anyone is querying it or not.

```
Traditional: Server is ON 24/7 → You pay 24/7
             Even at 3 AM when nobody is using it → Still running, still paying
```

Think of it like renting an office: you pay rent every month whether you're in the office or not.

### What is "Serverless" PostgreSQL?

Serverless PostgreSQL (like **Neon**) separates **storage** from **compute**:

```
Serverless:  Someone sends a query → Compute spins up (milliseconds) → Runs query → Scales down
             Nobody using it at 3 AM → Compute scales to ZERO → You pay $0 for compute
             Storage still exists (your data is safe) → You only pay for storage
```

Think of it like a taxi: you only pay when you ride.

### Visual Comparison

```
TRADITIONAL (AWS RDS, Azure DB, DigitalOcean):
├── 12 AM ████████████████ Running (paying)
├──  3 AM ████████████████ Running (paying) ← Nobody using it!
├──  6 AM ████████████████ Running (paying)
├──  9 AM ████████████████ Running (paying) ← Users active
├── 12 PM ████████████████ Running (paying) ← Peak usage
├──  3 PM ████████████████ Running (paying)
├──  6 PM ████████████████ Running (paying) ← Users leaving
├──  9 PM ████████████████ Running (paying)
│   Cost: ~$50/mo flat regardless of usage

SERVERLESS (Neon):
├── 12 AM ░░░░░░░░░░░░░░░░ Scaled to zero ($0)
├──  3 AM ░░░░░░░░░░░░░░░░ Scaled to zero ($0)
├──  6 AM ░░░░░░░░░░░░░░░░ Scaled to zero ($0)
├──  9 AM ████████░░░░░░░░ Scaled up (paying)
├── 12 PM ████████████████ Peak (paying more)
├──  3 PM ████████████░░░░ Medium load (paying less)
├──  6 PM ████████░░░░░░░░ Low usage (paying less)
├──  9 PM ░░░░░░░░░░░░░░░░ Scaled to zero ($0)
│   Cost: ~$10-20/mo (pay only for actual usage)
```

### Why Choose Serverless (Neon)?

| Advantage | Explanation |
|-----------|-------------|
| **Cost savings** | You pay only when queries are running. For a startup/MVP with variable traffic, this can save 50-80% vs a dedicated server. |
| **Auto-scaling** | If 100 users hit your app at once, compute scales up automatically. No manual server resizing. |
| **Scale to zero** | At night, weekends, or low-traffic periods, compute shuts down. Storage (your data) remains safe. |
| **Database branching** | Create instant copies of your database for testing migrations — like `git branch` for your database. |
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

Serverless databases have a "cold start" — when the compute has scaled to zero, the first query takes slightly longer:

```
Traditional:  Every query → ~5ms response
Serverless:   First query after idle → ~500ms (cold start)
              Subsequent queries → ~5ms (warm)
              After 5 min idle → scales to zero again
```

**Mitigation:** Neon lets you configure a "suspend delay" (e.g., keep compute alive for 5 minutes after the last query). For production, set this to 10-15 minutes to avoid cold starts during business hours.

### Decision Matrix

| Your Situation | Choose |
|----------------|--------|
| Building MVP, low budget | **Serverless (Neon)** |
| Variable traffic (busy daytime, quiet nights) | **Serverless (Neon)** |
| Startup, few users, growing | **Serverless (Neon)** |
| 50+ users online 24/7 | **Traditional (Azure/RDS)** |
| Enterprise client, SLA required | **Traditional (Azure/RDS)** |
| Need database branching for dev | **Serverless (Neon)** |
| Already on Azure with App Service | **Azure Database for PostgreSQL** |

### For YOUR Project (UAE ERP SaaS)

**Start with Neon (serverless)** because:
- You're building an ERP for UAE service companies — most users work 8 AM to 6 PM UAE time
- Nights and weekends will have near-zero traffic → serverless saves money
- Multiple tenants with variable load → auto-scaling handles spikes
- Database branching → test schema migrations safely before production
- When you grow to 100+ concurrent users 24/7, migrate to Azure Database or RDS

**Migration from Neon to Azure/RDS is simple** — it's all standard PostgreSQL. Just `pg_dump` and `pg_restore`.

---

## 16. Common Pitfalls & Solutions

### Pitfall 1: Forgetting to SET tenant context

```
Problem: Query returns empty results or affects wrong tenant's data
Solution: ALWAYS set app.current_tenant before any query
Prevention: Use middleware (see Section 6) so it's automatic
```

### Pitfall 2: Adding enum values in the wrong position

```
Problem: ALTER TYPE ... ADD VALUE cannot specify IF NOT EXISTS in transactions
Solution: Run enum additions outside transactions, or use the rename-recreate pattern
```

### Pitfall 3: Running migrations without backup

```
Problem: Migration fails halfway, database in inconsistent state
Solution: ALWAYS pg_dump before running migrations
          Use transactions: BEGIN; ... COMMIT; (or ROLLBACK; on error)
```

### Pitfall 4: N+1 queries with RLS

```
Problem: RLS subqueries (for child tables) can cause performance issues at scale
Solution: Add tenant_id directly to child tables instead of filtering via parent
          Our schema already does this for most tables — child tables without
          tenant_id use parent FK subqueries only where necessary
```

### Pitfall 5: JSONB overuse

```
Problem: Querying deep inside JSONB is slower than querying regular columns
Solution: If you query a JSONB field frequently (e.g., address.emirate),
          consider extracting it to a dedicated column with an index
```

### Pitfall 6: Large text in audit_logs

```
Problem: audit_logs grows very large because changes JSONB stores full before/after
Solution: Only store changed fields, not the full record
          Implement table partitioning by month/quarter
          Set up automatic archival after 2 years
```

### Pitfall 7: Connection pool exhaustion

```
Problem: "too many connections" error under load
Solution: Use connection pooling (Npgsql built-in or PgBouncer)
          Set MaxPoolSize appropriately (default 100 for Npgsql)
          Ensure connections are returned to pool (use 'using' statements)
```

```csharp
// GOOD — connection returned to pool when disposed
await using var connection = await factory.CreateConnectionAsync();
var customers = await connection.QueryAsync<Customer>("SELECT * FROM customers");

// BAD — connection leak!
var connection = await factory.CreateConnectionAsync();
var customers = await connection.QueryAsync<Customer>("SELECT * FROM customers");
// Forgot to dispose — connection never returned to pool
```

---

## Summary Checklist

Before going to production:

- [ ] Database created on cloud provider (Neon/Azure/Supabase)
- [ ] All 16 SQL files executed in order (00-15)
- [ ] Dedicated `erp_app` database role created (not superuser)
- [ ] SSL enabled on connection string
- [ ] ASP.NET Core middleware sets tenant context on every request
- [ ] All C# enums mapped to PostgreSQL enums via Npgsql
- [ ] JSONB columns mapped with proper serialization
- [ ] Connection pooling configured (MinPoolSize, MaxPoolSize)
- [ ] Automated backups configured on cloud provider
- [ ] Migration strategy set up (DbUp or FluentMigrator)
- [ ] Seed data verified (permissions, chart of accounts, leave types)
- [ ] RLS tested (tenant A cannot see tenant B's data)
- [ ] Parameterized queries used everywhere (no SQL injection)
