/**
 * Quotation List Component
 * Phase 6: Sales Module
 *
 * Displays list of quotations with filtering and actions
 * Fully responsive with mobile card view
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  FileEdit,
  Send,
  FileOutput,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  X,
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
import { EmptyState } from '@/components/shared/empty-state'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { StatusBadge } from '@/components/shared/status-badge'
import { SimplePagination } from '@/components/shared/simple-pagination'
import { formatDate, cn, generateWhatsAppUrl, generateMailtoUrl } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleQuotations } from '@/data/quotations.data'
import { QUOTATION_STATUS_CONFIG } from '../types/quotation.types'
import type { Quotation, QuotationStatus, QuotationFilters } from '../types/quotation.types'

interface QuotationListProps {
  onView: (quotation: Quotation) => void
  onEdit: (quotation: Quotation) => void
  className?: string
}

export function QuotationList({ onView, onEdit, className }: QuotationListProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()

  // Filter state
  const [filters, setFilters] = useState<QuotationFilters>({
    page: 1,
    pageSize: 25,
  })
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; quotation: Quotation | null }>({
    isOpen: false,
    quotation: null,
  })
  const [convertConfirm, setConvertConfirm] = useState<{ isOpen: boolean; quotation: Quotation | null }>({
    isOpen: false,
    quotation: null,
  })

  // Static data and derived state
  const isLoading = false
  const error = null
  const isDeleting = false
  const isSending = false
  const isConverting = false

  // Filter the sample data client-side
  const filteredQuotations = useMemo(() => {
    let result = [...sampleQuotations] as Quotation[]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (q) =>
          q.quotationNumber.toLowerCase().includes(search) ||
          q.customer.name.toLowerCase().includes(search) ||
          (q.customer.company && q.customer.company.toLowerCase().includes(search))
      )
    }

    if (filters.status) {
      result = result.filter((q) => q.status === filters.status)
    }

    return result
  }, [filters.search, filters.status])

  const quotations = filteredQuotations
  const pageSize = filters.pageSize || 25
  const currentPage = filters.page || 1
  const totalCount = filteredQuotations.length
  const pagination = totalCount > 0 ? {
    page: currentPage,
    pageSize,
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  } : undefined

  const sendQuotation = ({ id }: { id: string }) => {
    toast.success(t('sales.quotationSent'))
    void id
  }
  const deleteQuotation = (_id: string) => {
    toast.success(t('sales.quotationDeleted'))
  }
  const convertToInvoice = (_id: string) => {
    const invoiceNum = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`
    toast.success(t('sales.quotationConvertedWithInvoice', { quotation: convertConfirm.quotation?.quotationNumber, invoice: invoiceNum }))
    navigate('/sales/invoices')
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
  const handleFilterChange = (key: keyof QuotationFilters, value: string | undefined) => {
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
    if (deleteConfirm.quotation) {
      deleteQuotation(deleteConfirm.quotation.id)
      setDeleteConfirm({ isOpen: false, quotation: null })
    }
  }

  // Handle convert to invoice
  const handleConvert = () => {
    if (convertConfirm.quotation) {
      convertToInvoice(convertConfirm.quotation.id)
      setConvertConfirm({ isOpen: false, quotation: null })
    }
  }

  // Get status badge variant
  const getStatusVariant = (status: QuotationStatus) => {
    return QUOTATION_STATUS_CONFIG[status]?.variant || 'neutral'
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
              placeholder={t('sales.searchQuotations')}
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
                    <SelectItem value="approved">{t('status.approved')}</SelectItem>
                    <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
                    <SelectItem value="expired">{t('status.expired')}</SelectItem>
                    <SelectItem value="converted">{t('status.converted')}</SelectItem>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {quotations.length === 0 ? (
        <EmptyState
          icon="document"
          title={t('sales.noQuotations')}
          description={
            hasActiveFilters
              ? t('sales.adjustFilters')
              : t('sales.createFirstQuotation')
          }
          action={
            hasActiveFilters
              ? undefined
              : {
                  label: t('sales.createQuotation'),
                  onClick: () => navigate('/sales/quotations/new'),
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
                  <TableHead>{t('sales.quotationNumber')}</TableHead>
                  <TableHead>{t('common.customer')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('sales.expiryDate')}</TableHead>
                  <TableHead className="text-end">{t('common.amount')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => (
                  <TableRow
                    key={quotation.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onView(quotation)}
                  >
                    <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{quotation.customer.name}</p>
                        {quotation.customer.company && (
                          <p className="text-sm text-muted-foreground">
                            {quotation.customer.company}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(quotation.date)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          quotation.status === 'expired' && 'text-destructive'
                        )}
                      >
                        {formatDate(quotation.expiryDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-end font-medium">
                      {formatAmount(quotation.total)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={getStatusVariant(quotation.status)}>
                        {t(QUOTATION_STATUS_CONFIG[quotation.status]?.key)}
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
                          <DropdownMenuItem onClick={() => onView(quotation)}>
                            <Eye className="h-4 w-4 me-2" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          {quotation.status === 'draft' && (
                            <DropdownMenuItem onClick={() => onEdit(quotation)}>
                              <FileEdit className="h-4 w-4 me-2" />
                              {t('common.edit')}
                            </DropdownMenuItem>
                          )}
                          {quotation.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() => sendQuotation({ id: quotation.id })}
                              disabled={isSending}
                            >
                              <Send className="h-4 w-4 me-2" />
                              {t('sales.sendToCustomer')}
                            </DropdownMenuItem>
                          )}
                          {quotation.status === 'approved' && (
                            <DropdownMenuItem
                              onClick={() => setConvertConfirm({ isOpen: true, quotation })}
                            >
                              <FileOutput className="h-4 w-4 me-2" />
                              {t('sales.convertToInvoice')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const text = `${t('sales.quotation')} ${quotation.quotationNumber}\n${t('common.amount')}: ${formatAmount(quotation.total)}\n${t('sales.validUntil')}: ${formatDate(quotation.expiryDate)}`
                              window.open(generateWhatsAppUrl(text, quotation.customer.phone), '_blank')
                            }}
                          >
                            <MessageCircle className="h-4 w-4 me-2" />
                            {t('common.shareWhatsApp')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const subject = `${t('sales.quotation')} ${quotation.quotationNumber}`
                              const body = `${t('common.amount')}: ${formatAmount(quotation.total)}\n${t('sales.validUntil')}: ${formatDate(quotation.expiryDate)}`
                              window.open(generateMailtoUrl(quotation.customer.email, subject, body), '_self')
                            }}
                          >
                            <Mail className="h-4 w-4 me-2" />
                            {t('common.shareEmail')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm({ isOpen: true, quotation })}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 me-2" />
                            {t('common.delete')}
                          </DropdownMenuItem>
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
            {quotations.map((quotation) => (
              <Card
                key={quotation.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onView(quotation)}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-primary">{quotation.quotationNumber}</p>
                      <p className="font-medium">{quotation.customer.name}</p>
                      {quotation.customer.company && (
                        <p className="text-sm text-muted-foreground">{quotation.customer.company}</p>
                      )}
                    </div>
                    <StatusBadge variant={getStatusVariant(quotation.status)}>
                      {t(QUOTATION_STATUS_CONFIG[quotation.status]?.key)}
                    </StatusBadge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">{t('common.date')}</p>
                      <p className="font-medium">{formatDate(quotation.date)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('sales.expires')}</p>
                      <p
                        className={cn(
                          'font-medium',
                          quotation.status === 'expired' && 'text-destructive'
                        )}
                      >
                        {formatDate(quotation.expiryDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-bold text-primary">
                      {formatAmount(quotation.total)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          {t('common.actions')}
                          <MoreHorizontal className="h-4 w-4 ms-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(quotation)}>
                          <Eye className="h-4 w-4 me-2" />
                          {t('common.view')}
                        </DropdownMenuItem>
                        {quotation.status === 'draft' && (
                          <DropdownMenuItem onClick={() => onEdit(quotation)}>
                            <FileEdit className="h-4 w-4 me-2" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                        )}
                        {quotation.status === 'draft' && (
                          <DropdownMenuItem
                            onClick={() => sendQuotation({ id: quotation.id })}
                            disabled={isSending}
                          >
                            <Send className="h-4 w-4 me-2" />
                            {t('common.send')}
                          </DropdownMenuItem>
                        )}
                        {quotation.status === 'approved' && (
                          <DropdownMenuItem
                            onClick={() => setConvertConfirm({ isOpen: true, quotation })}
                          >
                            <FileOutput className="h-4 w-4 me-2" />
                            {t('sales.convertToInvoice')}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteConfirm({ isOpen: true, quotation })}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 me-2" />
                          {t('common.delete')}
                        </DropdownMenuItem>
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
        onClose={() => setDeleteConfirm({ isOpen: false, quotation: null })}
        onConfirm={handleDelete}
        title={t('sales.deleteQuotation')}
        description={t('sales.deleteQuotationConfirm', { number: deleteConfirm.quotation?.quotationNumber })}
        confirmLabel={t('common.delete')}
        variant="destructive"
        isLoading={isDeleting}
      />

      {/* Convert Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={convertConfirm.isOpen}
        onClose={() => setConvertConfirm({ isOpen: false, quotation: null })}
        onConfirm={handleConvert}
        title={t('sales.convertToInvoice')}
        description={t('sales.convertQuotationConfirm', { number: convertConfirm.quotation?.quotationNumber })}
        confirmLabel={t('sales.convert')}
        isLoading={isConverting}
      />
    </div>
  )
}

export default QuotationList
