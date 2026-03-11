-- ============================================================
-- 15_seed.sql
-- Default seed data for the UAE ERP system
-- ============================================================

-- ============================================================
-- 1. Default Permissions (CRUD per module)
-- ============================================================
INSERT INTO permissions (module, action, label, description) VALUES
  -- Dashboard
  ('dashboard', 'view', 'View Dashboard', 'Access the main dashboard'),
  -- CRM
  ('crm', 'view', 'View CRM', 'View customers and leads'),
  ('crm', 'create', 'Create CRM Records', 'Create customers and leads'),
  ('crm', 'update', 'Update CRM Records', 'Edit customers and leads'),
  ('crm', 'delete', 'Delete CRM Records', 'Delete customers and leads'),
  ('crm', 'export', 'Export CRM Data', 'Export customer/lead data'),
  -- Sales
  ('sales', 'view', 'View Sales', 'View quotations and invoices'),
  ('sales', 'create', 'Create Sales Records', 'Create quotations and invoices'),
  ('sales', 'update', 'Update Sales Records', 'Edit quotations and invoices'),
  ('sales', 'delete', 'Delete Sales Records', 'Delete quotations and invoices'),
  ('sales', 'approve', 'Approve Sales', 'Approve quotations'),
  ('sales', 'export', 'Export Sales Data', 'Export sales data'),
  -- Inventory
  ('inventory', 'view', 'View Inventory', 'View items and stock levels'),
  ('inventory', 'create', 'Create Inventory Records', 'Add items and stock movements'),
  ('inventory', 'update', 'Update Inventory Records', 'Edit items and warehouses'),
  ('inventory', 'delete', 'Delete Inventory Records', 'Delete items'),
  ('inventory', 'adjust', 'Adjust Stock', 'Make stock adjustments'),
  ('inventory', 'transfer', 'Transfer Stock', 'Transfer stock between warehouses'),
  -- Purchase
  ('purchase', 'view', 'View Purchases', 'View vendors and purchase orders'),
  ('purchase', 'create', 'Create Purchase Records', 'Create POs and GRNs'),
  ('purchase', 'update', 'Update Purchase Records', 'Edit POs and vendor info'),
  ('purchase', 'delete', 'Delete Purchase Records', 'Delete purchase records'),
  ('purchase', 'approve', 'Approve Purchases', 'Approve purchase orders'),
  ('purchase', 'receive', 'Receive Goods', 'Create goods received notes'),
  -- Accounts
  ('accounts', 'view', 'View Accounts', 'View financial records'),
  ('accounts', 'create', 'Create Accounting Records', 'Create journal entries and payments'),
  ('accounts', 'update', 'Update Accounting Records', 'Edit financial records'),
  ('accounts', 'delete', 'Delete Accounting Records', 'Delete financial records'),
  ('accounts', 'approve', 'Approve Accounting', 'Approve expenses and journal entries'),
  ('accounts', 'reconcile', 'Reconcile Bank', 'Perform bank reconciliations'),
  ('accounts', 'vat', 'Manage VAT', 'Prepare and file VAT returns'),
  -- HR
  ('hr', 'view', 'View HR', 'View employee records'),
  ('hr', 'create', 'Create HR Records', 'Add employees and HR data'),
  ('hr', 'update', 'Update HR Records', 'Edit employee information'),
  ('hr', 'delete', 'Delete HR Records', 'Delete HR records'),
  ('hr', 'approve-leave', 'Approve Leave', 'Approve leave requests'),
  ('hr', 'process-payroll', 'Process Payroll', 'Run and approve payroll'),
  ('hr', 'view-salary', 'View Salary Details', 'Access salary information'),
  -- Jobs
  ('jobs', 'view', 'View Jobs', 'View service jobs'),
  ('jobs', 'create', 'Create Jobs', 'Create service jobs'),
  ('jobs', 'update', 'Update Jobs', 'Edit service jobs'),
  ('jobs', 'delete', 'Delete Jobs', 'Delete service jobs'),
  ('jobs', 'assign', 'Assign Technicians', 'Assign technicians to jobs'),
  ('jobs', 'complete', 'Complete Jobs', 'Mark jobs as completed'),
  -- Dispatcher
  ('dispatcher', 'view', 'View Dispatcher', 'Access the dispatcher console'),
  ('dispatcher', 'assign', 'Dispatch Jobs', 'Assign and dispatch jobs to technicians'),
  -- Settings
  ('settings', 'view', 'View Settings', 'View system settings'),
  ('settings', 'update', 'Update Settings', 'Modify system settings'),
  ('settings', 'manage-users', 'Manage Users', 'Add, edit, delete users'),
  ('settings', 'manage-roles', 'Manage Roles', 'Configure roles and permissions'),
  ('settings', 'integrations', 'Manage Integrations', 'Configure third-party integrations'),
  ('settings', 'billing', 'Manage Billing', 'Manage subscription and billing');

