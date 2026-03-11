/**
 * Main Application Component
 * UAE Service ERP Frontend
 *
 * Routes configuration with authentication protection
 * Uses Redux store for state management
 * All pages are lazy-loaded for code splitting
 */

import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'

import { store } from '@/store'
import { AuthProvider } from '@/contexts/auth-context'
import { CurrencyProvider } from '@/contexts/currency-context'
import { useDirection } from '@/hooks/use-direction'
import { AppLayout } from '@/components/layout/app-layout'
import { ProtectedRoute } from './protected-route'
import { FloatingThemeButton } from '@/features/settings/theme/components/floating-theme-button'
import { useThemeApplicator } from '@/features/settings/theme/useThemeApplicator'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Auth (eagerly loaded — needed immediately)
import { LoginPage, ForgotPasswordPage } from '@/features/auth'

// Dashboard
const DashboardPage = lazy(() => import('@/features/dashboard/pages/dashboard-page').then(m => ({ default: m.DashboardPage })))

// CRM
const CustomersPage = lazy(() => import('@/features/crm/pages/customers-page').then(m => ({ default: m.CustomersPage })))
const LeadsPage = lazy(() => import('@/features/crm/pages/leads-page').then(m => ({ default: m.LeadsPage })))

// Sales
const QuotationsPage = lazy(() => import('@/features/sales/pages/quotations-page').then(m => ({ default: m.QuotationsPage })))
const InvoicesPage = lazy(() => import('@/features/sales/pages/invoices-page').then(m => ({ default: m.InvoicesPage })))

// Inventory
const ItemsPage = lazy(() => import('@/features/inventory/pages/items-page').then(m => ({ default: m.ItemsPage })))
const WarehousesPage = lazy(() => import('@/features/inventory/pages/warehouses-page').then(m => ({ default: m.WarehousesPage })))
const StockMovementsPage = lazy(() => import('@/features/inventory/pages/stock-movements-page').then(m => ({ default: m.StockMovementsPage })))
const CurrentStockPage = lazy(() => import('@/features/inventory/pages/current-stock-page').then(m => ({ default: m.CurrentStockPage })))
const StockReportsPage = lazy(() => import('@/features/inventory/pages/stock-reports-page').then(m => ({ default: m.StockReportsPage })))

// Purchase
const VendorsPage = lazy(() => import('@/features/purchase/pages/vendors-page').then(m => ({ default: m.VendorsPage })))
const PurchaseOrdersPage = lazy(() => import('@/features/purchase/pages/purchase-orders-page').then(m => ({ default: m.PurchaseOrdersPage })))
const GRNPage = lazy(() => import('@/features/purchase/pages/grn-page').then(m => ({ default: m.GRNPage })))
const PurchaseReturnsPage = lazy(() => import('@/features/purchase/pages/purchase-returns-page').then(m => ({ default: m.PurchaseReturnsPage })))
const VendorPaymentsPage = lazy(() => import('@/features/purchase/pages/vendor-payments-page').then(m => ({ default: m.VendorPaymentsPage })))

// Accounts
const ChartOfAccountsPage = lazy(() => import('@/features/accounts/pages/chart-of-accounts-page').then(m => ({ default: m.ChartOfAccountsPage })))
const AccountsReceivablePage = lazy(() => import('@/features/accounts/pages/accounts-receivable-page').then(m => ({ default: m.AccountsReceivablePage })))
const AccountsPayablePage = lazy(() => import('@/features/accounts/pages/accounts-payable-page').then(m => ({ default: m.AccountsPayablePage })))
const ExpensesPage = lazy(() => import('@/features/accounts/pages/expenses-page').then(m => ({ default: m.ExpensesPage })))
const JournalEntriesPage = lazy(() => import('@/features/accounts/pages/journal-entries-page').then(m => ({ default: m.JournalEntriesPage })))
const VATReturnsPage = lazy(() => import('@/features/accounts/pages/vat-returns-page').then(m => ({ default: m.VATReturnsPage })))
const FinancialReportsPage = lazy(() => import('@/features/accounts/pages/financial-reports-page').then(m => ({ default: m.FinancialReportsPage })))
const BankReconciliationPage = lazy(() => import('@/features/accounts/pages/bank-reconciliation-page').then(m => ({ default: m.BankReconciliationPage })))
const FinancialDashboardPage = lazy(() => import('@/features/accounts/pages/financial-dashboard-page').then(m => ({ default: m.FinancialDashboardPage })))

