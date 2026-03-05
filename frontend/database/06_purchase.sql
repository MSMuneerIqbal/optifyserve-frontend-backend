-- ============================================================
-- 06_purchase.sql
-- Vendors, POs, GRNs, returns, vendor payments, statements
-- ============================================================

-- ==================== VENDORS ====================
CREATE TABLE vendors (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  vendor_code        VARCHAR(20) NOT NULL,
  name               VARCHAR(255) NOT NULL,
  email              VARCHAR(255),
  phone              VARCHAR(20),
  contact_person     VARCHAR(255),
  trn                VARCHAR(15),
  categories         vendor_category[] NOT NULL DEFAULT '{}',
  payment_terms      vendor_payment_terms NOT NULL DEFAULT 'net-30',
  credit_limit       NUMERIC(15,2) NOT NULL DEFAULT 0,
  outstanding_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  status             vendor_status NOT NULL DEFAULT 'active',
  rating             NUMERIC(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  address            JSONB NOT NULL DEFAULT '{}',
  bank_details       JSONB NOT NULL DEFAULT '{}',
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at         TIMESTAMPTZ,
  UNIQUE (tenant_id, vendor_code)
);

-- ==================== VENDOR CONTACTS ====================
CREATE TABLE vendor_contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  email       VARCHAR(255),
  phone       VARCHAR(20),
  is_primary  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== PURCHASE ORDERS ====================
CREATE TABLE purchase_orders (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id              UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  po_number              VARCHAR(20) NOT NULL,
  vendor_id              UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  date                   DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  delivery_warehouse_id  UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  subtotal               NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_discount         NUMERIC(15,2) NOT NULL DEFAULT 0,
  taxable_amount         NUMERIC(15,2) NOT NULL DEFAULT 0,
  vat_amount             NUMERIC(15,2) NOT NULL DEFAULT 0,
  total                  NUMERIC(15,2) NOT NULL DEFAULT 0,
  received_amount        NUMERIC(15,2) NOT NULL DEFAULT 0,
  pending_amount         NUMERIC(15,2) NOT NULL DEFAULT 0,
  status                 po_status NOT NULL DEFAULT 'draft',
  payment_terms          vendor_payment_terms DEFAULT 'net-30',
  approval_level         approval_level,
  company_trn            VARCHAR(15),
  company_name           VARCHAR(255),
  company_address        JSONB NOT NULL DEFAULT '{}',
  notes                  TEXT,
  reference              VARCHAR(100),
  sent_date              TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at             TIMESTAMPTZ,
  UNIQUE (tenant_id, po_number)
);

-- ==================== PO LINE ITEMS ====================
CREATE TABLE po_line_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id             UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id           UUID REFERENCES items(id) ON DELETE SET NULL,
  item_code         VARCHAR(50),
  item_name         VARCHAR(255) NOT NULL,
  description       TEXT,
  quantity          NUMERIC(12,4) NOT NULL DEFAULT 1,
  unit              unit_of_measure NOT NULL DEFAULT 'piece',
  unit_price        NUMERIC(15,2) NOT NULL DEFAULT 0,
  discount_pct      NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_amount   NUMERIC(15,2) NOT NULL DEFAULT 0,
  vat_rate          NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  vat_amount        NUMERIC(15,2) NOT NULL DEFAULT 0,
  total             NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_with_vat    NUMERIC(15,2) NOT NULL DEFAULT 0,
  received_quantity NUMERIC(12,4) NOT NULL DEFAULT 0,
  pending_quantity  NUMERIC(12,4) NOT NULL DEFAULT 0,
  sort_order        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== PO APPROVALS ====================
CREATE TABLE po_approvals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id       UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  level       approval_level NOT NULL,
  approver_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status      approval_status NOT NULL DEFAULT 'pending',
  comments    TEXT,
  date        TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== GOODS RECEIVED NOTES ====================
CREATE TABLE goods_received_notes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  grn_number            VARCHAR(20) NOT NULL,
  po_id                 UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE RESTRICT,
  vendor_id             UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  receipt_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_note_number  VARCHAR(100),
  total_received        NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_accepted        NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_rejected        NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_cost            NUMERIC(15,2) NOT NULL DEFAULT 0,
  status                grn_status NOT NULL DEFAULT 'draft',
  warehouse_id          UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  received_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  inspected_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, grn_number)
);

