-- ============================================================
-- 07_accounts.sql
-- Chart of accounts, journal entries, AR, AP, expenses,
-- bank accounts, reconciliations, VAT returns
-- ============================================================

-- ==================== CHART OF ACCOUNTS ====================
CREATE TABLE chart_of_accounts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code              VARCHAR(20) NOT NULL,
  name              VARCHAR(255) NOT NULL,
  type              account_type NOT NULL,
  category          account_category NOT NULL,
  parent_id         UUID REFERENCES chart_of_accounts(id) ON DELETE SET NULL,
  description       TEXT,
  status            account_status NOT NULL DEFAULT 'active',
  is_system_account BOOLEAN NOT NULL DEFAULT false,
  balance           NUMERIC(15,2) NOT NULL DEFAULT 0,
  debit_balance     NUMERIC(15,2) NOT NULL DEFAULT 0,
  credit_balance    NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, code)
);

-- ==================== JOURNAL ENTRIES ====================
CREATE TABLE journal_entries (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entry_number         VARCHAR(20) NOT NULL,
  date                 DATE NOT NULL DEFAULT CURRENT_DATE,
  type                 journal_entry_type NOT NULL DEFAULT 'standard',
  narration            TEXT NOT NULL,
  total_debit          NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_credit         NUMERIC(15,2) NOT NULL DEFAULT 0,
  is_balanced          BOOLEAN NOT NULL DEFAULT true,
  status               journal_entry_status NOT NULL DEFAULT 'draft',
  reference_type       VARCHAR(50),
  reference_id         UUID,
  reference_number     VARCHAR(100),
  reversal_of          UUID REFERENCES journal_entries(id) ON DELETE SET NULL,
  reversed_by          UUID REFERENCES journal_entries(id) ON DELETE SET NULL,
  is_recurring         BOOLEAN NOT NULL DEFAULT false,
  recurring_frequency  recurring_frequency,
  next_recurring_date  DATE,
  posted_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  posted_date          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, entry_number)
);

-- ==================== JOURNAL LINES ====================
CREATE TABLE journal_lines (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id    UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id  UUID NOT NULL REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
  description TEXT,
  debit       NUMERIC(15,2) NOT NULL DEFAULT 0,
  credit      NUMERIC(15,2) NOT NULL DEFAULT 0,
  reference   VARCHAR(100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== ACCOUNTS RECEIVABLE ====================
CREATE TABLE accounts_receivable (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id        UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
  invoice_number    VARCHAR(20) NOT NULL,
  customer_id       UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  invoice_date      DATE NOT NULL,
  due_date          DATE NOT NULL,
  total_amount      NUMERIC(15,2) NOT NULL DEFAULT 0,
  paid_amount       NUMERIC(15,2) NOT NULL DEFAULT 0,
  balance_amount    NUMERIC(15,2) NOT NULL DEFAULT 0,
  status            ar_invoice_status NOT NULL DEFAULT 'open',
  aging_days        INT NOT NULL DEFAULT 0,
  aging_bucket      aging_bucket NOT NULL DEFAULT 'current',
  last_payment_date DATE,
  reminder_count    INT NOT NULL DEFAULT 0,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== CUSTOMER PAYMENTS (AR) ====================
CREATE TABLE customer_payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  ar_invoice_id    UUID NOT NULL REFERENCES accounts_receivable(id) ON DELETE RESTRICT,
  invoice_number   VARCHAR(20),
  customer_id      UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  date             DATE NOT NULL DEFAULT CURRENT_DATE,
  amount           NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  payment_method   payment_method NOT NULL DEFAULT 'bank-transfer',
  reference_number VARCHAR(100),
  cheque_number    VARCHAR(50),
  bank_name        VARCHAR(100),
  notes            TEXT,
  recorded_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== ACCOUNTS PAYABLE ====================
CREATE TABLE accounts_payable (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id              UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  bill_number            VARCHAR(20) NOT NULL,
  vendor_bill_number     VARCHAR(50),
  po_id                  UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
  vendor_id              UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  bill_date              DATE NOT NULL,
  due_date               DATE NOT NULL,
  total_amount           NUMERIC(15,2) NOT NULL DEFAULT 0,
  vat_amount             NUMERIC(15,2) NOT NULL DEFAULT 0,
  paid_amount            NUMERIC(15,2) NOT NULL DEFAULT 0,
  balance_amount         NUMERIC(15,2) NOT NULL DEFAULT 0,
  status                 ap_bill_status NOT NULL DEFAULT 'open',
  aging_days             INT NOT NULL DEFAULT 0,
  aging_bucket           aging_bucket NOT NULL DEFAULT 'current',
  early_payment_discount JSONB NOT NULL DEFAULT '{}',
  notes                  TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by             UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, bill_number)
);

-- ==================== AP PAYMENTS ====================
CREATE TABLE ap_payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  ap_bill_id       UUID NOT NULL REFERENCES accounts_payable(id) ON DELETE RESTRICT,
  vendor_id        UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  date             DATE NOT NULL DEFAULT CURRENT_DATE,
  amount           NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  payment_method   vendor_payment_method NOT NULL DEFAULT 'bank-transfer',
  reference_number VARCHAR(100),
  cheque_number    VARCHAR(50),
  bank_name        VARCHAR(100),
  notes            TEXT,
  recorded_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== EXPENSES ====================
CREATE TABLE expenses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  expense_number      VARCHAR(20) NOT NULL,
  date                DATE NOT NULL DEFAULT CURRENT_DATE,
  category            expense_category NOT NULL,
  description         TEXT NOT NULL,
  amount              NUMERIC(15,2) NOT NULL DEFAULT 0,
  vat_amount          NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_amount        NUMERIC(15,2) NOT NULL DEFAULT 0,
  vat_status          vat_status NOT NULL DEFAULT 'standard',
  payment_method      expense_payment_method NOT NULL DEFAULT 'bank-transfer',
  paid_to             VARCHAR(255),
  reference_number    VARCHAR(100),
  account_code        VARCHAR(20),
  department          VARCHAR(100),
  project             VARCHAR(100),
  is_tax_deductible   BOOLEAN NOT NULL DEFAULT true,
  is_recurring        BOOLEAN NOT NULL DEFAULT false,
  recurring_frequency recurring_frequency,
  status              expense_status NOT NULL DEFAULT 'draft',
  attachments         JSONB NOT NULL DEFAULT '[]',
  notes               TEXT,
  submitted_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at          TIMESTAMPTZ,
  UNIQUE (tenant_id, expense_number)
);

-- ==================== EXPENSE APPROVALS ====================
CREATE TABLE expense_approvals (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id   UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  action       VARCHAR(20) NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'cancelled')),
  performed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  comments     TEXT,
  date         TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== BANK ACCOUNTS ====================
