# Local PostgreSQL Setup — Windows 11

## Option 1: Docker (Recommended)

Docker is the cleanest approach — no permanent installation, easy to reset.

### Install Docker Desktop
1. Download from https://www.docker.com/products/docker-desktop/
2. Install and restart
3. Open Docker Desktop and let it start

### Run PostgreSQL in Docker

```bash
# Start PostgreSQL 16 container
docker run -d ^
  --name erp-postgres ^
  -e POSTGRES_DB=erp_db ^
  -e POSTGRES_USER=erp_app ^
  -e POSTGRES_PASSWORD=erp_dev_password ^
  -p 5432:5432 ^
  -v erp_pgdata:/var/lib/postgresql/data ^
  postgres:16

# Verify it's running
docker ps
```

### Run the Schema

```bash
# Run all SQL files in order
for %f in (database\*.sql) do docker exec -i erp-postgres psql -U erp_app -d erp_db < %f

# Or one by one:
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\00_extensions.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\01_enums.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\02_tenants_and_auth.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\03_crm.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\04_sales.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\05_inventory.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\06_purchase.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\07_accounts.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\08_hr.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\09_jobs.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\10_dispatcher.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\11_settings.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\12_rls_policies.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\13_indexes.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\14_triggers.sql
docker exec -i erp-postgres psql -U erp_app -d erp_db < database\15_seed.sql
```

### Connect from psql

```bash
docker exec -it erp-postgres psql -U erp_app -d erp_db
```

### Reset Database (start fresh)

```bash
docker stop erp-postgres
docker rm erp-postgres
docker volume rm erp_pgdata
# Then re-run the "docker run" command above
```

### Stop / Start

```bash
docker stop erp-postgres    # Stop (data preserved)
docker start erp-postgres   # Start again
```

### Connection String for ASP.NET Core

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=erp_db;Username=erp_app;Password=erp_dev_password"
  }
}
```

---

## Option 2: Native PostgreSQL Install

### Install
1. Download PostgreSQL 16 from https://www.postgresql.org/download/windows/
2. Run installer — remember the password you set for `postgres` user
3. Keep default port 5432
4. Include pgAdmin 4 (GUI tool) and command-line tools in the install

### Create Database and User

Open pgAdmin or SQL Shell (psql):

```sql
-- Connect as postgres superuser
CREATE USER erp_app WITH PASSWORD 'erp_dev_password';
CREATE DATABASE erp_db OWNER erp_app;
GRANT ALL PRIVILEGES ON DATABASE erp_db TO erp_app;

-- Connect to erp_db
\c erp_db

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO erp_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO erp_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO erp_app;
```

### Run the Schema

In Command Prompt (navigate to project root):

```bash
psql -h localhost -U erp_app -d erp_db -f database\00_extensions.sql
psql -h localhost -U erp_app -d erp_db -f database\01_enums.sql
psql -h localhost -U erp_app -d erp_db -f database\02_tenants_and_auth.sql
psql -h localhost -U erp_app -d erp_db -f database\03_crm.sql
psql -h localhost -U erp_app -d erp_db -f database\04_sales.sql
psql -h localhost -U erp_app -d erp_db -f database\05_inventory.sql
psql -h localhost -U erp_app -d erp_db -f database\06_purchase.sql
psql -h localhost -U erp_app -d erp_db -f database\07_accounts.sql
psql -h localhost -U erp_app -d erp_db -f database\08_hr.sql
psql -h localhost -U erp_app -d erp_db -f database\09_jobs.sql
psql -h localhost -U erp_app -d erp_db -f database\10_dispatcher.sql
psql -h localhost -U erp_app -d erp_db -f database\11_settings.sql
psql -h localhost -U erp_app -d erp_db -f database\12_rls_policies.sql
psql -h localhost -U erp_app -d erp_db -f database\13_indexes.sql
psql -h localhost -U erp_app -d erp_db -f database\14_triggers.sql
psql -h localhost -U erp_app -d erp_db -f database\15_seed.sql
```

### Reset Database

```sql
-- In psql as postgres superuser
DROP DATABASE erp_db;
CREATE DATABASE erp_db OWNER erp_app;
-- Then re-run all SQL files
```

### Connection String for ASP.NET Core

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=erp_db;Username=erp_app;Password=erp_dev_password"
  }
}
```

---

## Option 3: Neon Free Tier (Cloud — for sharing with team)

Only use this if you need your teammate/backend developer to access the same database remotely.

1. Go to https://neon.tech and sign up (free)
2. Create a project → get connection string
3. Run SQL files against the Neon endpoint

```bash
psql "postgresql://erp_app:xxx@ep-cool-name.us-east-2.aws.neon.tech/erp_db?sslmode=require" -f database\00_extensions.sql
# ... repeat for all files
```

Free tier limits: 512 MB storage, 0.25 vCPU, auto-suspend after 5 min idle.

---

## GUI Tools for Browsing the Database

| Tool | Type | Notes |
|------|------|-------|
| **pgAdmin 4** | Desktop app | Comes with PostgreSQL install. Full featured. |
| **DBeaver** | Desktop app | Free, supports many DBs. Good for browsing tables. |
| **DataGrip** | Desktop app | JetBrains (paid). Best SQL IDE. |
| **Azure Data Studio** | Desktop app | Free Microsoft tool. Good with PostgreSQL extension. |
| **TablePlus** | Desktop app | Clean UI, free tier available. |

### Recommended: DBeaver (free) or Azure Data Studio (free, .NET friendly)

---

## Verify Schema After Setup

```sql
-- Connect to the database
\c erp_db

-- Count tables (should be ~84)
SELECT count(*) FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Count enums (should be ~90)
SELECT count(*) FROM pg_type
WHERE typtype = 'e' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Verify RLS enabled
SELECT count(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true;

-- Test seed data
SET app.current_tenant = 'a0000000-0000-0000-0000-000000000001';
SELECT name, email, role FROM users;
-- Should return: System Administrator | admin@optify.ae | admin

-- Test auto-number
INSERT INTO customers (tenant_id, name, email, phone)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Test Co', 'test@test.com', '+971501111111');
SELECT customer_number, name FROM customers;
-- Should return: CUST-00001 | Test Co

-- Clean up test
DELETE FROM customers WHERE email = 'test@test.com';
```

---

## Recommended Development Flow

```
Local PostgreSQL (Docker)     →  Testing, daily development
         ↓
Neon Free Tier                →  Team sharing, CI/CD testing (optional)
         ↓
Neon Scale / Azure DB         →  Staging / Production
```
