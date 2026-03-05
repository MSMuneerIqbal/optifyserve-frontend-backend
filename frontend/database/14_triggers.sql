-- ============================================================
-- 14_triggers.sql
-- Automated triggers for timestamps, audit, sequences, stock
-- ============================================================

-- ============================================================
-- 1. Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
      AND table_name NOT IN ('user_sessions')  -- sessions manage their own
    ORDER BY table_name
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW
       EXECUTE FUNCTION set_updated_at()',
      tbl.table_name, tbl.table_name
    );
  END LOOP;
END;
$$;

-- ============================================================
-- 2. Auto-set audit columns (created_by, updated_by)
-- ============================================================
CREATE OR REPLACE FUNCTION set_audit_columns()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
BEGIN
  BEGIN
    current_user_id := current_setting('app.current_user', true)::uuid;
  EXCEPTION
    WHEN OTHERS THEN current_user_id := NULL;
  END;

  IF TG_OP = 'INSERT' THEN
    IF NEW.created_by IS NULL THEN
      NEW.created_by = current_user_id;
    END IF;
    NEW.updated_by = current_user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by = current_user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with created_by and updated_by columns
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN
    SELECT c1.table_name
    FROM information_schema.columns c1
    JOIN information_schema.columns c2 ON c1.table_name = c2.table_name AND c2.column_name = 'updated_by'
    WHERE c1.column_name = 'created_by'
      AND c1.table_schema = 'public'
    ORDER BY c1.table_name
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%I_audit_columns
       BEFORE INSERT OR UPDATE ON %I
       FOR EACH ROW
       EXECUTE FUNCTION set_audit_columns()',
      tbl.table_name, tbl.table_name
    );
  END LOOP;
END;
$$;

-- ============================================================
-- 3. Auto-generate sequence numbers per tenant
-- ============================================================
CREATE TABLE sequence_counters (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  prefix    VARCHAR(10) NOT NULL,
  counter   BIGINT NOT NULL DEFAULT 0,
  UNIQUE (tenant_id, prefix)
);

CREATE OR REPLACE FUNCTION generate_sequence_number(
  p_tenant_id UUID,
  p_prefix VARCHAR(10)
) RETURNS VARCHAR(20) AS $$
DECLARE
  v_counter BIGINT;
