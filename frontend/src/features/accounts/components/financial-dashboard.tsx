/**
 * Financial Dashboard Component
 * Phase 9: Accounts/Finance Module
 *
 * KPIs, charts, and key metrics overview
 * Fully responsive
 */

import { useTranslation } from 'react-i18next'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useCurrency } from '@/contexts/currency-context'
import { cn } from '@/lib/utils'
import { sampleFinancialKPIs } from '@/data/accounts.data'

const COLORS = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#be185d', '#84cc16']

export function FinancialDashboard() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const isLoading = false
  const kpis = sampleFinancialKPIs

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><p className="text-muted-foreground">{t('common.loading')}</p></div>
  }

  if (!kpis) return null

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          label={t('accounts.revenueMTD')}
          value={formatAmount(kpis.totalRevenueMTD)}
          icon={<DollarSign className="h-4 w-4" />}
          color="text-green-600"
        />
        <KPICard
          label={t('accounts.expensesMTD')}
          value={formatAmount(kpis.totalExpensesMTD)}
          icon={<Receipt className="h-4 w-4" />}
          color="text-red-600"
        />
        <KPICard
          label={t('accounts.netProfitMTD')}
          value={formatAmount(kpis.netProfitMTD)}
          icon={kpis.netProfitMTD >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          color={kpis.netProfitMTD >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <KPICard
          label={t('accounts.cashBalance')}
          value={formatAmount(kpis.cashBalance)}
          icon={<Wallet className="h-4 w-4" />}
          color="text-blue-600"
        />
        <KPICard
          label={t('accounts.arOutstanding')}
          value={formatAmount(kpis.arOutstanding)}
          icon={<ArrowUpRight className="h-4 w-4" />}
          color="text-amber-600"
        />
        <KPICard
          label={t('accounts.apOutstanding')}
          value={formatAmount(kpis.apOutstanding)}
          icon={<ArrowDownRight className="h-4 w-4" />}
          color="text-orange-600"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SecondaryKPI label={t('accounts.revenueYTD')} value={formatAmount(kpis.totalRevenueYTD)} />
        <SecondaryKPI label={t('accounts.profitMargin')} value={`${kpis.profitMargin.toFixed(1)}%`} />
        <SecondaryKPI label={t('accounts.currentRatio')} value={kpis.currentRatio.toFixed(2)} />
        <SecondaryKPI label={t('accounts.vatPayable')} value={formatAmount(kpis.vatPayable)} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.revenueVsExpenses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpis.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => formatAmount(value ?? 0)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} name={t('accounts.revenue')} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2} name={t('accounts.expenses')} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.expenseBreakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kpis.expenseBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {kpis.expenseBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number | undefined) => formatAmount(value ?? 0)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Trend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('accounts.cashFlowTrend')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpis.cashFlowTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(value: number | undefined) => formatAmount(value ?? 0)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="inflow" fill="#059669" name={t('accounts.inflow')} radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#dc2626" name={t('accounts.outflow')} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers & Top Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.topCustomers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kpis.topCustomersByRevenue.map((customer, idx) => {
                const maxRevenue = kpis.topCustomersByRevenue[0]?.revenue || 1
                const percentage = (customer.revenue / maxRevenue) * 100
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{customer.name}</span>
                      <span>{formatAmount(customer.revenue)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.topExpenseCategories')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kpis.topExpenseCategories.map((cat, idx) => {
                const maxAmount = kpis.topExpenseCategories[0]?.amount || 1
                const percentage = (cat.amount / maxAmount) * 100
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{cat.category}</span>
                      <span>{formatAmount(cat.amount)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPICard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
          <div className={cn('p-1 rounded', color)}>{icon}</div>
        </div>
        <p className={cn('text-lg sm:text-xl font-bold truncate', color)}>{value}</p>
      </CardContent>
    </Card>
  )
}

function SecondaryKPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3 sm:p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-0.5">{value}</p>
    </div>
  )
}

export default FinancialDashboard