-- ============================================================
-- 2. Sample Tenant (for development/testing)
-- ============================================================
INSERT INTO tenants (id, name, name_ar, slug, trn, status, plan, enabled_modules, max_users, trial_ends_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'OptifyServe Solutions LLC',
  'أوبتيفاي سيرف سوليوشنز',
  'optifyserve-solutions',
  '100234567890003',
  'active',
  'enterprise',
  ARRAY['dashboard','crm','sales','inventory','purchase','accounts','hr','jobs','dispatcher','settings'],
  50,
  now() + interval '30 days'
);

-- ============================================================
-- 3. Default Admin User (password: Admin@123)
-- Password hash is bcrypt of 'Admin@123'
-- ============================================================
INSERT INTO users (id, tenant_id, email, password_hash, name, role, permissions, status, phone, department)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'admin@optifyserve.com',
  '$2a$12$LQv3c1yqBo9SkvXS7QTJPOoGS3J4FQ2g0xV1qL7FOqD5A3bM3myam',  -- Admin@123
  'System Administrator',
  'admin',
  ARRAY['*'],  -- Full access
  'active',
  '+971501234567',
  'IT'
);

-- ============================================================
-- 4. Default System Roles
-- ============================================================
INSERT INTO roles (tenant_id, name, description, permissions, is_system) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'Administrator',
  'Full system access',
  ARRAY['*'],
  true
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Manager',
  'Department manager with broad access',
  ARRAY[
    'dashboard:view', 'crm:view', 'crm:create', 'crm:update', 'crm:export',
    'sales:view', 'sales:create', 'sales:update', 'sales:approve', 'sales:export',
    'inventory:view', 'inventory:create', 'inventory:update', 'inventory:adjust', 'inventory:transfer',
    'purchase:view', 'purchase:create', 'purchase:update', 'purchase:approve', 'purchase:receive',
    'accounts:view', 'accounts:create', 'accounts:update', 'accounts:approve',
    'hr:view', 'hr:create', 'hr:update', 'hr:approve-leave', 'hr:view-salary',
    'jobs:view', 'jobs:create', 'jobs:update', 'jobs:assign', 'jobs:complete',
    'dispatcher:view', 'dispatcher:assign',
    'settings:view'
  ],
  true
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Staff',
  'Regular staff member',
  ARRAY[
    'dashboard:view',
    'crm:view', 'crm:create', 'crm:update',
    'sales:view', 'sales:create', 'sales:update',
    'inventory:view',
    'purchase:view', 'purchase:create',
    'accounts:view',
    'hr:view',
    'jobs:view', 'jobs:create', 'jobs:update'
  ],
  true
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Technician',
  'Field technician with limited access',
  ARRAY[
    'dashboard:view',
    'jobs:view', 'jobs:update', 'jobs:complete',
    'inventory:view'
  ],
  true
);

