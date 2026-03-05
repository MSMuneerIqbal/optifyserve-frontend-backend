/**
 * Invoice Preview Component
 * Phase 6: Sales Module
 *
 * UAE FTA-compliant invoice display for viewing and printing
 * Includes VAT breakdown and payment history
 */

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Printer, Download, Send, ArrowLeft, CreditCard, AlertTriangle, MessageCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { INVOICE_STATUS_CONFIG, PAYMENT_METHOD_KEYS, VAT_STATUS_KEYS } from '../types/invoice.types'
import type { Invoice } from '../types/invoice.types'

interface InvoicePreviewProps {
  invoice: Invoice
  onBack: () => void
  onSend?: () => void
  onRecordPayment?: () => void
  className?: string
}

export function InvoicePreview({
  invoice,
  onBack,
  onSend,
  onRecordPayment,
  className,
}: InvoicePreviewProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const printRef = useRef<HTMLDivElement>(null)
  const company = sampleCompanyProfile

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Download as PDF
  const handleDownloadPDF = () => {
    window.print()
  }

  // Calculate payment progress
  const paymentProgress = invoice.total > 0 ? (invoice.paidAmount / invoice.total) * 100 : 0

  // Check if overdue
  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.balanceAmount > 0

  return (
    <div className={cn('space-y-6', className)}>
      {/* Action Bar - Hidden in print */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('sales.backToList')}
        </Button>

        <div className="flex flex-wrap gap-2">
          {invoice.status === 'draft' && onSend && (
            <Button variant="default" onClick={onSend} className="gap-2">
              <Send className="h-4 w-4" />
              {t('sales.sendToCustomer')}
            </Button>
          )}
          {['sent', 'partially-paid', 'overdue'].includes(invoice.status) && onRecordPayment && (
            <Button variant="default" onClick={onRecordPayment} className="gap-2">
              <CreditCard className="h-4 w-4" />
              {t('sales.recordPayment')}
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
              const text = `${invoice.invoiceType === 'proforma' ? t('sales.proformaInvoice') : t('sales.taxInvoice')} ${invoice.invoiceNumber}\n${t('common.amount')}: ${formatAmount(invoice.total)}\n${t('sales.dueDate')}: ${formatDate(invoice.dueDate)}`
              window.open(generateWhatsAppUrl(text, invoice.customer.phone), '_blank')
            }}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.whatsapp')}</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              const subject = `${invoice.invoiceType === 'proforma' ? t('sales.proformaInvoice') : t('sales.taxInvoice')} ${invoice.invoiceNumber}`
              const body = `${t('common.amount')}: ${formatAmount(invoice.total)}\n${t('sales.dueDate')}: ${formatDate(invoice.dueDate)}`
              window.open(generateMailtoUrl(invoice.customer.email, subject, body), '_self')
            }}
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.emailShare')}</span>
          </Button>
        </div>
      </div>

      {/* Overdue Warning */}
      {isOverdue && (
        <Alert variant="destructive" className="print:hidden">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t('sales.overdueWarning', { date: formatDate(invoice.dueDate), amount: formatAmount(invoice.balanceAmount) })}
          </AlertDescription>
        </Alert>
      )}

      {/* Proforma Disclaimer */}
      {invoice.invoiceType === 'proforma' && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {t('sales.proformaDisclaimer')}
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Progress - Hidden in print */}
      {invoice.status !== 'draft' && (
        <div className="bg-muted/30 rounded-lg p-4 print:hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{t('sales.paymentProgress')}</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(paymentProgress)}% {t('sales.percentPaid')}
            </span>
          </div>
          <Progress value={paymentProgress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-green-600">{t('sales.paidAmount')}: {formatAmount(invoice.paidAmount)}</span>
            <span className={cn(invoice.balanceAmount > 0 ? 'text-destructive' : 'text-green-600')}>
              {t('sales.balanceDue')}: {formatAmount(invoice.balanceAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Invoice Document */}
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
              <p className="text-sm font-semibold mt-2">
                TRN: {formatTRN(company.taxRegistrationNumber)}
              </p>
            </div>

            {/* Invoice Info */}
            <div className="text-start sm:text-end">
              <h2 className="text-3xl font-bold text-muted-foreground uppercase tracking-wider">
                {invoice.invoiceType === 'proforma' ? t('sales.proformaInvoice') : t('sales.taxInvoice')}
              </h2>
              <p className="text-xl font-semibold mt-2">{invoice.invoiceNumber}</p>
              <div className="mt-4 space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">{t('common.date')}:</span>{' '}
                  <span className="font-medium">{formatDate(invoice.date)}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">{t('sales.dueDate')}:</span>{' '}
                  <span className={cn('font-medium', isOverdue && 'text-destructive')}>
                    {formatDate(invoice.dueDate)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">{t('sales.vatEmirateLabel')}:</span>{' '}
                  <span className="font-medium">{invoice.vatEmirate}</span>
                </p>
              </div>
              <div className="mt-4 print:hidden">
                <StatusBadge variant={INVOICE_STATUS_CONFIG[invoice.status]?.variant || 'neutral'}>
                  {t(INVOICE_STATUS_CONFIG[invoice.status]?.key)}
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
              <p className="font-semibold text-lg">{invoice.customer.name}</p>
              {invoice.customer.company && (
                <p className="text-muted-foreground">{invoice.customer.company}</p>
              )}
              <p className="text-muted-foreground mt-1">
                {invoice.customer.address.street}
              </p>
              <p className="text-muted-foreground">
                {invoice.customer.address.city}, {invoice.customer.address.emirate}
              </p>
              <p className="text-muted-foreground">{invoice.customer.address.country}</p>
              <p className="text-muted-foreground mt-2">
                {t('common.phone')}: {invoice.customer.phone}
              </p>
              <p className="text-muted-foreground">
                {t('common.email')}: {invoice.customer.email}
              </p>
              {invoice.customer.taxRegistrationNumber && (
                <p className="text-sm font-semibold mt-2">
                  TRN: {formatTRN(invoice.customer.taxRegistrationNumber)}
                </p>
              )}
            </div>

            {/* From Quotation */}
            {invoice.quotationNumber && (
              <div className="sm:text-end">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {t('sales.reference')}
                </h3>
                <div className="inline-block text-start sm:text-end bg-muted/30 rounded-lg p-4">
                  <p className="text-sm">
                    <span className="text-muted-foreground">{t('sales.quotationRef')}:</span>{' '}
                    <span className="font-medium">{invoice.quotationNumber}</span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="text-muted-foreground">{t('common.paymentTerms')}:</span>{' '}
                    <span className="font-medium">
                      {invoice.paymentTerms.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </p>
                </div>
              </div>
            )}
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
                  <TableHead className="text-center w-24">{t('sales.vatStatus')}</TableHead>
                  <TableHead className="text-end w-24">{t('sales.vatAmount')}</TableHead>
                  <TableHead className="text-end w-32">{t('common.total')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
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
                    <TableCell className="text-center text-xs">
                      {item.vatStatus === 'standard' ? '5%' : t(VAT_STATUS_KEYS[item.vatStatus])}
                    </TableCell>
                    <TableCell className="text-end">{formatAmount(item.vatAmount)}</TableCell>
                    <TableCell className="text-end font-medium">
                      {formatAmount(item.totalWithVat)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals & VAT Breakdown */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* VAT Breakdown */}
            <div className="order-2 sm:order-1">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {t('sales.vatSummary')}
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('sales.standardRated')} (5%)</span>
                  <span>{formatAmount(invoice.taxableAmount)}</span>
                </div>
                {invoice.zeroRatedAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('sales.zeroRated')} (0%)</span>
                    <span>{formatAmount(invoice.zeroRatedAmount)}</span>
                  </div>
                )}
                {invoice.exemptAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('sales.vatExempt')}</span>
                    <span>{formatAmount(invoice.exemptAmount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>{t('sales.totalOutputVAT')}</span>
                  <span>{formatAmount(invoice.vatAmount)}</span>
                </div>
              </div>
            </div>

            {/* Invoice Totals */}
            <div className="order-1 sm:order-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('sales.subtotal')}</span>
                  <span>{formatAmount(invoice.subtotal)}</span>
                </div>
                {invoice.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('sales.discount')}</span>
                    <span className="text-red-600">-{formatAmount(invoice.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('sales.netAmount')}</span>
                  <span>{formatAmount(invoice.taxableAmount + invoice.zeroRatedAmount + invoice.exemptAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('sales.vatAmount')} (5%)</span>
                  <span>{formatAmount(invoice.vatAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('sales.grandTotal')}</span>
                  <span className="text-primary">{formatAmount(invoice.total)}</span>
                </div>
                {invoice.paidAmount > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>{t('sales.paidAmount')}</span>
                      <span>-{formatAmount(invoice.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('sales.balanceDue')}</span>
                      <span className={cn(invoice.balanceAmount > 0 ? 'text-destructive' : 'text-green-600')}>
                        {formatAmount(invoice.balanceAmount)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment History */}
          {invoice.payments.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {t('sales.paymentHistory')}
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>{t('common.date')}</TableHead>
                      <TableHead>{t('sales.method')}</TableHead>
                      <TableHead>{t('sales.reference')}</TableHead>
                      <TableHead className="text-end">{t('common.amount')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{t(PAYMENT_METHOD_KEYS[payment.paymentMethod])}</TableCell>
                        <TableCell>{payment.referenceNumber || '-'}</TableCell>
                        <TableCell className="text-end font-medium text-green-600">
                          {formatAmount(payment.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t('common.notes')}
              </h3>
              <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Terms */}
          {invoice.termsAndConditions && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t('sales.termsConditions')}
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {invoice.termsAndConditions}
              </p>
            </div>
          )}

          {/* Bank Details */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t('sales.bankDetails')}
            </h3>
            <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-1">
              <p><span className="text-muted-foreground">{t('sales.bankName')}:</span> {company.bankDetails.bankName}</p>
              <p><span className="text-muted-foreground">{t('sales.accountName')}:</span> {company.bankDetails.accountName}</p>
              <p><span className="text-muted-foreground">{t('sales.accountNumber')}:</span> {company.bankDetails.accountNumber}</p>
              <p><span className="text-muted-foreground">{t('sales.iban')}:</span> {company.bankDetails.iban}</p>
              <p><span className="text-muted-foreground">{t('sales.swiftCode')}:</span> {company.bankDetails.swiftCode}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              {t('sales.ftaCompliant', { trn: formatTRN(invoice.companyTRN) })}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('sales.vatRegulations')}
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
          ${printRef.current ? `#${printRef.current.id || 'invoice-preview'}` : ''},
          ${printRef.current ? `#${printRef.current.id || 'invoice-preview'}` : ''} * {
            visibility: visible;
          }
          ${printRef.current ? `#${printRef.current.id || 'invoice-preview'}` : ''} {
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

export default InvoicePreview
