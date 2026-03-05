/**
 * Purchase Returns Page
 * Phase 8: Purchase Module
 *
 * Main page for managing purchase returns
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, RotateCcw, Search, Filter, X, Eye, MoreHorizontal } from 'lucide-react'
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
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { SimplePagination } from '@/components/shared/simple-pagination'
import { formatDate } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { toast } from 'sonner'
import { PurchaseReturnForm } from '../components/purchase-return-form'
import { samplePurchaseReturns } from '@/data/purchase-orders.data'
import { PURCHASE_RETURN_STATUS_CONFIG, RETURN_TYPE_KEYS } from '../types/purchase-return.types'
import type { PurchaseReturnFilters, PurchaseReturnFormData, PurchaseReturnStatus } from '../types/purchase-return.types'

export function PurchaseReturnsPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [filters, setFilters] = useState<PurchaseReturnFilters>({ page: 1, pageSize: 25 })
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const isLoading = false
  const error = null
  const isCreating = false

  const returns = samplePurchaseReturns
  const totalCount = returns.length
  const currentPage = filters.page || 1
  const pageSize = filters.pageSize || 25

  const pagination = totalCount > 0 ? {
    page: currentPage,
    pageSize: pageSize,
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
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

  const handleFormSubmit = async (_data: PurchaseReturnFormData) => {
    toast.success(t('purchase.returnCreatedSuccess'))
    setIsFormOpen(false)
  }

  const getStatusVariant = (status: PurchaseReturnStatus) => {
    return PURCHASE_RETURN_STATUS_CONFIG[status]?.variant || 'neutral'
  }

  const hasActiveFilters = filters.search || filters.status

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('purchase.purchaseReturns')}
        description={t('purchase.purchaseReturnsDescription')}
        actions={
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('purchase.newReturn')}</span>
            <span className="sm:hidden">{t('common.new')}</span>
          </Button>
        }
      />

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('purchase.searchReturns')}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.status')}</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value === 'all' ? undefined : value as PurchaseReturnStatus, page: 1 }))}
                >
                  <SelectTrigger><SelectValue placeholder={t('common.all')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="draft">{t('status.draft')}</SelectItem>
                    <SelectItem value="pending">{t('status.pending')}</SelectItem>
                    <SelectItem value="completed">{t('status.completed')}</SelectItem>
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
        <div className="text-center py-12">
          <p className="text-destructive">{t('purchase.failedToLoadReturns')}</p>
        </div>
      ) : returns.length === 0 ? (
        <EmptyState icon="document" title={t('purchase.noReturns')} description={t('purchase.returnsWillAppear')} />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t('purchase.returnNumber')}</TableHead>
                  <TableHead>{t('purchase.grnPo')}</TableHead>
                  <TableHead>{t('purchase.vendor')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('common.type')}</TableHead>
                  <TableHead className="text-end">{t('common.amount')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((ret) => (
                  <TableRow key={ret.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{ret.returnNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{ret.grnNumber}</p>
                        <p className="text-xs text-muted-foreground">{ret.poNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{ret.vendorName}</TableCell>
                    <TableCell>{formatDate(ret.returnDate)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(RETURN_TYPE_KEYS[ret.returnType])}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatAmount(ret.totalAmount)}</TableCell>
                    <TableCell>
                      <StatusBadge variant={getStatusVariant(ret.status)}>
                        {t(PURCHASE_RETURN_STATUS_CONFIG[ret.status]?.key)}
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
                          <DropdownMenuItem onClick={() => toast.info(t('purchase.viewReturnDetails', { number: ret.returnNumber }))}>
                            <Eye className="h-4 w-4 me-2" />
                            {t('common.view')}
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
            {returns.map((ret) => (
              <Card key={ret.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-primary">{ret.returnNumber}</p>
                      <p className="text-sm">{ret.vendorName}</p>
                    </div>
                    <StatusBadge variant={getStatusVariant(ret.status)}>
                      {t(PURCHASE_RETURN_STATUS_CONFIG[ret.status]?.key)}
                    </StatusBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
                    <div>
                      <p className="text-muted-foreground">{t('common.date')}</p>
                      <p className="font-medium">{formatDate(ret.returnDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('common.amount')}</p>
                      <p className="font-medium">{formatAmount(ret.totalAmount)}</p>
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

      {/* Create Return Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              {t('purchase.newPurchaseReturn')}
            </SheetTitle>
          </SheetHeader>
          <PurchaseReturnForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isCreating}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default PurchaseReturnsPage
