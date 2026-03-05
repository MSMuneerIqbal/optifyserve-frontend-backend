-- ============================================================
-- 05_inventory.sql
-- Item categories, items, warehouses, stock levels, movements, batches, alerts
-- ============================================================

-- ==================== ITEM CATEGORIES ====================
CREATE TABLE item_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  name_ar     VARCHAR(255),
  description TEXT,
  parent_id   UUID REFERENCES item_categories(id) ON DELETE SET NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by  UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==================== ITEMS ====================
CREATE TABLE items (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sku                VARCHAR(50) NOT NULL,
  name               VARCHAR(255) NOT NULL,
  name_ar            VARCHAR(255),
  description        TEXT,
  category_id        UUID REFERENCES item_categories(id) ON DELETE SET NULL,
  unit_of_measure    unit_of_measure NOT NULL DEFAULT 'piece',
  cost_price         NUMERIC(15,2) NOT NULL DEFAULT 0,
  selling_price      NUMERIC(15,2) NOT NULL DEFAULT 0,
  reorder_point      NUMERIC(12,2) NOT NULL DEFAULT 0,
  reorder_quantity   NUMERIC(12,2) NOT NULL DEFAULT 0,
  lead_time_days     INT DEFAULT 0,
  barcode            VARCHAR(100),
  has_serial_numbers BOOLEAN NOT NULL DEFAULT false,
  has_expiry         BOOLEAN NOT NULL DEFAULT false,
  expiry_days        INT,
  status             item_status NOT NULL DEFAULT 'active',
  stock_tracked      BOOLEAN NOT NULL DEFAULT true,
  is_active          BOOLEAN NOT NULL DEFAULT true,
  image_url          TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at         TIMESTAMPTZ,
  UNIQUE (tenant_id, sku)
);

-- Add deferred FKs from sales line items to items
ALTER TABLE quotation_items
  ADD CONSTRAINT fk_quotation_items_item
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL;

ALTER TABLE invoice_items
  ADD CONSTRAINT fk_invoice_items_item
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL;

-- ==================== WAREHOUSES ====================
CREATE TABLE warehouses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL,
  code       VARCHAR(20) NOT NULL,
  type       warehouse_type NOT NULL DEFAULT 'main',
  status     warehouse_status NOT NULL DEFAULT 'active',
  is_default BOOLEAN NOT NULL DEFAULT false,
  address    JSONB NOT NULL DEFAULT '{}',
  phone      VARCHAR(20),
  email      VARCHAR(255),
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, code)
);

-- ==================== WAREHOUSE LOCATIONS ====================
CREATE TABLE warehouse_locations (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id       UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  name               VARCHAR(255) NOT NULL,
  location_type      VARCHAR(50) NOT NULL DEFAULT 'shelf',
  parent_location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  is_active          BOOLEAN NOT NULL DEFAULT true,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== STOCK LEVELS ====================
CREATE TABLE stock_levels (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  item_id             UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  warehouse_id        UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  available_qty       NUMERIC(12,2) NOT NULL DEFAULT 0,
  reserved_qty        NUMERIC(12,2) NOT NULL DEFAULT 0,
  on_order_qty        NUMERIC(12,2) NOT NULL DEFAULT 0,
  last_movement_date  TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, item_id, warehouse_id)
);

-- ==================== STOCK MOVEMENTS ====================
CREATE TABLE stock_movements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  movement_number   VARCHAR(20) NOT NULL,
  type              stock_movement_type NOT NULL,
  item_id           UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
  warehouse_id      UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
  from_warehouse_id UUID REFERENCES warehouses(id) ON DELETE RESTRICT,
  to_warehouse_id   UUID REFERENCES warehouses(id) ON DELETE RESTRICT,
  quantity          NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit_cost         NUMERIC(15,2) NOT NULL DEFAULT 0,
  adjustment_reason adjustment_reason,
  reference_number  VARCHAR(50),
  reference_type    VARCHAR(50),
  notes             TEXT,
  performed_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  performed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, movement_number)
);

-- ==================== STOCK BATCHES ====================
CREATE TABLE stock_batches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  item_id       UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  warehouse_id  UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  quantity      NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit_cost     NUMERIC(15,2) NOT NULL DEFAULT 0,
  batch_number  VARCHAR(50) NOT NULL,
  expiry_date   DATE,
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== LOW STOCK ALERTS ====================
CREATE TABLE low_stock_alerts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  item_id             UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  warehouse_id        UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  current_stock       NUMERIC(12,2) NOT NULL DEFAULT 0,
  reorder_point       NUMERIC(12,2) NOT NULL DEFAULT 0,
  suggested_order_qty NUMERIC(12,2) NOT NULL DEFAULT 0,
  priority            VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  is_acknowledged     BOOLEAN NOT NULL DEFAULT false,
  acknowledged_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  acknowledged_at     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
