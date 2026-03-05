-- ============================================================
-- 09_jobs.sql
-- Jobs, technicians, service reports, customer feedback
-- ============================================================

-- ==================== JOBS ====================
CREATE TABLE jobs (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id              UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  job_number             VARCHAR(20) NOT NULL,
  title                  VARCHAR(255) NOT NULL,
  description            TEXT,
  customer_id            UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  service_type           service_type NOT NULL DEFAULT 'general-maintenance',
  priority               job_priority NOT NULL DEFAULT 'medium',
  status                 job_status NOT NULL DEFAULT 'pending',
  service_address        JSONB NOT NULL DEFAULT '{}',
  scheduled_date         DATE,
  scheduled_time         TIME,
  estimated_duration     INT,  -- minutes
  actual_start_time      TIMESTAMPTZ,
  actual_end_time        TIMESTAMPTZ,
  actual_duration        INT,  -- minutes
  branch_id              UUID REFERENCES branches(id) ON DELETE SET NULL,
  assigned_technician_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  estimated_cost         NUMERIC(15,2) NOT NULL DEFAULT 0,
  labor_charges          NUMERIC(15,2) NOT NULL DEFAULT 0,
  parts_cost             NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_cost             NUMERIC(15,2) NOT NULL DEFAULT 0,
  invoice_id             UUID REFERENCES invoices(id) ON DELETE SET NULL,
  is_recurring           BOOLEAN NOT NULL DEFAULT false,
  recurring_frequency    recurring_frequency,
  parent_job_id          UUID REFERENCES jobs(id) ON DELETE SET NULL,
  internal_notes         TEXT,
  customer_notes         TEXT,
  customer_rating        INT CHECK (customer_rating >= 1 AND customer_rating <= 5),
  has_feedback           BOOLEAN NOT NULL DEFAULT false,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at             TIMESTAMPTZ,
  UNIQUE (tenant_id, job_number)
);

-- ==================== JOB TECHNICIANS ====================
CREATE TABLE job_technicians (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  role          VARCHAR(50) NOT NULL DEFAULT 'primary',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, technician_id)
);

-- ==================== JOB ATTACHMENTS ====================
CREATE TABLE job_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  file_name   VARCHAR(255) NOT NULL,
  file_url    TEXT NOT NULL,
  file_size   BIGINT,
  file_type   VARCHAR(50),
  category    VARCHAR(50),
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== JOB STATUS HISTORY ====================
CREATE TABLE job_status_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id     UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status     job_status NOT NULL,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== TECHNICIANS (extends employees) ====================
CREATE TABLE technicians (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id       UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  primary_skill     service_type NOT NULL DEFAULT 'general-maintenance',
  status            technician_status NOT NULL DEFAULT 'available',
  working_schedule  JSONB NOT NULL DEFAULT '{}',
  vehicle           JSONB NOT NULL DEFAULT '{}',
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, employee_id)
);

-- ==================== TECHNICIAN SKILLS ====================
CREATE TABLE technician_skills (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id    UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  service_type     service_type NOT NULL,
  level            skill_level NOT NULL DEFAULT 'intermediate',
  years_experience NUMERIC(4,1) NOT NULL DEFAULT 0,
  certifications   TEXT[] NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (technician_id, service_type)
);

-- ==================== SERVICE REPORTS ====================
CREATE TABLE service_reports (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  report_number        VARCHAR(20) NOT NULL,
  job_id               UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  technician_id        UUID NOT NULL REFERENCES technicians(id) ON DELETE RESTRICT,
  start_time           TIMESTAMPTZ,
  end_time             TIMESTAMPTZ,
  actual_duration      INT,  -- minutes
  travel_time          INT,  -- minutes
  checklist            JSONB NOT NULL DEFAULT '[]',
  work_performed       TEXT,
  recommendations      TEXT,
  parts_used           JSONB NOT NULL DEFAULT '[]',
  total_parts_cost     NUMERIC(15,2) NOT NULL DEFAULT 0,
  base_service_charge  NUMERIC(15,2) NOT NULL DEFAULT 0,
  overtime_charge      NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_labor_cost     NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_cost           NUMERIC(15,2) NOT NULL DEFAULT 0,
  before_photos        JSONB NOT NULL DEFAULT '[]',
  after_photos         JSONB NOT NULL DEFAULT '[]',
  technician_signature JSONB,
  customer_signature   JSONB,
  status               service_report_status NOT NULL DEFAULT 'draft',
  submitted_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, report_number)
);

-- ==================== CUSTOMER FEEDBACKS ====================
CREATE TABLE customer_feedbacks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  job_id           UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  customer_id      UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  technician_id    UUID REFERENCES technicians(id) ON DELETE SET NULL,
  overall_rating   INT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  category_ratings JSONB NOT NULL DEFAULT '{}',
  comments         TEXT,
  would_recommend  BOOLEAN,
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
