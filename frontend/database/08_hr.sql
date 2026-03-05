-- ============================================================
-- 08_hr.sql
-- Branches, departments, designations, employees, shifts,
-- attendance, leaves, payroll, EOSB, documents, performance
-- ============================================================

-- ==================== BRANCHES ====================
CREATE TABLE branches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code            VARCHAR(20) NOT NULL,
  name            VARCHAR(255) NOT NULL,
  address         JSONB NOT NULL DEFAULT '{}',
  contact_person  VARCHAR(255),
  phone           VARCHAR(20),
  email           VARCHAR(255),
  gps_coordinates JSONB,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, code)
);

-- ==================== DEPARTMENTS ====================
CREATE TABLE departments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  code        VARCHAR(20) NOT NULL,
  description TEXT,
  head_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  parent_id   UUID REFERENCES departments(id) ON DELETE SET NULL,
  branch_id   UUID REFERENCES branches(id) ON DELETE SET NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, code)
);

-- ==================== DESIGNATIONS ====================
CREATE TABLE designations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  code          VARCHAR(20) NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  level         INT,
  description   TEXT,
  status        VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code)
);

-- ==================== EMPLOYEES ====================
CREATE TABLE employees (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id_number    VARCHAR(20) NOT NULL,
  first_name            VARCHAR(100) NOT NULL,
  last_name             VARCHAR(100) NOT NULL,
  full_name             VARCHAR(201) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  email                 VARCHAR(255),
  phone                 VARCHAR(20),
  date_of_birth         DATE,
  gender                gender,
  marital_status        marital_status,
  nationality           VARCHAR(100),
  profile_photo_url     TEXT,
  join_date             DATE NOT NULL,
  probation_end_date    DATE,
  confirmation_date     DATE,
  termination_date      DATE,
  contract_type         contract_type NOT NULL DEFAULT 'limited',
  contract_start_date   DATE,
  contract_end_date     DATE,
  department_id         UUID REFERENCES departments(id) ON DELETE SET NULL,
  designation_id        UUID REFERENCES designations(id) ON DELETE SET NULL,
  branch_id             UUID REFERENCES branches(id) ON DELETE SET NULL,
  reporting_manager_id  UUID REFERENCES employees(id) ON DELETE SET NULL,
  status                employee_status NOT NULL DEFAULT 'active',
  -- Nested JSONB documents
  emirates_id           JSONB NOT NULL DEFAULT '{}',
  passport              JSONB NOT NULL DEFAULT '{}',
  visa                  JSONB NOT NULL DEFAULT '{}',
  labor_card            JSONB NOT NULL DEFAULT '{}',
  salary                JSONB NOT NULL DEFAULT '{}',
  bank_details          JSONB NOT NULL DEFAULT '{}',
  address               JSONB NOT NULL DEFAULT '{}',
  emergency_contact     JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at            TIMESTAMPTZ,
  UNIQUE (tenant_id, employee_id_number)
);

-- ==================== SHIFTS ====================
CREATE TABLE shifts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name                VARCHAR(100) NOT NULL,
  type                shift_type NOT NULL DEFAULT 'morning',
  start_time          TIME NOT NULL,
  end_time            TIME NOT NULL,
  break_duration_minutes INT NOT NULL DEFAULT 60,
  grace_minutes       INT NOT NULL DEFAULT 15,
  is_ramadan          BOOLEAN NOT NULL DEFAULT false,
  ramadan_start_time  TIME,
  ramadan_end_time    TIME,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== ATTENDANCE RECORDS ====================
CREATE TABLE attendance_records (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id              UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date                     DATE NOT NULL,
  shift_type               shift_type,
  check_in_time            TIMESTAMPTZ,
  check_out_time           TIMESTAMPTZ,
  check_in_location        JSONB,
  check_out_location       JSONB,
  status                   attendance_status NOT NULL DEFAULT 'present',
  working_hours            NUMERIC(5,2) NOT NULL DEFAULT 0,
  overtime_hours           NUMERIC(5,2) NOT NULL DEFAULT 0,
  late_minutes             INT NOT NULL DEFAULT 0,
  early_departure_minutes  INT NOT NULL DEFAULT 0,
  notes                    TEXT,
  is_manual_entry          BOOLEAN NOT NULL DEFAULT false,
  approved_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, employee_id, date)
);

-- ==================== ATTENDANCE REGULARIZATIONS ====================
CREATE TABLE attendance_regularizations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id         UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date                DATE NOT NULL,
  reason              TEXT NOT NULL,
  requested_check_in  TIMESTAMPTZ,
  requested_check_out TIMESTAMPTZ,
  status              VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  comments            TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== LEAVE TYPES ====================
CREATE TABLE leave_types (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type_id                     leave_type_id NOT NULL,
  name                        VARCHAR(100) NOT NULL,
  days_per_year               NUMERIC(5,1) NOT NULL DEFAULT 0,
  is_paid                     BOOLEAN NOT NULL DEFAULT true,
  pay_percentage              NUMERIC(5,2) NOT NULL DEFAULT 100,
  requires_medical_certificate BOOLEAN NOT NULL DEFAULT false,
  min_service_days_required   INT NOT NULL DEFAULT 0,
  carry_forward               BOOLEAN NOT NULL DEFAULT false,
  max_carry_forward_days      NUMERIC(5,1) NOT NULL DEFAULT 0,
  encashable                  BOOLEAN NOT NULL DEFAULT false,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, type_id)
);