// HR
const EmployeesPage = lazy(() => import('@/features/hr/pages/employees-page').then(m => ({ default: m.EmployeesPage })))
const DepartmentsPage = lazy(() => import('@/features/hr/pages/departments-page').then(m => ({ default: m.DepartmentsPage })))
const AttendancePage = lazy(() => import('@/features/hr/pages/attendance-page').then(m => ({ default: m.AttendancePage })))
const LeavesPage = lazy(() => import('@/features/hr/pages/leaves-page').then(m => ({ default: m.LeavesPage })))
const PayrollPage = lazy(() => import('@/features/hr/pages/payroll-page').then(m => ({ default: m.PayrollPage })))
const EOSBPage = lazy(() => import('@/features/hr/pages/eosb-page').then(m => ({ default: m.EOSBPage })))
const DocumentsPage = lazy(() => import('@/features/hr/pages/documents-page').then(m => ({ default: m.DocumentsPage })))
const PerformancePage = lazy(() => import('@/features/hr/pages/performance-page').then(m => ({ default: m.PerformancePage })))
const HRReportsPage = lazy(() => import('@/features/hr/pages/hr-reports-page').then(m => ({ default: m.HRReportsPage })))
const EmployeePortalPage = lazy(() => import('@/features/hr/pages/employee-portal-page').then(m => ({ default: m.EmployeePortalPage })))

// Jobs
const JobsPage = lazy(() => import('@/features/jobs/pages/jobs-page').then(m => ({ default: m.JobsPage })))
const TechniciansPage = lazy(() => import('@/features/jobs/pages/technicians-page').then(m => ({ default: m.TechniciansPage })))
const JobSchedulingPage = lazy(() => import('@/features/jobs/pages/job-scheduling-page').then(m => ({ default: m.JobSchedulingPage })))
const ServiceReportsPage = lazy(() => import('@/features/jobs/pages/service-reports-page').then(m => ({ default: m.ServiceReportsPage })))
const JobReportsPage = lazy(() => import('@/features/jobs/pages/job-reports-page').then(m => ({ default: m.JobReportsPage })))

// Dispatcher
const DispatcherPage = lazy(() => import('@/features/dispatcher/pages/dispatcher-page').then(m => ({ default: m.DispatcherPage })))

// User Management
const UsersPage = lazy(() => import('@/features/user-management/pages/users-page').then(m => ({ default: m.UsersPage })))
const RolesPage = lazy(() => import('@/features/user-management/pages/roles-page').then(m => ({ default: m.RolesPage })))

// Platform Administration
const TenantsPage = lazy(() => import('@/features/admin/pages/tenants-page').then(m => ({ default: m.TenantsPage })))
const PlansPage = lazy(() => import('@/features/admin/pages/plans-page').then(m => ({ default: m.PlansPage })))
const AdminAnalyticsPage = lazy(() => import('@/features/admin/pages/analytics-page').then(m => ({ default: m.AnalyticsPage })))

// Audit Logs
const AuditPage = lazy(() => import('@/features/audit/pages/audit-page').then(m => ({ default: m.AuditPage })))

// Settings
const SettingsPage = lazy(() => import('@/features/settings/pages/settings-page').then(m => ({ default: m.SettingsPage })))

function PageLoader() {
  return <LoadingSpinner variant="fullPage" />
}

function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{t('common.notFound.title')}</h1>
      <p className="mt-2 text-base sm:text-lg text-muted-foreground">
        {t('common.notFound.message')}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('common.notFound.description')}
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
      >
        {t('common.notFound.goToDashboard')}
      </Link>
    </div>
  )
}

