-- ============================================================
-- 02_tenants_and_auth.sql
-- Tenants, users, sessions, roles, permissions, invitations
-- ============================================================

-- ==================== TENANTS ====================
CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  name_ar         VARCHAR(255),
  slug            VARCHAR(100) UNIQUE NOT NULL,
  trn             VARCHAR(15),
  status          tenant_status NOT NULL DEFAULT 'trial',
  plan            subscription_plan NOT NULL DEFAULT 'starter',
  enabled_modules TEXT[] NOT NULL DEFAULT '{}',
  max_users       INT NOT NULL DEFAULT 5,
  settings        JSONB NOT NULL DEFAULT '{}',
  trial_ends_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== PERMISSIONS (global seed, no tenant_id) ====================
CREATE TABLE permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module      VARCHAR(50) NOT NULL,
  action      VARCHAR(50) NOT NULL,
  label       VARCHAR(100) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (module, action)
);

-- ==================== ROLES ====================
CREATE TABLE roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_system   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

-- ==================== USERS ====================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  role          user_role NOT NULL DEFAULT 'staff',
  role_id       UUID REFERENCES roles(id) ON DELETE SET NULL,
  permissions   TEXT[] NOT NULL DEFAULT '{}',
  status        user_status NOT NULL DEFAULT 'active',
  avatar_url    TEXT,
  phone         VARCHAR(20),
  department    VARCHAR(100),
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    UUID,
  updated_by    UUID,
  deleted_at    TIMESTAMPTZ,
  UNIQUE (tenant_id, email)
);

-- Self-referential FKs for audit columns
ALTER TABLE users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ==================== USER SESSIONS ====================
CREATE TABLE user_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token  VARCHAR(500) NOT NULL,
  device         VARCHAR(255),
  browser        VARCHAR(255),
  ip_address     INET,
  location       VARCHAR(255),
  expires_at     TIMESTAMPTZ NOT NULL,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== PASSWORD RESET TOKENS ====================
CREATE TABLE password_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== USER INVITATIONS ====================
CREATE TABLE user_invitations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email      VARCHAR(255) NOT NULL,
  role       user_role NOT NULL DEFAULT 'staff',
  role_id    UUID REFERENCES roles(id) ON DELETE SET NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
