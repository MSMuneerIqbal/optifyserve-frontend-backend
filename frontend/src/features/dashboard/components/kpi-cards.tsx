/**
 * KPI Cards Component
 * Phase 3: Dashboard Module
 *
 * Displays key performance indicators with sparkline trends
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import type { DashboardKPIs, KPIMetric } from '../types/dashboard.types'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Wrench,
  Star,
  FileText,
  Package,
  Users,
  UserPlus,
} from 'lucide-react'
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts'

interface KPICardsProps {
  kpis: DashboardKPIs
}

// Map KPI keys to icons
const kpiIcons: Record<string, React.ElementType> = {
  totalRevenue: DollarSign,
  activeJobs: Briefcase,
  firstTimeFix: Wrench,
  customerSatisfaction: Star,
  pendingInvoices: FileText,
  lowStockAlerts: Package,
  activeTechnicians: Users,
  newCustomers: UserPlus,
}

// Map KPI keys to colors
const kpiColors: Record<string, string> = {
  totalRevenue: 'text-emerald-600',
  activeJobs: 'text-blue-600',
  firstTimeFix: 'text-purple-600',
  customerSatisfaction: 'text-amber-600',
  pendingInvoices: 'text-orange-600',
  lowStockAlerts: 'text-red-600',
  activeTechnicians: 'text-cyan-600',
  newCustomers: 'text-primary',
}

const sparklineColors: Record<string, string> = {
  totalRevenue: '#10b981',
  activeJobs: '#2563eb',
  firstTimeFix: '#9333ea',
  customerSatisfaction: '#d97706',
  pendingInvoices: '#ea580c',
  lowStockAlerts: '#dc2626',
  activeTechnicians: '#0891b2',
  newCustomers: '#4f46e5',
}

interface KPICardProps {
  keyName: string
  metric: KPIMetric
}

function KPICard({ keyName, metric }: KPICardProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const Icon = kpiIcons[keyName] || DollarSign
  const iconColor = kpiColors[keyName] || 'text-gray-600'
  const lineColor = sparklineColors[keyName] || '#6b7280'

  // Transform trend data for Recharts
  const chartData = metric.trend.map((value, index) => ({
    index,
    value,
  }))

  // Format the value based on prefix/suffix
  const formatValue = () => {
    if (metric.prefix === 'AED') {
      return formatAmount(metric.value as number)
    }
    if (metric.suffix === '%') {
      return `${metric.value}%`
    }
    if (metric.suffix === '/5') {
      return `${metric.value}/5`
    }
    return metric.value.toLocaleString()
  }

  const isPositive = metric.changeType === 'increase'
  // For some metrics, decrease is good (like pending invoices, low stock alerts)
  const isGoodChange = ['pendingInvoices', 'lowStockAlerts'].includes(keyName)
    ? !isPositive
    : isPositive

  return (
    <Card className="group hover:border-primary/30 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Label */}
            <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide truncate">
              {metric.label}
            </p>

            {/* Value */}
            <p className="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
              {formatValue()}
            </p>

            {/* Change indicator */}
            <div className="mt-2 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp
                  className={cn(
                    'h-4 w-4',
                    isGoodChange ? 'text-emerald-600' : 'text-red-600'
                  )}
                />
              ) : (
                <TrendingDown
                  className={cn(
                    'h-4 w-4',
                    isGoodChange ? 'text-emerald-600' : 'text-red-600'
                  )}
                />
              )}
              <span
                className={cn(
                  'text-xs sm:text-sm font-medium',
                  isGoodChange ? 'text-emerald-600' : 'text-red-600'
                )}
              >
                {isPositive ? '+' : ''}
                {metric.change}
                {metric.suffix === '%' ? ' pts' : '%'}
              </span>
              <span className="text-xs text-muted-foreground">{t('common.vsLastPeriod')}</span>
            </div>
          </div>

          {/* Icon and Sparkline */}
          <div className="flex flex-col items-end gap-2 ms-4">
            <div
              className={cn(
                'p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors',
                iconColor
              )}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            {/* Mini Sparkline */}
            <div className="w-16 h-6 sm:w-20 sm:h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={lineColor}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICards({ kpis }: KPICardsProps) {
  // Define the order and which KPIs to display (top 4 for main view)
  const primaryKPIs: (keyof DashboardKPIs)[] = [
    'totalRevenue',
    'activeJobs',
    'firstTimeFix',
    'customerSatisfaction',
  ]

  const secondaryKPIs: (keyof DashboardKPIs)[] = [
    'pendingInvoices',
    'lowStockAlerts',
    'activeTechnicians',
    'newCustomers',
  ]

  return (
    <div className="space-y-4">
      {/* Primary KPIs - Top row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryKPIs.map((key) => (
          <KPICard key={key} keyName={key} metric={kpis[key]} />
        ))}
      </div>

      {/* Secondary KPIs - Bottom row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryKPIs.map((key) => (
          <KPICard key={key} keyName={key} metric={kpis[key]} />
        ))}
      </div>
    </div>
  )
}

export default KPICards
