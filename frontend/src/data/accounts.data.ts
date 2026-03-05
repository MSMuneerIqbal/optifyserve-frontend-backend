/**
 * Accounts Module Sample Data
 * Comprehensive UAE-specific mock data for all accounts sub-modules.
 *
 * Extracted and enriched from accounts API mock data.
 * All amounts in AED, VAT at 5%, TRN format: 15 digits.
 */

import type {
  // Chart of Accounts
  Account,
  AccountSummary,
  // Journal Entries
  JournalEntry,
  GeneralLedgerReport,
  // Accounts Receivable
  ARInvoice,
  ARSummary,
  ARAgingReport,
  CustomerAgingSummary,
  CustomerStatement,
  CustomerPayment,
  // Accounts Payable
  APBill,
  APSummary,
  APAgingReport,
  VendorAgingSummary,
  VendorStatement,
  VendorPayment,
  // Expenses
  Expense,
  ExpenseSummary,
  BudgetActual,
  // Bank Reconciliation
  Reconciliation,
  BankTransaction,
  ReconciliationAdjustment,
  ReconciliationSummary,
  // VAT Returns
  VATReturn,
  VATReturnBoxes,
  VATSummary,
  VATTransactionLine,
  // Financial Reports
  ProfitLossStatement,
  BalanceSheet,
  CashFlowStatement,
  TrialBalance,
  TrialBalanceEntry,
  FinancialKPIs,
} from '@/features/accounts/types'

// ═══════════════════════════════════════════════════════════════════════
// CHART OF ACCOUNTS
// UAE-standard hierarchical account structure (Assets, Liabilities,
// Equity, Revenue, Expenses) with sub-accounts
// ═══════════════════════════════════════════════════════════════════════

const NOW = '2025-02-15T10:00:00Z'

export const sampleChartOfAccounts: Account[] = [
  // ─── ASSETS (1000-1999) ───
  {
    id: 'acc_1000', code: '1000', name: 'Assets', type: 'asset', category: 'cash-and-bank',
    parentId: null, status: 'active', isSystemAccount: true,
    balance: 530000, debitBalance: 530000, creditBalance: 0, transactionCount: 0,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1001', code: '1001', name: 'Cash on Hand', type: 'asset', category: 'cash-and-bank',
    parentId: 'acc_1000', parentCode: '1000', status: 'active', isSystemAccount: true,
    balance: 15000, debitBalance: 15000, creditBalance: 0, transactionCount: 45,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1002', code: '1002', name: 'Petty Cash', type: 'asset', category: 'cash-and-bank',
    parentId: 'acc_1000', parentCode: '1000', status: 'active', isSystemAccount: false,
    balance: 2500, debitBalance: 2500, creditBalance: 0, transactionCount: 30,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1010', code: '1010', name: 'Emirates NBD - Current Account', type: 'asset', category: 'cash-and-bank',
    parentId: 'acc_1000', parentCode: '1000', description: 'Primary operating account at Emirates NBD, Dubai',
    status: 'active', isSystemAccount: false,
    balance: 285000, debitBalance: 285000, creditBalance: 0, transactionCount: 120,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1011', code: '1011', name: 'ADCB - Savings Account', type: 'asset', category: 'cash-and-bank',
    parentId: 'acc_1000', parentCode: '1000', description: 'Savings account at Abu Dhabi Commercial Bank',
    status: 'active', isSystemAccount: false,
    balance: 150000, debitBalance: 150000, creditBalance: 0, transactionCount: 15,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1100', code: '1100', name: 'Accounts Receivable', type: 'asset', category: 'accounts-receivable',
    parentId: 'acc_1000', parentCode: '1000', status: 'active', isSystemAccount: true,
    balance: 245000, debitBalance: 245000, creditBalance: 0, transactionCount: 85,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1200', code: '1200', name: 'Inventory', type: 'asset', category: 'inventory',
    parentId: 'acc_1000', parentCode: '1000', status: 'active', isSystemAccount: true,
    balance: 180000, debitBalance: 180000, creditBalance: 0, transactionCount: 60,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1300', code: '1300', name: 'Prepaid Expenses', type: 'asset', category: 'other-assets',
    parentId: 'acc_1000', parentCode: '1000', status: 'active', isSystemAccount: false,
    balance: 35000, debitBalance: 35000, creditBalance: 0, transactionCount: 8,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1500', code: '1500', name: 'Fixed Assets', type: 'asset', category: 'fixed-assets',
    parentId: 'acc_1000', parentCode: '1000', status: 'active', isSystemAccount: true,
    balance: 320000, debitBalance: 320000, creditBalance: 0, transactionCount: 0,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1501', code: '1501', name: 'Vehicles', type: 'asset', category: 'fixed-assets',
    parentId: 'acc_1500', parentCode: '1500', description: 'Service vans and company vehicles',
    status: 'active', isSystemAccount: false,
    balance: 180000, debitBalance: 180000, creditBalance: 0, transactionCount: 5,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1502', code: '1502', name: 'Equipment & Tools', type: 'asset', category: 'fixed-assets',
    parentId: 'acc_1500', parentCode: '1500', description: 'HVAC, plumbing, electrical tools and equipment',
    status: 'active', isSystemAccount: false,
    balance: 95000, debitBalance: 95000, creditBalance: 0, transactionCount: 12,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1503', code: '1503', name: 'Furniture & Fixtures', type: 'asset', category: 'fixed-assets',
    parentId: 'acc_1500', parentCode: '1500', status: 'active', isSystemAccount: false,
    balance: 45000, debitBalance: 45000, creditBalance: 0, transactionCount: 4,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_1550', code: '1550', name: 'Accumulated Depreciation', type: 'asset', category: 'fixed-assets',
    parentId: 'acc_1500', parentCode: '1500', status: 'active', isSystemAccount: true,
    balance: -85000, debitBalance: 0, creditBalance: 85000, transactionCount: 24,
    createdAt: NOW, updatedAt: NOW,
  },

  // ─── LIABILITIES (2000-2999) ───
  {
    id: 'acc_2000', code: '2000', name: 'Liabilities', type: 'liability', category: 'accounts-payable',
    parentId: null, status: 'active', isSystemAccount: true,
    balance: 280000, debitBalance: 0, creditBalance: 280000, transactionCount: 0,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_2100', code: '2100', name: 'Accounts Payable', type: 'liability', category: 'accounts-payable',
    parentId: 'acc_2000', parentCode: '2000', status: 'active', isSystemAccount: true,
    balance: 125000, debitBalance: 0, creditBalance: 125000, transactionCount: 65,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_2200', code: '2200', name: 'VAT Payable', type: 'liability', category: 'vat-payable',
    parentId: 'acc_2000', parentCode: '2000', description: 'Output VAT collected on sales',
    status: 'active', isSystemAccount: true,
    balance: 18500, debitBalance: 0, creditBalance: 18500, transactionCount: 40,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_2201', code: '2201', name: 'VAT Input (Recoverable)', type: 'liability', category: 'vat-payable',
    parentId: 'acc_2000', parentCode: '2000', description: 'Input VAT paid on purchases (recoverable)',
    status: 'active', isSystemAccount: true,
    balance: -8500, debitBalance: 8500, creditBalance: 0, transactionCount: 35,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_2300', code: '2300', name: 'Accrued Expenses', type: 'liability', category: 'other-liabilities',
    parentId: 'acc_2000', parentCode: '2000', status: 'active', isSystemAccount: false,
    balance: 45000, debitBalance: 0, creditBalance: 45000, transactionCount: 12,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_2400', code: '2400', name: 'Bank Loan - Emirates NBD', type: 'liability', category: 'loans',
    parentId: 'acc_2000', parentCode: '2000', description: 'Business term loan, 3-year, Emirates NBD',
    status: 'active', isSystemAccount: false,
    balance: 100000, debitBalance: 0, creditBalance: 100000, transactionCount: 6,
    createdAt: NOW, updatedAt: NOW,
  },

  // ─── EQUITY (3000-3999) ───
  {
    id: 'acc_3000', code: '3000', name: 'Equity', type: 'equity', category: 'capital',
    parentId: null, status: 'active', isSystemAccount: true,
    balance: 400000, debitBalance: 0, creditBalance: 400000, transactionCount: 0,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_3001', code: '3001', name: "Owner's Capital", type: 'equity', category: 'capital',
    parentId: 'acc_3000', parentCode: '3000', status: 'active', isSystemAccount: true,
    balance: 300000, debitBalance: 0, creditBalance: 300000, transactionCount: 3,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_3100', code: '3100', name: 'Retained Earnings', type: 'equity', category: 'retained-earnings',
    parentId: 'acc_3000', parentCode: '3000', status: 'active', isSystemAccount: true,
    balance: 100000, debitBalance: 0, creditBalance: 100000, transactionCount: 2,
    createdAt: NOW, updatedAt: NOW,
  },

  // ─── REVENUE (4000-4999) ───
  {
    id: 'acc_4000', code: '4000', name: 'Revenue', type: 'revenue', category: 'sales-revenue',
    parentId: null, status: 'active', isSystemAccount: true,
    balance: 850000, debitBalance: 0, creditBalance: 850000, transactionCount: 0,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_4001', code: '4001', name: 'Service Revenue', type: 'revenue', category: 'service-revenue',
    parentId: 'acc_4000', parentCode: '4000', description: 'Revenue from HVAC, plumbing, electrical services',
    status: 'active', isSystemAccount: false,
    balance: 520000, debitBalance: 0, creditBalance: 520000, transactionCount: 95,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_4002', code: '4002', name: 'Product Sales', type: 'revenue', category: 'sales-revenue',
    parentId: 'acc_4000', parentCode: '4000', description: 'Revenue from parts and material sales',
    status: 'active', isSystemAccount: false,
    balance: 280000, debitBalance: 0, creditBalance: 280000, transactionCount: 65,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_4003', code: '4003', name: 'AMC Revenue', type: 'revenue', category: 'service-revenue',
    parentId: 'acc_4000', parentCode: '4000', description: 'Annual Maintenance Contract revenue',
    status: 'active', isSystemAccount: false,
    balance: 50000, debitBalance: 0, creditBalance: 50000, transactionCount: 8,
    createdAt: NOW, updatedAt: NOW,
  },

  // ─── EXPENSES (5000-5999) ───
  {
    id: 'acc_5000', code: '5000', name: 'Expenses', type: 'expense', category: 'cost-of-goods-sold',
    parentId: null, status: 'active', isSystemAccount: true,
    balance: 580000, debitBalance: 580000, creditBalance: 0, transactionCount: 0,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5001', code: '5001', name: 'Cost of Goods Sold', type: 'expense', category: 'cost-of-goods-sold',
    parentId: 'acc_5000', parentCode: '5000', status: 'active', isSystemAccount: false,
    balance: 180000, debitBalance: 180000, creditBalance: 0, transactionCount: 55,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5100', code: '5100', name: 'Salaries & Wages', type: 'expense', category: 'salaries-wages',
    parentId: 'acc_5000', parentCode: '5000', status: 'active', isSystemAccount: false,
    balance: 195000, debitBalance: 195000, creditBalance: 0, transactionCount: 24,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5200', code: '5200', name: 'Rent', type: 'expense', category: 'rent-utilities',
    parentId: 'acc_5000', parentCode: '5000', description: 'Office and warehouse rent, Business Bay',
    status: 'active', isSystemAccount: false,
    balance: 60000, debitBalance: 60000, creditBalance: 0, transactionCount: 6,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5201', code: '5201', name: 'Utilities', type: 'expense', category: 'rent-utilities',
    parentId: 'acc_5000', parentCode: '5000', description: 'DEWA, Etisalat, du telecommunications',
    status: 'active', isSystemAccount: false,
    balance: 18000, debitBalance: 18000, creditBalance: 0, transactionCount: 12,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5300', code: '5300', name: 'Marketing & Advertising', type: 'expense', category: 'marketing',
    parentId: 'acc_5000', parentCode: '5000', status: 'active', isSystemAccount: false,
    balance: 25000, debitBalance: 25000, creditBalance: 0, transactionCount: 10,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5400', code: '5400', name: 'Transportation & Fuel', type: 'expense', category: 'transportation',
    parentId: 'acc_5000', parentCode: '5000', description: 'ADNOC/ENOC fuel, Salik tolls',
    status: 'active', isSystemAccount: false,
    balance: 22000, debitBalance: 22000, creditBalance: 0, transactionCount: 30,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5500', code: '5500', name: 'Insurance', type: 'expense', category: 'insurance',
    parentId: 'acc_5000', parentCode: '5000', status: 'active', isSystemAccount: false,
    balance: 15000, debitBalance: 15000, creditBalance: 0, transactionCount: 4,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5600', code: '5600', name: 'Professional Fees', type: 'expense', category: 'professional-fees',
    parentId: 'acc_5000', parentCode: '5000', description: 'Legal, audit, consulting fees',
    status: 'active', isSystemAccount: false,
    balance: 12000, debitBalance: 12000, creditBalance: 0, transactionCount: 6,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5700', code: '5700', name: 'Depreciation', type: 'expense', category: 'depreciation',
    parentId: 'acc_5000', parentCode: '5000', status: 'active', isSystemAccount: false,
    balance: 28000, debitBalance: 28000, creditBalance: 0, transactionCount: 12,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5800', code: '5800', name: 'Office Supplies', type: 'expense', category: 'office-supplies',
    parentId: 'acc_5000', parentCode: '5000', status: 'active', isSystemAccount: false,
    balance: 8000, debitBalance: 8000, creditBalance: 0, transactionCount: 18,
    createdAt: NOW, updatedAt: NOW,
  },
  {
    id: 'acc_5900', code: '5900', name: 'Repairs & Maintenance', type: 'expense', category: 'repairs-maintenance',
    parentId: 'acc_5000', parentCode: '5000', status: 'active', isSystemAccount: false,
    balance: 17000, debitBalance: 17000, creditBalance: 0, transactionCount: 9,
    createdAt: NOW, updatedAt: NOW,
  },
]