/**
 * Protected Route Layout Wrapper
 * Wraps routes that require authentication with the ProtectedRoute component
 */
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  )
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  useThemeApplicator()
  useDirection()
  return <>{children}</>
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
      <CurrencyProvider>
      <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes - Wrapped in AppLayout with ProtectedRoute */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* CRM Routes */}
            <Route path="/crm" element={<Navigate to="/crm/customers" replace />} />
            <Route path="/crm/customers" element={<CustomersPage />} />
            <Route path="/crm/leads" element={<LeadsPage />} />
            {/* Sales Routes */}
            <Route path="/sales" element={<Navigate to="/sales/quotations" replace />} />
            <Route path="/sales/quotations" element={<QuotationsPage />} />
            <Route path="/sales/invoices" element={<InvoicesPage />} />
            {/* Inventory Routes */}
            <Route path="/inventory" element={<Navigate to="/inventory/items" replace />} />
            <Route path="/inventory/items" element={<ItemsPage />} />
            <Route path="/inventory/warehouses" element={<WarehousesPage />} />
            <Route path="/inventory/movements" element={<StockMovementsPage />} />
            <Route path="/inventory/stock" element={<CurrentStockPage />} />
            <Route path="/inventory/reports" element={<StockReportsPage />} />
            {/* Purchase Routes */}
            <Route path="/purchase" element={<Navigate to="/purchase/orders" replace />} />
            <Route path="/purchase/vendors" element={<VendorsPage />} />
            <Route path="/purchase/orders" element={<PurchaseOrdersPage />} />
            <Route path="/purchase/grn" element={<GRNPage />} />
            <Route path="/purchase/returns" element={<PurchaseReturnsPage />} />
            <Route path="/purchase/payments" element={<VendorPaymentsPage />} />
            {/* Accounts Routes */}
            <Route path="/accounts" element={<Navigate to="/accounts/dashboard" replace />} />
            <Route path="/accounts/dashboard" element={<FinancialDashboardPage />} />
            <Route path="/accounts/chart" element={<ChartOfAccountsPage />} />
            <Route path="/accounts/receivable" element={<AccountsReceivablePage />} />
            <Route path="/accounts/payable" element={<AccountsPayablePage />} />
            <Route path="/accounts/expenses" element={<ExpensesPage />} />
            <Route path="/accounts/journal" element={<JournalEntriesPage />} />
            <Route path="/accounts/vat" element={<VATReturnsPage />} />
            <Route path="/accounts/reports" element={<FinancialReportsPage />} />
            <Route path="/accounts/reconciliation" element={<BankReconciliationPage />} />
            {/* HR Routes */}
            <Route path="/hr" element={<Navigate to="/hr/employees" replace />} />
            <Route path="/hr/employees" element={<EmployeesPage />} />
            <Route path="/hr/departments" element={<DepartmentsPage />} />
            <Route path="/hr/attendance" element={<AttendancePage />} />
            <Route path="/hr/leave" element={<LeavesPage />} />
            <Route path="/hr/payroll" element={<PayrollPage />} />
            <Route path="/hr/eosb" element={<EOSBPage />} />
            <Route path="/hr/documents" element={<DocumentsPage />} />
            <Route path="/hr/performance" element={<PerformancePage />} />
            <Route path="/hr/reports" element={<HRReportsPage />} />
            <Route path="/hr/portal" element={<EmployeePortalPage />} />
            {/* Jobs Routes */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/technicians" element={<TechniciansPage />} />
            <Route path="/jobs/schedule" element={<JobSchedulingPage />} />
            <Route path="/jobs/reports" element={<ServiceReportsPage />} />
            <Route path="/jobs/analytics" element={<JobReportsPage />} />
            {/* Dispatcher Routes */}
            <Route path="/dispatcher" element={<DispatcherPage />} />
            {/* User Management Routes */}
            <Route path="/users" element={<Navigate to="/users/list" replace />} />
            <Route path="/users/list" element={<UsersPage />} />
            <Route path="/users/roles" element={<RolesPage />} />
            {/* Platform Administration Routes */}
            <Route path="/admin" element={<Navigate to="/admin/tenants" replace />} />
            <Route path="/admin/tenants" element={<TenantsPage />} />
            <Route path="/admin/plans" element={<PlansPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            {/* Audit Logs Route */}
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>

      {/* Floating Theme Customizer Button */}
      <FloatingThemeButton />
      </ThemeProvider>
      </CurrencyProvider>
      </AuthProvider>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          className: 'font-sans',
        }}
      />
    </Provider>
  )
}

export default App
