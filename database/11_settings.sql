-- ============================================================
-- 11_settings.sql
-- Company profiles, notification prefs, integrations,
-- themes, security, backups, audit logs
-- ============================================================

-- ==================== COMPANY PROFILES ====================
CREATE TABLE company_profiles (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name               VARCHAR(255) NOT NULL,
  name_ar            VARCHAR(255),
  logo_url           TEXT,
  email              VARCHAR(255),
  phone              VARCHAR(20),
  website            VARCHAR(255),
  trn                VARCHAR(15),
  commercial_license VARCHAR(50),
  business_type      business_type,
  business_hours     JSONB NOT NULL DEFAULT '{}',
  address            JSONB NOT NULL DEFAULT '{}',
  bank_details       JSONB NOT NULL DEFAULT '{}',
  settings           JSONB NOT NULL DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id)
);

-- ==================== NOTIFICATION PREFERENCES ====================
CREATE TABLE notification_preferences (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_settings    JSONB NOT NULL DEFAULT '{}',
  whatsapp_settings JSONB NOT NULL DEFAULT '{}',
  system_settings   JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- ==================== INTEGRATIONS ====================
CREATE TABLE integrations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  icon        VARCHAR(50),
  category    integration_category NOT NULL,
  status      integration_status NOT NULL DEFAULT 'inactive',
  config      JSONB NOT NULL DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== THEME SETTINGS ====================
CREATE TABLE theme_settings (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  colors    JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id)
);

-- ==================== SECURITY SETTINGS ====================
CREATE TABLE security_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  password_policy JSONB NOT NULL DEFAULT '{"min_length": 8, "require_uppercase": true, "require_lowercase": true, "require_number": true, "require_special": true, "expiry_days": 90}',
  login_policy    JSONB NOT NULL DEFAULT '{"max_attempts": 5, "lockout_duration_minutes": 30, "session_timeout_minutes": 480}',
  two_factor      JSONB NOT NULL DEFAULT '{"enabled": false, "method": "email"}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id)
);

-- ==================== BACKUP SETTINGS ====================
CREATE TABLE backup_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  auto_backup     BOOLEAN NOT NULL DEFAULT true,
  frequency       VARCHAR(20) NOT NULL DEFAULT 'daily',
  retention_days  INT NOT NULL DEFAULT 30,
  last_backup_at  TIMESTAMPTZ,
  last_backup_size BIGINT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id)
);

-- ==================== AUDIT LOGS (append-only) ====================
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(50) NOT NULL,
  module      VARCHAR(50) NOT NULL,
  description TEXT,
  details     JSONB NOT NULL DEFAULT '{}',
  ip_address  INET,
  changes     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent UPDATE and DELETE on audit_logs
CREATE RULE audit_logs_no_update AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE RULE audit_logs_no_delete AS ON DELETE TO audit_logs DO INSTEAD NOTHING;
