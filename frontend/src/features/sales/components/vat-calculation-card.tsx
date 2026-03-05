/**
 * VAT Calculation Card Component
 * Phase 6: Sales Module
 *
 * Displays VAT breakdown for quotations and invoices
 * UAE FTA-compliant VAT display
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import type { VATCalculationResult } from '../hooks/use-vat-calculator'

interface VatCalculationCardProps {
  calculation: VATCalculationResult
  showBreakdown?: boolean
  className?: string
}

export function VatCalculationCard({
  calculation,
  showBreakdown = true,
  className,
}: VatCalculationCardProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const {
    subtotal,
    totalDiscount,
    standardRatedAmount,
    standardRatedVat,
    zeroRatedAmount,
    exemptAmount,
    totalVat,
    grandTotal,
  } = calculation

  return (
    <Card className={cn('bg-slate-50', className)}>
      <CardHeader className="pb-2 px-4 pt-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-semibold">{t('sales.summary')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 sm:px-6">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('sales.subtotal')}</span>
          <span className="font-medium">{formatAmount(subtotal)}</span>
        </div>

        {/* Discount */}
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('sales.discount')}</span>
            <span className="font-medium text-red-600">-{formatAmount(totalDiscount)}</span>
          </div>
        )}

        {/* VAT Breakdown */}
        {showBreakdown && (
          <>
            <Separator className="my-2" />

            {/* Standard Rated */}
            {standardRatedAmount > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('sales.standardRated')}</span>
                  <span className="font-medium">{formatAmount(standardRatedAmount)}</span>
                </div>
                <div className="flex justify-between text-sm ps-4">
                  <span className="text-muted-foreground text-xs">{t('sales.vatAmount')}</span>
                  <span className="text-xs">{formatAmount(standardRatedVat)}</span>
                </div>
              </div>
            )}

            {/* Zero Rated */}
            {zeroRatedAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('sales.zeroRated')}</span>
                <span className="font-medium">{formatAmount(zeroRatedAmount)}</span>
              </div>
            )}

            {/* Exempt */}
            {exemptAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('sales.vatExempt')}</span>
                <span className="font-medium">{formatAmount(exemptAmount)}</span>
              </div>
            )}
          </>
        )}

        <Separator className="my-2" />

        {/* Total VAT */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-medium">{t('sales.totalVat')}</span>
          <span className="font-semibold">{formatAmount(totalVat)}</span>
        </div>

        <Separator className="my-2" />

        {/* Grand Total */}
        <div className="flex justify-between items-center">
          <span className="text-base sm:text-lg font-semibold">{t('sales.grandTotal')}</span>
          <span className="text-lg sm:text-xl font-bold text-primary">
            {formatAmount(grandTotal)}
          </span>
        </div>

        {/* VAT Registration Note */}
        <p className="text-xs text-muted-foreground mt-4 pt-2 border-t">
          {t('sales.vatNote')}
        </p>
      </CardContent>
    </Card>
  )
}

/**
 * Mini VAT Summary Component - For inline display
 */
interface VatSummaryInlineProps {
  subtotal: number
  vatAmount: number
  total: number
  className?: string
}

export function VatSummaryInline({
  subtotal,
  vatAmount,
  total,
  className,
}: VatSummaryInlineProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  return (
    <div className={cn('space-y-1 text-end text-sm', className)}>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">{t('sales.subtotal')}:</span>
        <span>{formatAmount(subtotal)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">{t('sales.vat')}:</span>
        <span>{formatAmount(vatAmount)}</span>
      </div>
      <div className="flex justify-between gap-4 font-semibold text-base border-t pt-1">
        <span>{t('sales.total')}:</span>
        <span className="text-primary">{formatAmount(total)}</span>
      </div>
    </div>
  )
}

export default VatCalculationCard
