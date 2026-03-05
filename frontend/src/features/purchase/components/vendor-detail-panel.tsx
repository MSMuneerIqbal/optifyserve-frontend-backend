/**
 * Vendor Detail Panel Component
 * Phase 8: Purchase Module
 *
 * Slide-out panel showing vendor details
 */

import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Building2, Star } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDate, formatTRN } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleVendors } from '@/data/vendors.data'
import { VENDOR_STATUS_CONFIG, VENDOR_CATEGORY_KEYS, VENDOR_PAYMENT_TERMS_KEYS } from '../types/vendor.types'

interface VendorDetailPanelProps {
  vendorId: string | null
  isOpen: boolean
  onClose: () => void
}

export function VendorDetailPanel({ vendorId, isOpen, onClose }: VendorDetailPanelProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const isLoading = false
  const vendor = vendorId ? sampleVendors.find((v) => v.id === vendorId) ?? null : null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t('purchase.vendorDetails')}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            {t('common.loading')}
          </div>
        ) : !vendor ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('purchase.vendorNotFound')}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{vendor.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {t(VENDOR_CATEGORY_KEYS[vendor.categories[0]])}
                </Badge>
              </div>
              <StatusBadge variant={VENDOR_STATUS_CONFIG[vendor.status]?.variant || 'neutral'}>
                {t(VENDOR_STATUS_CONFIG[vendor.status]?.key)}
              </StatusBadge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-4 pb-3">
                  <p className="text-sm text-muted-foreground">{t('purchase.totalOrders')}</p>
                  <p className="text-2xl font-bold">{vendor.totalPurchaseOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <p className="text-sm text-muted-foreground">{t('purchase.totalSpend')}</p>
                  <p className="text-2xl font-bold">{formatAmount(vendor.totalPurchaseValue)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <p className="text-sm text-muted-foreground">{t('purchase.outstanding')}</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatAmount(vendor.outstandingAmount)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <p className="text-sm text-muted-foreground">{t('purchase.rating')}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-2xl font-bold">{vendor.rating.toFixed(1)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {t('purchase.contactInformation')}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{vendor.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    {vendor.address.street}, {vendor.address.city}, {vendor.address.emirate}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Details */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {t('purchase.businessDetails')}
              </h4>
              <div className="space-y-3 text-sm">
                {vendor.taxRegistrationNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TRN</span>
                    <span className="font-medium">{formatTRN(vendor.taxRegistrationNumber)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('purchase.paymentTerms')}</span>
                  <span className="font-medium">{t(VENDOR_PAYMENT_TERMS_KEYS[vendor.paymentTerms])}</span>
                </div>
                {vendor.creditLimit && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('purchase.creditLimit')}</span>
                    <span className="font-medium">{formatAmount(vendor.creditLimit)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details */}
            {vendor.bankDetails && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t('purchase.bankDetails')}
                  </h4>
                  <div className="space-y-3 text-sm">
                    {vendor.bankDetails.bankName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('purchase.bank')}</span>
                        <span className="font-medium">{vendor.bankDetails.bankName}</span>
                      </div>
                    )}
                    {vendor.bankDetails.accountNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('purchase.account')}</span>
                        <span className="font-medium">{vendor.bankDetails.accountNumber}</span>
                      </div>
                    )}
                    {vendor.bankDetails.iban && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IBAN</span>
                        <span className="font-medium font-mono text-xs">{vendor.bankDetails.iban}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Contacts */}
            {vendor.contacts && vendor.contacts.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t('purchase.contactPersons')}
                  </h4>
                  <div className="space-y-3">
                    {vendor.contacts.map((contact) => (
                      <Card key={contact.id}>
                        <CardContent className="pt-3 pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              {contact.designation && (
                                <p className="text-sm text-muted-foreground">{contact.designation}</p>
                              )}
                            </div>
                            {contact.isPrimary && <Badge variant="secondary">{t('purchase.primary')}</Badge>}
                          </div>
                          <div className="mt-2 space-y-1 text-sm">
                            {contact.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                {contact.email}
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {vendor.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t('common.notes')}
                  </h4>
                  <p className="text-sm">{vendor.notes}</p>
                </div>
              </>
            )}

            {/* Dates */}
            <Separator />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{t('common.created')}: {formatDate(vendor.createdAt)}</p>
              <p>{t('common.lastUpdated')}: {formatDate(vendor.updatedAt)}</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default VendorDetailPanel