BEGIN
  INSERT INTO sequence_counters (tenant_id, prefix, counter)
  VALUES (p_tenant_id, p_prefix, 1)
  ON CONFLICT (tenant_id, prefix)
  DO UPDATE SET counter = sequence_counters.counter + 1
  RETURNING counter INTO v_counter;

  RETURN p_prefix || '-' || LPAD(v_counter::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Customer number trigger
CREATE OR REPLACE FUNCTION trg_customer_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_number IS NULL OR NEW.customer_number = '' THEN
    NEW.customer_number := generate_sequence_number(NEW.tenant_id, 'CUST');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_customers_auto_number
  BEFORE INSERT ON customers
  FOR EACH ROW EXECUTE FUNCTION trg_customer_number();

-- Lead number trigger
CREATE OR REPLACE FUNCTION trg_lead_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lead_number IS NULL OR NEW.lead_number = '' THEN
    NEW.lead_number := generate_sequence_number(NEW.tenant_id, 'LEAD');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_leads_auto_number
  BEFORE INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION trg_lead_number();

-- Quotation number trigger
CREATE OR REPLACE FUNCTION trg_quotation_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quotation_number IS NULL OR NEW.quotation_number = '' THEN
    NEW.quotation_number := generate_sequence_number(NEW.tenant_id, 'QTN');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_quotations_auto_number
  BEFORE INSERT ON quotations
  FOR EACH ROW EXECUTE FUNCTION trg_quotation_number();

-- Invoice number trigger
CREATE OR REPLACE FUNCTION trg_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_sequence_number(NEW.tenant_id, 'INV');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_invoices_auto_number
  BEFORE INSERT ON invoices
  FOR EACH ROW EXECUTE FUNCTION trg_invoice_number();

-- PO number trigger
CREATE OR REPLACE FUNCTION trg_po_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.po_number IS NULL OR NEW.po_number = '' THEN
    NEW.po_number := generate_sequence_number(NEW.tenant_id, 'PO');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_purchase_orders_auto_number
  BEFORE INSERT ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION trg_po_number();

-- GRN number trigger
CREATE OR REPLACE FUNCTION trg_grn_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.grn_number IS NULL OR NEW.grn_number = '' THEN
    NEW.grn_number := generate_sequence_number(NEW.tenant_id, 'GRN');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_grn_auto_number
  BEFORE INSERT ON goods_received_notes
  FOR EACH ROW EXECUTE FUNCTION trg_grn_number();

-- Purchase return number trigger
CREATE OR REPLACE FUNCTION trg_return_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.return_number IS NULL OR NEW.return_number = '' THEN
    NEW.return_number := generate_sequence_number(NEW.tenant_id, 'RET');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_purchase_returns_auto_number
  BEFORE INSERT ON purchase_returns
  FOR EACH ROW EXECUTE FUNCTION trg_return_number();

-- Vendor payment number trigger
CREATE OR REPLACE FUNCTION trg_vendor_payment_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_number IS NULL OR NEW.payment_number = '' THEN
    NEW.payment_number := generate_sequence_number(NEW.tenant_id, 'VPAY');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_vendor_payments_auto_number
  BEFORE INSERT ON vendor_payments
  FOR EACH ROW EXECUTE FUNCTION trg_vendor_payment_number();

-- Expense number trigger
CREATE OR REPLACE FUNCTION trg_expense_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expense_number IS NULL OR NEW.expense_number = '' THEN
    NEW.expense_number := generate_sequence_number(NEW.tenant_id, 'EXP');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_expenses_auto_number
  BEFORE INSERT ON expenses
  FOR EACH ROW EXECUTE FUNCTION trg_expense_number();

-- Journal entry number trigger
CREATE OR REPLACE FUNCTION trg_journal_entry_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.entry_number IS NULL OR NEW.entry_number = '' THEN
    NEW.entry_number := generate_sequence_number(NEW.tenant_id, 'JE');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_journal_entries_auto_number
  BEFORE INSERT ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION trg_journal_entry_number();

-- VAT return number trigger
CREATE OR REPLACE FUNCTION trg_vat_return_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.return_number IS NULL OR NEW.return_number = '' THEN
    NEW.return_number := generate_sequence_number(NEW.tenant_id, 'VAT');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_vat_returns_auto_number
  BEFORE INSERT ON vat_returns
  FOR EACH ROW EXECUTE FUNCTION trg_vat_return_number();

-- Job number trigger
CREATE OR REPLACE FUNCTION trg_job_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_number IS NULL OR NEW.job_number = '' THEN
    NEW.job_number := generate_sequence_number(NEW.tenant_id, 'JOB');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_jobs_auto_number
  BEFORE INSERT ON jobs
  FOR EACH ROW EXECUTE FUNCTION trg_job_number();

-- Service report number trigger
CREATE OR REPLACE FUNCTION trg_service_report_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.report_number IS NULL OR NEW.report_number = '' THEN
    NEW.report_number := generate_sequence_number(NEW.tenant_id, 'SR');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_service_reports_auto_number
  BEFORE INSERT ON service_reports
  FOR EACH ROW EXECUTE FUNCTION trg_service_report_number();

-- Stock movement number trigger
CREATE OR REPLACE FUNCTION trg_movement_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.movement_number IS NULL OR NEW.movement_number = '' THEN
    NEW.movement_number := generate_sequence_number(NEW.tenant_id, 'SM');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_stock_movements_auto_number
  BEFORE INSERT ON stock_movements
  FOR EACH ROW EXECUTE FUNCTION trg_movement_number();

-- Vendor code trigger
CREATE OR REPLACE FUNCTION trg_vendor_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vendor_code IS NULL OR NEW.vendor_code = '' THEN
    NEW.vendor_code := generate_sequence_number(NEW.tenant_id, 'VEN');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_vendors_auto_code
  BEFORE INSERT ON vendors
  FOR EACH ROW EXECUTE FUNCTION trg_vendor_code();

-- AP bill number trigger
CREATE OR REPLACE FUNCTION trg_ap_bill_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.bill_number IS NULL OR NEW.bill_number = '' THEN
    NEW.bill_number := generate_sequence_number(NEW.tenant_id, 'BILL');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_accounts_payable_auto_number
  BEFORE INSERT ON accounts_payable
  FOR EACH ROW EXECUTE FUNCTION trg_ap_bill_number();

-- ============================================================
-- 4. Auto-update stock levels on stock movement
-- ============================================================
CREATE OR REPLACE FUNCTION update_stock_levels()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure stock_levels row exists
  INSERT INTO stock_levels (tenant_id, item_id, warehouse_id, available_qty)
  VALUES (NEW.tenant_id, NEW.item_id, NEW.warehouse_id, 0)
  ON CONFLICT (tenant_id, item_id, warehouse_id) DO NOTHING;

  CASE NEW.type
    WHEN 'in' THEN
      UPDATE stock_levels
      SET available_qty = available_qty + NEW.quantity,
          last_movement_date = NEW.performed_at
      WHERE tenant_id = NEW.tenant_id
        AND item_id = NEW.item_id
        AND warehouse_id = NEW.warehouse_id;

    WHEN 'out', 'consumption' THEN
      UPDATE stock_levels
      SET available_qty = available_qty - NEW.quantity,
          last_movement_date = NEW.performed_at
      WHERE tenant_id = NEW.tenant_id
        AND item_id = NEW.item_id
        AND warehouse_id = NEW.warehouse_id;

    WHEN 'transfer' THEN
      -- Decrease from source warehouse
      IF NEW.from_warehouse_id IS NOT NULL THEN
        INSERT INTO stock_levels (tenant_id, item_id, warehouse_id, available_qty)
        VALUES (NEW.tenant_id, NEW.item_id, NEW.from_warehouse_id, 0)
        ON CONFLICT (tenant_id, item_id, warehouse_id) DO NOTHING;

        UPDATE stock_levels
        SET available_qty = available_qty - NEW.quantity,
            last_movement_date = NEW.performed_at
        WHERE tenant_id = NEW.tenant_id
          AND item_id = NEW.item_id
          AND warehouse_id = NEW.from_warehouse_id;
      END IF;

      -- Increase in destination warehouse
      IF NEW.to_warehouse_id IS NOT NULL THEN
        INSERT INTO stock_levels (tenant_id, item_id, warehouse_id, available_qty)
        VALUES (NEW.tenant_id, NEW.item_id, NEW.to_warehouse_id, 0)
        ON CONFLICT (tenant_id, item_id, warehouse_id) DO NOTHING;

        UPDATE stock_levels
        SET available_qty = available_qty + NEW.quantity,
            last_movement_date = NEW.performed_at
        WHERE tenant_id = NEW.tenant_id
          AND item_id = NEW.item_id
          AND warehouse_id = NEW.to_warehouse_id;
      END IF;

    WHEN 'adjustment' THEN
      -- Adjustment can be positive or negative based on reason
      UPDATE stock_levels
      SET available_qty = available_qty + NEW.quantity,  -- negative qty for decrease
          last_movement_date = NEW.performed_at
      WHERE tenant_id = NEW.tenant_id
        AND item_id = NEW.item_id
        AND warehouse_id = NEW.warehouse_id;

    WHEN 'return' THEN
      UPDATE stock_levels
      SET available_qty = available_qty + NEW.quantity,
          last_movement_date = NEW.performed_at
      WHERE tenant_id = NEW.tenant_id
        AND item_id = NEW.item_id
        AND warehouse_id = NEW.warehouse_id;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stock_movements_update_levels
  AFTER INSERT ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_levels();

-- ============================================================
-- 5. Auto-update invoice balance on payment
-- ============================================================
CREATE OR REPLACE FUNCTION update_invoice_balance()
RETURNS TRIGGER AS $$
DECLARE
  v_total_paid NUMERIC(15,2);
  v_total NUMERIC(15,2);
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_total_paid
  FROM invoice_payments
  WHERE invoice_id = NEW.invoice_id;

  SELECT total INTO v_total
  FROM invoices
  WHERE id = NEW.invoice_id;

  UPDATE invoices
  SET paid_amount = v_total_paid,
      balance_amount = v_total - v_total_paid,
      status = CASE
        WHEN v_total_paid >= v_total THEN 'paid'::invoice_status
        WHEN v_total_paid > 0 THEN 'partially-paid'::invoice_status
        ELSE status
      END
  WHERE id = NEW.invoice_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_payments_update_balance
  AFTER INSERT ON invoice_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_balance();

-- ============================================================
-- 6. Auto-update AR balance on customer payment
-- ============================================================
CREATE OR REPLACE FUNCTION update_ar_on_payment()
RETURNS TRIGGER AS $$
DECLARE
  v_total_paid NUMERIC(15,2);
  v_total NUMERIC(15,2);
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_total_paid
  FROM customer_payments
  WHERE ar_invoice_id = NEW.ar_invoice_id;

  SELECT total_amount INTO v_total
  FROM accounts_receivable
  WHERE id = NEW.ar_invoice_id;

  UPDATE accounts_receivable
  SET paid_amount = v_total_paid,
      balance_amount = v_total - v_total_paid,
      last_payment_date = NEW.date,
      status = CASE
        WHEN v_total_paid >= v_total THEN 'paid'::ar_invoice_status
        WHEN v_total_paid > 0 THEN 'partially-paid'::ar_invoice_status
        ELSE status
      END
  WHERE id = NEW.ar_invoice_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customer_payments_update_ar
  AFTER INSERT ON customer_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_ar_on_payment();

-- ============================================================
-- 7. Auto-update AP balance on vendor payment
-- ============================================================
CREATE OR REPLACE FUNCTION update_ap_on_payment()
RETURNS TRIGGER AS $$
DECLARE
  v_total_paid NUMERIC(15,2);
  v_total NUMERIC(15,2);
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_total_paid
  FROM ap_payments
  WHERE ap_bill_id = NEW.ap_bill_id;

  SELECT total_amount INTO v_total
  FROM accounts_payable
  WHERE id = NEW.ap_bill_id;

  UPDATE accounts_payable
  SET paid_amount = v_total_paid,
      balance_amount = v_total - v_total_paid,
      status = CASE
        WHEN v_total_paid >= v_total THEN 'paid'::ap_bill_status
        WHEN v_total_paid > 0 THEN 'partially-paid'::ap_bill_status
        ELSE status
      END
  WHERE id = NEW.ap_bill_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ap_payments_update_ap
  AFTER INSERT ON ap_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_ap_on_payment();
