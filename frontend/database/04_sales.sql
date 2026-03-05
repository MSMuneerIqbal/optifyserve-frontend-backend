-- ============================================================
-- 04_sales.sql
-- Quotations, invoices, payments
-- ============================================================

-- ==================== QUOTATIONS ====================
CREATE TABLE quotations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  quotation_number     VARCHAR(20) NOT NULL,
  customer_id          UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  date                 DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date          DATE,
  validity_days        INT DEFAULT 30,
  subtotal             NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_discount       NUMERIC(15,2) NOT NULL DEFAULT 0,
  taxable_amount       NUMERIC(15,2) NOT NULL DEFAULT 0,
  vat_amount           NUMERIC(15,2) NOT NULL DEFAULT 0,
  total                NUMERIC(15,2) NOT NULL DEFAULT 0,
  status               quotation_status NOT NULL DEFAULT 'draft',
  payment_terms        payment_terms DEFAULT 'net-30',
  notes                TEXT,
  terms_and_conditions TEXT,
  internal_notes       TEXT,
  approved_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  sent_date            TIMESTAMPTZ,
  converted_invoice_id UUID,  -- FK added after invoices table
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at           TIMESTAMPTZ,
  UNIQUE (tenant_id, quotation_number)
);

-- ==================== INVOICES ====================
CREATE TABLE invoices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number    VARCHAR(20) NOT NULL,
  customer_id       UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  quotation_id      UUID REFERENCES quotations(id) ON DELETE SET NULL,
  date              DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date          DATE NOT NULL,
  vat_emirate       vat_emirate,
  subtotal          NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_discount    NUMERIC(15,2) NOT NULL DEFAULT 0,
  taxable_amount    NUMERIC(15,2) NOT NULL DEFAULT 0,
  zero_rated_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  exempt_amount     NUMERIC(15,2) NOT NULL DEFAULT 0,
  vat_amount        NUMERIC(15,2) NOT NULL DEFAULT 0,
  total             NUMERIC(15,2) NOT NULL DEFAULT 0,
  paid_amount       NUMERIC(15,2) NOT NULL DEFAULT 0,
  balance_amount    NUMERIC(15,2) NOT NULL DEFAULT 0,
  status            invoice_status NOT NULL DEFAULT 'draft',
  payment_terms     payment_terms DEFAULT 'net-30',
  company_trn       VARCHAR(15),
  company_name      VARCHAR(255),
  company_address   JSONB NOT NULL DEFAULT '{}',
  notes             TEXT,
  sent_date         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at        TIMESTAMPTZ,
  UNIQUE (tenant_id, invoice_number)
);

-- Add FK from quotations to invoices now that invoices table exists
ALTER TABLE quotations
  ADD CONSTRAINT fk_quotations_converted_invoice
  FOREIGN KEY (converted_invoice_id) REFERENCES invoices(id) ON DELETE SET NULL;

-- ==================== QUOTATION ITEMS ====================
CREATE TABLE quotation_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id    UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  item_id         UUID,  -- FK added after items table in 05_inventory.sql
  item_code       VARCHAR(50),
  item_name       VARCHAR(255) NOT NULL,
  description     TEXT,
  quantity         NUMERIC(12,4) NOT NULL DEFAULT 1,
  unit            unit_of_measure NOT NULL DEFAULT 'piece',
  unit_price      NUMERIC(15,2) NOT NULL DEFAULT 0,
  discount_pct    NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  vat_rate        NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  vat_amount      NUMERIC(15,2) NOT NULL DEFAULT 0,
  total           NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_with_vat  NUMERIC(15,2) NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== INVOICE ITEMS ====================
CREATE TABLE invoice_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_id         UUID,  -- FK added after items table in 05_inventory.sql
  item_code       VARCHAR(50),
  item_name       VARCHAR(255) NOT NULL,
  description     TEXT,
  quantity         NUMERIC(12,4) NOT NULL DEFAULT 1,
  unit            unit_of_measure NOT NULL DEFAULT 'piece',
  unit_price      NUMERIC(15,2) NOT NULL DEFAULT 0,
  discount_pct    NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  vat_status      vat_status NOT NULL DEFAULT 'standard',
  vat_rate        NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  vat_amount      NUMERIC(15,2) NOT NULL DEFAULT 0,
  total           NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_with_vat  NUMERIC(15,2) NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== INVOICE PAYMENTS ====================
CREATE TABLE invoice_payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id       UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  date             DATE NOT NULL DEFAULT CURRENT_DATE,
  amount           NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  payment_method   payment_method NOT NULL DEFAULT 'bank-transfer',
  reference_number VARCHAR(100),
  cheque_number    VARCHAR(50),
  bank_name        VARCHAR(100),
  notes            TEXT,
  recorded_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
