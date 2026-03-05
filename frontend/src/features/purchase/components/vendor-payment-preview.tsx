import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Printer, Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDate, formatTRN, cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleCompanyProfile } from '@/data/settings.data'
import { VENDOR_PAYMENT_STATUS_CONFIG, VENDOR_PAYMENT_METHOD_KEYS } from '../types/payment.types'
import type { VendorPayment } from '../types/payment.types'

interface VendorPaymentPreviewProps {
  payment: VendorPayment
  onBack: () => void
  className?: string
}

export function VendorPaymentPreview({ payment, onBack, className }: VendorPaymentPreviewProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const printRef = useRef<HTMLDivElement>(null)
  const company = sampleCompanyProfile

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.print')}</span>
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.pdf')}</span>
          </Button>
        </div>
      </div>

      {/* Payment Receipt Document */}
      <div ref={printRef} className="bg-white border rounded-lg shadow-sm print:shadow-none print:border-0">
        <div className="p-6 sm:p-8 print:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-primary">{company.name}</h1>
              <p className="text-muted-foreground mt-1">{company.address.area}, {company.address.city}, {company.address.country}</p>
              <p className="text-muted-foreground">{t('common.phone')}: {company.phone}</p>
              <p className="text-sm font-semibold mt-2">TRN: {formatTRN(company.taxRegistrationNumber)}</p>
            </div>
            <div className="text-start sm:text-end">
              <h2 className="text-3xl font-bold text-muted-foreground uppercase tracking-wider">
                {t('purchase.paymentReceipt')}
              </h2>
              <p className="text-xl font-semibold mt-2">{payment.paymentNumber}</p>
              <div className="mt-4 print:hidden">
                <StatusBadge variant={VENDOR_PAYMENT_STATUS_CONFIG[payment.status]?.variant || 'neutral'}>
                  {t(VENDOR_PAYMENT_STATUS_CONFIG[payment.status]?.key)}
                </StatusBadge>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t('purchase.vendorDetails')}
              </h3>
              <div className="space-y-1">
                <p className="font-medium text-lg">{payment.vendorName}</p>
                {payment.poNumber && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">{t('purchase.poNumber')}:</span> {payment.poNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t('purchase.paymentDetails')}
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">{t('common.date')}:</span>{' '}
                  <span className="font-medium">{formatDate(payment.paymentDate)}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">{t('purchase.method')}:</span>{' '}
                  <span className="font-medium">{t(VENDOR_PAYMENT_METHOD_KEYS[payment.paymentMethod])}</span>
                </p>
                {payment.referenceNumber && (
                  <p>
                    <span className="text-muted-foreground">{t('purchase.referenceNumber')}:</span>{' '}
                    <span className="font-medium">{payment.referenceNumber}</span>
                  </p>
                )}
                {payment.chequeNumber && (
                  <p>
                    <span className="text-muted-foreground">{t('purchase.chequeNumber')}:</span>{' '}
                    <span className="font-medium">{payment.chequeNumber}</span>
                  </p>
                )}
                {payment.bankName && (
                  <p>
                    <span className="text-muted-foreground">{t('purchase.bankName')}:</span>{' '}
                    <span className="font-medium">{payment.bankName}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="rounded-lg border bg-muted/30 p-6 text-center mb-8">
            <p className="text-sm text-muted-foreground mb-1">{t('purchase.paymentAmount')}</p>
            <p className="text-4xl font-bold text-primary">{formatAmount(payment.amount)}</p>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t('common.notes')}
              </h3>
              <p className="text-sm whitespace-pre-wrap">{payment.notes}</p>
            </div>
          )}

          <Separator className="mb-6" />

          {/* Footer */}
          <div className="flex justify-between items-end text-sm">
            <div>
              <p className="text-muted-foreground">{t('purchase.recordedBy')}</p>
              <p className="font-medium">{payment.recordedBy.name}</p>
              <p className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</p>
            </div>
            <div className="text-end">
              <p className="text-xs text-muted-foreground">{t('purchase.authorizedSignatory')}</p>
              <div className="mt-6 border-t border-dashed w-40 pt-1">
                <p className="text-xs text-muted-foreground">{t('purchase.signature')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