-- ============================================================
-- 5. Default Leave Types (UAE Labor Law)
-- ============================================================
INSERT INTO leave_types (tenant_id, type_id, name, days_per_year, is_paid, pay_percentage, requires_medical_certificate, min_service_days_required, carry_forward, max_carry_forward_days, encashable) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'annual', 'Annual Leave', 30, true, 100, false, 365, true, 15, true
),
(
  'a0000000-0000-0000-0000-000000000001',
  'sick', 'Sick Leave', 90, true, 100, true, 90, false, 0, false
  -- Note: UAE sick leave is 15 days full pay, 30 half pay, 45 unpaid. Simplified here.
),
(
  'a0000000-0000-0000-0000-000000000001',
  'maternity', 'Maternity Leave', 60, true, 100, true, 365, false, 0, false
),
(
  'a0000000-0000-0000-0000-000000000001',
  'paternity', 'Paternity Leave', 5, true, 100, false, 0, false, 0, false
),
(
  'a0000000-0000-0000-0000-000000000001',
  'compassionate', 'Compassionate Leave', 5, true, 100, false, 0, false, 0, false
),
(
  'a0000000-0000-0000-0000-000000000001',
  'hajj', 'Hajj Leave', 30, false, 0, false, 365, false, 0, false
),
(
  'a0000000-0000-0000-0000-000000000001',
  'unpaid', 'Unpaid Leave', 365, false, 0, false, 0, false, 0, false
),
(
  'a0000000-0000-0000-0000-000000000001',
  'study', 'Study Leave', 10, true, 100, false, 730, false, 0, false
),
(
  'a0000000-0000-0000-0000-000000000001',
  'emergency', 'Emergency Leave', 5, true, 100, false, 0, false, 0, false
);

-- ============================================================
-- 6. Default Chart of Accounts (UAE Standard Template)
-- ============================================================
DO $$
DECLARE
  t_id UUID := 'a0000000-0000-0000-0000-000000000001';
  u_id UUID := 'b0000000-0000-0000-0000-000000000001';
BEGIN

-- ASSETS (1xxx)
INSERT INTO chart_of_accounts (tenant_id, code, name, type, category, is_system_account, created_by) VALUES
(t_id, '1000', 'Assets', 'asset', 'current-assets', true, u_id),
(t_id, '1100', 'Current Assets', 'asset', 'current-assets', true, u_id),
(t_id, '1110', 'Cash on Hand', 'asset', 'current-assets', true, u_id),
(t_id, '1120', 'Bank Accounts', 'asset', 'current-assets', true, u_id),
(t_id, '1121', 'Main Operating Account', 'asset', 'current-assets', false, u_id),
(t_id, '1122', 'Payroll Account', 'asset', 'current-assets', false, u_id),
(t_id, '1130', 'Accounts Receivable', 'asset', 'current-assets', true, u_id),
(t_id, '1140', 'Inventory', 'asset', 'current-assets', true, u_id),
(t_id, '1150', 'Prepaid Expenses', 'asset', 'current-assets', false, u_id),
(t_id, '1160', 'VAT Input (Recoverable)', 'asset', 'current-assets', true, u_id),
(t_id, '1170', 'Employee Advances', 'asset', 'current-assets', false, u_id),
(t_id, '1200', 'Fixed Assets', 'asset', 'fixed-assets', true, u_id),
(t_id, '1210', 'Vehicles', 'asset', 'fixed-assets', false, u_id),
(t_id, '1220', 'Equipment & Tools', 'asset', 'fixed-assets', false, u_id),
(t_id, '1230', 'Furniture & Fixtures', 'asset', 'fixed-assets', false, u_id),
(t_id, '1240', 'Computer Equipment', 'asset', 'fixed-assets', false, u_id),
(t_id, '1250', 'Accumulated Depreciation', 'asset', 'fixed-assets', true, u_id);

