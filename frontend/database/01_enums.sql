-- ============================================================
-- 01_enums.sql
-- All PostgreSQL enum types mapped from frontend TypeScript unions
-- ============================================================

-- ==================== AUTH ====================
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff', 'technician');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- ==================== CRM ====================
CREATE TYPE customer_type AS ENUM ('individual', 'corporate', 'government');
CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'blocked');
CREATE TYPE lead_source AS ENUM ('website', 'referral', 'cold-call', 'exhibition', 'whatsapp', 'social-media', 'advertisement', 'other');
CREATE TYPE lead_stage AS ENUM ('new', 'follow-up', 'qualified', 'closed-won', 'closed-lost');
CREATE TYPE lead_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE follow_up_type AS ENUM ('call', 'email', 'meeting', 'whatsapp', 'site-visit');
CREATE TYPE follow_up_status AS ENUM ('scheduled', 'completed', 'missed', 'cancelled');

-- ==================== SALES ====================
CREATE TYPE quotation_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'viewed', 'partially-paid', 'paid', 'overdue', 'cancelled', 'credited');
CREATE TYPE payment_method AS ENUM ('cash', 'bank-transfer', 'cheque', 'credit-card', 'online');
CREATE TYPE payment_terms AS ENUM ('immediate', 'net-15', 'net-30', 'net-45', 'net-60', 'net-90', 'custom');
CREATE TYPE vat_status AS ENUM ('standard', 'zero-rated', 'exempt', 'out-of-scope', 'reverse-charge');
CREATE TYPE vat_emirate AS ENUM ('dubai', 'abu-dhabi', 'sharjah', 'ajman', 'rak', 'uaq', 'fujairah');

-- ==================== INVENTORY ====================
CREATE TYPE item_status AS ENUM ('active', 'inactive', 'discontinued');
CREATE TYPE unit_of_measure AS ENUM ('piece', 'set', 'box', 'kg', 'gram', 'liter', 'ml', 'meter', 'sqm', 'hour', 'day', 'service');
CREATE TYPE stock_movement_type AS ENUM ('in', 'out', 'transfer', 'adjustment', 'return', 'consumption');
CREATE TYPE adjustment_reason AS ENUM ('damage', 'expired', 'theft', 'count-correction', 'quality-issue', 'write-off', 'other');
CREATE TYPE warehouse_type AS ENUM ('main', 'branch', 'vehicle', 'virtual');
CREATE TYPE warehouse_status AS ENUM ('active', 'inactive', 'maintenance');

-- ==================== PURCHASE ====================
CREATE TYPE vendor_status AS ENUM ('active', 'inactive', 'blocked', 'pending-approval');
CREATE TYPE vendor_category AS ENUM ('spare-parts', 'tools-equipment', 'consumables', 'services', 'raw-materials', 'office-supplies', 'it-equipment', 'other');
CREATE TYPE vendor_payment_terms AS ENUM ('immediate', 'net-15', 'net-30', 'net-45', 'net-60', 'net-90');
CREATE TYPE po_status AS ENUM ('draft', 'pending-approval', 'approved', 'sent', 'partially-received', 'fully-received', 'cancelled', 'closed');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE approval_level AS ENUM ('level-1', 'level-2', 'level-3');
CREATE TYPE grn_status AS ENUM ('draft', 'inspecting', 'completed', 'partial');
CREATE TYPE purchase_return_status AS ENUM ('draft', 'pending-approval', 'approved', 'shipped', 'completed', 'cancelled');
CREATE TYPE return_reason AS ENUM ('defective', 'wrong-item', 'damaged', 'quality-issue', 'excess-quantity', 'other');
CREATE TYPE return_type AS ENUM ('full', 'partial');
CREATE TYPE vendor_payment_method AS ENUM ('bank-transfer', 'cheque', 'cash', 'credit-card', 'online');
CREATE TYPE vendor_payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- ==================== ACCOUNTS ====================
CREATE TYPE account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');
CREATE TYPE account_category AS ENUM (
  'current-assets', 'fixed-assets', 'other-assets',
  'current-liabilities', 'long-term-liabilities',
  'owner-equity', 'retained-earnings',
  'operating-revenue', 'other-revenue',
  'cost-of-goods', 'operating-expenses', 'other-expenses'
);
CREATE TYPE account_status AS ENUM ('active', 'inactive', 'frozen');
CREATE TYPE ar_invoice_status AS ENUM ('open', 'partially-paid', 'paid', 'overdue', 'written-off');
CREATE TYPE ap_bill_status AS ENUM ('open', 'partially-paid', 'paid', 'overdue', 'disputed');
CREATE TYPE aging_bucket AS ENUM ('current', '1-30', '31-60', '61-90', '91-120', 'over-120');
CREATE TYPE expense_category AS ENUM (
  'rent', 'utilities', 'salaries', 'travel', 'office-supplies',
  'maintenance', 'insurance', 'marketing', 'professional-fees',
  'vehicle', 'communication', 'training', 'miscellaneous'
);
CREATE TYPE expense_status AS ENUM ('draft', 'pending-approval', 'approved', 'rejected', 'paid', 'cancelled');
CREATE TYPE expense_payment_method AS ENUM ('cash', 'bank-transfer', 'credit-card', 'petty-cash', 'company-card');
CREATE TYPE journal_entry_status AS ENUM ('draft', 'posted', 'reversed');
CREATE TYPE journal_entry_type AS ENUM ('standard', 'adjusting', 'closing', 'reversing', 'recurring', 'opening');
CREATE TYPE vat_return_period AS ENUM ('monthly', 'quarterly');
CREATE TYPE vat_return_status AS ENUM ('draft', 'pending-review', 'approved', 'filed', 'paid', 'amended');
CREATE TYPE bank_transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE match_status AS ENUM ('matched', 'unmatched', 'partially-matched');
CREATE TYPE reconciliation_status AS ENUM ('in-progress', 'completed', 'discrepancy');

