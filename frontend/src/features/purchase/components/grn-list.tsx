/**
 * GRN List Component
 * Phase 8: Purchase Module
 *
 * Displays list of Goods Receipt Notes
 * Fully responsive with mobile card view
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  X,
} from 'lucide-react'
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
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { SimplePagination } from '@/components/shared/simple-pagination'
import { formatDate, cn } from '@/lib/utils'
import { sampleGoodsReceiptNotes } from '@/data/purchase-orders.data'
import { GRN_STATUS_CONFIG } from '../types/grn.types'
import type { GoodsReceiptNote, GRNStatus, GRNFilters } from '../types/grn.types'

interface GRNListProps {
  onView: (grn: GoodsReceiptNote) => void
  className?: string
}

export function GRNList({ onView, className }: GRNListProps) {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<GRNFilters>({ page: 1, pageSize: 25 })
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const isLoading = false
  const error = null

  const grns = sampleGoodsReceiptNotes
  const totalCount = grns.length
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

  const handleFilterChange = (key: keyof GRNFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 25 })
    setSearchValue('')
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }))
  }

  const getStatusVariant = (status: GRNStatus) => {
    return GRN_STATUS_CONFIG[status]?.variant || 'neutral'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        {t('common.loading')}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{t('purchase.failedToLoadGRNs')}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">{t('common.retry')}</Button>
      </div>
    )
  }

  const hasActiveFilters = filters.search || filters.status

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('purchase.searchGRNs')}
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
            {hasActiveFilters && <Badge variant="secondary" className="ms-1 h-5 w-5 p-0 justify-center">!</Badge>}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" /><span className="hidden sm:inline">{t('common.clear')}</span>
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.status')}</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger><SelectValue placeholder={t('purchase.allStatuses')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('purchase.allStatuses')}</SelectItem>
                    <SelectItem value="draft">{t('status.draft')}</SelectItem>
                    <SelectItem value="inspecting">{t('purchase.inspecting')}</SelectItem>
                    <SelectItem value="accepted">{t('purchase.accepted')}</SelectItem>
                    <SelectItem value="partial">{t('purchase.partial')}</SelectItem>
                    <SelectItem value="rejected">{t('purchase.rejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {grns.length === 0 ? (
        <EmptyState
          icon="document"
          title={t('purchase.noGRNsFound')}
          description={hasActiveFilters ? t('common.tryAdjustingFilters') : t('purchase.grnsWillAppearHere')}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t('purchase.grnNumber')}</TableHead>
                  <TableHead>{t('purchase.poNumber')}</TableHead>
                  <TableHead>{t('purchase.vendor')}</TableHead>
                  <TableHead>{t('purchase.receivedDate')}</TableHead>
                  <TableHead className="text-center">{t('purchase.accepted')}</TableHead>
                  <TableHead className="text-center">{t('purchase.rejected')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grns.map((grn) => (
                  <TableRow key={grn.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(grn)}>
                    <TableCell className="font-medium">{grn.grnNumber}</TableCell>
                    <TableCell>{grn.poNumber}</TableCell>
                    <TableCell>{grn.vendorName}</TableCell>
                    <TableCell>{formatDate(grn.receiptDate)}</TableCell>
                    <TableCell className="text-center font-medium text-green-600">{grn.totalAccepted}</TableCell>
                    <TableCell className="text-center font-medium text-red-600">{grn.totalRejected}</TableCell>
                    <TableCell>
                      <StatusBadge variant={getStatusVariant(grn.status)}>
                        {t(GRN_STATUS_CONFIG[grn.status]?.key)}
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
                          <DropdownMenuItem onClick={() => onView(grn)}>
                            <Eye className="h-4 w-4 me-2" /> {t('common.view')}
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
            {grns.map((grn) => (
              <Card key={grn.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onView(grn)}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-primary">{grn.grnNumber}</p>
                      <p className="text-sm text-muted-foreground">{grn.poNumber}</p>
                      <p className="font-medium mt-1">{grn.vendorName}</p>
                    </div>
                    <StatusBadge variant={getStatusVariant(grn.status)}>
                      {t(GRN_STATUS_CONFIG[grn.status]?.key)}
                    </StatusBadge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm pt-3 border-t">
                    <div>
                      <p className="text-muted-foreground">{t('common.date')}</p>
                      <p className="font-medium">{formatDate(grn.receiptDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('purchase.accepted')}</p>
                      <p className="font-medium text-green-600">{grn.totalAccepted}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('purchase.rejected')}</p>
                      <p className="font-medium text-red-600">{grn.totalRejected}</p>
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
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export default GRNList