-- LIABILITIES (2xxx)
INSERT INTO chart_of_accounts (tenant_id, code, name, type, category, is_system_account, created_by) VALUES
(t_id, '2000', 'Liabilities', 'liability', 'current-liabilities', true, u_id),
(t_id, '2100', 'Current Liabilities', 'liability', 'current-liabilities', true, u_id),
(t_id, '2110', 'Accounts Payable', 'liability', 'current-liabilities', true, u_id),
(t_id, '2120', 'Accrued Expenses', 'liability', 'current-liabilities', false, u_id),
(t_id, '2130', 'VAT Output (Payable)', 'liability', 'current-liabilities', true, u_id),
(t_id, '2140', 'Salaries Payable', 'liability', 'current-liabilities', true, u_id),
(t_id, '2150', 'End of Service Benefits', 'liability', 'current-liabilities', true, u_id),
(t_id, '2160', 'Customer Deposits', 'liability', 'current-liabilities', false, u_id),
(t_id, '2170', 'Short-term Loans', 'liability', 'current-liabilities', false, u_id),
(t_id, '2200', 'Long-term Liabilities', 'liability', 'long-term-liabilities', true, u_id),
(t_id, '2210', 'Long-term Loans', 'liability', 'long-term-liabilities', false, u_id);

-- EQUITY (3xxx)
INSERT INTO chart_of_accounts (tenant_id, code, name, type, category, is_system_account, created_by) VALUES
(t_id, '3000', 'Equity', 'equity', 'owner-equity', true, u_id),
(t_id, '3100', 'Owner Capital', 'equity', 'owner-equity', true, u_id),
(t_id, '3200', 'Owner Drawings', 'equity', 'owner-equity', false, u_id),
(t_id, '3300', 'Retained Earnings', 'equity', 'retained-earnings', true, u_id),
(t_id, '3400', 'Current Year Profit/Loss', 'equity', 'retained-earnings', true, u_id);

-- REVENUE (4xxx)
INSERT INTO chart_of_accounts (tenant_id, code, name, type, category, is_system_account, created_by) VALUES
(t_id, '4000', 'Revenue', 'revenue', 'operating-revenue', true, u_id),
(t_id, '4100', 'Service Revenue', 'revenue', 'operating-revenue', true, u_id),
(t_id, '4110', 'AC Maintenance Revenue', 'revenue', 'operating-revenue', false, u_id),
(t_id, '4120', 'Plumbing Revenue', 'revenue', 'operating-revenue', false, u_id),
(t_id, '4130', 'Electrical Revenue', 'revenue', 'operating-revenue', false, u_id),
(t_id, '4140', 'General Maintenance Revenue', 'revenue', 'operating-revenue', false, u_id),
(t_id, '4150', 'Cleaning Revenue', 'revenue', 'operating-revenue', false, u_id),
(t_id, '4160', 'Pest Control Revenue', 'revenue', 'operating-revenue', false, u_id),
(t_id, '4200', 'Parts & Materials Revenue', 'revenue', 'operating-revenue', false, u_id),
(t_id, '4300', 'AMC Contract Revenue', 'revenue', 'operating-revenue', false, u_id),
(t_id, '4900', 'Other Revenue', 'revenue', 'other-revenue', false, u_id),
(t_id, '4910', 'Late Payment Fees', 'revenue', 'other-revenue', false, u_id);

-- COST OF GOODS/SERVICES (5xxx)
INSERT INTO chart_of_accounts (tenant_id, code, name, type, category, is_system_account, created_by) VALUES
(t_id, '5000', 'Cost of Services', 'expense', 'cost-of-goods', true, u_id),
(t_id, '5100', 'Direct Labor', 'expense', 'cost-of-goods', true, u_id),
(t_id, '5200', 'Parts & Materials Used', 'expense', 'cost-of-goods', true, u_id),
(t_id, '5300', 'Subcontractor Costs', 'expense', 'cost-of-goods', false, u_id),
(t_id, '5400', 'Vehicle Running Costs', 'expense', 'cost-of-goods', false, u_id);