-- ==================== HR ====================
CREATE TYPE employee_status AS ENUM ('active', 'probation', 'notice-period', 'terminated', 'resigned', 'absconded', 'suspended');
CREATE TYPE contract_type AS ENUM ('limited', 'unlimited', 'part-time', 'temporary', 'freelance');
CREATE TYPE gender AS ENUM ('male', 'female');
CREATE TYPE marital_status AS ENUM ('single', 'married', 'divorced', 'widowed');
CREATE TYPE visa_type AS ENUM ('employment', 'investor', 'partner', 'golden', 'freelance', 'green');
CREATE TYPE visa_status AS ENUM ('active', 'expired', 'cancelled', 'in-process', 'renewal');
CREATE TYPE labor_card_status AS ENUM ('active', 'expired', 'cancelled', 'in-process', 'renewal');
CREATE TYPE shift_type AS ENUM ('morning', 'evening', 'night', 'split', 'flexible', 'rotational');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'half-day', 'on-leave', 'holiday', 'weekend', 'work-from-home');
CREATE TYPE leave_type_id AS ENUM ('annual', 'sick', 'maternity', 'paternity', 'compassionate', 'hajj', 'unpaid', 'study', 'emergency');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE leave_duration AS ENUM ('full-day', 'half-day', 'hourly');
CREATE TYPE payroll_status AS ENUM ('draft', 'processing', 'processed', 'approved', 'paid', 'cancelled');
CREATE TYPE payslip_status AS ENUM ('draft', 'generated', 'approved', 'paid', 'cancelled');
CREATE TYPE allowance_type AS ENUM ('housing', 'transport', 'mobile', 'food', 'education', 'medical', 'other');
CREATE TYPE deduction_type AS ENUM ('absence', 'late', 'loan', 'advance', 'damage', 'other');
CREATE TYPE termination_reason AS ENUM ('resignation', 'termination', 'end-of-contract', 'redundancy', 'retirement', 'absconding', 'mutual-agreement');
CREATE TYPE eosb_status AS ENUM ('draft', 'calculated', 'approved', 'paid');
CREATE TYPE document_type_id AS ENUM ('emirates-id', 'passport', 'visa', 'labor-card', 'medical-insurance', 'driving-license', 'qualification', 'contract', 'other');
CREATE TYPE document_verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE review_period AS ENUM ('monthly', 'quarterly', 'semi-annual', 'annual');
CREATE TYPE review_status AS ENUM ('draft', 'self-assessment', 'manager-review', 'completed', 'acknowledged');
CREATE TYPE goal_status AS ENUM ('not-started', 'in-progress', 'completed', 'deferred', 'cancelled');

-- ==================== JOBS ====================
CREATE TYPE job_status AS ENUM ('pending', 'scheduled', 'in-progress', 'on-hold', 'completed', 'cancelled', 'invoiced');
CREATE TYPE job_priority AS ENUM ('low', 'medium', 'high', 'emergency');
CREATE TYPE service_type AS ENUM ('ac-repair', 'ac-maintenance', 'plumbing', 'electrical', 'painting', 'cleaning', 'pest-control', 'carpentry', 'masonry', 'general-maintenance', 'other');
CREATE TYPE recurring_frequency AS ENUM ('daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'semi-annual', 'annual');
CREATE TYPE emirate AS ENUM ('dubai', 'abu-dhabi', 'sharjah', 'ajman', 'rak', 'uaq', 'fujairah');
CREATE TYPE technician_status AS ENUM ('available', 'busy', 'on-leave', 'offline', 'en-route');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE checklist_item_status AS ENUM ('pending', 'passed', 'failed', 'skipped', 'not-applicable');
CREATE TYPE service_report_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
CREATE TYPE consumption_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE feedback_rating AS ENUM ('1', '2', '3', '4', '5');
CREATE TYPE feedback_category AS ENUM ('professionalism', 'quality', 'timeliness', 'communication', 'cleanliness');
CREATE TYPE calendar_view AS ENUM ('day', 'week', 'month');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled');

-- ==================== DISPATCHER ====================
CREATE TYPE map_marker_type AS ENUM ('technician', 'job', 'warehouse', 'branch');

-- ==================== SETTINGS ====================
CREATE TYPE subscription_plan AS ENUM ('starter', 'professional', 'enterprise', 'custom');
CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'trial', 'cancelled');
CREATE TYPE business_type AS ENUM ('maintenance', 'cleaning', 'pest-control', 'facilities-management', 'hvac', 'plumbing', 'electrical', 'general-trading', 'other');
CREATE TYPE integration_category AS ENUM ('accounting', 'payment', 'communication', 'maps', 'storage', 'analytics');
CREATE TYPE integration_status AS ENUM ('active', 'inactive', 'error', 'configuring');
CREATE TYPE settings_category AS ENUM ('general', 'notifications', 'security', 'integrations', 'billing', 'appearance');
