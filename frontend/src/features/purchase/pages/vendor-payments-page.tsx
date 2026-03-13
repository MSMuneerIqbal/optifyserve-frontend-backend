/**
 * Vendor Payments Page
 * Phase 8: Purchase Module
 *
 * Record and manage vendor payments
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, CreditCard, Search, Filter, X, FileText, Eye, MoreHorizontal, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { SimplePagination } from '@/components/shared/simple-pagination'
import { formatDate } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { toast } from 'sonner'
import { VendorPaymentForm } from '../components/vendor-payment-form'
import { VendorPaymentPreview } from '../components/vendor-payment-preview'
import { VendorStatement } from '../components/vendor-statement'
import { sampleVendorPayments } from '@/data/purchase-orders.data'
import { VENDOR_PAYMENT_STATUS_CONFIG, VENDOR_PAYMENT_METHOD_KEYS } from '../types/payment.types'
import type { VendorPayment, VendorPaymentFilters, VendorPaymentFormData, VendorPaymentStatus } from '../types/payment.types'

export function VendorPaymentsPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [filters, setFilters] = useState<VendorPaymentFilters>({ page: 1, pageSize: 25 })
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('payments')
  const [selectedPayment, setSelectedPayment] = useState<VendorPayment | null>(null)

  const isLoading = false
  const error = null
  const isCreating = false

  const paymentList = sampleVendorPayments
  const totalCount = paymentList.length
  const currentPage = filters.page || 1
  const pageSize = filters.pageSize || 25

  const payments = paymentList

  const pagination = totalCount > 0 ? {
    page: currentPage,
    pageSize: pageSize,
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  } : null

  const summary = paymentList.length > 0 ? {
    totalPayments: totalCount,
    totalAmount: paymentList.reduce((sum, p) => sum + (p.amount || 0), 0),
    thisMonthTotal: paymentList
      .filter((p) => {
        if (!p.paymentDate) return false
        const now = new Date()
        const pd = new Date(p.paymentDate)
        return pd.getMonth() === now.getMonth() && pd.getFullYear() === now.getFullYear()
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    failedCount: paymentList.filter((p) => p.status === 'failed').length,
  } : null

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchValue, page: 1 }))
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 25 })
    setSearchValue('')
  }

  const handleFormSubmit = async (_data: VendorPaymentFormData) => {
    toast.success(t('purchase.paymentRecordedSuccess'))
    setIsFormOpen(false)
  }

  const getStatusVariant = (status: VendorPaymentStatus) => {
    return VENDOR_PAYMENT_STATUS_CONFIG[status]?.variant || 'neutral'
  }

  const hasActiveFilters = filters.search || filters.status

  if (selectedPayment) {
    return (
      <VendorPaymentPreview
        payment={selectedPayment}
        onBack={() => setSelectedPayment(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('purchase.vendorPayments')}
        description={t('purchase.vendorPaymentsDescription')}
        actions={
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('purchase.recordPayment')}</span>
            <span className="sm:hidden">{t('common.record')}</span>
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryCard label={t('purchase.totalPayments')} value={summary.totalPayments} variant="default" />
          <SummaryCard label={t('purchase.totalAmount')} value={formatAmount(summary.totalAmount)} variant="info" />
          <SummaryCard label={t('purchase.thisMonth')} value={formatAmount(summary.thisMonthTotal)} variant="success" />
          <SummaryCard label={t('purchase.failed')} value={summary.failedCount} variant="error" />
        </div>
      )}

      {/* Tabs: Payments / Statement */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            {t('purchase.payments')}
          </TabsTrigger>
          <TabsTrigger value="statement" className="gap-2">
            <FileText className="h-4 w-4" />
            {t('purchase.vendorStatement')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4 mt-4">
          {/* Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('purchase.searchPayments')}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="ps-9 h-10"
                />
              </div>
              <Button onClick={handleSearch} variant="secondary" className="shrink-0">{t('common.search')}</Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFilters ? 'secondary' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t('common.filters')}</span>
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{t('common.status')}</label>
                    <Select
                      value={filters.status || 'all'}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value === 'all' ? undefined : value as VendorPaymentStatus, page: 1 }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.all')}</SelectItem>
                        <SelectItem value="pending">{t('status.pending')}</SelectItem>
                        <SelectItem value="completed">{t('status.completed')}</SelectItem>
                        <SelectItem value="failed">{t('status.failed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{t('purchase.method')}</label>
                    <Select
                      value={filters.paymentMethod || 'all'}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, paymentMethod: value === 'all' ? undefined : value as VendorPaymentFilters['paymentMethod'], page: 1 }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.all')}</SelectItem>
                        <SelectItem value="cash">{t('purchase.cash')}</SelectItem>
                        <SelectItem value="bank-transfer">{t('purchase.bankTransfer')}</SelectItem>
                        <SelectItem value="cheque">{t('purchase.cheque')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">{t('common.loading')}</div>
          ) : error ? (
            <div className="text-center py-12"><p className="text-destructive">{t('purchase.failedToLoadPayments')}</p></div>
          ) : payments.length === 0 ? (
            <EmptyState icon="document" title={t('purchase.noPayments')} description={t('purchase.recordFirstPayment')} />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>{t('purchase.paymentNumber')}</TableHead>
                      <TableHead>{t('purchase.vendor')}</TableHead>
                      <TableHead>{t('purchase.poNumber')}</TableHead>
                      <TableHead>{t('common.date')}</TableHead>
                      <TableHead>{t('purchase.method')}</TableHead>
                      <TableHead className="text-end">{t('common.amount')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                        <TableCell>{payment.vendorName}</TableCell>
                        <TableCell>{payment.poNumber || '-'}</TableCell>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{t(VENDOR_PAYMENT_METHOD_KEYS[payment.paymentMethod])}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatAmount(payment.amount)}</TableCell>
                        <TableCell>
                          <StatusBadge variant={getStatusVariant(payment.status)}>
                            {t(VENDOR_PAYMENT_STATUS_CONFIG[payment.status]?.key)}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                                <Eye className="h-4 w-4 me-2" />
                                {t('common.view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedPayment(payment); setTimeout(() => window.print(), 300) }}>
                                <Printer className="h-4 w-4 me-2" />
                                {t('purchase.printReceipt')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-primary">{payment.paymentNumber}</p>
                          <p className="text-sm">{payment.vendorName}</p>
                        </div>
                        <StatusBadge variant={getStatusVariant(payment.status)}>
                          {t(VENDOR_PAYMENT_STATUS_CONFIG[payment.status]?.key)}
                        </StatusBadge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
                        <div>
                          <p className="text-muted-foreground">{t('common.date')}</p>
                          <p className="font-medium">{formatDate(payment.paymentDate)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t('common.amount')}</p>
                          <p className="font-bold text-lg">{formatAmount(payment.amount)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pagination && (
                <SimplePagination
                  page={pagination.page}
                  pageSize={pagination.pageSize}
                  totalItems={pagination.totalItems}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                  onPageSizeChange={(pageSize) => setFilters((prev) => ({ ...prev, pageSize, page: 1 }))}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="statement" className="mt-4">
          <VendorStatement />
        </TabsContent>
      </Tabs>

      {/* Record Payment Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('purchase.recordPayment')}
            </SheetTitle>
          </SheetHeader>
          <VendorPaymentForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isCreating}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

interface SummaryCardProps {
  label: string
  value: number | string
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error'
}

function SummaryCard({ label, value, variant = 'default' }: SummaryCardProps) {
  const variantStyles = {
    default: 'border-border',
    info: 'border-l-4 border-l-blue-500',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-amber-500',
    error: 'border-l-4 border-l-red-500',
  }
  return (
    <div className={`rounded-lg border bg-white p-4 ${variantStyles[variant]}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{value}</p>
    </div>
  )
}

export default VendorPaymentsPage