-- OPERATING EXPENSES (6xxx)
INSERT INTO chart_of_accounts (tenant_id, code, name, type, category, is_system_account, created_by) VALUES
(t_id, '6000', 'Operating Expenses', 'expense', 'operating-expenses', true, u_id),
(t_id, '6100', 'Salaries & Wages', 'expense', 'operating-expenses', true, u_id),
(t_id, '6110', 'Basic Salaries', 'expense', 'operating-expenses', false, u_id),
(t_id, '6120', 'Housing Allowance', 'expense', 'operating-expenses', false, u_id),
(t_id, '6130', 'Transport Allowance', 'expense', 'operating-expenses', false, u_id),
(t_id, '6140', 'Other Allowances', 'expense', 'operating-expenses', false, u_id),
(t_id, '6150', 'Overtime', 'expense', 'operating-expenses', false, u_id),
(t_id, '6160', 'End of Service Gratuity', 'expense', 'operating-expenses', false, u_id),
(t_id, '6200', 'Rent', 'expense', 'operating-expenses', false, u_id),
(t_id, '6210', 'Office Rent', 'expense', 'operating-expenses', false, u_id),
(t_id, '6220', 'Warehouse Rent', 'expense', 'operating-expenses', false, u_id),
(t_id, '6300', 'Utilities', 'expense', 'operating-expenses', false, u_id),
(t_id, '6310', 'DEWA / Electricity & Water', 'expense', 'operating-expenses', false, u_id),
(t_id, '6320', 'Internet & Phone', 'expense', 'operating-expenses', false, u_id),
(t_id, '6400', 'Insurance', 'expense', 'operating-expenses', false, u_id),
(t_id, '6410', 'Medical Insurance', 'expense', 'operating-expenses', false, u_id),
(t_id, '6420', 'Vehicle Insurance', 'expense', 'operating-expenses', false, u_id),
(t_id, '6430', 'General Insurance', 'expense', 'operating-expenses', false, u_id),
(t_id, '6500', 'Visa & Labor Costs', 'expense', 'operating-expenses', false, u_id),
(t_id, '6600', 'Marketing & Advertising', 'expense', 'operating-expenses', false, u_id),
(t_id, '6700', 'Office Supplies', 'expense', 'operating-expenses', false, u_id),
(t_id, '6800', 'Professional Fees', 'expense', 'operating-expenses', false, u_id),
(t_id, '6810', 'Audit & Accounting Fees', 'expense', 'operating-expenses', false, u_id),
(t_id, '6820', 'Legal Fees', 'expense', 'operating-expenses', false, u_id),
(t_id, '6830', 'Consultancy Fees', 'expense', 'operating-expenses', false, u_id),
(t_id, '6900', 'Depreciation Expense', 'expense', 'operating-expenses', true, u_id),
(t_id, '6950', 'Bank Charges', 'expense', 'other-expenses', false, u_id),
(t_id, '6960', 'Miscellaneous Expenses', 'expense', 'other-expenses', false, u_id);

-- Set parent_id relationships for chart of accounts hierarchy
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '1000' AND tenant_id = t_id) WHERE code = '1100' AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '1100' AND tenant_id = t_id) WHERE code IN ('1110','1120','1130','1140','1150','1160','1170') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '1120' AND tenant_id = t_id) WHERE code IN ('1121','1122') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '1000' AND tenant_id = t_id) WHERE code = '1200' AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '1200' AND tenant_id = t_id) WHERE code IN ('1210','1220','1230','1240','1250') AND tenant_id = t_id;

UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '2000' AND tenant_id = t_id) WHERE code = '2100' AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '2100' AND tenant_id = t_id) WHERE code IN ('2110','2120','2130','2140','2150','2160','2170') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '2000' AND tenant_id = t_id) WHERE code = '2200' AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '2200' AND tenant_id = t_id) WHERE code = '2210' AND tenant_id = t_id;

UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '3000' AND tenant_id = t_id) WHERE code IN ('3100','3200','3300','3400') AND tenant_id = t_id;

UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '4000' AND tenant_id = t_id) WHERE code = '4100' AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '4100' AND tenant_id = t_id) WHERE code IN ('4110','4120','4130','4140','4150','4160') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '4000' AND tenant_id = t_id) WHERE code IN ('4200','4300','4900') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '4900' AND tenant_id = t_id) WHERE code = '4910' AND tenant_id = t_id;

UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '5000' AND tenant_id = t_id) WHERE code IN ('5100','5200','5300','5400') AND tenant_id = t_id;

UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '6000' AND tenant_id = t_id) WHERE code = '6100' AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '6100' AND tenant_id = t_id) WHERE code IN ('6110','6120','6130','6140','6150','6160') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '6000' AND tenant_id = t_id) WHERE code IN ('6200','6300','6400','6500','6600','6700','6800','6900','6950','6960') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '6200' AND tenant_id = t_id) WHERE code IN ('6210','6220') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '6300' AND tenant_id = t_id) WHERE code IN ('6310','6320') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '6400' AND tenant_id = t_id) WHERE code IN ('6410','6420','6430') AND tenant_id = t_id;
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '6800' AND tenant_id = t_id) WHERE code IN ('6810','6820','6830') AND tenant_id = t_id;

END;
$$;

-- ============================================================
-- 7. Default Shifts
-- ============================================================
INSERT INTO shifts (tenant_id, name, type, start_time, end_time, break_duration_minutes, grace_minutes) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'Morning Shift', 'morning', '08:00', '17:00', 60, 15
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Evening Shift', 'evening', '14:00', '23:00', 60, 15
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Night Shift', 'night', '22:00', '07:00', 60, 15
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Split Shift', 'split', '08:00', '20:00', 180, 15
),
(
  'a0000000-0000-0000-0000-000000000001',
  'Flexible', 'flexible', '07:00', '19:00', 60, 30
);

-- ============================================================
-- 8. Default Company Profile
-- ============================================================
INSERT INTO company_profiles (
  tenant_id, name, name_ar, email, phone, website, trn,
  business_type, business_hours, address, bank_details, settings, created_by
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'OptifyServe Solutions LLC',
  'أوبتيفاي سيرف سوليوشنز',
  'info@optifyserve.com',
  '+97142345678',
  'www.optifyserve.com',
  '100234567890003',
  'maintenance',
  '{"sunday": {"open": "08:00", "close": "18:00"}, "monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": "closed", "saturday": {"open": "09:00", "close": "14:00"}}',
  '{"street": "Business Bay", "building": "Tower A, Office 1205", "city": "Dubai", "emirate": "Dubai", "country": "UAE", "po_box": "12345"}',
  '{"bank_name": "Emirates NBD", "account_name": "OptifyServe Solutions LLC", "account_number": "1234567890", "iban": "AE070331234567890123456", "swift_code": "EABORAEAD"}',
  '{"currency": "AED", "vat_rate": 5, "fiscal_year_start": "01-01", "date_format": "DD/MM/YYYY", "timezone": "Asia/Dubai"}',
  'b0000000-0000-0000-0000-000000000001'
);

-- ============================================================
-- 9. Default Security Settings
-- ============================================================
INSERT INTO security_settings (tenant_id) VALUES
('a0000000-0000-0000-0000-000000000001');

-- ============================================================
-- 10. Default Backup Settings
-- ============================================================
INSERT INTO backup_settings (tenant_id) VALUES
('a0000000-0000-0000-0000-000000000001');

-- ============================================================
-- 11. Default Theme Settings
-- ============================================================
INSERT INTO theme_settings (tenant_id, colors) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  '{"primary": "#4f46e5", "sidebar": "#0f172a", "success": "#16a34a", "warning": "#d97706", "error": "#dc2626"}'
);

-- ============================================================
-- 12. Default Branch
-- ============================================================
INSERT INTO branches (tenant_id, code, name, address, is_default, created_by) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'HQ',
  'Head Office - Dubai',
  '{"street": "Business Bay", "city": "Dubai", "emirate": "Dubai", "country": "UAE"}',
  true,
  'b0000000-0000-0000-0000-000000000001'
);

-- ============================================================
-- 13. Default Warehouse
-- ============================================================
INSERT INTO warehouses (tenant_id, name, code, type, is_default, address, created_by) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'Main Warehouse',
  'WH-MAIN',
  'main',
  true,
  '{"street": "Al Quoz Industrial Area", "city": "Dubai", "emirate": "Dubai", "country": "UAE"}',
  'b0000000-0000-0000-0000-000000000001'
);