-- ==================== LEAVE BALANCES ====================
CREATE TABLE leave_balances (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id     UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id   UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  year            INT NOT NULL,
  entitled        NUMERIC(5,1) NOT NULL DEFAULT 0,
  taken           NUMERIC(5,1) NOT NULL DEFAULT 0,
  pending         NUMERIC(5,1) NOT NULL DEFAULT 0,
  carried_forward NUMERIC(5,1) NOT NULL DEFAULT 0,
  balance         NUMERIC(5,1) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, employee_id, leave_type_id, year)
);

-- ==================== LEAVE REQUESTS ====================
CREATE TABLE leave_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id      UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id    UUID NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
  start_date       DATE NOT NULL,
  end_date         DATE NOT NULL,
  duration         leave_duration NOT NULL DEFAULT 'full-day',
  total_days       NUMERIC(5,1) NOT NULL DEFAULT 0,
  reason           TEXT,
  attachment_url   TEXT,
  status           leave_status NOT NULL DEFAULT 'pending',
  approver_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  approver_comments TEXT,
  approved_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== PAYROLL RUNS ====================
CREATE TABLE payroll_runs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  month            INT NOT NULL CHECK (month >= 1 AND month <= 12),
  year             INT NOT NULL,
  branch_id        UUID REFERENCES branches(id) ON DELETE SET NULL,
  department_id    UUID REFERENCES departments(id) ON DELETE SET NULL,
  total_employees  INT NOT NULL DEFAULT 0,
  total_earnings   NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_deductions NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_net_salary NUMERIC(15,2) NOT NULL DEFAULT 0,
  status           payroll_status NOT NULL DEFAULT 'draft',
  processed_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  processed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by       UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==================== PAYSLIPS ====================
CREATE TABLE payslips (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id      UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id         UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  month               INT NOT NULL CHECK (month >= 1 AND month <= 12),
  year                INT NOT NULL,
  basic_salary        NUMERIC(15,2) NOT NULL DEFAULT 0,
  housing_allowance   NUMERIC(15,2) NOT NULL DEFAULT 0,
  transport_allowance NUMERIC(15,2) NOT NULL DEFAULT 0,
  mobile_allowance    NUMERIC(15,2) NOT NULL DEFAULT 0,
  other_allowances    NUMERIC(15,2) NOT NULL DEFAULT 0,
  overtime_hours      NUMERIC(5,2) NOT NULL DEFAULT 0,
  overtime_rate       NUMERIC(15,2) NOT NULL DEFAULT 0,
  overtime_amount     NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_earnings      NUMERIC(15,2) NOT NULL DEFAULT 0,
  absence_deduction   NUMERIC(15,2) NOT NULL DEFAULT 0,
  late_deduction      NUMERIC(15,2) NOT NULL DEFAULT 0,
  loan_repayment      NUMERIC(15,2) NOT NULL DEFAULT 0,
  advance_recovery    NUMERIC(15,2) NOT NULL DEFAULT 0,
  other_deductions    NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_deductions    NUMERIC(15,2) NOT NULL DEFAULT 0,
  net_salary          NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_working_days  NUMERIC(5,1) NOT NULL DEFAULT 0,
  present_days        NUMERIC(5,1) NOT NULL DEFAULT 0,
  absent_days         NUMERIC(5,1) NOT NULL DEFAULT 0,
  leave_days          NUMERIC(5,1) NOT NULL DEFAULT 0,
  payment_method      VARCHAR(50),
  payment_date        DATE,
  bank_name           VARCHAR(100),
  account_number      VARCHAR(50),
  iban                VARCHAR(34),
  status              payslip_status NOT NULL DEFAULT 'draft',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== EOSB RECORDS ====================
CREATE TABLE eosb_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id         UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  calculation_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  join_date           DATE NOT NULL,
  termination_date    DATE NOT NULL,
  contract_type       contract_type NOT NULL,
  termination_reason  termination_reason NOT NULL,
  last_basic_salary   NUMERIC(15,2) NOT NULL DEFAULT 0,
  years_of_service    NUMERIC(5,2) NOT NULL DEFAULT 0,
  gross_gratuity      NUMERIC(15,2) NOT NULL DEFAULT 0,
  gratuity_multiplier NUMERIC(5,2) NOT NULL DEFAULT 1,
  net_gratuity        NUMERIC(15,2) NOT NULL DEFAULT 0,
  leave_encashment    NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_settlement    NUMERIC(15,2) NOT NULL DEFAULT 0,
  status              eosb_status NOT NULL DEFAULT 'draft',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by          UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==================== EMPLOYEE DOCUMENTS ====================
CREATE TABLE employee_documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id         UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  document_type_id    document_type_id NOT NULL,
  file_name           VARCHAR(255) NOT NULL,
  file_url            TEXT NOT NULL,
  file_size           BIGINT,
  file_format         VARCHAR(20),
  issue_date          DATE,
  expiry_date         DATE,
  verification_status document_verification_status NOT NULL DEFAULT 'pending',
  verified_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at         TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== PERFORMANCE REVIEWS ====================
CREATE TABLE performance_reviews (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id              UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id            UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  reviewer_id            UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  period                 review_period NOT NULL DEFAULT 'annual',
  year                   INT NOT NULL,
  start_date             DATE NOT NULL,
  end_date               DATE NOT NULL,
  status                 review_status NOT NULL DEFAULT 'draft',
  category_ratings       JSONB NOT NULL DEFAULT '{}',
  overall_self_rating    NUMERIC(3,1),
  overall_manager_rating NUMERIC(3,1),
  overall_rating         NUMERIC(3,1),
  self_comments          TEXT,
  manager_comments       TEXT,
  strengths              TEXT,
  areas_of_improvement   TEXT,
  goals                  JSONB NOT NULL DEFAULT '[]',
  completed_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by             UUID REFERENCES users(id) ON DELETE SET NULL
);