-- ==================== GRN LINE ITEMS ====================
CREATE TABLE grn_line_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_id              UUID NOT NULL REFERENCES goods_received_notes(id) ON DELETE CASCADE,
  po_line_item_id     UUID REFERENCES po_line_items(id) ON DELETE SET NULL,
  item_id             UUID REFERENCES items(id) ON DELETE SET NULL,
  item_name           VARCHAR(255) NOT NULL,
  ordered_quantity    NUMERIC(12,4) NOT NULL DEFAULT 0,
  previously_received NUMERIC(12,4) NOT NULL DEFAULT 0,
  received_quantity   NUMERIC(12,4) NOT NULL DEFAULT 0,
  accepted_quantity   NUMERIC(12,4) NOT NULL DEFAULT 0,
  rejected_quantity   NUMERIC(12,4) NOT NULL DEFAULT 0,
  unit                unit_of_measure NOT NULL DEFAULT 'piece',
  unit_cost           NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_cost          NUMERIC(15,2) NOT NULL DEFAULT 0,
  rejection_reason    TEXT,
  batch_number        VARCHAR(50),
  serial_numbers      TEXT[] NOT NULL DEFAULT '{}',
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== PURCHASE RETURNS ====================
CREATE TABLE purchase_returns (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  return_number       VARCHAR(20) NOT NULL,
  grn_id              UUID REFERENCES goods_received_notes(id) ON DELETE SET NULL,
  po_id               UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
  vendor_id           UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  return_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  return_type         return_type NOT NULL DEFAULT 'partial',
  total_items         INT NOT NULL DEFAULT 0,
  total_quantity      NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount        NUMERIC(15,2) NOT NULL DEFAULT 0,
  status              purchase_return_status NOT NULL DEFAULT 'draft',
  credit_note_number  VARCHAR(50),
  credit_note_amount  NUMERIC(15,2) DEFAULT 0,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, return_number)
);

-- ==================== PURCHASE RETURN ITEMS ====================
CREATE TABLE purchase_return_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id        UUID NOT NULL REFERENCES purchase_returns(id) ON DELETE CASCADE,
  grn_line_item_id UUID REFERENCES grn_line_items(id) ON DELETE SET NULL,
  item_id          UUID REFERENCES items(id) ON DELETE SET NULL,
  item_name        VARCHAR(255) NOT NULL,
  return_quantity  NUMERIC(12,4) NOT NULL DEFAULT 0,
  unit             unit_of_measure NOT NULL DEFAULT 'piece',
  unit_cost        NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_cost       NUMERIC(15,2) NOT NULL DEFAULT 0,
  reason           return_reason NOT NULL DEFAULT 'defective',
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== VENDOR PAYMENTS ====================
CREATE TABLE vendor_payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  payment_number   VARCHAR(20) NOT NULL,
  vendor_id        UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  po_id            UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
  payment_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  amount           NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  payment_method   vendor_payment_method NOT NULL DEFAULT 'bank-transfer',
  status           vendor_payment_status NOT NULL DEFAULT 'pending',
  reference_number VARCHAR(100),
  cheque_number    VARCHAR(50),
  cheque_date      DATE,
  bank_name        VARCHAR(100),
  account_number   VARCHAR(50),
  notes            TEXT,
  recorded_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, payment_number)
);

-- ==================== VENDOR STATEMENT ENTRIES ====================
CREATE TABLE vendor_statement_entries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  vendor_id        UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  date             DATE NOT NULL,
  type             VARCHAR(50) NOT NULL,
  reference_number VARCHAR(100),
  description      TEXT,
  debit            NUMERIC(15,2) NOT NULL DEFAULT 0,
  credit           NUMERIC(15,2) NOT NULL DEFAULT 0,
  balance          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
