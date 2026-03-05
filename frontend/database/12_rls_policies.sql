-- ============================================================
-- 12_rls_policies.sql
-- Row-Level Security policies for multi-tenant isolation
-- Tenant context: SET app.current_tenant = '<uuid>';
-- ============================================================

-- ============================================================
-- Helper function to get current tenant
-- ============================================================
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant', true)::uuid;
EXCEPTION
  WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- Enable RLS on all tenant-scoped tables
-- Tables WITHOUT tenant_id (exempt): tenants, permissions
-- Tables with special handling: users, user_sessions
-- ============================================================

-- ==================== AUTH ====================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- ==================== CRM ====================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_service_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_activities ENABLE ROW LEVEL SECURITY;

-- ==================== SALES ====================
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;

-- ==================== INVENTORY ====================
ALTER TABLE item_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE low_stock_alerts ENABLE ROW LEVEL SECURITY;

-- ==================== PURCHASE ====================
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_received_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grn_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_statement_entries ENABLE ROW LEVEL SECURITY;

-- ==================== ACCOUNTS ====================
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_payable ENABLE ROW LEVEL SECURITY;
ALTER TABLE ap_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_returns ENABLE ROW LEVEL SECURITY;

-- ==================== HR ====================
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_regularizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE eosb_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;

-- ==================== JOBS ====================
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedbacks ENABLE ROW LEVEL SECURITY;

-- ==================== DISPATCHER ====================
ALTER TABLE technician_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_assignment_logs ENABLE ROW LEVEL SECURITY;

-- ==================== SETTINGS ====================
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies: Tables with tenant_id column
-- Pattern: USING (tenant_id = current_tenant_id())
-- ============================================================

-- Macro-style function to create standard tenant policies
-- We'll create policies explicitly for each table

-- ==================== AUTH POLICIES ====================

CREATE POLICY tenant_isolation_select ON roles FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON roles FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON roles FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON roles FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON users FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON users FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON users FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON users FOR DELETE USING (tenant_id = current_tenant_id());

-- user_sessions: filter by user's tenant via join
CREATE POLICY tenant_isolation_select ON user_sessions FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON user_sessions FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON user_sessions FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON user_sessions FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));

-- password_reset_tokens: filter by user's tenant
CREATE POLICY tenant_isolation_select ON password_reset_tokens FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON password_reset_tokens FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON password_reset_tokens FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON user_invitations FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON user_invitations FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON user_invitations FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON user_invitations FOR DELETE USING (tenant_id = current_tenant_id());

-- ==================== CRM POLICIES ====================

CREATE POLICY tenant_isolation_select ON customers FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON customers FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON customers FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON customers FOR DELETE USING (tenant_id = current_tenant_id());