CREATE TABLE bank_accounts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name           VARCHAR(255) NOT NULL,
  bank_name      VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  iban           VARCHAR(34),
  swift_code     VARCHAR(11),
  code           VARCHAR(20),
  balance        NUMERIC(15,2) NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by     UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==================== BANK RECONCILIATIONS ====================
CREATE TABLE bank_reconciliations (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                 UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  bank_account_id           UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE RESTRICT,
  statement_date            DATE NOT NULL,
  statement_opening_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
  statement_closing_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
  book_opening_balance      NUMERIC(15,2) NOT NULL DEFAULT 0,
  book_closing_balance      NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_matched             INT NOT NULL DEFAULT 0,
  total_unmatched           INT NOT NULL DEFAULT 0,
  reconciliation_difference NUMERIC(15,2) NOT NULL DEFAULT 0,
  is_reconciled             BOOLEAN NOT NULL DEFAULT false,
  status                    reconciliation_status NOT NULL DEFAULT 'in-progress',
  completed_by              UUID REFERENCES users(id) ON DELETE SET NULL,
  completed_date            TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by                UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by                UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==================== BANK TRANSACTIONS ====================
CREATE TABLE bank_transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_id UUID NOT NULL REFERENCES bank_reconciliations(id) ON DELETE CASCADE,
  date              DATE NOT NULL,
  description       TEXT,
  reference         VARCHAR(100),
  type              bank_transaction_type NOT NULL,
  amount            NUMERIC(15,2) NOT NULL DEFAULT 0,
  balance           NUMERIC(15,2) NOT NULL DEFAULT 0,
  match_status      match_status NOT NULL DEFAULT 'unmatched',
  matched_entry_id  UUID REFERENCES journal_entries(id) ON DELETE SET NULL,
  category          VARCHAR(100),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== RECONCILIATION ADJUSTMENTS ====================
CREATE TABLE reconciliation_adjustments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_id UUID NOT NULL REFERENCES bank_reconciliations(id) ON DELETE CASCADE,
  date              DATE NOT NULL,
  description       TEXT NOT NULL,
  type              bank_transaction_type NOT NULL,
  amount            NUMERIC(15,2) NOT NULL DEFAULT 0,
  account_code      VARCHAR(20),
  journal_entry_id  UUID REFERENCES journal_entries(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== VAT RETURNS ====================
CREATE TABLE vat_returns (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  return_number     VARCHAR(20) NOT NULL,
  period_type       vat_return_period NOT NULL DEFAULT 'quarterly',
  period_from       DATE NOT NULL,
  period_to         DATE NOT NULL,
  company_trn       VARCHAR(15),
  company_name      VARCHAR(255),
  boxes             JSONB NOT NULL DEFAULT '{}',
  status            vat_return_status NOT NULL DEFAULT 'draft',
  filing_deadline   DATE,
  filed_date        DATE,
  payment_date      DATE,
  payment_reference VARCHAR(100),
  notes             TEXT,
  prepared_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (tenant_id, return_number)
);
