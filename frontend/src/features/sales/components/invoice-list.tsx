/**
 * Invoice List Component
 * Phase 6: Sales Module
 *
 * Displays list of invoices with filtering and actions
 * Fully responsive with mobile card view
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  FileEdit,
  Send,
  CreditCard,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  X,
  Ban,
  Printer,
  MessageCircle,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'
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
  DropdownMenuSeparator,
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
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/shared/empty-state'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { StatusBadge } from '@/components/shared/status-badge'
import { SimplePagination } from '@/components/shared/simple-pagination'
import { formatDate, cn, generateWhatsAppUrl, generateMailtoUrl } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleInvoices } from '@/data/invoices.data'
import { INVOICE_STATUS_CONFIG } from '../types/invoice.types'
import type { Invoice, InvoiceStatus, InvoiceFilters } from '../types/invoice.types'

interface InvoiceListProps {
  onView: (invoice: Invoice) => void
  onEdit: (invoice: Invoice) => void
  onRecordPayment: (invoice: Invoice) => void
  className?: string
}

export function InvoiceList({
  onView,
  onEdit,
  onRecordPayment,
  className,
}: InvoiceListProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()

  // Filter state
  const [filters, setFilters] = useState<InvoiceFilters>({
    page: 1,
    pageSize: 25,
  })
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; invoice: Invoice | null }>({
    isOpen: false,
    invoice: null,
  })
  const [cancelConfirm, setCancelConfirm] = useState<{ isOpen: boolean; invoice: Invoice | null }>({
    isOpen: false,
    invoice: null,
  })

  // Static data and derived state
  const isLoading = false
  const error = null
  const isDeleting = false
  const isSending = false
  const isCancelling = false

  // Filter the sample data client-side
  const filteredInvoices = useMemo(() => {
    let result = [...sampleInvoices] as Invoice[]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(search) ||
          i.customer.name.toLowerCase().includes(search) ||
          (i.customer.company && i.customer.company.toLowerCase().includes(search))
      )
    }

    if (filters.status) {
      result = result.filter((i) => i.status === filters.status)
    }

    if (filters.paymentStatus) {
      result = result.filter((i) => {
        switch (filters.paymentStatus) {
          case 'pending':
            return i.paidAmount === 0
          case 'partial':
            return i.paidAmount > 0 && i.paidAmount < i.total
          case 'complete':
            return i.paidAmount >= i.total
          default:
            return true
        }
      })
    }

    return result
  }, [filters.search, filters.status, filters.paymentStatus])

  const invoices = filteredInvoices
  const pageSize = filters.pageSize || 25
  const currentPage = filters.page || 1
  const totalCount = filteredInvoices.length
  const pagination = totalCount > 0 ? {
    page: currentPage,
    pageSize,
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  } : undefined

  const deleteInvoice = (_id: string) => {
    toast.success(t('sales.invoiceDeleted'))
  }
  const sendInvoice = ({ id }: { id: string }) => {
    toast.success(t('sales.invoiceSent'))
    void id
  }
  const cancelInvoice = ({ id, reason }: { id: string; reason: string }) => {
    toast.success(t('sales.invoiceCancelled'))
    void id
    void reason
  }

  // Handle search
  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchValue, page: 1 }))
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Handle filter change
  const handleFilterChange = (key: keyof InvoiceFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 25 })
    setSearchValue('')
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }))
  }

  // Handle delete
  const handleDelete = () => {
    if (deleteConfirm.invoice) {
      deleteInvoice(deleteConfirm.invoice.id)
      setDeleteConfirm({ isOpen: false, invoice: null })
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (cancelConfirm.invoice) {
      cancelInvoice({ id: cancelConfirm.invoice.id, reason: t('validation.cancelledByUser') })
      setCancelConfirm({ isOpen: false, invoice: null })
    }
  }

  // Get status badge variant
  const getStatusVariant = (status: InvoiceStatus) => {
    return INVOICE_STATUS_CONFIG[status]?.variant || 'neutral'
  }

  // Calculate payment progress
  const getPaymentProgress = (invoice: Invoice) => {
    if (invoice.total === 0) return 0
    return (invoice.paidAmount / invoice.total) * 100
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{t('common.failedToLoad')}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          {t('common.retry')}
        </Button>
      </div>
    )
  }

  const hasActiveFilters = filters.search || filters.status

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('sales.searchInvoices')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="ps-9 h-10"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary" className="shrink-0">
            {t('common.search')}
          </Button>
        </div>

        {/* Filter Toggle */}
        <div className="flex gap-2">
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.filters')}</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ms-1 h-5 w-5 p-0 justify-center">
                !
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.clear')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.status')}</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('sales.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('sales.allStatuses')}</SelectItem>
                    <SelectItem value="draft">{t('status.draft')}</SelectItem>
                    <SelectItem value="sent">{t('status.sent')}</SelectItem>
                    <SelectItem value="partially-paid">{t('status.partiallyPaid')}</SelectItem>
                    <SelectItem value="paid">{t('status.paid')}</SelectItem>
                    <SelectItem value="overdue">{t('status.overdue')}</SelectItem>
                    <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('sales.fromDate')}</label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('sales.toDate')}</label>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('sales.paymentStatus')}</label>
                <Select
                  value={filters.paymentStatus || 'all'}
                  onValueChange={(value) => handleFilterChange('paymentStatus', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="pending">{t('sales.unpaid')}</SelectItem>
                    <SelectItem value="partial">{t('sales.partial')}</SelectItem>
                    <SelectItem value="complete">{t('sales.paidInFull')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {invoices.length === 0 ? (
        <EmptyState
          icon="document"
          title={t('sales.noInvoices')}
          description={
            hasActiveFilters
              ? t('sales.adjustFilters')
              : t('sales.createFirstInvoice')
          }
          action={
            hasActiveFilters
              ? undefined
              : {
                  label: t('sales.createInvoice'),
                  onClick: () => navigate('/sales/invoices/new'),
                }
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t('sales.invoiceNumber')}</TableHead>
                  <TableHead>{t('common.customer')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('sales.dueDate')}</TableHead>
                  <TableHead className="text-end">{t('common.amount')}</TableHead>
                  <TableHead>{t('sales.payment')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onView(invoice)}
                  >
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                      {invoice.invoiceType === 'proforma' && (
                        <Badge variant="outline" className="ms-2 text-xs">{t('sales.proforma')}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.customer.name}</p>
                        {invoice.customer.company && (
                          <p className="text-sm text-muted-foreground">
                            {invoice.customer.company}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          invoice.status === 'overdue' && 'text-destructive font-medium'
                        )}
                      >
                        {formatDate(invoice.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-end font-medium">
                      {formatAmount(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <div className="w-24 space-y-1">
                        <Progress
                          value={getPaymentProgress(invoice)}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {formatAmount(invoice.paidAmount)} / {formatAmount(invoice.total)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={getStatusVariant(invoice.status)}>
                        {t(INVOICE_STATUS_CONFIG[invoice.status]?.key)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(invoice)}>
                            <Eye className="h-4 w-4 me-2" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.print()}>
                            <Printer className="h-4 w-4 me-2" />
                            {t('sales.printPdf')}
                          </DropdownMenuItem>
                          {invoice.status === 'draft' && (
                            <DropdownMenuItem onClick={() => onEdit(invoice)}>
                              <FileEdit className="h-4 w-4 me-2" />
                              {t('common.edit')}
                            </DropdownMenuItem>
                          )}
                          {invoice.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() => sendInvoice({ id: invoice.id })}
                              disabled={isSending}
                            >
                              <Send className="h-4 w-4 me-2" />
                              {t('sales.sendToCustomer')}
                            </DropdownMenuItem>
                          )}
                          {['sent', 'partially-paid', 'overdue'].includes(invoice.status) && (
                            <DropdownMenuItem onClick={() => onRecordPayment(invoice)}>
                              <CreditCard className="h-4 w-4 me-2" />
                              {t('sales.recordPayment')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const text = `${t('sales.taxInvoice')} ${invoice.invoiceNumber}\n${t('common.amount')}: ${formatAmount(invoice.total)}\n${t('sales.dueDate')}: ${formatDate(invoice.dueDate)}`
                              window.open(generateWhatsAppUrl(text, invoice.customer.phone), '_blank')
                            }}
                          >
                            <MessageCircle className="h-4 w-4 me-2" />
                            {t('common.shareWhatsApp')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const subject = `${t('sales.taxInvoice')} ${invoice.invoiceNumber}`
                              const body = `${t('common.amount')}: ${formatAmount(invoice.total)}\n${t('sales.dueDate')}: ${formatDate(invoice.dueDate)}`
                              window.open(generateMailtoUrl(invoice.customer.email, subject, body), '_self')
                            }}
                          >
                            <Mail className="h-4 w-4 me-2" />
                            {t('common.shareEmail')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {invoice.status !== 'cancelled' && invoice.status !== 'void' && invoice.status !== 'paid' && (
                            <DropdownMenuItem
                              onClick={() => setCancelConfirm({ isOpen: true, invoice })}
                              className="text-destructive focus:text-destructive"
                            >
                              <Ban className="h-4 w-4 me-2" />
                              {t('sales.cancelInvoice')}
                            </DropdownMenuItem>
                          )}
                          {invoice.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm({ isOpen: true, invoice })}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 me-2" />
                              {t('common.delete')}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {invoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onView(invoice)}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-primary">
                        {invoice.invoiceNumber}
                        {invoice.invoiceType === 'proforma' && (
                          <Badge variant="outline" className="ms-2 text-xs">{t('sales.proforma')}</Badge>
                        )}
                      </p>
                      <p className="font-medium">{invoice.customer.name}</p>
                      {invoice.customer.company && (
                        <p className="text-sm text-muted-foreground">{invoice.customer.company}</p>
                      )}
                    </div>
                    <StatusBadge variant={getStatusVariant(invoice.status)}>
                      {t(INVOICE_STATUS_CONFIG[invoice.status]?.key)}
                    </StatusBadge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">{t('common.date')}</p>
                      <p className="font-medium">{formatDate(invoice.date)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('sales.dueDate')}</p>
                      <p
                        className={cn(
                          'font-medium',
                          invoice.status === 'overdue' && 'text-destructive'
                        )}
                      >
                        {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('sales.paymentProgress')}</span>
                      <span>{Math.round(getPaymentProgress(invoice))}%</span>
                    </div>
                    <Progress value={getPaymentProgress(invoice)} className="h-2" />
                    <p className="text-xs text-muted-foreground text-end">
                      {t('sales.paidOf', { paid: formatAmount(invoice.paidAmount), total: formatAmount(invoice.total) })}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('sales.balanceDue')}</p>
                      <span
                        className={cn(
                          'text-lg font-bold',
                          invoice.balanceAmount > 0 ? 'text-destructive' : 'text-green-600'
                        )}
                      >
                        {formatAmount(invoice.balanceAmount)}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          {t('common.actions')}
                          <MoreHorizontal className="h-4 w-4 ms-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(invoice)}>
                          <Eye className="h-4 w-4 me-2" />
                          {t('common.view')}
                        </DropdownMenuItem>
                        {['sent', 'partially-paid', 'overdue'].includes(invoice.status) && (
                          <DropdownMenuItem onClick={() => onRecordPayment(invoice)}>
                            <CreditCard className="h-4 w-4 me-2" />
                            {t('sales.recordPayment')}
                          </DropdownMenuItem>
                        )}
                        {invoice.status === 'draft' && (
                          <DropdownMenuItem
                            onClick={() => sendInvoice({ id: invoice.id })}
                            disabled={isSending}
                          >
                            <Send className="h-4 w-4 me-2" />
                            {t('common.send')}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <SimplePagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, invoice: null })}
        onConfirm={handleDelete}
        title={t('sales.deleteInvoice')}
        description={t('sales.deleteInvoiceConfirm', { number: deleteConfirm.invoice?.invoiceNumber })}
        confirmLabel={t('common.delete')}
        variant="destructive"
        isLoading={isDeleting}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={cancelConfirm.isOpen}
        onClose={() => setCancelConfirm({ isOpen: false, invoice: null })}
        onConfirm={handleCancel}
        title={t('sales.cancelInvoice')}
        description={t('sales.cancelInvoiceConfirm', { number: cancelConfirm.invoice?.invoiceNumber })}
        confirmLabel={t('sales.cancelInvoice')}
        variant="destructive"
        isLoading={isCancelling}
      />
    </div>
  )
}

export default InvoiceList
