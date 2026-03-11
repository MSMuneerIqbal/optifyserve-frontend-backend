/**
 * Quotation Preview Component
 * Phase 6: Sales Module
 *
 * Displays quotation in a printable format
 * Responsive preview with print-optimized styles
 */

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Printer, Download, Send, ArrowLeft, CheckCircle, XCircle, MessageCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { formatDate, formatTRN, cn, generateWhatsAppUrl, generateMailtoUrl } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleCompanyProfile } from '@/data/settings.data'
import { QUOTATION_STATUS_CONFIG } from '../types/quotation.types'
import type { Quotation } from '../types/quotation.types'

interface QuotationPreviewProps {
  quotation: Quotation
  onBack: () => void
  onSend?: () => void
  onApprove?: () => void
  onReject?: () => void
  onConvert?: () => void
  className?: string
}

export function QuotationPreview({
  quotation,
  onBack,
  onSend,
  onApprove,
  onReject,
  onConvert,
  className,
}: QuotationPreviewProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const printRef = useRef<HTMLDivElement>(null)
  const company = sampleCompanyProfile

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Download as PDF (using browser print)
  const handleDownloadPDF = () => {
    window.print()
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Action Bar - Hidden in print */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('sales.backToList')}
        </Button>

        <div className="flex flex-wrap gap-2">
          {quotation.status === 'draft' && onSend && (
            <Button variant="default" onClick={onSend} className="gap-2">
              <Send className="h-4 w-4" />
              {t('sales.sendToCustomer')}
            </Button>
          )}
          {quotation.status === 'sent' && onApprove && (
            <Button variant="default" onClick={onApprove} className="gap-2 bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4" />
              {t('sales.markApproved')}
            </Button>
          )}
          {quotation.status === 'sent' && onReject && (
            <Button variant="outline" onClick={onReject} className="gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              {t('sales.markRejected')}
            </Button>
          )}
          {quotation.status === 'accepted' && onConvert && (
            <Button variant="default" onClick={onConvert} className="gap-2">
              {t('sales.convertToInvoice')}
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.print')}</span>
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.pdf')}</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              const text = `${t('sales.quotation')} ${quotation.quotationNumber}\n${t('common.amount')}: ${formatAmount(quotation.total)}\n${t('sales.validUntil')}: ${formatDate(quotation.expiryDate)}`
              window.open(generateWhatsAppUrl(text, quotation.customer.phone), '_blank')
            }}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.whatsapp')}</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              const subject = `${t('sales.quotation')} ${quotation.quotationNumber}`
              const body = `${t('common.amount')}: ${formatAmount(quotation.total)}\n${t('sales.validUntil')}: ${formatDate(quotation.expiryDate)}`
              window.open(generateMailtoUrl(quotation.customer.email, subject, body), '_self')
            }}
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.emailShare')}</span>
          </Button>
        </div>
      </div>

      {/* Quotation Document */}
      <div
        ref={printRef}
        className="bg-white border rounded-lg shadow-sm print:shadow-none print:border-0"
      >
        <div className="p-6 sm:p-8 print:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
            {/* Company Info */}
            <div>
              <h1 className="text-2xl font-bold text-primary">{company.name}</h1>
              <p className="text-muted-foreground mt-1">
                {company.address.area}, {company.address.city}, {company.address.country}
              </p>
              <p className="text-muted-foreground">
                {t('common.phone')}: {company.phone}
              </p>
              <p className="text-muted-foreground">
                {t('common.email')}: {company.email}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                TRN: {formatTRN(company.taxRegistrationNumber)}
              </p>
            </div>

            {/* Quotation Info */}
            <div className="text-start sm:text-end">
              <h2 className="text-3xl font-bold text-muted-foreground uppercase tracking-wider">
                {t('sales.quotation')}
              </h2>
              <p className="text-xl font-semibold mt-2">{quotation.quotationNumber}</p>
              <div className="mt-4 space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">{t('common.date')}:</span>{' '}
                  <span className="font-medium">{formatDate(quotation.date)}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">{t('sales.expiryDate')}:</span>{' '}
                  <span className="font-medium">{formatDate(quotation.expiryDate)}</span>
                </p>
              </div>
              <div className="mt-4 print:hidden">
                <StatusBadge variant={QUOTATION_STATUS_CONFIG[quotation.status]?.variant || 'neutral'}>
                  {t(QUOTATION_STATUS_CONFIG[quotation.status]?.key)}
                </StatusBadge>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t('sales.billTo')}
              </h3>
              <p className="font-semibold text-lg">{quotation.customer.name}</p>
              {quotation.customer.company && (
                <p className="text-muted-foreground">{quotation.customer.company}</p>
              )}
              <p className="text-muted-foreground mt-1">
                {quotation.customer.address.street}
              </p>
              <p className="text-muted-foreground">
                {quotation.customer.address.city}, {quotation.customer.address.emirate}
              </p>
              <p className="text-muted-foreground">{quotation.customer.address.country}</p>
              <p className="text-muted-foreground mt-2">
                {t('common.phone')}: {quotation.customer.phone}
              </p>
              <p className="text-muted-foreground">
                {t('common.email')}: {quotation.customer.email}
              </p>
              {quotation.customer.taxRegistrationNumber && (
                <p className="text-sm mt-2">
                  <span className="text-muted-foreground">TRN:</span>{' '}
                  {formatTRN(quotation.customer.taxRegistrationNumber)}
                </p>
              )}
            </div>

            <div className="sm:text-end">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t('sales.summary')}
              </h3>
              <div className="inline-block text-start sm:text-end bg-muted/30 rounded-lg p-4">
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">{t('sales.itemsCount')}:</span>{' '}
                    <span className="font-medium">{quotation.items.length}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">{t('sales.validity')}:</span>{' '}
                    <span className="font-medium">{quotation.validityDays} {t('common.days')}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">{t('common.paymentTerms')}:</span>{' '}
                    <span className="font-medium">
                      {quotation.paymentTerms.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{t('common.description')}</TableHead>
                  <TableHead className="text-center w-20">{t('sales.quantity')}</TableHead>
                  <TableHead className="text-end w-28">{t('sales.unitPrice')}</TableHead>
                  <TableHead className="text-center w-20">{t('sales.discountPercent')}</TableHead>
                  <TableHead className="text-end w-24">{t('sales.vatAmount')}</TableHead>
                  <TableHead className="text-end w-32">{t('common.total')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotation.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.itemName}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        {item.itemCode && (
                          <p className="text-xs text-muted-foreground">{t('sales.code')}: {item.itemCode}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell className="text-end">{formatAmount(item.unitPrice)}</TableCell>
                    <TableCell className="text-center">{item.discount}%</TableCell>
                    <TableCell className="text-end">{formatAmount(item.vatAmount)}</TableCell>
                    <TableCell className="text-end font-medium">
                      {formatAmount(item.totalWithVat)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full sm:w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('sales.subtotal')}</span>
                <span>{formatAmount(quotation.subtotal)}</span>
              </div>
              {quotation.totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('sales.discount')}</span>
                  <span className="text-red-600">-{formatAmount(quotation.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('sales.taxableAmount')}</span>
                <span>{formatAmount(quotation.taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('sales.vatAmount')} (5%)</span>
                <span>{formatAmount(quotation.vatAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{t('sales.grandTotal')}</span>
                <span className="text-primary">{formatAmount(quotation.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quotation.notes && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t('common.notes')}
              </h3>
              <p className="text-sm whitespace-pre-wrap">{quotation.notes}</p>
            </div>
          )}

          {/* Terms */}
          {quotation.termsAndConditions && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t('sales.termsConditions')}
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {quotation.termsAndConditions}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              {t('sales.computerGenerated')}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('sales.amountsInAED')}
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          ${printRef.current ? `#${printRef.current.id || 'quotation-preview'}` : ''},
          ${printRef.current ? `#${printRef.current.id || 'quotation-preview'}` : ''} * {
            visibility: visible;
          }
          ${printRef.current ? `#${printRef.current.id || 'quotation-preview'}` : ''} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default QuotationPreview