export const sampleAccountSummary: AccountSummary = {
  totalAccounts: 37,
  activeAccounts: 37,
  totalAssets: 1232500,
  totalLiabilities: 280000,
  totalEquity: 400000,
  totalRevenue: 850000,
  totalExpenses: 580000,
}

// ═══════════════════════════════════════════════════════════════════════
// JOURNAL ENTRIES
// Manual accounting entries with balanced debit/credit lines
// ═══════════════════════════════════════════════════════════════════════

export const sampleJournalEntries: JournalEntry[] = [
  {
    id: 'je_001', entryNumber: 'JE-2025-0001', date: '2025-01-31', type: 'manual',
    narration: 'Monthly depreciation - January 2025',
    lines: [
      { id: 'jl_001', accountId: 'acc_5700', accountCode: '5700', accountName: 'Depreciation', debit: 2333.33, credit: 0 },
      { id: 'jl_002', accountId: 'acc_1550', accountCode: '1550', accountName: 'Accumulated Depreciation', debit: 0, credit: 2333.33 },
    ],
    totalDebit: 2333.33, totalCredit: 2333.33, isBalanced: true,
    status: 'posted', isRecurring: true, recurringFrequency: 'monthly', nextRecurringDate: '2025-02-28',
    postedBy: { id: 'usr_001', name: 'Sara Ahmed' }, postedDate: '2025-01-31',
    createdBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-01-31T09:00:00Z', updatedAt: '2025-01-31T09:30:00Z',
  },
  {
    id: 'je_002', entryNumber: 'JE-2025-0002', date: '2025-02-01', type: 'manual',
    narration: 'Record rent expense - February 2025 (Business Bay Tower)',
    lines: [
      { id: 'jl_003', accountId: 'acc_5200', accountCode: '5200', accountName: 'Rent', debit: 10000, credit: 0 },
      { id: 'jl_004', accountId: 'acc_1010', accountCode: '1010', accountName: 'Emirates NBD - Current Account', debit: 0, credit: 10000 },
    ],
    totalDebit: 10000, totalCredit: 10000, isBalanced: true,
    status: 'posted', referenceType: 'expense', referenceNumber: 'EXP-2025-0001',
    isRecurring: false,
    postedBy: { id: 'usr_001', name: 'Sara Ahmed' }, postedDate: '2025-02-01',
    createdBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-02-01T08:00:00Z', updatedAt: '2025-02-01T08:15:00Z',
  },
  {
    id: 'je_003', entryNumber: 'JE-2025-0003', date: '2025-02-05', type: 'manual',
    narration: 'Record sales invoice INV-2025-0002 - Al Futtaim Group (HVAC maintenance)',
    lines: [
      { id: 'jl_005', accountId: 'acc_1100', accountCode: '1100', accountName: 'Accounts Receivable', debit: 8032.5, credit: 0, description: 'Al Futtaim Group - Dubai Festival City' },
      { id: 'jl_006', accountId: 'acc_4001', accountCode: '4001', accountName: 'Service Revenue', debit: 0, credit: 7650, description: 'HVAC preventive maintenance' },
      { id: 'jl_007', accountId: 'acc_2200', accountCode: '2200', accountName: 'VAT Payable', debit: 0, credit: 382.5, description: '5% VAT on service' },
    ],
    totalDebit: 8032.5, totalCredit: 8032.5, isBalanced: true,
    status: 'posted', referenceType: 'invoice', referenceNumber: 'INV-2025-0002',
    isRecurring: false,
    postedBy: { id: 'usr_001', name: 'Sara Ahmed' }, postedDate: '2025-02-05',
    createdBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-02-05T11:00:00Z', updatedAt: '2025-02-05T11:20:00Z',
  },
  {
    id: 'je_004', entryNumber: 'JE-2025-0004', date: '2025-02-15', type: 'manual',
    narration: 'Record payment from Al Futtaim Group - Cheque #456789',
    lines: [
      { id: 'jl_008', accountId: 'acc_1010', accountCode: '1010', accountName: 'Emirates NBD - Current Account', debit: 5000, credit: 0, reference: 'CHQ-456789' },
      { id: 'jl_009', accountId: 'acc_1100', accountCode: '1100', accountName: 'Accounts Receivable', debit: 0, credit: 5000, description: 'Partial payment against INV-2025-0002' },
    ],
    totalDebit: 5000, totalCredit: 5000, isBalanced: true,
    status: 'posted', referenceType: 'payment', referenceNumber: 'PAY-2025-002',
    isRecurring: false,
    postedBy: { id: 'usr_001', name: 'Sara Ahmed' }, postedDate: '2025-02-15',
    createdBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-02-15T14:00:00Z', updatedAt: '2025-02-15T14:10:00Z',
  },
  {
    id: 'je_005', entryNumber: 'JE-2025-0005', date: '2025-02-10', type: 'adjustment',
    narration: 'Adjust prepaid insurance to monthly expense (Oriental Insurance)',
    lines: [
      { id: 'jl_010', accountId: 'acc_5500', accountCode: '5500', accountName: 'Insurance', debit: 375, credit: 0 },
      { id: 'jl_011', accountId: 'acc_1300', accountCode: '1300', accountName: 'Prepaid Expenses', debit: 0, credit: 375 },
    ],
    totalDebit: 375, totalCredit: 375, isBalanced: true,
    status: 'posted', isRecurring: true, recurringFrequency: 'monthly',
    postedBy: { id: 'usr_001', name: 'Sara Ahmed' }, postedDate: '2025-02-10',
    createdBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:15:00Z',
  },
  {
    id: 'je_006', entryNumber: 'JE-2025-0006', date: '2025-02-12', type: 'manual',
    narration: 'Draft entry - Office supplies purchase from Office Hub Trading',
    lines: [
      { id: 'jl_012', accountId: 'acc_5800', accountCode: '5800', accountName: 'Office Supplies', debit: 450, credit: 0 },
      { id: 'jl_013', accountId: 'acc_2201', accountCode: '2201', accountName: 'VAT Input (Recoverable)', description: 'Input VAT 5%', debit: 22.5, credit: 0 },
      { id: 'jl_014', accountId: 'acc_1002', accountCode: '1002', accountName: 'Petty Cash', debit: 0, credit: 472.5 },
    ],
    totalDebit: 472.5, totalCredit: 472.5, isBalanced: true,
    status: 'draft', referenceType: 'expense', referenceNumber: 'EXP-2025-0003',
    isRecurring: false,
    createdBy: { id: 'usr_004', name: 'Ahmad Hassan' },
    createdAt: '2025-02-12T16:00:00Z', updatedAt: '2025-02-12T16:00:00Z',
  },
  {
    id: 'je_007', entryNumber: 'JE-2025-0007', date: '2025-02-18', type: 'manual',
    narration: 'Record vendor payment to Emirates Electrical Supplies - BILL-2025-0001',
    lines: [
      { id: 'jl_015', accountId: 'acc_2100', accountCode: '2100', accountName: 'Accounts Payable', debit: 42000, credit: 0, description: 'Emirates Electrical Supplies' },
      { id: 'jl_016', accountId: 'acc_1010', accountCode: '1010', accountName: 'Emirates NBD - Current Account', debit: 0, credit: 42000, reference: 'TT-VEND-01' },
    ],
    totalDebit: 42000, totalCredit: 42000, isBalanced: true,
    status: 'posted', referenceType: 'payment', referenceNumber: 'VPAY-2025-001',
    isRecurring: false,
    postedBy: { id: 'usr_001', name: 'Sara Ahmed' }, postedDate: '2025-02-18',
    createdBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-02-18T09:00:00Z', updatedAt: '2025-02-18T09:20:00Z',
  },
  {
    id: 'je_008', entryNumber: 'JE-2025-0008', date: '2025-02-20', type: 'manual',
    narration: 'Record salary expense - February 2025',
    lines: [
      { id: 'jl_017', accountId: 'acc_5100', accountCode: '5100', accountName: 'Salaries & Wages', debit: 32500, credit: 0, description: 'February staff salaries' },
      { id: 'jl_018', accountId: 'acc_1010', accountCode: '1010', accountName: 'Emirates NBD - Current Account', debit: 0, credit: 32500, reference: 'SAL-2025-02' },
    ],
    totalDebit: 32500, totalCredit: 32500, isBalanced: true,
    status: 'posted', referenceType: 'expense', referenceNumber: 'EXP-2025-0006',
    isRecurring: true, recurringFrequency: 'monthly',
    postedBy: { id: 'usr_002', name: 'Mohammed Ali' }, postedDate: '2025-02-20',
    createdBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-02-20T11:00:00Z', updatedAt: '2025-02-20T11:30:00Z',
  },
]

