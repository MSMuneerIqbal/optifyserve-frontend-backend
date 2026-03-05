-- ============================================================
-- 03_crm.sql
-- Customers, leads, follow-ups, contacts, activities
-- ============================================================

-- ==================== CUSTOMERS ====================
CREATE TABLE customers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_number       VARCHAR(20) NOT NULL,
  name                  VARCHAR(255) NOT NULL,
  email                 VARCHAR(255),
  phone                 VARCHAR(20),
  company               VARCHAR(255),
  customer_type         customer_type NOT NULL DEFAULT 'individual',
  trn                   VARCHAR(15),
  address               JSONB NOT NULL DEFAULT '{}',
  billing_address       JSONB NOT NULL DEFAULT '{}',
  status                customer_status NOT NULL DEFAULT 'active',
  lifetime_value        NUMERIC(15,2) NOT NULL DEFAULT 0,
  credit_limit          NUMERIC(15,2) NOT NULL DEFAULT 0,
  payment_terms         payment_terms DEFAULT 'net-30',
  assigned_sales_rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at            TIMESTAMPTZ,
  UNIQUE (tenant_id, customer_number)
);

-- ==================== CUSTOMER CONTACTS ====================
CREATE TABLE customer_contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  position    VARCHAR(100),
  email       VARCHAR(255),
  phone       VARCHAR(20),
  is_primary  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== LEADS ====================
CREATE TABLE leads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_number           VARCHAR(20) NOT NULL,
  name                  VARCHAR(255) NOT NULL,
  company               VARCHAR(255),
  email                 VARCHAR(255),
  phone                 VARCHAR(20),
  source                lead_source NOT NULL DEFAULT 'website',
  stage                 lead_stage NOT NULL DEFAULT 'new',
  priority              lead_priority NOT NULL DEFAULT 'medium',
  estimated_value_min   NUMERIC(15,2) DEFAULT 0,
  estimated_value_max   NUMERIC(15,2) DEFAULT 0,
  probability           INT DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date   DATE,
  assigned_to_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  address               JSONB NOT NULL DEFAULT '{}',
  lost_reason           TEXT,
  converted_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at            TIMESTAMPTZ,
  UNIQUE (tenant_id, lead_number)
);

-- ==================== LEAD SERVICE INTERESTS ====================
CREATE TABLE lead_service_interests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  name         VARCHAR(255),
  category     VARCHAR(100),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== FOLLOW-UPS ====================
CREATE TABLE follow_ups (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id       UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  date          DATE NOT NULL,
  time          TIME,
  type          follow_up_type NOT NULL DEFAULT 'call',
  notes         TEXT,
  outcome       TEXT,
  status        follow_up_status NOT NULL DEFAULT 'scheduled',
  reminder      BOOLEAN NOT NULL DEFAULT false,
  reminder_date TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by    UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==================== CUSTOMER ACTIVITIES ====================
CREATE TABLE customer_activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
