/**
 * VAT Calculation Table Component
 * Phase 9: Accounts/Finance Module
 *
 * Display UAE FTA VAT Return boxes with calculated values
 * Fully responsive
 */

import { useTranslation } from 'react-i18next'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/shared/status-badge'
import { useCurrency } from '@/contexts/currency-context'
import { formatDate } from '@/lib/utils'
import { VAT_RETURN_STATUS_CONFIG } from '../types/vat-return.types'
import type { VATReturn } from '../types/vat-return.types'

interface VATCalculationTableProps {
  vatReturn: VATReturn
  onCalculate?: () => void
  onSubmit?: () => void
  onFile?: () => void
  isCalculating?: boolean
  isSubmitting?: boolean
  isFiling?: boolean
}

export function VATCalculationTable({
  vatReturn,
  onCalculate,
  onSubmit,
  onFile,
  isCalculating,
  isSubmitting,
  isFiling,
}: VATCalculationTableProps) {
  const { t } = useTranslation()
  const { boxes } = vatReturn
  const statusConfig = VAT_RETURN_STATUS_CONFIG[vatReturn.status]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{vatReturn.returnNumber}</CardTitle>
                <StatusBadge variant={statusConfig.variant}>{t(statusConfig.key)}</StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t('common.period')}: {formatDate(vatReturn.periodFrom)} - {formatDate(vatReturn.periodTo)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('accounts.trn')}: {vatReturn.companyTRN} | {t('accounts.filingDeadline')}: {formatDate(vatReturn.filingDeadline)}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4 me-2" /> {t('common.print')}
              </Button>
              {vatReturn.status === 'draft' && onCalculate && (
                <Button size="sm" onClick={onCalculate} disabled={isCalculating}>
                  {isCalculating ? t('common.calculating') : t('common.calculate')}
                </Button>
              )}
              {vatReturn.status === 'calculated' && onSubmit && (
                <Button size="sm" onClick={onSubmit} disabled={isSubmitting}>
                  {isSubmitting ? t('common.submitting') : t('common.submit')}
                </Button>
              )}
              {vatReturn.status === 'submitted' && onFile && (
                <Button size="sm" onClick={onFile} disabled={isFiling}>
                  {isFiling ? t('common.filing') : t('accounts.fileWithFTA')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* VAT Return Boxes - Desktop */}
      <div className="hidden md:block">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.uaeFTAVATReturnForm')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-16">{t('accounts.box')}</TableHead>
                    <TableHead>{t('common.description')}</TableHead>
                    <TableHead className="text-end w-40">{t('accounts.amountAED')}</TableHead>
                    <TableHead className="text-end w-40">{t('accounts.vatAmountAED')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Sales Section */}
                  <TableRow className="bg-blue-50/50">
                    <TableCell colSpan={4} className="font-semibold text-blue-700">{t('accounts.salesAndOutputVAT')}</TableCell>
                  </TableRow>
                  <VATBoxRow box="1a" label={t('accounts.standardRatedSales')} amount={boxes.box1StandardRatedSales} />
                  <VATBoxRow box="1b" label={t('accounts.vatOnStandardRatedSales')} vatAmount={boxes.box2VATOnStandardRatedSales} />
                  <VATBoxRow box="2" label={t('accounts.zeroRatedSales')} amount={boxes.box3ZeroRatedSales} />
                  <VATBoxRow box="3" label={t('accounts.exemptSales')} amount={boxes.box4ExemptSales} />
                  <VATBoxRow box="4" label={t('accounts.totalSales')} amount={boxes.box5TotalSales} isTotal />

                  {/* Purchases Section */}
                  <TableRow className="bg-green-50/50">
                    <TableCell colSpan={4} className="font-semibold text-green-700">{t('accounts.purchasesAndInputVAT')}</TableCell>
                  </TableRow>
                  <VATBoxRow box="5a" label={t('accounts.standardRatedPurchases')} amount={boxes.box6StandardRatedPurchases} />
                  <VATBoxRow box="5b" label={t('accounts.vatOnStandardRatedPurchases')} vatAmount={boxes.box7VATOnStandardRatedPurchases} />
                  <VATBoxRow box="6" label={t('accounts.zeroRatedPurchases')} amount={boxes.box8ZeroRatedPurchases} />
                  <VATBoxRow box="7" label={t('accounts.exemptPurchases')} amount={boxes.box9ExemptPurchases} />
                  <VATBoxRow box="8" label={t('accounts.totalPurchases')} amount={boxes.box10TotalPurchases} isTotal />

                  {/* VAT Due Section */}
                  <TableRow className="bg-amber-50/50">
                    <TableCell colSpan={4} className="font-semibold text-amber-700">{t('accounts.netVATDue')}</TableCell>
                  </TableRow>
                  <VATBoxRow box="9" label={t('accounts.vatDueOutputInput')} vatAmount={boxes.box11VATDue} />
                  <VATBoxRow box="10" label={t('accounts.adjustments')} vatAmount={boxes.box12Adjustments} />
                  <VATBoxRow box="11" label={t('accounts.netVATDueRefundable')} vatAmount={boxes.box13NetVATDue} isTotal isHighlight />
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VAT Return Boxes - Mobile */}
      <div className="md:hidden space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.salesAndOutputVAT')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <VATBoxMobile label={t('accounts.standardRatedSales')} value={boxes.box1StandardRatedSales} />
            <VATBoxMobile label={t('accounts.vatOnSales')} value={boxes.box2VATOnStandardRatedSales} isVAT />
            <VATBoxMobile label={t('accounts.zeroRatedSales')} value={boxes.box3ZeroRatedSales} />
            <VATBoxMobile label={t('accounts.exemptSales')} value={boxes.box4ExemptSales} />
            <Separator />
            <VATBoxMobile label={t('accounts.totalSales')} value={boxes.box5TotalSales} isTotal />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.purchasesAndInputVAT')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <VATBoxMobile label={t('accounts.standardRatedPurchases')} value={boxes.box6StandardRatedPurchases} />
            <VATBoxMobile label={t('accounts.vatOnPurchases')} value={boxes.box7VATOnStandardRatedPurchases} isVAT />
            <VATBoxMobile label={t('accounts.zeroRatedPurchases')} value={boxes.box8ZeroRatedPurchases} />
            <VATBoxMobile label={t('accounts.exemptPurchases')} value={boxes.box9ExemptPurchases} />
            <Separator />
            <VATBoxMobile label={t('accounts.totalPurchases')} value={boxes.box10TotalPurchases} isTotal />
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.netVATDue')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <VATBoxMobile label={t('accounts.vatDueOutputInput')} value={boxes.box11VATDue} />
            <VATBoxMobile label={t('accounts.adjustments')} value={boxes.box12Adjustments} />
            <Separator />
            <VATBoxMobile label={t('accounts.netVATDueRefundable')} value={boxes.box13NetVATDue} isTotal isHighlight />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function VATBoxRow({
  box,
  label,
  amount,
  vatAmount,
  isTotal,
  isHighlight,
}: {
  box: string
  label: string
  amount?: number
  vatAmount?: number
  isTotal?: boolean
  isHighlight?: boolean
}) {
  const { formatAmount } = useCurrency()
  return (
    <TableRow className={isHighlight ? 'bg-primary/5 font-bold' : isTotal ? 'bg-muted/30 font-semibold' : ''}>
      <TableCell className="font-mono text-sm">{box}</TableCell>
      <TableCell>{label}</TableCell>
      <TableCell className="text-end">{amount !== undefined ? formatAmount(amount) : '-'}</TableCell>
      <TableCell className="text-end">{vatAmount !== undefined ? formatAmount(vatAmount) : '-'}</TableCell>
    </TableRow>
  )
}

function VATBoxMobile({
  label,
  value,
  isVAT,
  isTotal,
  isHighlight,
}: {
  label: string
  value: number
  isVAT?: boolean
  isTotal?: boolean
  isHighlight?: boolean
}) {
  const { formatAmount } = useCurrency()
  return (
    <div className={`flex justify-between items-center ${isTotal ? 'font-bold' : ''} ${isHighlight ? 'text-primary text-lg' : ''}`}>
      <span className={isVAT ? 'text-sm text-muted-foreground' : ''}>{label}</span>
      <span>{formatAmount(value)}</span>
    </div>
  )
}

export default VATCalculationTable