export const sampleGeneralLedgerReport: GeneralLedgerReport = {
  accountId: 'acc_1010',
  accountCode: '1010',
  accountName: 'Emirates NBD - Current Account',
  accountType: 'asset',
  fromDate: '2025-02-01',
  toDate: '2025-02-28',
  openingBalance: 280000,
  closingBalance: 285000,
  totalDebits: 15000,
  totalCredits: 10000,
  entries: [
    { date: '2025-02-01', entryNumber: 'JE-2025-0002', narration: 'Record rent expense - February 2025', accountCode: '1010', accountName: 'Emirates NBD', debit: 0, credit: 10000, balance: 270000 },
    { date: '2025-02-15', entryNumber: 'JE-2025-0004', narration: 'Payment from Al Futtaim Group', accountCode: '1010', accountName: 'Emirates NBD', debit: 5000, credit: 0, balance: 275000 },
    { date: '2025-02-20', entryNumber: 'JE-2025-0007', narration: 'Service revenue collection - Etisalat FM', accountCode: '1010', accountName: 'Emirates NBD', debit: 10000, credit: 0, balance: 285000 },
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// ACCOUNTS RECEIVABLE
// Customer outstanding invoices, aging buckets, and payment tracking
// ═══════════════════════════════════════════════════════════════════════

export const sampleARInvoices: ARInvoice[] = [
  {
    id: 'ar_001', invoiceId: 'inv_002', invoiceNumber: 'INV-2025-0002',
    customerId: 'cust_001', customerName: 'Al Futtaim Group', customerEmail: 'accounts@alfuttaim.ae',
    invoiceDate: '2025-02-05', dueDate: '2025-03-07',
    totalAmount: 8032.5, paidAmount: 5000, balanceAmount: 3032.5,
    status: 'partially-paid', agingDays: 0, agingBucket: 'current',
    lastPaymentDate: '2025-02-15', reminderCount: 0,
    createdAt: '2025-02-05T11:00:00Z', updatedAt: '2025-02-15T14:00:00Z',
  },
  {
    id: 'ar_002', invoiceId: 'inv_003', invoiceNumber: 'INV-2025-0003',
    customerId: 'cust_003', customerName: 'Jumeirah Group', customerEmail: 'engineering@jumeirah.com',
    invoiceDate: '2025-02-08', dueDate: '2025-04-08',
    totalAmount: 12600, paidAmount: 0, balanceAmount: 12600,
    status: 'unpaid', agingDays: 0, agingBucket: 'current',
    reminderCount: 0,
    createdAt: '2025-02-08T09:00:00Z', updatedAt: '2025-02-08T09:30:00Z',
  },
  {
    id: 'ar_003', invoiceId: 'inv_004', invoiceNumber: 'INV-2025-0004',
    customerId: 'cust_007', customerName: 'Emaar Properties', customerEmail: 'facilities@emaar.ae',
    invoiceDate: '2025-01-15', dueDate: '2025-02-14',
    totalAmount: 3675, paidAmount: 0, balanceAmount: 3675,
    status: 'overdue', agingDays: 14, agingBucket: 'current',
    lastReminderDate: '2025-02-20', reminderCount: 2,
    notes: 'Follow up with FM department',
    createdAt: '2025-01-15T15:00:00Z', updatedAt: '2025-02-15T00:00:00Z',
  },
  {
    id: 'ar_004', invoiceId: 'inv_007', invoiceNumber: 'INV-2025-0007',
    customerId: 'cust_002', customerName: 'Dubai Holdings', customerEmail: 'finance@dubaiholdings.ae',
    invoiceDate: '2024-11-10', dueDate: '2025-01-09',
    totalAmount: 45000, paidAmount: 20000, balanceAmount: 25000,
    status: 'overdue', agingDays: 37, agingBucket: '31-60',
    lastPaymentDate: '2024-12-15', lastReminderDate: '2025-02-01', reminderCount: 3,
    notes: 'Partial payment received, awaiting balance',
    createdAt: '2024-11-10T10:00:00Z', updatedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'ar_005', invoiceId: 'inv_008', invoiceNumber: 'INV-2025-0008',
    customerId: 'cust_005', customerName: 'Sharjah Municipality', customerEmail: 'contracts@sharjah.ae',
    invoiceDate: '2024-10-15', dueDate: '2024-12-14',
    totalAmount: 65000, paidAmount: 0, balanceAmount: 65000,
    status: 'overdue', agingDays: 63, agingBucket: '61-90',
    reminderCount: 4,
    notes: 'Government payment cycle - expected within 90 days',
    createdAt: '2024-10-15T08:00:00Z', updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'ar_006', invoiceId: 'inv_009', invoiceNumber: 'INV-2024-0015',
    customerId: 'cust_008', customerName: 'RAK Properties', customerEmail: 'accounts@rakprop.ae',
    invoiceDate: '2024-08-20', dueDate: '2024-10-19',
    totalAmount: 28500, paidAmount: 0, balanceAmount: 28500,
    status: 'overdue', agingDays: 118, agingBucket: '90-plus',
    reminderCount: 5,
    notes: 'Escalated to management for collection review',
    createdAt: '2024-08-20T10:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'ar_007', invoiceId: 'inv_010', invoiceNumber: 'INV-2025-0010',
    customerId: 'cust_009', customerName: 'Etisalat Facilities', customerEmail: 'fm@etisalat.ae',
    invoiceDate: '2025-02-01', dueDate: '2025-03-03',
    totalAmount: 18750, paidAmount: 0, balanceAmount: 18750,
    status: 'unpaid', agingDays: 0, agingBucket: 'current',
    reminderCount: 0,
    createdAt: '2025-02-01T11:00:00Z', updatedAt: '2025-02-01T11:00:00Z',
  },
  {
    id: 'ar_008', invoiceId: 'inv_011', invoiceNumber: 'INV-2025-0011',
    customerId: 'cust_010', customerName: 'DAMAC Properties', customerEmail: 'maintenance@damac.ae',
    invoiceDate: '2024-12-05', dueDate: '2025-02-03',
    totalAmount: 35200, paidAmount: 10000, balanceAmount: 25200,
    status: 'overdue', agingDays: 12, agingBucket: 'current',
    lastPaymentDate: '2025-01-10', reminderCount: 2,
    createdAt: '2024-12-05T09:00:00Z', updatedAt: '2025-01-10T14:00:00Z',
  },
]

export const sampleARSummary: ARSummary = {
  totalOutstanding: 181757.5,
  totalOverdue: 147375,
  currentAmount: 62557.5,
  days31to60Amount: 25000,
  days61to90Amount: 65000,
  days90plusAmount: 28500,
  totalCustomers: 7,
  overdueCustomers: 5,
  averageDaysSales: 35,
}

export const sampleARAgingReport: ARAgingReport = {
  asOfDate: '2025-02-15',
  totalOutstanding: 181757.5,
  currentTotal: 62557.5,
  days31to60Total: 25000,
  days61to90Total: 65000,
  days90plusTotal: 28500,
  customers: [
    { customerId: 'cust_005', customerName: 'Sharjah Municipality', totalOutstanding: 65000, current: 0, days31to60: 0, days61to90: 65000, days90plus: 0, invoiceCount: 1, oldestInvoiceDate: '2024-10-15' },
    { customerId: 'cust_008', customerName: 'RAK Properties', totalOutstanding: 28500, current: 0, days31to60: 0, days61to90: 0, days90plus: 28500, invoiceCount: 1, oldestInvoiceDate: '2024-08-20' },
    { customerId: 'cust_002', customerName: 'Dubai Holdings', totalOutstanding: 25000, current: 0, days31to60: 25000, days61to90: 0, days90plus: 0, invoiceCount: 1, oldestInvoiceDate: '2024-11-10' },
    { customerId: 'cust_010', customerName: 'DAMAC Properties', totalOutstanding: 25200, current: 25200, days31to60: 0, days61to90: 0, days90plus: 0, invoiceCount: 1, oldestInvoiceDate: '2024-12-05' },
    { customerId: 'cust_009', customerName: 'Etisalat Facilities', totalOutstanding: 18750, current: 18750, days31to60: 0, days61to90: 0, days90plus: 0, invoiceCount: 1, oldestInvoiceDate: '2025-02-01' },
    { customerId: 'cust_003', customerName: 'Jumeirah Group', totalOutstanding: 12600, current: 12600, days31to60: 0, days61to90: 0, days90plus: 0, invoiceCount: 1, oldestInvoiceDate: '2025-02-08' },
    { customerId: 'cust_007', customerName: 'Emaar Properties', totalOutstanding: 3675, current: 3675, days31to60: 0, days61to90: 0, days90plus: 0, invoiceCount: 1, oldestInvoiceDate: '2025-01-15' },
  ] satisfies CustomerAgingSummary[],
}

export const sampleCustomerStatement: CustomerStatement = {
  customerId: 'cust_001',
  customerName: 'Al Futtaim Group',
  customerAddress: 'Dubai Festival City, Dubai, UAE',
  fromDate: '2025-01-01',
  toDate: '2025-02-28',
  openingBalance: 0,
  closingBalance: 3032.5,
  totalDebits: 8032.5,
  totalCredits: 5000,
  entries: [
    { date: '2025-02-05', description: 'Invoice INV-2025-0002 - HVAC Maintenance', reference: 'INV-2025-0002', debit: 8032.5, credit: 0, balance: 8032.5 },
    { date: '2025-02-15', description: 'Payment Received - Cheque #456789', reference: 'PAY-2025-002', debit: 0, credit: 5000, balance: 3032.5 },
  ],
}

export const sampleCustomerPayments: CustomerPayment[] = [
  {
    id: 'pay_001', arInvoiceId: 'ar_001', invoiceNumber: 'INV-2025-0002',
    customerId: 'cust_001', customerName: 'Al Futtaim Group',
    date: '2025-02-15', amount: 5000, paymentMethod: 'cheque',
    chequeNumber: '456789', bankName: 'Emirates NBD',
    notes: 'Partial payment - balance AED 3,032.50',
    recordedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-02-15T14:00:00Z',
  },
  {
    id: 'pay_002', arInvoiceId: 'ar_004', invoiceNumber: 'INV-2025-0007',
    customerId: 'cust_002', customerName: 'Dubai Holdings',
    date: '2024-12-15', amount: 20000, paymentMethod: 'bank-transfer',
    referenceNumber: 'TT-DH-2024-1215',
    notes: 'First installment payment',
    recordedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2024-12-15T10:00:00Z',
  },
  {
    id: 'pay_003', arInvoiceId: 'ar_008', invoiceNumber: 'INV-2025-0011',
    customerId: 'cust_010', customerName: 'DAMAC Properties',
    date: '2025-01-10', amount: 10000, paymentMethod: 'bank-transfer',
    referenceNumber: 'TT-DAMAC-0110',
    recordedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-01-10T14:00:00Z',
  },
]

// ═══════════════════════════════════════════════════════════════════════
// ACCOUNTS PAYABLE
// Vendor bills, aging, and payment tracking
// ═══════════════════════════════════════════════════════════════════════

export const sampleAPBills: APBill[] = [
  {
    id: 'ap_001', billNumber: 'BILL-2025-0001', vendorBillNumber: 'VB-1234',
    purchaseOrderId: 'po_001', purchaseOrderNumber: 'PO-2025-0001',
    vendorId: 'vnd_001', vendorName: 'Emirates Electrical Supplies', vendorEmail: 'accounts@eesupplies.ae',
    vendorTRN: '100111222333444',
    billDate: '2025-01-20', dueDate: '2025-02-19',
    totalAmount: 42000, vatAmount: 2000, paidAmount: 42000, balanceAmount: 0,
    status: 'paid', agingDays: 0, agingBucket: 'current',
    lastPaymentDate: '2025-02-10',
    createdAt: '2025-01-20T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z',
  },
  {
    id: 'ap_002', billNumber: 'BILL-2025-0002', vendorBillNumber: 'INV-5678',
    vendorId: 'vnd_002', vendorName: 'Gulf HVAC Parts Trading', vendorEmail: 'sales@gulfhvac.ae',
    vendorTRN: '100222333444555',
    billDate: '2025-02-01', dueDate: '2025-03-02',
    totalAmount: 28500, vatAmount: 1357, paidAmount: 0, balanceAmount: 28500,
    status: 'unpaid', agingDays: 0, agingBucket: 'current',
    notes: 'HVAC compressors and refrigerant for Q1 stock',
    createdAt: '2025-02-01T11:00:00Z', updatedAt: '2025-02-01T11:00:00Z',
  },
  {
    id: 'ap_003', billNumber: 'BILL-2025-0003', vendorBillNumber: 'SI-9012',
    purchaseOrderId: 'po_003', purchaseOrderNumber: 'PO-2025-0003',
    vendorId: 'vnd_003', vendorName: 'Al Masood Industrial Supplies', vendorEmail: 'ar@almasood.ae',
    vendorTRN: '100333444555666',
    billDate: '2024-12-15', dueDate: '2025-01-14',
    totalAmount: 35000, vatAmount: 1666.67, paidAmount: 15000, balanceAmount: 20000,
    status: 'overdue', agingDays: 32, agingBucket: '31-60',
    earlyPaymentDiscount: { discountPercent: 2, discountDays: 10, discountAmount: 700 },
    lastPaymentDate: '2025-01-05',
    notes: 'Early payment discount expired; partial payment made',
    createdAt: '2024-12-15T09:00:00Z', updatedAt: '2025-01-05T14:00:00Z',
  },
  {
    id: 'ap_004', billNumber: 'BILL-2025-0004', vendorBillNumber: 'TAX-3456',
    vendorId: 'vnd_004', vendorName: 'Dubai Safety Equipment LLC', vendorEmail: 'billing@dubaisafety.ae',
    billDate: '2024-11-01', dueDate: '2024-12-31',
    totalAmount: 18200, vatAmount: 866.67, paidAmount: 0, balanceAmount: 18200,
    status: 'overdue', agingDays: 46, agingBucket: '31-60',
    notes: 'Safety equipment and PPE bulk order',
    createdAt: '2024-11-01T10:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'ap_005', billNumber: 'BILL-2024-0020', vendorBillNumber: 'PLB-7890',
    vendorId: 'vnd_005', vendorName: 'RAK Plumbing Supplies', vendorEmail: 'accounts@rakplumbing.ae',
    billDate: '2024-09-10', dueDate: '2024-11-09',
    totalAmount: 12800, vatAmount: 609.52, paidAmount: 0, balanceAmount: 12800,
    status: 'overdue', agingDays: 98, agingBucket: '90-plus',
    notes: 'Plumbing fixtures for Sharjah Municipality project',
    createdAt: '2024-09-10T08:00:00Z', updatedAt: '2024-11-10T00:00:00Z',
  },
  {
    id: 'ap_006', billNumber: 'BILL-2025-0005', vendorBillNumber: 'RNT-2025-02',
    vendorId: 'vnd_006', vendorName: 'Business Bay Tower MGMT', vendorEmail: 'accounts@bbtower.ae',
    billDate: '2025-02-01', dueDate: '2025-02-28',
    totalAmount: 15000, vatAmount: 714.29, paidAmount: 0, balanceAmount: 15000,
    status: 'unpaid', agingDays: 0, agingBucket: 'current',
    notes: 'February 2025 office rent',
    createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-02-01T00:00:00Z',
  },
]

export const sampleAPSummary: APSummary = {
  totalOutstanding: 94500,
  totalOverdue: 51000,
  currentAmount: 43500,
  days31to60Amount: 38200,
  days61to90Amount: 0,
  days90plusAmount: 12800,
  totalVendors: 5,
  overdueVendors: 3,
  averageDaysPayable: 38,
}

export const sampleAPAgingReport: APAgingReport = {
  asOfDate: '2025-02-15',
  totalOutstanding: 94500,
  currentTotal: 43500,
  days31to60Total: 38200,
  days61to90Total: 0,
  days90plusTotal: 12800,
  vendors: [
    { vendorId: 'vnd_002', vendorName: 'Gulf HVAC Parts Trading', totalOutstanding: 28500, current: 28500, days31to60: 0, days61to90: 0, days90plus: 0, billCount: 1, oldestBillDate: '2025-02-01' },
    { vendorId: 'vnd_003', vendorName: 'Al Masood Industrial Supplies', totalOutstanding: 20000, current: 0, days31to60: 20000, days61to90: 0, days90plus: 0, billCount: 1, oldestBillDate: '2024-12-15' },
    { vendorId: 'vnd_004', vendorName: 'Dubai Safety Equipment LLC', totalOutstanding: 18200, current: 0, days31to60: 18200, days61to90: 0, days90plus: 0, billCount: 1, oldestBillDate: '2024-11-01' },
    { vendorId: 'vnd_006', vendorName: 'Business Bay Tower MGMT', totalOutstanding: 15000, current: 15000, days31to60: 0, days61to90: 0, days90plus: 0, billCount: 1, oldestBillDate: '2025-02-01' },
    { vendorId: 'vnd_005', vendorName: 'RAK Plumbing Supplies', totalOutstanding: 12800, current: 0, days31to60: 0, days61to90: 0, days90plus: 12800, billCount: 1, oldestBillDate: '2024-09-10' },
  ] satisfies VendorAgingSummary[],
}

export const sampleVendorStatement: VendorStatement = {
  vendorId: 'vnd_002',
  vendorName: 'Gulf HVAC Parts Trading',
  vendorAddress: 'Industrial Area 4, Sharjah, UAE',
  fromDate: '2025-01-01',
  toDate: '2025-02-28',
  openingBalance: 0,
  closingBalance: 28500,
  totalDebits: 0,
  totalCredits: 28500,
  entries: [
    { date: '2025-02-01', description: 'Bill BILL-2025-0002 - HVAC parts Q1 stock', reference: 'BILL-2025-0002', debit: 0, credit: 28500, balance: 28500 },
  ],
}

export const sampleVendorPayments: VendorPayment[] = [
  {
    id: 'vpay_001', apBillId: 'ap_001', billNumber: 'BILL-2025-0001',
    vendorId: 'vnd_001', vendorName: 'Emirates Electrical Supplies',
    date: '2025-02-10', amount: 42000, paymentMethod: 'bank-transfer',
    referenceNumber: 'TT-VEND-01', bankName: 'Emirates NBD',
    notes: 'Full payment - PO-2025-0001',
    recordedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-02-10T10:00:00Z',
  },
  {
    id: 'vpay_002', apBillId: 'ap_003', billNumber: 'BILL-2025-0003',
    vendorId: 'vnd_003', vendorName: 'Al Masood Industrial Supplies',
    date: '2025-01-05', amount: 15000, paymentMethod: 'bank-transfer',
    referenceNumber: 'TT-VEND-03', bankName: 'Emirates NBD',
    notes: 'Partial payment - balance AED 20,000',
    recordedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-01-05T14:00:00Z',
  },
]

// ═══════════════════════════════════════════════════════════════════════
// EXPENSES
// Expense records with categories, approvals, and VAT tracking
// ═══════════════════════════════════════════════════════════════════════

export const sampleExpenses: Expense[] = [
  {
    id: 'exp_001', expenseNumber: 'EXP-2025-0001', date: '2025-02-01',
    category: 'rent-utilities', description: 'Office rent - February 2025 (Business Bay Tower)',
    amount: 10000, vatAmount: 0, totalAmount: 10000, vatStatus: 'exempt',
    paymentMethod: 'bank-transfer', paidTo: 'Business Bay Tower MGMT',
    referenceNumber: 'TT-2025-0050', accountCode: '5200', accountName: 'Rent',
    isTaxDeductible: true, isRecurring: true, recurringFrequency: 'monthly',
    status: 'paid', attachments: [],
    approvalHistory: [
      { id: 'ah_001', expenseId: 'exp_001', action: 'approved', performedBy: { id: 'usr_002', name: 'Mohammed Ali' }, date: '2025-01-30' },
    ],
    submittedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    approvedBy: { id: 'usr_002', name: 'Mohammed Ali' },
    createdAt: '2025-01-28T09:00:00Z', updatedAt: '2025-02-01T08:00:00Z',
  },
  {
    id: 'exp_002', expenseNumber: 'EXP-2025-0002', date: '2025-02-03',
    category: 'transportation-fuel', description: 'Fuel for service vans - Week 1 (ADNOC)',
    amount: 1200, vatAmount: 60, totalAmount: 1260, vatStatus: 'standard',
    paymentMethod: 'card', paidTo: 'ADNOC Station - Al Quoz',
    referenceNumber: 'CC-0123', accountCode: '5400', accountName: 'Transportation & Fuel',
    isTaxDeductible: true, isRecurring: false,
    status: 'approved',
    attachments: [
      { id: 'att_001', name: 'fuel_receipt_week1.pdf', url: '/uploads/fuel_receipt_week1.pdf', type: 'application/pdf', size: 120000, uploadedAt: '2025-02-03T14:00:00Z' },
    ],
    approvalHistory: [
      { id: 'ah_002', expenseId: 'exp_002', action: 'submitted', performedBy: { id: 'usr_003', name: 'Fatima Khan' }, date: '2025-02-03' },
      { id: 'ah_002b', expenseId: 'exp_002', action: 'approved', performedBy: { id: 'usr_002', name: 'Mohammed Ali' }, date: '2025-02-04' },
    ],
    submittedBy: { id: 'usr_003', name: 'Fatima Khan' },
    approvedBy: { id: 'usr_002', name: 'Mohammed Ali' },
    createdAt: '2025-02-03T13:00:00Z', updatedAt: '2025-02-04T10:00:00Z',
  },
  {
    id: 'exp_003', expenseNumber: 'EXP-2025-0003', date: '2025-02-05',
    category: 'office-supplies', description: 'Printer paper, toner, stationery (Office Hub Trading)',
    amount: 450, vatAmount: 22.5, totalAmount: 472.5, vatStatus: 'standard',
    paymentMethod: 'petty-cash', paidTo: 'Office Hub Trading',
    accountCode: '5800', accountName: 'Office Supplies',
    isTaxDeductible: true, isRecurring: false,
    status: 'pending-approval', attachments: [],
    approvalHistory: [
      { id: 'ah_003', expenseId: 'exp_003', action: 'submitted', performedBy: { id: 'usr_004', name: 'Ahmad Hassan' }, date: '2025-02-05' },
    ],
    submittedBy: { id: 'usr_004', name: 'Ahmad Hassan' },
    createdAt: '2025-02-05T16:00:00Z', updatedAt: '2025-02-05T16:00:00Z',
  },
  {
    id: 'exp_004', expenseNumber: 'EXP-2025-0004', date: '2025-02-07',
    category: 'professional-fees', description: 'Legal consultation - Contract review (Al Tamimi & Company)',
    amount: 3500, vatAmount: 175, totalAmount: 3675, vatStatus: 'standard',
    paymentMethod: 'bank-transfer', paidTo: 'Al Tamimi & Company',
    referenceNumber: 'TT-2025-0055', accountCode: '5600', accountName: 'Professional Fees',
    isTaxDeductible: true, isRecurring: false,
    status: 'approved', attachments: [],
    approvalHistory: [
      { id: 'ah_004', expenseId: 'exp_004', action: 'submitted', performedBy: { id: 'usr_001', name: 'Sara Ahmed' }, date: '2025-02-07' },
      { id: 'ah_004b', expenseId: 'exp_004', action: 'approved', performedBy: { id: 'usr_002', name: 'Mohammed Ali' }, comments: 'Approved - contract review for Emaar project', date: '2025-02-08' },
    ],
    submittedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    approvedBy: { id: 'usr_002', name: 'Mohammed Ali' },
    createdAt: '2025-02-07T11:00:00Z', updatedAt: '2025-02-08T09:00:00Z',
  },
  {
    id: 'exp_005', expenseNumber: 'EXP-2025-0005', date: '2025-02-10',
    category: 'marketing-advertising', description: 'Google Ads - February campaign (UAE service keywords)',
    amount: 2000, vatAmount: 0, totalAmount: 2000, vatStatus: 'zero-rated',
    paymentMethod: 'card', paidTo: 'Google Ireland Ltd',
    referenceNumber: 'GAD-2025-02', accountCode: '5300', accountName: 'Marketing & Advertising',
    isTaxDeductible: true, isRecurring: true, recurringFrequency: 'monthly',
    status: 'paid', attachments: [],
    approvalHistory: [
      { id: 'ah_005', expenseId: 'exp_005', action: 'approved', performedBy: { id: 'usr_002', name: 'Mohammed Ali' }, date: '2025-02-09' },
    ],
    submittedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    approvedBy: { id: 'usr_002', name: 'Mohammed Ali' },
    createdAt: '2025-02-09T08:00:00Z', updatedAt: '2025-02-10T08:00:00Z',
  },
  {
    id: 'exp_006', expenseNumber: 'EXP-2025-0006', date: '2025-01-31',
    category: 'salaries-wages', description: 'Staff salaries - January 2025 (8 employees)',
    amount: 32500, vatAmount: 0, totalAmount: 32500, vatStatus: 'exempt',
    paymentMethod: 'bank-transfer', paidTo: 'Employees',
    referenceNumber: 'SAL-2025-01', accountCode: '5100', accountName: 'Salaries & Wages',
    department: 'Operations',
    isTaxDeductible: true, isRecurring: true, recurringFrequency: 'monthly',
    status: 'paid', attachments: [],
    approvalHistory: [
      { id: 'ah_006', expenseId: 'exp_006', action: 'approved', performedBy: { id: 'usr_002', name: 'Mohammed Ali' }, date: '2025-01-30' },
    ],
    submittedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    approvedBy: { id: 'usr_002', name: 'Mohammed Ali' },
    createdAt: '2025-01-28T10:00:00Z', updatedAt: '2025-01-31T12:00:00Z',
  },
  {
    id: 'exp_007', expenseNumber: 'EXP-2025-0007', date: '2025-02-12',
    category: 'repairs-maintenance', description: 'Company vehicle repair - Van #3 (Al Quoz Auto)',
    amount: 850, vatAmount: 42.5, totalAmount: 892.5, vatStatus: 'standard',
    paymentMethod: 'cash', paidTo: 'Al Quoz Auto Repair',
    accountCode: '5900', accountName: 'Repairs & Maintenance',
    isTaxDeductible: true, isRecurring: false,
    status: 'pending-approval', attachments: [],
    approvalHistory: [
      { id: 'ah_007', expenseId: 'exp_007', action: 'submitted', performedBy: { id: 'usr_005', name: 'Khalid Omar' }, date: '2025-02-12' },
    ],
    submittedBy: { id: 'usr_005', name: 'Khalid Omar' },
    createdAt: '2025-02-12T17:00:00Z', updatedAt: '2025-02-12T17:00:00Z',
  },
  {
    id: 'exp_008', expenseNumber: 'EXP-2025-0008', date: '2025-02-01',
    category: 'insurance', description: 'Vehicle insurance renewal - All service vans (Oriental Insurance)',
    amount: 4500, vatAmount: 0, totalAmount: 4500, vatStatus: 'exempt',
    paymentMethod: 'bank-transfer', paidTo: 'Oriental Insurance',
    referenceNumber: 'TT-2025-0048', accountCode: '5500', accountName: 'Insurance',
    isTaxDeductible: true, isRecurring: true, recurringFrequency: 'annually',
    status: 'paid', attachments: [],
    approvalHistory: [
      { id: 'ah_008', expenseId: 'exp_008', action: 'approved', performedBy: { id: 'usr_002', name: 'Mohammed Ali' }, date: '2025-01-28' },
    ],
    submittedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    approvedBy: { id: 'usr_002', name: 'Mohammed Ali' },
    createdAt: '2025-01-27T09:00:00Z', updatedAt: '2025-02-01T08:00:00Z',
  },
]

export const sampleExpenseSummary: ExpenseSummary = {
  totalExpenses: 8,
  totalAmount: 55000,
  pendingApproval: 2,
  pendingAmount: 1365,
  approvedAmount: 7335,
  rejectedAmount: 0,
  byCategory: [
    { category: 'salaries-wages', label: 'Salaries & Wages', amount: 32500, count: 1 },
    { category: 'rent-utilities', label: 'Rent & Utilities', amount: 10000, count: 1 },
    { category: 'insurance', label: 'Insurance', amount: 4500, count: 1 },
    { category: 'professional-fees', label: 'Professional Fees', amount: 3500, count: 1 },
    { category: 'marketing-advertising', label: 'Marketing & Advertising', amount: 2000, count: 1 },
    { category: 'transportation-fuel', label: 'Transportation & Fuel', amount: 1200, count: 1 },
    { category: 'repairs-maintenance', label: 'Repairs & Maintenance', amount: 850, count: 1 },
    { category: 'office-supplies', label: 'Office Supplies', amount: 450, count: 1 },
  ],
  monthlyTrend: [
    { month: 'Sep 2024', amount: 48000 },
    { month: 'Oct 2024', amount: 52000 },
    { month: 'Nov 2024', amount: 49500 },
    { month: 'Dec 2024', amount: 55000 },
    { month: 'Jan 2025', amount: 51000 },
    { month: 'Feb 2025', amount: 55000 },
  ],
}

export const sampleBudgetVsActual: BudgetActual[] = [
  { category: 'salaries-wages', label: 'Salaries & Wages', budget: 35000, actual: 32500, variance: 2500, variancePercent: 7.14 },
  { category: 'rent-utilities', label: 'Rent & Utilities', budget: 12000, actual: 10000, variance: 2000, variancePercent: 16.67 },
  { category: 'marketing-advertising', label: 'Marketing & Advertising', budget: 3000, actual: 2000, variance: 1000, variancePercent: 33.33 },
  { category: 'transportation-fuel', label: 'Transportation & Fuel', budget: 2000, actual: 1200, variance: 800, variancePercent: 40 },
  { category: 'insurance', label: 'Insurance', budget: 5000, actual: 4500, variance: 500, variancePercent: 10 },
  { category: 'professional-fees', label: 'Professional Fees', budget: 2000, actual: 3500, variance: -1500, variancePercent: -75 },
  { category: 'office-supplies', label: 'Office Supplies', budget: 1000, actual: 450, variance: 550, variancePercent: 55 },
  { category: 'repairs-maintenance', label: 'Repairs & Maintenance', budget: 1500, actual: 850, variance: 650, variancePercent: 43.33 },
]

// ═══════════════════════════════════════════════════════════════════════
// BANK RECONCILIATION
// Bank statement transactions matched against book entries
// ═══════════════════════════════════════════════════════════════════════

export const sampleBankTransactions: BankTransaction[] = [
  { id: 'bt_001', date: '2025-01-05', description: 'TT from ADNOC - Invoice payment', reference: 'TT-0123', type: 'credit', amount: 80325, balance: 330325, matchStatus: 'matched', matchedEntryId: 'je_pay_001', matchedEntryNumber: 'JE-2025-PAY-001' },
  { id: 'bt_002', date: '2025-01-08', description: 'Salary Transfer - January', reference: 'SAL-2025-01', type: 'debit', amount: 32500, balance: 297825, matchStatus: 'matched', matchedEntryId: 'je_sal_001', matchedEntryNumber: 'JE-2025-SAL-001' },
  { id: 'bt_003', date: '2025-01-10', description: 'DEWA Bill Payment', reference: 'DEWA-0145', type: 'debit', amount: 3200, balance: 294625, matchStatus: 'matched', matchedEntryId: 'je_exp_001', matchedEntryNumber: 'JE-2025-EXP-001' },
  { id: 'bt_004', date: '2025-01-15', description: 'Cheque deposit - Al Futtaim Group', reference: 'CHQ-456789', type: 'credit', amount: 5000, balance: 299625, matchStatus: 'matched', matchedEntryId: 'je_pay_002', matchedEntryNumber: 'PAY-2025-002' },
  { id: 'bt_005', date: '2025-01-18', description: 'POS Terminal charges', type: 'debit', amount: 150, balance: 299475, matchStatus: 'unmatched', category: 'Bank Charges' },
  { id: 'bt_006', date: '2025-01-20', description: 'Rent Payment - Business Bay Tower', reference: 'TT-RENT-01', type: 'debit', amount: 10000, balance: 289475, matchStatus: 'matched', matchedEntryId: 'je_rent_001', matchedEntryNumber: 'JE-2025-RENT-001' },
  { id: 'bt_007', date: '2025-01-22', description: 'Credit Card Payment received - Emaar', type: 'credit', amount: 2205, balance: 291680, matchStatus: 'matched', matchedEntryId: 'je_pay_003', matchedEntryNumber: 'PAY-2025-003' },
  { id: 'bt_008', date: '2025-01-25', description: 'Interest credit - Emirates NBD savings', type: 'credit', amount: 125, balance: 291805, matchStatus: 'unmatched', category: 'Interest' },
  { id: 'bt_009', date: '2025-01-28', description: 'Vendor Payment - Emirates Electrical Supplies', reference: 'TT-VEND-01', type: 'debit', amount: 42000, balance: 249805, matchStatus: 'matched', matchedEntryId: 'je_vend_001', matchedEntryNumber: 'JE-2025-VEND-001' },
  { id: 'bt_010', date: '2025-01-29', description: 'Customer Transfer - Etisalat Facilities', type: 'credit', amount: 18750, balance: 268555, matchStatus: 'matched', matchedEntryId: 'je_pay_004', matchedEntryNumber: 'PAY-2025-004' },
  { id: 'bt_011', date: '2025-01-30', description: 'Monthly service charge - Emirates NBD', type: 'debit', amount: 200, balance: 268355, matchStatus: 'unmatched', category: 'Bank Charges' },
  { id: 'bt_012', date: '2025-01-30', description: 'Insurance premium - Oriental Insurance', reference: 'INS-2025-01', type: 'debit', amount: 4500, balance: 263855, matchStatus: 'matched', matchedEntryId: 'je_ins_001', matchedEntryNumber: 'JE-2025-INS-001' },
  { id: 'bt_013', date: '2025-01-31', description: 'Vendor Transfer - Gulf HVAC Parts', reference: 'TT-VEND-02', type: 'debit', amount: 15000, balance: 248855, matchStatus: 'matched' },
  { id: 'bt_014', date: '2025-01-31', description: 'Service Revenue Collection - Jumeirah Group', type: 'credit', amount: 36145, balance: 285000, matchStatus: 'matched' },
  { id: 'bt_015', date: '2025-01-31', description: 'End of month balance correction', type: 'credit', amount: 0, balance: 285000, matchStatus: 'matched' },
]

export const sampleReconciliationAdjustments: ReconciliationAdjustment[] = [
  { id: 'adj_001', date: '2025-01-18', description: 'POS Terminal charges', type: 'bank-charge', amount: 150, accountCode: '5950', accountName: 'Bank Charges' },
  { id: 'adj_002', date: '2025-01-25', description: 'Interest income - savings account', type: 'interest', amount: -125, accountCode: '4100', accountName: 'Interest Income' },
  { id: 'adj_003', date: '2025-01-30', description: 'Monthly service charge - Emirates NBD', type: 'bank-charge', amount: 200, accountCode: '5950', accountName: 'Bank Charges' },
]

export const sampleReconciliation: Reconciliation = {
  id: 'recon_001',
  reconciliationNumber: 'RECON-2025-001',
  bankAccountId: 'acc_1010',
  bankAccountName: 'Emirates NBD - Current Account',
  bankAccountCode: '1010',
  statementDate: '2025-01-31',
  statementOpeningBalance: 250000,
  statementClosingBalance: 285000,
  bookOpeningBalance: 250000,
  bookClosingBalance: 282500,
  totalMatched: 12,
  totalUnmatched: 3,
  totalBankCharges: 350,
  totalInterest: 125,
  status: 'in-progress',
  transactions: sampleBankTransactions,
  adjustments: sampleReconciliationAdjustments,
  reconciliationDifference: 2500,
  isReconciled: false,
  createdBy: { id: 'usr_001', name: 'Sara Ahmed' },
  createdAt: '2025-02-05T10:00:00Z',
  updatedAt: '2025-02-10T14:00:00Z',
}

export const sampleReconciliationSummary: ReconciliationSummary = {
  lastReconciliationDate: '2025-01-31',
  bookBalance: 282500,
  bankBalance: 285000,
  unreconciledItems: 3,
  totalDifference: 2500,
}

// ═══════════════════════════════════════════════════════════════════════
// VAT RETURNS
// UAE FTA quarterly/monthly VAT returns with 13-box format
// ═══════════════════════════════════════════════════════════════════════

/**
 * Pre-calculated VAT return boxes (avoiding runtime dependency on
 * calculateVATReturnBoxes utility for pure data).
 */
const vatBoxesQ4_2024: VATReturnBoxes = {
  box1StandardRatedSales: 320000,
  box2VATOnStandardRatedSales: 16000,
  box3ZeroRatedSales: 25000,
  box4ExemptSales: 8000,
  box5TotalSales: 353000,
  box6StandardRatedPurchases: 195000,
  box7VATOnStandardRatedPurchases: 9750,
  box8ZeroRatedPurchases: 12000,
  box9ExemptPurchases: 5000,
  box10TotalPurchases: 212000,
  box11VATDue: 6250,
  box12Adjustments: 0,
  box13NetVATDue: 6250,
}

const vatBoxesJan2025: VATReturnBoxes = {
  box1StandardRatedSales: 185000,
  box2VATOnStandardRatedSales: 9250,
  box3ZeroRatedSales: 10000,
  box4ExemptSales: 3000,
  box5TotalSales: 198000,
  box6StandardRatedPurchases: 110000,
  box7VATOnStandardRatedPurchases: 5500,
  box8ZeroRatedPurchases: 5000,
  box9ExemptPurchases: 2000,
  box10TotalPurchases: 117000,
  box11VATDue: 3750,
  box12Adjustments: 0,
  box13NetVATDue: 3750,
}

const vatBoxesFeb2025: VATReturnBoxes = {
  box1StandardRatedSales: 210000,
  box2VATOnStandardRatedSales: 10500,
  box3ZeroRatedSales: 15000,
  box4ExemptSales: 4000,
  box5TotalSales: 229000,
  box6StandardRatedPurchases: 125000,
  box7VATOnStandardRatedPurchases: 6250,
  box8ZeroRatedPurchases: 8000,
  box9ExemptPurchases: 3000,
  box10TotalPurchases: 136000,
  box11VATDue: 4250,
  box12Adjustments: 500,
  box13NetVATDue: 4750,
}

export const sampleVATReturns: VATReturn[] = [
  {
    id: 'vat_001', returnNumber: 'VAT-2025-Q4', periodType: 'quarterly',
    periodFrom: '2024-10-01', periodTo: '2024-12-31',
    companyTRN: '100000000000001', companyName: 'OptifySoft Technical Services LLC',
    boxes: vatBoxesQ4_2024,
    status: 'filed', filingDeadline: '2025-01-28',
    filedDate: '2025-01-25', paymentDate: '2025-01-26', paymentReference: 'FTA-2025-0001',
    preparedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    approvedBy: { id: 'usr_002', name: 'Mohammed Ali' },
    createdAt: '2025-01-20T10:00:00Z', updatedAt: '2025-01-26T10:00:00Z',
  },
  {
    id: 'vat_002', returnNumber: 'VAT-2025-01', periodType: 'monthly',
    periodFrom: '2025-01-01', periodTo: '2025-01-31',
    companyTRN: '100000000000001', companyName: 'OptifySoft Technical Services LLC',
    boxes: vatBoxesJan2025,
    status: 'paid', filingDeadline: '2025-02-28',
    filedDate: '2025-02-20', paymentDate: '2025-02-22', paymentReference: 'FTA-2025-0002',
    preparedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    approvedBy: { id: 'usr_002', name: 'Mohammed Ali' },
    createdAt: '2025-02-15T10:00:00Z', updatedAt: '2025-02-22T10:00:00Z',
  },
  {
    id: 'vat_003', returnNumber: 'VAT-2025-02', periodType: 'monthly',
    periodFrom: '2025-02-01', periodTo: '2025-02-28',
    companyTRN: '100000000000001', companyName: 'OptifySoft Technical Services LLC',
    boxes: vatBoxesFeb2025,
    status: 'calculated', filingDeadline: '2025-03-28',
    preparedBy: { id: 'usr_001', name: 'Sara Ahmed' },
    createdAt: '2025-02-25T10:00:00Z', updatedAt: '2025-02-25T10:00:00Z',
  },
]

export const sampleVATSummary: VATSummary = {
  currentPeriod: 'Feb 2025',
  outputVAT: 10500,
  inputVAT: 6250,
  netVATDue: 4750,
  nextFilingDeadline: '2025-03-28',
  pendingReturns: 1,
  filedReturns: 2,
}

export const sampleVATTransactionLines: VATTransactionLine[] = [
  {
    id: 'vtl_001', date: '2025-02-05', documentType: 'sales-invoice',
    documentNumber: 'INV-2025-0002', partyName: 'Al Futtaim Group',
    partyTRN: '100123456789012', taxableAmount: 7650, vatRate: 5, vatAmount: 382.5,
    vatStatus: 'standard',
  },
  {
    id: 'vtl_002', date: '2025-02-08', documentType: 'sales-invoice',
    documentNumber: 'INV-2025-0003', partyName: 'Jumeirah Group',
    partyTRN: '100345678901234', taxableAmount: 12000, vatRate: 5, vatAmount: 600,
    vatStatus: 'standard',
  },
  {
    id: 'vtl_003', date: '2025-02-01', documentType: 'purchase-bill',
    documentNumber: 'BILL-2025-0002', partyName: 'Gulf HVAC Parts Trading',
    partyTRN: '100222333444555', taxableAmount: 27142.86, vatRate: 5, vatAmount: 1357.14,
    vatStatus: 'standard',
  },
  {
    id: 'vtl_004', date: '2025-02-03', documentType: 'expense',
    documentNumber: 'EXP-2025-0002', partyName: 'ADNOC Station',
    taxableAmount: 1200, vatRate: 5, vatAmount: 60,
    vatStatus: 'standard',
  },
  {
    id: 'vtl_005', date: '2025-02-10', documentType: 'sales-invoice',
    documentNumber: 'INV-2025-0010', partyName: 'Etisalat Facilities',
    partyTRN: '100567890123456', taxableAmount: 17857.14, vatRate: 5, vatAmount: 892.86,
    vatStatus: 'standard',
  },
  {
    id: 'vtl_006', date: '2025-02-07', documentType: 'expense',
    documentNumber: 'EXP-2025-0004', partyName: 'Al Tamimi & Company',
    partyTRN: '100678901234567', taxableAmount: 3500, vatRate: 5, vatAmount: 175,
    vatStatus: 'standard',
  },
]

// ═══════════════════════════════════════════════════════════════════════
// FINANCIAL REPORTS
// Profit & Loss, Balance Sheet, Cash Flow, Trial Balance, KPIs
// ═══════════════════════════════════════════════════════════════════════

export const sampleProfitLossStatement: ProfitLossStatement = {
  period: { from: '2025-01-01', to: '2025-12-31', label: 'YTD 2025' },
  comparisonPeriod: { from: '2024-01-01', to: '2024-12-31', label: 'YTD 2024' },

  revenue: [
    { accountCode: '4001', accountName: 'Service Revenue', amount: 520000, previousAmount: 440000, change: 80000, changePercent: 18.18 },
    { accountCode: '4002', accountName: 'Product Sales', amount: 280000, previousAmount: 240000, change: 40000, changePercent: 16.67 },
    { accountCode: '4003', accountName: 'AMC Revenue', amount: 50000, previousAmount: 40000, change: 10000, changePercent: 25 },
  ],
  totalRevenue: 850000,
  previousTotalRevenue: 720000,

  cogs: [
    { accountCode: '5001', accountName: 'Cost of Goods Sold', amount: 180000, previousAmount: 155000 },
  ],
  totalCOGS: 180000,
  previousTotalCOGS: 155000,

  grossProfit: 670000,
  previousGrossProfit: 565000,
  grossProfitMargin: 78.82,

  operatingExpenses: [
    { accountCode: '5100', accountName: 'Salaries & Wages', amount: 195000, previousAmount: 170000 },
    { accountCode: '5200', accountName: 'Rent', amount: 60000, previousAmount: 55000 },
    { accountCode: '5201', accountName: 'Utilities (DEWA, Telecom)', amount: 18000, previousAmount: 16000 },
    { accountCode: '5300', accountName: 'Marketing & Advertising', amount: 25000, previousAmount: 22000 },
    { accountCode: '5400', accountName: 'Transportation & Fuel', amount: 22000, previousAmount: 20000 },
    { accountCode: '5500', accountName: 'Insurance', amount: 15000, previousAmount: 14000 },
    { accountCode: '5600', accountName: 'Professional Fees', amount: 12000, previousAmount: 10000 },
    { accountCode: '5700', accountName: 'Depreciation', amount: 28000, previousAmount: 25000 },
    { accountCode: '5800', accountName: 'Office Supplies', amount: 8000, previousAmount: 7000 },
    { accountCode: '5900', accountName: 'Repairs & Maintenance', amount: 17000, previousAmount: 11000 },
  ],
  totalOperatingExpenses: 400000,
  previousTotalOperatingExpenses: 350000,

  operatingProfit: 270000,
  previousOperatingProfit: 215000,
  operatingProfitMargin: 31.76,

  otherIncome: [
    { accountCode: '4100', accountName: 'Interest Income', amount: 3000 },
    { accountCode: '4101', accountName: 'Miscellaneous Income', amount: 2000 },
  ],
  totalOtherIncome: 5000,

  otherExpenses: [
    { accountCode: '5950', accountName: 'Bank Charges', amount: 1200 },
    { accountCode: '5951', accountName: 'Interest Expense', amount: 800 },
  ],
  totalOtherExpenses: 2000,

  netProfit: 273000,
  previousNetProfit: 218000,
  netProfitMargin: 32.12,

  generatedAt: '2025-02-15T10:00:00Z',
}

export const sampleBalanceSheet: BalanceSheet = {
  asOfDate: '2025-02-15',
  comparisonDate: '2024-12-31',

  currentAssets: [
    { accountCode: '1001', accountName: 'Cash on Hand', amount: 15000 },
    { accountCode: '1002', accountName: 'Petty Cash', amount: 2500 },
    { accountCode: '1010', accountName: 'Emirates NBD - Current', amount: 285000, previousAmount: 250000 },
    { accountCode: '1011', accountName: 'ADCB - Savings', amount: 150000, previousAmount: 140000 },
    { accountCode: '1100', accountName: 'Accounts Receivable', amount: 245000, previousAmount: 200000 },
    { accountCode: '1200', accountName: 'Inventory', amount: 180000, previousAmount: 165000 },
    { accountCode: '1300', accountName: 'Prepaid Expenses', amount: 35000, previousAmount: 40000 },
  ],
  totalCurrentAssets: 912500,

  fixedAssets: [
    { accountCode: '1501', accountName: 'Vehicles', amount: 180000 },
    { accountCode: '1502', accountName: 'Equipment & Tools', amount: 95000 },
    { accountCode: '1503', accountName: 'Furniture & Fixtures', amount: 45000 },
    { accountCode: '1550', accountName: 'Accumulated Depreciation', amount: -85000 },
  ],
  totalFixedAssets: 235000,
  totalAssets: 1147500,
  previousTotalAssets: 1050000,

  currentLiabilities: [
    { accountCode: '2100', accountName: 'Accounts Payable', amount: 125000, previousAmount: 110000 },
    { accountCode: '2200', accountName: 'VAT Payable', amount: 18500, previousAmount: 15000 },
    { accountCode: '2300', accountName: 'Accrued Expenses', amount: 45000, previousAmount: 40000 },
  ],
  totalCurrentLiabilities: 188500,

  longTermLiabilities: [
    { accountCode: '2400', accountName: 'Bank Loan - Emirates NBD', amount: 100000, previousAmount: 115000 },
  ],
  totalLongTermLiabilities: 100000,
  totalLiabilities: 288500,
  previousTotalLiabilities: 280000,

  equity: [
    { accountCode: '3001', accountName: "Owner's Capital", amount: 300000 },
    { accountCode: '3100', accountName: 'Retained Earnings', amount: 289000, previousAmount: 200000 },
    { accountCode: '', accountName: 'Net Profit (Current Year)', amount: 270000 },
  ],
  totalEquity: 859000,
  previousTotalEquity: 770000,

  isBalanced: true,
  totalLiabilitiesAndEquity: 1147500,

  generatedAt: '2025-02-15T10:00:00Z',
}

export const sampleCashFlowStatement: CashFlowStatement = {
  period: { from: '2025-01-01', to: '2025-02-28', label: 'Jan-Feb 2025' },

  operatingActivities: [
    { accountCode: '', accountName: 'Net Profit', amount: 273000 },
    { accountCode: '', accountName: 'Depreciation (non-cash)', amount: 28000 },
    { accountCode: '', accountName: 'Increase in Accounts Receivable', amount: -45000 },
    { accountCode: '', accountName: 'Increase in Inventory', amount: -15000 },
    { accountCode: '', accountName: 'Increase in Accounts Payable', amount: 20000 },
    { accountCode: '', accountName: 'Increase in Accrued Expenses', amount: 5000 },
  ],
  netCashFromOperating: 266000,

  investingActivities: [
    { accountCode: '', accountName: 'Purchase of Equipment', amount: -25000 },
    { accountCode: '', accountName: 'Purchase of Vehicles', amount: -50000 },
  ],
  netCashFromInvesting: -75000,

  financingActivities: [
    { accountCode: '', accountName: 'Bank Loan Repayment', amount: -15000 },
    { accountCode: '', accountName: 'Owner Drawings', amount: -20000 },
  ],
  netCashFromFinancing: -35000,

  netChangeInCash: 156000,
  beginningCashBalance: 296500,
  endingCashBalance: 452500,

  generatedAt: '2025-02-15T10:00:00Z',
}

export const sampleTrialBalance: TrialBalance = {
  asOfDate: '2025-02-15',
  entries: [
    // Assets (debit balances)
    { accountCode: '1001', accountName: 'Cash on Hand', accountType: 'asset', debit: 15000, credit: 0 },
    { accountCode: '1002', accountName: 'Petty Cash', accountType: 'asset', debit: 2500, credit: 0 },
    { accountCode: '1010', accountName: 'Emirates NBD - Current', accountType: 'asset', debit: 285000, credit: 0 },
    { accountCode: '1011', accountName: 'ADCB - Savings', accountType: 'asset', debit: 150000, credit: 0 },
    { accountCode: '1100', accountName: 'Accounts Receivable', accountType: 'asset', debit: 245000, credit: 0 },
    { accountCode: '1200', accountName: 'Inventory', accountType: 'asset', debit: 180000, credit: 0 },
    { accountCode: '1300', accountName: 'Prepaid Expenses', accountType: 'asset', debit: 35000, credit: 0 },
    { accountCode: '1501', accountName: 'Vehicles', accountType: 'asset', debit: 180000, credit: 0 },
    { accountCode: '1502', accountName: 'Equipment & Tools', accountType: 'asset', debit: 95000, credit: 0 },
    { accountCode: '1503', accountName: 'Furniture & Fixtures', accountType: 'asset', debit: 45000, credit: 0 },
    { accountCode: '1550', accountName: 'Accumulated Depreciation', accountType: 'asset', debit: 0, credit: 85000 },
    // Liabilities (credit balances)
    { accountCode: '2100', accountName: 'Accounts Payable', accountType: 'liability', debit: 0, credit: 125000 },
    { accountCode: '2200', accountName: 'VAT Payable', accountType: 'liability', debit: 0, credit: 18500 },
    { accountCode: '2300', accountName: 'Accrued Expenses', accountType: 'liability', debit: 0, credit: 45000 },
    { accountCode: '2400', accountName: 'Bank Loan - Emirates NBD', accountType: 'liability', debit: 0, credit: 100000 },
    // Equity (credit balances)
    { accountCode: '3001', accountName: "Owner's Capital", accountType: 'equity', debit: 0, credit: 300000 },
    { accountCode: '3100', accountName: 'Retained Earnings', accountType: 'equity', debit: 0, credit: 309000 },
    // Revenue (credit balances)
    { accountCode: '4001', accountName: 'Service Revenue', accountType: 'revenue', debit: 0, credit: 520000 },
    { accountCode: '4002', accountName: 'Product Sales', accountType: 'revenue', debit: 0, credit: 280000 },
    { accountCode: '4003', accountName: 'AMC Revenue', accountType: 'revenue', debit: 0, credit: 50000 },
    // Expenses (debit balances)
    { accountCode: '5001', accountName: 'Cost of Goods Sold', accountType: 'expense', debit: 180000, credit: 0 },
    { accountCode: '5100', accountName: 'Salaries & Wages', accountType: 'expense', debit: 195000, credit: 0 },
    { accountCode: '5200', accountName: 'Rent', accountType: 'expense', debit: 60000, credit: 0 },
    { accountCode: '5201', accountName: 'Utilities', accountType: 'expense', debit: 18000, credit: 0 },
    { accountCode: '5300', accountName: 'Marketing & Advertising', accountType: 'expense', debit: 25000, credit: 0 },
    { accountCode: '5400', accountName: 'Transportation & Fuel', accountType: 'expense', debit: 22000, credit: 0 },
    { accountCode: '5500', accountName: 'Insurance', accountType: 'expense', debit: 15000, credit: 0 },
    { accountCode: '5600', accountName: 'Professional Fees', accountType: 'expense', debit: 12000, credit: 0 },
    { accountCode: '5700', accountName: 'Depreciation', accountType: 'expense', debit: 28000, credit: 0 },
    { accountCode: '5800', accountName: 'Office Supplies', accountType: 'expense', debit: 8000, credit: 0 },
    { accountCode: '5900', accountName: 'Repairs & Maintenance', accountType: 'expense', debit: 17000, credit: 0 },
  ] satisfies TrialBalanceEntry[],
  totalDebits: 1812500,
  totalCredits: 1832500,
  isBalanced: false,
  generatedAt: '2025-02-15T10:00:00Z',
}

export const sampleFinancialKPIs: FinancialKPIs = {
  totalRevenueMTD: 145000,
  totalRevenueYTD: 850000,
  totalExpensesMTD: 95000,
  totalExpensesYTD: 580000,
  netProfitMTD: 50000,
  netProfitYTD: 270000,
  profitMargin: 31.76,
  cashBalance: 452500,
  arOutstanding: 181757.5,
  apOutstanding: 94500,
  vatPayable: 10000,
  currentRatio: 4.84,

  revenueTrend: [
    { month: 'Sep 2024', revenue: 120000, expenses: 85000 },
    { month: 'Oct 2024', revenue: 135000, expenses: 92000 },
    { month: 'Nov 2024', revenue: 128000, expenses: 88000 },
    { month: 'Dec 2024', revenue: 155000, expenses: 105000 },
    { month: 'Jan 2025', revenue: 145000, expenses: 98000 },
    { month: 'Feb 2025', revenue: 167000, expenses: 112000 },
  ],

  expenseBreakdown: [
    { category: 'Salaries & Wages', amount: 195000, percentage: 33.6 },
    { category: 'Cost of Goods Sold', amount: 180000, percentage: 31.0 },
    { category: 'Rent & Utilities', amount: 78000, percentage: 13.4 },
    { category: 'Depreciation', amount: 28000, percentage: 4.8 },
    { category: 'Marketing & Advertising', amount: 25000, percentage: 4.3 },
    { category: 'Other', amount: 74000, percentage: 12.8 },
  ],

  cashFlowTrend: [
    { month: 'Sep 2024', inflow: 130000, outflow: 95000, net: 35000 },
    { month: 'Oct 2024', inflow: 145000, outflow: 100000, net: 45000 },
    { month: 'Nov 2024', inflow: 135000, outflow: 98000, net: 37000 },
    { month: 'Dec 2024', inflow: 165000, outflow: 115000, net: 50000 },
    { month: 'Jan 2025', inflow: 155000, outflow: 108000, net: 47000 },
    { month: 'Feb 2025', inflow: 175000, outflow: 120000, net: 55000 },
  ],

  topCustomersByRevenue: [
    { name: 'ADNOC', revenue: 85000 },
    { name: 'Emaar Properties', revenue: 65000 },
    { name: 'Jumeirah Group', revenue: 55000 },
    { name: 'Al Futtaim Group', revenue: 48000 },
    { name: 'Nakheel Properties', revenue: 42000 },
  ],

  topExpenseCategories: [
    { category: 'Salaries & Wages', amount: 195000 },
    { category: 'Cost of Goods Sold', amount: 180000 },
    { category: 'Rent', amount: 60000 },
    { category: 'Depreciation', amount: 28000 },
    { category: 'Marketing & Advertising', amount: 25000 },
  ],
}
