-- ============================================================
-- 10_dispatcher.sql
-- Technician locations, job assignment logs
-- ============================================================

-- ==================== TECHNICIAN LOCATIONS ====================
CREATE TABLE technician_locations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  latitude      NUMERIC(10,7) NOT NULL,
  longitude     NUMERIC(10,7) NOT NULL,
  accuracy      NUMERIC(8,2),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, technician_id)
);

-- ==================== JOB ASSIGNMENT LOGS ====================
CREATE TABLE job_assignment_logs (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  job_id                   UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  technician_id            UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  action                   VARCHAR(50) NOT NULL,
  score                    NUMERIC(5,2),
  distance_km              NUMERIC(8,2),
  estimated_travel_minutes INT,
  notes                    TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