-- customer_contacts: via customer's tenant
CREATE POLICY tenant_isolation_select ON customer_contacts FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON customer_contacts FOR INSERT
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON customer_contacts FOR UPDATE
  USING (customer_id IN (SELECT id FROM customers WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON customer_contacts FOR DELETE
  USING (customer_id IN (SELECT id FROM customers WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON leads FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON leads FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON leads FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON leads FOR DELETE USING (tenant_id = current_tenant_id());

-- lead_service_interests: via lead's tenant
CREATE POLICY tenant_isolation_select ON lead_service_interests FOR SELECT
  USING (lead_id IN (SELECT id FROM leads WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON lead_service_interests FOR INSERT
  WITH CHECK (lead_id IN (SELECT id FROM leads WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON lead_service_interests FOR DELETE
  USING (lead_id IN (SELECT id FROM leads WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON follow_ups FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON follow_ups FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON follow_ups FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON follow_ups FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON customer_activities FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON customer_activities FOR INSERT WITH CHECK (tenant_id = current_tenant_id());

-- ==================== SALES POLICIES ====================

CREATE POLICY tenant_isolation_select ON quotations FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON quotations FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON quotations FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON quotations FOR DELETE USING (tenant_id = current_tenant_id());

-- quotation_items: via quotation's tenant
CREATE POLICY tenant_isolation_select ON quotation_items FOR SELECT
  USING (quotation_id IN (SELECT id FROM quotations WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON quotation_items FOR INSERT
  WITH CHECK (quotation_id IN (SELECT id FROM quotations WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON quotation_items FOR UPDATE
  USING (quotation_id IN (SELECT id FROM quotations WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON quotation_items FOR DELETE
  USING (quotation_id IN (SELECT id FROM quotations WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON invoices FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON invoices FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON invoices FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON invoices FOR DELETE USING (tenant_id = current_tenant_id());

-- invoice_items: via invoice's tenant
CREATE POLICY tenant_isolation_select ON invoice_items FOR SELECT
  USING (invoice_id IN (SELECT id FROM invoices WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON invoice_items FOR INSERT
  WITH CHECK (invoice_id IN (SELECT id FROM invoices WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON invoice_items FOR UPDATE
  USING (invoice_id IN (SELECT id FROM invoices WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON invoice_items FOR DELETE
  USING (invoice_id IN (SELECT id FROM invoices WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON invoice_payments FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON invoice_payments FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON invoice_payments FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON invoice_payments FOR DELETE USING (tenant_id = current_tenant_id());

-- ==================== INVENTORY POLICIES ====================

CREATE POLICY tenant_isolation_select ON item_categories FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON item_categories FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON item_categories FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON item_categories FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON items FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON items FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON items FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON items FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON warehouses FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON warehouses FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON warehouses FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON warehouses FOR DELETE USING (tenant_id = current_tenant_id());

-- warehouse_locations: via warehouse's tenant
CREATE POLICY tenant_isolation_select ON warehouse_locations FOR SELECT
  USING (warehouse_id IN (SELECT id FROM warehouses WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON warehouse_locations FOR INSERT
  WITH CHECK (warehouse_id IN (SELECT id FROM warehouses WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON warehouse_locations FOR UPDATE
  USING (warehouse_id IN (SELECT id FROM warehouses WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON warehouse_locations FOR DELETE
  USING (warehouse_id IN (SELECT id FROM warehouses WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON stock_levels FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON stock_levels FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON stock_levels FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON stock_levels FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON stock_movements FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON stock_movements FOR INSERT WITH CHECK (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON stock_batches FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON stock_batches FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON stock_batches FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON low_stock_alerts FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON low_stock_alerts FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON low_stock_alerts FOR UPDATE USING (tenant_id = current_tenant_id());

-- ==================== PURCHASE POLICIES ====================

CREATE POLICY tenant_isolation_select ON vendors FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON vendors FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON vendors FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON vendors FOR DELETE USING (tenant_id = current_tenant_id());

-- vendor_contacts: via vendor's tenant
CREATE POLICY tenant_isolation_select ON vendor_contacts FOR SELECT
  USING (vendor_id IN (SELECT id FROM vendors WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON vendor_contacts FOR INSERT
  WITH CHECK (vendor_id IN (SELECT id FROM vendors WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON vendor_contacts FOR UPDATE
  USING (vendor_id IN (SELECT id FROM vendors WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON vendor_contacts FOR DELETE
  USING (vendor_id IN (SELECT id FROM vendors WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON purchase_orders FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON purchase_orders FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON purchase_orders FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON purchase_orders FOR DELETE USING (tenant_id = current_tenant_id());

-- po_line_items: via PO's tenant
CREATE POLICY tenant_isolation_select ON po_line_items FOR SELECT
  USING (po_id IN (SELECT id FROM purchase_orders WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON po_line_items FOR INSERT
  WITH CHECK (po_id IN (SELECT id FROM purchase_orders WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON po_line_items FOR UPDATE
  USING (po_id IN (SELECT id FROM purchase_orders WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON po_line_items FOR DELETE
  USING (po_id IN (SELECT id FROM purchase_orders WHERE tenant_id = current_tenant_id()));

-- po_approvals: via PO's tenant
CREATE POLICY tenant_isolation_select ON po_approvals FOR SELECT
  USING (po_id IN (SELECT id FROM purchase_orders WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON po_approvals FOR INSERT
  WITH CHECK (po_id IN (SELECT id FROM purchase_orders WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON po_approvals FOR UPDATE
  USING (po_id IN (SELECT id FROM purchase_orders WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON goods_received_notes FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON goods_received_notes FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON goods_received_notes FOR UPDATE USING (tenant_id = current_tenant_id());

-- grn_line_items: via GRN's tenant
CREATE POLICY tenant_isolation_select ON grn_line_items FOR SELECT
  USING (grn_id IN (SELECT id FROM goods_received_notes WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON grn_line_items FOR INSERT
  WITH CHECK (grn_id IN (SELECT id FROM goods_received_notes WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON grn_line_items FOR UPDATE
  USING (grn_id IN (SELECT id FROM goods_received_notes WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON purchase_returns FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON purchase_returns FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON purchase_returns FOR UPDATE USING (tenant_id = current_tenant_id());

-- purchase_return_items: via return's tenant
CREATE POLICY tenant_isolation_select ON purchase_return_items FOR SELECT
  USING (return_id IN (SELECT id FROM purchase_returns WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON purchase_return_items FOR INSERT
  WITH CHECK (return_id IN (SELECT id FROM purchase_returns WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON vendor_payments FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON vendor_payments FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON vendor_payments FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON vendor_statement_entries FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON vendor_statement_entries FOR INSERT WITH CHECK (tenant_id = current_tenant_id());

-- ==================== ACCOUNTS POLICIES ====================

CREATE POLICY tenant_isolation_select ON chart_of_accounts FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON chart_of_accounts FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON chart_of_accounts FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON chart_of_accounts FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON journal_entries FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON journal_entries FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON journal_entries FOR UPDATE USING (tenant_id = current_tenant_id());

-- journal_lines: via entry's tenant
CREATE POLICY tenant_isolation_select ON journal_lines FOR SELECT
  USING (entry_id IN (SELECT id FROM journal_entries WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON journal_lines FOR INSERT
  WITH CHECK (entry_id IN (SELECT id FROM journal_entries WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON accounts_receivable FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON accounts_receivable FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON accounts_receivable FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON customer_payments FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON customer_payments FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON customer_payments FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON accounts_payable FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON accounts_payable FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON accounts_payable FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON ap_payments FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON ap_payments FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON ap_payments FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON expenses FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON expenses FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON expenses FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON expenses FOR DELETE USING (tenant_id = current_tenant_id());

-- expense_approvals: via expense's tenant
CREATE POLICY tenant_isolation_select ON expense_approvals FOR SELECT
  USING (expense_id IN (SELECT id FROM expenses WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON expense_approvals FOR INSERT
  WITH CHECK (expense_id IN (SELECT id FROM expenses WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON bank_accounts FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON bank_accounts FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON bank_accounts FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON bank_reconciliations FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON bank_reconciliations FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON bank_reconciliations FOR UPDATE USING (tenant_id = current_tenant_id());

-- bank_transactions: via reconciliation's tenant
CREATE POLICY tenant_isolation_select ON bank_transactions FOR SELECT
  USING (reconciliation_id IN (SELECT id FROM bank_reconciliations WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON bank_transactions FOR INSERT
  WITH CHECK (reconciliation_id IN (SELECT id FROM bank_reconciliations WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON bank_transactions FOR UPDATE
  USING (reconciliation_id IN (SELECT id FROM bank_reconciliations WHERE tenant_id = current_tenant_id()));

-- reconciliation_adjustments: via reconciliation's tenant
CREATE POLICY tenant_isolation_select ON reconciliation_adjustments FOR SELECT
  USING (reconciliation_id IN (SELECT id FROM bank_reconciliations WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON reconciliation_adjustments FOR INSERT
  WITH CHECK (reconciliation_id IN (SELECT id FROM bank_reconciliations WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON vat_returns FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON vat_returns FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON vat_returns FOR UPDATE USING (tenant_id = current_tenant_id());

-- ==================== HR POLICIES ====================

CREATE POLICY tenant_isolation_select ON branches FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON branches FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON branches FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON branches FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON departments FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON departments FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON departments FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON departments FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON designations FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON designations FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON designations FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON employees FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON employees FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON employees FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON employees FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON shifts FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON shifts FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON shifts FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON attendance_records FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON attendance_records FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON attendance_records FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON attendance_regularizations FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON attendance_regularizations FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON attendance_regularizations FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON leave_types FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON leave_types FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON leave_types FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON leave_balances FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON leave_balances FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON leave_balances FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON leave_requests FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON leave_requests FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON leave_requests FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON payroll_runs FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON payroll_runs FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON payroll_runs FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON payslips FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON payslips FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON payslips FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON eosb_records FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON eosb_records FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON eosb_records FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON employee_documents FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON employee_documents FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON employee_documents FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON employee_documents FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON performance_reviews FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON performance_reviews FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON performance_reviews FOR UPDATE USING (tenant_id = current_tenant_id());

-- ==================== JOBS POLICIES ====================

CREATE POLICY tenant_isolation_select ON jobs FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON jobs FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON jobs FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON jobs FOR DELETE USING (tenant_id = current_tenant_id());

-- job_technicians: via job's tenant
CREATE POLICY tenant_isolation_select ON job_technicians FOR SELECT
  USING (job_id IN (SELECT id FROM jobs WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON job_technicians FOR INSERT
  WITH CHECK (job_id IN (SELECT id FROM jobs WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON job_technicians FOR DELETE
  USING (job_id IN (SELECT id FROM jobs WHERE tenant_id = current_tenant_id()));

-- job_attachments: via job's tenant
CREATE POLICY tenant_isolation_select ON job_attachments FOR SELECT
  USING (job_id IN (SELECT id FROM jobs WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON job_attachments FOR INSERT
  WITH CHECK (job_id IN (SELECT id FROM jobs WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON job_attachments FOR DELETE
  USING (job_id IN (SELECT id FROM jobs WHERE tenant_id = current_tenant_id()));

-- job_status_history: via job's tenant
CREATE POLICY tenant_isolation_select ON job_status_history FOR SELECT
  USING (job_id IN (SELECT id FROM jobs WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON job_status_history FOR INSERT
  WITH CHECK (job_id IN (SELECT id FROM jobs WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON technicians FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON technicians FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON technicians FOR UPDATE USING (tenant_id = current_tenant_id());

-- technician_skills: via technician's tenant
CREATE POLICY tenant_isolation_select ON technician_skills FOR SELECT
  USING (technician_id IN (SELECT id FROM technicians WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON technician_skills FOR INSERT
  WITH CHECK (technician_id IN (SELECT id FROM technicians WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON technician_skills FOR UPDATE
  USING (technician_id IN (SELECT id FROM technicians WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_delete ON technician_skills FOR DELETE
  USING (technician_id IN (SELECT id FROM technicians WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON service_reports FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON service_reports FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON service_reports FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON customer_feedbacks FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON customer_feedbacks FOR INSERT WITH CHECK (tenant_id = current_tenant_id());

-- ==================== DISPATCHER POLICIES ====================

CREATE POLICY tenant_isolation_select ON technician_locations FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON technician_locations FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON technician_locations FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON job_assignment_logs FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON job_assignment_logs FOR INSERT WITH CHECK (tenant_id = current_tenant_id());

-- ==================== SETTINGS POLICIES ====================

CREATE POLICY tenant_isolation_select ON company_profiles FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON company_profiles FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON company_profiles FOR UPDATE USING (tenant_id = current_tenant_id());

-- notification_preferences: via user's tenant
CREATE POLICY tenant_isolation_select ON notification_preferences FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_insert ON notification_preferences FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));
CREATE POLICY tenant_isolation_update ON notification_preferences FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE tenant_id = current_tenant_id()));

CREATE POLICY tenant_isolation_select ON integrations FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON integrations FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON integrations FOR UPDATE USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_delete ON integrations FOR DELETE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON theme_settings FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON theme_settings FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON theme_settings FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON security_settings FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON security_settings FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON security_settings FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON backup_settings FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON backup_settings FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_update ON backup_settings FOR UPDATE USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_select ON audit_logs FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY tenant_isolation_insert ON audit_logs FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
