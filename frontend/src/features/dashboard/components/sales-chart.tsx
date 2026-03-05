/**
 * Sales Chart Component
 * Phase 3: Dashboard Module
 *
 * Displays sales trend by emirate using Recharts
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { SalesData, ChartPeriod } from '../types/dashboard.types'
import { cn } from '@/lib/utils'

interface SalesChartProps {
  data: SalesData[]
  isLoading?: boolean
}

// Emirates color mapping
const emirateColors: Record<string, string> = {
  Dubai: '#2563eb',      // Blue
  AbuDhabi: '#16a34a',   // Green
  Sharjah: '#ea580c',    // Orange
  Ajman: '#9333ea',      // Purple
  RAK: '#0891b2',        // Cyan
  UAQ: '#db2777',        // Pink
  Fujairah: '#ca8a04',   // Yellow
}

// Period options
const periodOptions: { value: ChartPeriod; key: string }[] = [
  { value: '7d', key: 'dashboard.7d' },
  { value: '30d', key: 'dashboard.30d' },
  { value: '90d', key: 'dashboard.90d' },
  { value: '12m', key: 'dashboard.12m' },
  { value: 'ytd', key: 'dashboard.ytd' },
]

// Format currency for Y-axis
function formatYAxis(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toString()
}

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  const { t } = useTranslation()

  if (!active || !payload || !payload.length) {
    return null
  }

  // Get emirate label translation
  const getEmirateLabel = (emirate: string) => {
    const emirateKeyMap: Record<string, string> = {
      Dubai: 'emirates.dubai',
      AbuDhabi: 'emirates.abuDhabi',
      Sharjah: 'emirates.sharjah',
      Ajman: 'emirates.ajman',
      RAK: 'emirates.rak',
      UAQ: 'emirates.uaq',
      Fujairah: 'emirates.fujairah',
    }
    return t(emirateKeyMap[emirate] || emirate)
  }

  return (
    <div className="bg-background border rounded-lg shadow-lg p-3 min-w-[200px]">
      <p className="font-semibold text-sm mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {getEmirateLabel(entry.name)}
              </span>
            </div>
            <span className="font-medium">
              AED {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SalesChart({ data, isLoading }: SalesChartProps) {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>('12m')
  const [visibleEmirates, setVisibleEmirates] = useState<Set<string>>(
    new Set(Object.keys(emirateColors))
  )

  // Toggle emirate visibility
  const toggleEmirate = (emirate: string) => {
    setVisibleEmirates((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(emirate)) {
        // Don't allow hiding all emirates
        if (newSet.size > 1) {
          newSet.delete(emirate)
        }
      } else {
        newSet.add(emirate)
      }
      return newSet
    })
  }

  // Get emirate label translation
  const getEmirateLabel = (emirate: string) => {
    const emirateKeyMap: Record<string, string> = {
      Dubai: 'emirates.dubai',
      AbuDhabi: 'emirates.abuDhabi',
      Sharjah: 'emirates.sharjah',
      Ajman: 'emirates.ajman',
      RAK: 'emirates.rak',
      UAQ: 'emirates.uaq',
      Fujairah: 'emirates.fujairah',
    }
    return t(emirateKeyMap[emirate] || emirate)
  }

  if (isLoading) {
    return (
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle>{t('dashboard.salesTrend')}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-pulse text-muted-foreground">
            {t('dashboard.loadingChart')}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">
          {t('dashboard.salesTrend')}
        </CardTitle>

        {/* Period selector */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedPeriod === option.value ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-7 px-3 text-xs',
                selectedPeriod === option.value && 'shadow-sm'
              )}
              onClick={() => setSelectedPeriod(option.value)}
            >
              {t(option.key)}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Chart */}
        <div className="h-[300px] sm:h-[350px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                content={() => null} // Hide default legend, use custom below
              />

              {Object.entries(emirateColors).map(([emirate, color]) => (
                <Line
                  key={emirate}
                  type="monotone"
                  dataKey={emirate}
                  name={emirate}
                  stroke={color}
                  strokeWidth={visibleEmirates.has(emirate) ? 2 : 0}
                  dot={false}
                  activeDot={visibleEmirates.has(emirate) ? { r: 4 } : false}
                  hide={!visibleEmirates.has(emirate)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {Object.entries(emirateColors).map(([emirate, color]) => (
            <button
              key={emirate}
              onClick={() => toggleEmirate(emirate)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                visibleEmirates.has(emirate)
                  ? 'bg-muted hover:bg-muted/80'
                  : 'bg-transparent text-muted-foreground hover:bg-muted/50 line-through'
              )}
            >
              <div
                className={cn(
                  'w-3 h-3 rounded-full transition-opacity',
                  !visibleEmirates.has(emirate) && 'opacity-40'
                )}
                style={{ backgroundColor: color }}
              />
              <span>{getEmirateLabel(emirate)}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesChart
