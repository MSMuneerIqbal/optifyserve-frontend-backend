-- ============================================================
-- 13_indexes.sql
-- Composite indexes for performance across all modules
-- Pattern: (tenant_id, ...) for all tenant-scoped lookups
-- ============================================================

-- ==================== AUTH ====================
CREATE INDEX idx_users_tenant_email ON users (tenant_id, email);
CREATE INDEX idx_users_tenant_role ON users (tenant_id, role);
CREATE INDEX idx_users_tenant_status ON users (tenant_id, status);
CREATE INDEX idx_users_deleted_at ON users (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_user_sessions_user_id ON user_sessions (user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions (expires_at);
CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens (user_id);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens (expires_at);
CREATE INDEX idx_roles_tenant ON roles (tenant_id);
CREATE INDEX idx_user_invitations_tenant_email ON user_invitations (tenant_id, email);

-- ==================== CRM ====================
CREATE INDEX idx_customers_tenant ON customers (tenant_id);
CREATE INDEX idx_customers_tenant_number ON customers (tenant_id, customer_number);
CREATE INDEX idx_customers_tenant_email ON customers (tenant_id, email);
CREATE INDEX idx_customers_tenant_status ON customers (tenant_id, status);
CREATE INDEX idx_customers_tenant_type ON customers (tenant_id, customer_type);
CREATE INDEX idx_customers_tenant_sales_rep ON customers (tenant_id, assigned_sales_rep_id);
CREATE INDEX idx_customers_deleted_at ON customers (deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_customers_name_trgm ON customers USING gin (name gin_trgm_ops);

CREATE INDEX idx_customer_contacts_customer ON customer_contacts (customer_id);

CREATE INDEX idx_leads_tenant ON leads (tenant_id);
CREATE INDEX idx_leads_tenant_stage ON leads (tenant_id, stage);
CREATE INDEX idx_leads_tenant_source ON leads (tenant_id, source);
CREATE INDEX idx_leads_tenant_assigned ON leads (tenant_id, assigned_to_id);
CREATE INDEX idx_leads_tenant_priority ON leads (tenant_id, priority);
CREATE INDEX idx_leads_expected_close ON leads (tenant_id, expected_close_date);
CREATE INDEX idx_leads_deleted_at ON leads (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_lead_service_interests_lead ON lead_service_interests (lead_id);

CREATE INDEX idx_follow_ups_tenant ON follow_ups (tenant_id);
CREATE INDEX idx_follow_ups_lead ON follow_ups (lead_id);
CREATE INDEX idx_follow_ups_tenant_date ON follow_ups (tenant_id, date);
CREATE INDEX idx_follow_ups_tenant_status ON follow_ups (tenant_id, status);

CREATE INDEX idx_customer_activities_tenant ON customer_activities (tenant_id);
CREATE INDEX idx_customer_activities_customer ON customer_activities (customer_id);

-- ==================== SALES ====================
CREATE INDEX idx_quotations_tenant ON quotations (tenant_id);
CREATE INDEX idx_quotations_tenant_number ON quotations (tenant_id, quotation_number);
CREATE INDEX idx_quotations_tenant_customer ON quotations (tenant_id, customer_id);
CREATE INDEX idx_quotations_tenant_status ON quotations (tenant_id, status);
CREATE INDEX idx_quotations_tenant_date ON quotations (tenant_id, date);
CREATE INDEX idx_quotations_deleted_at ON quotations (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_quotation_items_quotation ON quotation_items (quotation_id);

CREATE INDEX idx_invoices_tenant ON invoices (tenant_id);
CREATE INDEX idx_invoices_tenant_number ON invoices (tenant_id, invoice_number);
CREATE INDEX idx_invoices_tenant_customer ON invoices (tenant_id, customer_id);
CREATE INDEX idx_invoices_tenant_status ON invoices (tenant_id, status);
CREATE INDEX idx_invoices_tenant_date ON invoices (tenant_id, date);
CREATE INDEX idx_invoices_tenant_due_date ON invoices (tenant_id, due_date);
CREATE INDEX idx_invoices_tenant_customer_status ON invoices (tenant_id, customer_id, status);
CREATE INDEX idx_invoices_deleted_at ON invoices (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_invoice_items_invoice ON invoice_items (invoice_id);

CREATE INDEX idx_invoice_payments_tenant ON invoice_payments (tenant_id);
CREATE INDEX idx_invoice_payments_invoice ON invoice_payments (invoice_id);

-- ==================== INVENTORY ====================
CREATE INDEX idx_item_categories_tenant ON item_categories (tenant_id);
CREATE INDEX idx_item_categories_parent ON item_categories (parent_id);

CREATE INDEX idx_items_tenant ON items (tenant_id);
CREATE INDEX idx_items_tenant_sku ON items (tenant_id, sku);
CREATE INDEX idx_items_tenant_category ON items (tenant_id, category_id);
CREATE INDEX idx_items_tenant_status ON items (tenant_id, status);
CREATE INDEX idx_items_barcode ON items (tenant_id, barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_items_deleted_at ON items (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_warehouses_tenant ON warehouses (tenant_id);
CREATE INDEX idx_warehouses_tenant_code ON warehouses (tenant_id, code);

CREATE INDEX idx_warehouse_locations_warehouse ON warehouse_locations (warehouse_id);

CREATE INDEX idx_stock_levels_tenant ON stock_levels (tenant_id);
CREATE INDEX idx_stock_levels_tenant_item_warehouse ON stock_levels (tenant_id, item_id, warehouse_id);
CREATE INDEX idx_stock_levels_item ON stock_levels (item_id);

CREATE INDEX idx_stock_movements_tenant ON stock_movements (tenant_id);
CREATE INDEX idx_stock_movements_tenant_number ON stock_movements (tenant_id, movement_number);
CREATE INDEX idx_stock_movements_tenant_item ON stock_movements (tenant_id, item_id);
CREATE INDEX idx_stock_movements_tenant_type ON stock_movements (tenant_id, type);
CREATE INDEX idx_stock_movements_performed_at ON stock_movements (tenant_id, performed_at);

CREATE INDEX idx_stock_batches_tenant_item ON stock_batches (tenant_id, item_id);
CREATE INDEX idx_stock_batches_expiry ON stock_batches (expiry_date) WHERE expiry_date IS NOT NULL;

CREATE INDEX idx_low_stock_alerts_tenant ON low_stock_alerts (tenant_id);
CREATE INDEX idx_low_stock_alerts_unacknowledged ON low_stock_alerts (tenant_id, is_acknowledged) WHERE is_acknowledged = false;

-- ==================== PURCHASE ====================
CREATE INDEX idx_vendors_tenant ON vendors (tenant_id);
CREATE INDEX idx_vendors_tenant_code ON vendors (tenant_id, vendor_code);
CREATE INDEX idx_vendors_tenant_status ON vendors (tenant_id, status);
CREATE INDEX idx_vendors_deleted_at ON vendors (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_vendor_contacts_vendor ON vendor_contacts (vendor_id);

CREATE INDEX idx_purchase_orders_tenant ON purchase_orders (tenant_id);
CREATE INDEX idx_purchase_orders_tenant_number ON purchase_orders (tenant_id, po_number);
CREATE INDEX idx_purchase_orders_tenant_vendor ON purchase_orders (tenant_id, vendor_id);
CREATE INDEX idx_purchase_orders_tenant_status ON purchase_orders (tenant_id, status);
CREATE INDEX idx_purchase_orders_tenant_vendor_status ON purchase_orders (tenant_id, vendor_id, status);
CREATE INDEX idx_purchase_orders_deleted_at ON purchase_orders (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_po_line_items_po ON po_line_items (po_id);

CREATE INDEX idx_po_approvals_po ON po_approvals (po_id);
CREATE INDEX idx_po_approvals_approver ON po_approvals (approver_id, status);

CREATE INDEX idx_grn_tenant ON goods_received_notes (tenant_id);
CREATE INDEX idx_grn_tenant_number ON goods_received_notes (tenant_id, grn_number);
CREATE INDEX idx_grn_po ON goods_received_notes (po_id);

CREATE INDEX idx_grn_line_items_grn ON grn_line_items (grn_id);

CREATE INDEX idx_purchase_returns_tenant ON purchase_returns (tenant_id);
CREATE INDEX idx_purchase_returns_tenant_number ON purchase_returns (tenant_id, return_number);
CREATE INDEX idx_purchase_returns_vendor ON purchase_returns (vendor_id);

CREATE INDEX idx_purchase_return_items_return ON purchase_return_items (return_id);

CREATE INDEX idx_vendor_payments_tenant ON vendor_payments (tenant_id);
CREATE INDEX idx_vendor_payments_tenant_number ON vendor_payments (tenant_id, payment_number);
CREATE INDEX idx_vendor_payments_vendor ON vendor_payments (vendor_id);

CREATE INDEX idx_vendor_statement_entries_tenant_vendor ON vendor_statement_entries (tenant_id, vendor_id);
CREATE INDEX idx_vendor_statement_entries_date ON vendor_statement_entries (tenant_id, vendor_id, date);

-- ==================== ACCOUNTS ====================
CREATE INDEX idx_coa_tenant ON chart_of_accounts (tenant_id);
CREATE INDEX idx_coa_tenant_code ON chart_of_accounts (tenant_id, code);
CREATE INDEX idx_coa_tenant_type ON chart_of_accounts (tenant_id, type);
CREATE INDEX idx_coa_parent ON chart_of_accounts (parent_id);

CREATE INDEX idx_journal_entries_tenant ON journal_entries (tenant_id);
CREATE INDEX idx_journal_entries_tenant_number ON journal_entries (tenant_id, entry_number);
CREATE INDEX idx_journal_entries_tenant_date ON journal_entries (tenant_id, date);
CREATE INDEX idx_journal_entries_tenant_type ON journal_entries (tenant_id, type);
CREATE INDEX idx_journal_entries_tenant_status ON journal_entries (tenant_id, status);
CREATE INDEX idx_journal_entries_reference ON journal_entries (tenant_id, reference_type, reference_id);

CREATE INDEX idx_journal_lines_entry ON journal_lines (entry_id);
CREATE INDEX idx_journal_lines_account ON journal_lines (account_id);

CREATE INDEX idx_ar_tenant ON accounts_receivable (tenant_id);
CREATE INDEX idx_ar_tenant_customer ON accounts_receivable (tenant_id, customer_id);
CREATE INDEX idx_ar_tenant_status ON accounts_receivable (tenant_id, status);
CREATE INDEX idx_ar_tenant_due_date ON accounts_receivable (tenant_id, due_date);
CREATE INDEX idx_ar_tenant_aging ON accounts_receivable (tenant_id, aging_bucket);

CREATE INDEX idx_customer_payments_tenant ON customer_payments (tenant_id);
CREATE INDEX idx_customer_payments_ar ON customer_payments (ar_invoice_id);
CREATE INDEX idx_customer_payments_customer ON customer_payments (customer_id);

CREATE INDEX idx_ap_tenant ON accounts_payable (tenant_id);
CREATE INDEX idx_ap_tenant_vendor ON accounts_payable (tenant_id, vendor_id);
CREATE INDEX idx_ap_tenant_status ON accounts_payable (tenant_id, status);
CREATE INDEX idx_ap_tenant_due_date ON accounts_payable (tenant_id, due_date);
CREATE INDEX idx_ap_tenant_aging ON accounts_payable (tenant_id, aging_bucket);

CREATE INDEX idx_ap_payments_tenant ON ap_payments (tenant_id);
CREATE INDEX idx_ap_payments_bill ON ap_payments (ap_bill_id);
CREATE INDEX idx_ap_payments_vendor ON ap_payments (vendor_id);

CREATE INDEX idx_expenses_tenant ON expenses (tenant_id);
CREATE INDEX idx_expenses_tenant_number ON expenses (tenant_id, expense_number);
CREATE INDEX idx_expenses_tenant_status ON expenses (tenant_id, status);
CREATE INDEX idx_expenses_tenant_category ON expenses (tenant_id, category);
CREATE INDEX idx_expenses_tenant_date ON expenses (tenant_id, date);
CREATE INDEX idx_expenses_deleted_at ON expenses (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_expense_approvals_expense ON expense_approvals (expense_id);

CREATE INDEX idx_bank_accounts_tenant ON bank_accounts (tenant_id);

CREATE INDEX idx_bank_reconciliations_tenant ON bank_reconciliations (tenant_id);
CREATE INDEX idx_bank_reconciliations_account ON bank_reconciliations (bank_account_id);

CREATE INDEX idx_bank_transactions_reconciliation ON bank_transactions (reconciliation_id);
CREATE INDEX idx_bank_transactions_match ON bank_transactions (match_status);

CREATE INDEX idx_reconciliation_adjustments_reconciliation ON reconciliation_adjustments (reconciliation_id);

CREATE INDEX idx_vat_returns_tenant ON vat_returns (tenant_id);
CREATE INDEX idx_vat_returns_tenant_number ON vat_returns (tenant_id, return_number);
CREATE INDEX idx_vat_returns_tenant_period ON vat_returns (tenant_id, period_from, period_to);
CREATE INDEX idx_vat_returns_tenant_status ON vat_returns (tenant_id, status);

-- ==================== HR ====================
CREATE INDEX idx_branches_tenant ON branches (tenant_id);
CREATE INDEX idx_branches_tenant_code ON branches (tenant_id, code);

CREATE INDEX idx_departments_tenant ON departments (tenant_id);
CREATE INDEX idx_departments_tenant_code ON departments (tenant_id, code);

CREATE INDEX idx_designations_tenant ON designations (tenant_id);
CREATE INDEX idx_designations_department ON designations (department_id);

CREATE INDEX idx_employees_tenant ON employees (tenant_id);
CREATE INDEX idx_employees_tenant_id_number ON employees (tenant_id, employee_id_number);
CREATE INDEX idx_employees_tenant_department ON employees (tenant_id, department_id);
CREATE INDEX idx_employees_tenant_branch ON employees (tenant_id, branch_id);
CREATE INDEX idx_employees_tenant_status ON employees (tenant_id, status);
CREATE INDEX idx_employees_reporting_manager ON employees (reporting_manager_id);
CREATE INDEX idx_employees_deleted_at ON employees (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_attendance_tenant ON attendance_records (tenant_id);
CREATE INDEX idx_attendance_tenant_employee_date ON attendance_records (tenant_id, employee_id, date);
CREATE INDEX idx_attendance_tenant_date ON attendance_records (tenant_id, date);
CREATE INDEX idx_attendance_tenant_status ON attendance_records (tenant_id, status);

CREATE INDEX idx_attendance_reg_tenant ON attendance_regularizations (tenant_id);
CREATE INDEX idx_attendance_reg_employee ON attendance_regularizations (employee_id);

CREATE INDEX idx_leave_types_tenant ON leave_types (tenant_id);

CREATE INDEX idx_leave_balances_tenant ON leave_balances (tenant_id);
CREATE INDEX idx_leave_balances_employee_year ON leave_balances (tenant_id, employee_id, year);

CREATE INDEX idx_leave_requests_tenant ON leave_requests (tenant_id);
CREATE INDEX idx_leave_requests_employee ON leave_requests (tenant_id, employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests (tenant_id, status);
CREATE INDEX idx_leave_requests_dates ON leave_requests (tenant_id, start_date, end_date);

CREATE INDEX idx_payroll_runs_tenant ON payroll_runs (tenant_id);
CREATE INDEX idx_payroll_runs_tenant_month_year ON payroll_runs (tenant_id, year, month);

CREATE INDEX idx_payslips_tenant ON payslips (tenant_id);
CREATE INDEX idx_payslips_payroll_run ON payslips (payroll_run_id);
CREATE INDEX idx_payslips_employee ON payslips (tenant_id, employee_id);
CREATE INDEX idx_payslips_month_year ON payslips (tenant_id, year, month);

CREATE INDEX idx_eosb_tenant ON eosb_records (tenant_id);
CREATE INDEX idx_eosb_employee ON eosb_records (employee_id);

CREATE INDEX idx_employee_documents_tenant ON employee_documents (tenant_id);
CREATE INDEX idx_employee_documents_employee ON employee_documents (employee_id);
CREATE INDEX idx_employee_documents_expiry ON employee_documents (expiry_date) WHERE expiry_date IS NOT NULL;

CREATE INDEX idx_performance_reviews_tenant ON performance_reviews (tenant_id);
CREATE INDEX idx_performance_reviews_employee ON performance_reviews (tenant_id, employee_id);
CREATE INDEX idx_performance_reviews_year ON performance_reviews (tenant_id, year);

-- ==================== JOBS ====================
CREATE INDEX idx_jobs_tenant ON jobs (tenant_id);
CREATE INDEX idx_jobs_tenant_number ON jobs (tenant_id, job_number);
CREATE INDEX idx_jobs_tenant_status ON jobs (tenant_id, status);
CREATE INDEX idx_jobs_tenant_customer ON jobs (tenant_id, customer_id);
CREATE INDEX idx_jobs_tenant_scheduled ON jobs (tenant_id, scheduled_date);
CREATE INDEX idx_jobs_tenant_technician ON jobs (tenant_id, assigned_technician_id);
CREATE INDEX idx_jobs_tenant_priority ON jobs (tenant_id, priority);
CREATE INDEX idx_jobs_deleted_at ON jobs (deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_job_technicians_job ON job_technicians (job_id);
CREATE INDEX idx_job_technicians_technician ON job_technicians (technician_id);

CREATE INDEX idx_job_attachments_job ON job_attachments (job_id);

CREATE INDEX idx_job_status_history_job ON job_status_history (job_id);

CREATE INDEX idx_technicians_tenant ON technicians (tenant_id);
CREATE INDEX idx_technicians_employee ON technicians (employee_id);
CREATE INDEX idx_technicians_tenant_status ON technicians (tenant_id, status);

CREATE INDEX idx_technician_skills_technician ON technician_skills (technician_id);

CREATE INDEX idx_service_reports_tenant ON service_reports (tenant_id);
CREATE INDEX idx_service_reports_tenant_number ON service_reports (tenant_id, report_number);
CREATE INDEX idx_service_reports_job ON service_reports (job_id);

CREATE INDEX idx_customer_feedbacks_tenant ON customer_feedbacks (tenant_id);
CREATE INDEX idx_customer_feedbacks_job ON customer_feedbacks (job_id);
CREATE INDEX idx_customer_feedbacks_customer ON customer_feedbacks (customer_id);

-- ==================== DISPATCHER ====================
CREATE INDEX idx_technician_locations_tenant ON technician_locations (tenant_id);
CREATE INDEX idx_technician_locations_technician ON technician_locations (technician_id);
CREATE INDEX idx_technician_locations_updated ON technician_locations (updated_at);

CREATE INDEX idx_job_assignment_logs_tenant ON job_assignment_logs (tenant_id);
CREATE INDEX idx_job_assignment_logs_job ON job_assignment_logs (job_id);
CREATE INDEX idx_job_assignment_logs_technician ON job_assignment_logs (technician_id);

-- ==================== SETTINGS ====================
CREATE INDEX idx_company_profiles_tenant ON company_profiles (tenant_id);

CREATE INDEX idx_integrations_tenant ON integrations (tenant_id);
CREATE INDEX idx_integrations_tenant_category ON integrations (tenant_id, category);

CREATE INDEX idx_audit_logs_tenant ON audit_logs (tenant_id);
CREATE INDEX idx_audit_logs_tenant_module ON audit_logs (tenant_id, module, created_at);
CREATE INDEX idx_audit_logs_tenant_user ON audit_logs (tenant_id, user_id, created_at);
CREATE INDEX idx_audit_logs_tenant_action ON audit_logs (tenant_id, action, created_at);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);

-- ==================== GIN INDEXES (JSONB & TEXT[]) ====================

-- JSONB columns
CREATE INDEX idx_customers_address_gin ON customers USING gin (address);
CREATE INDEX idx_customers_tags_gin ON customers USING gin (tags);
CREATE INDEX idx_leads_tags_gin ON leads USING gin (tags);
CREATE INDEX idx_employees_salary_gin ON employees USING gin (salary);
CREATE INDEX idx_employees_visa_gin ON employees USING gin (visa);
CREATE INDEX idx_employees_emirates_id_gin ON employees USING gin (emirates_id);
CREATE INDEX idx_vendors_categories_gin ON vendors USING gin (categories);
CREATE INDEX idx_vat_returns_boxes_gin ON vat_returns USING gin (boxes);
CREATE INDEX idx_audit_logs_details_gin ON audit_logs USING gin (details);
CREATE INDEX idx_audit_logs_changes_gin ON audit_logs USING gin (changes);

-- TEXT[] arrays
CREATE INDEX idx_tenants_modules_gin ON tenants USING gin (enabled_modules);
CREATE INDEX idx_users_permissions_gin ON users USING gin (permissions);
CREATE INDEX idx_roles_permissions_gin ON roles USING gin (permissions);
