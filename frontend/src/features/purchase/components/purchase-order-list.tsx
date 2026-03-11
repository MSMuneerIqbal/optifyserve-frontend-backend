/**
 * Purchase Order List Component
 * Phase 8: Purchase Module
 *
 * Displays list of purchase orders with filtering and actions
 * Fully responsive with mobile card view
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  FileEdit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  X,
  Send,
  CheckCircle,
  Ban,
  ClipboardCheck,
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
import { formatDate, cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { toast } from 'sonner'
import { samplePurchaseOrders } from '@/data/purchase-orders.data'
import { PO_STATUS_CONFIG } from '../types/purchase-order.types'
import type { PurchaseOrder, POStatus, POFilters } from '../types/purchase-order.types'

interface PurchaseOrderListProps {
  onView: (po: PurchaseOrder) => void
  onEdit: (po: PurchaseOrder) => void
  onApprove?: (po: PurchaseOrder) => void
  className?: string
}

export function PurchaseOrderList({ onView, onEdit, onApprove, className }: PurchaseOrderListProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [filters, setFilters] = useState<POFilters>({ page: 1, pageSize: 25 })
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; po: PurchaseOrder | null }>({
    isOpen: false, po: null,
  })
  const [cancelConfirm, setCancelConfirm] = useState<{ isOpen: boolean; po: PurchaseOrder | null }>({
    isOpen: false, po: null,
  })

  const isLoading = false
  const error = null
  const isSubmitting = false
  const isDeleting = false
  const isSending = false
  const isCancelling = false

  const purchaseOrders = samplePurchaseOrders
  const totalCount = purchaseOrders.length
  const currentPage = filters.page || 1
  const pageSize = filters.pageSize || 25

  const pagination = totalCount > 0 ? {
    page: currentPage,
    pageSize: pageSize,
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  } : null

  const submitForApproval = (_id: string) => {
    toast.success(t('purchase.submittedForApproval'))
  }

  const sendPO = ({ id: _id }: { id: string }) => {
    toast.success(t('purchase.sentToVendor'))
  }

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchValue, page: 1 }))
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleFilterChange = (key: keyof POFilters, value: string | undefined) => {
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

  const handleDelete = () => {
    if (deleteConfirm.po) {
      toast.success(t('purchase.poDeletedSuccess', { number: deleteConfirm.po.poNumber }))
      setDeleteConfirm({ isOpen: false, po: null })
    }
  }

  const handleCancel = () => {
    if (cancelConfirm.po) {
      toast.success(t('purchase.poCancelledSuccess', { number: cancelConfirm.po.poNumber }))
      setCancelConfirm({ isOpen: false, po: null })
    }
  }

  const getStatusVariant = (status: POStatus) => {
    return PO_STATUS_CONFIG[status]?.variant || 'neutral'
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
        <p className="text-destructive">{t('purchase.failedToLoadPOs')}</p>
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
              placeholder={t('purchase.searchPurchaseOrders')}
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
            {hasActiveFilters && (
              <Badge variant="secondary" className="ms-1 h-5 w-5 p-0 justify-center">!</Badge>
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
                  <SelectTrigger><SelectValue placeholder={t('purchase.allStatuses')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('purchase.allStatuses')}</SelectItem>
                    <SelectItem value="draft">{t('status.draft')}</SelectItem>
                    <SelectItem value="pending-approval">{t('status.pendingApproval')}</SelectItem>
                    <SelectItem value="approved">{t('status.approved')}</SelectItem>
                    <SelectItem value="sent">{t('purchase.sentToVendor')}</SelectItem>
                    <SelectItem value="partially-received">{t('status.partiallyReceived')}</SelectItem>
                    <SelectItem value="received">{t('status.fullyReceived')}</SelectItem>
                    <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.fromDate')}</label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.toDate')}</label>
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
      {purchaseOrders.length === 0 ? (
        <EmptyState
          icon="document"
          title={t('purchase.noPurchaseOrdersFound')}
          description={
            hasActiveFilters
              ? t('common.tryAdjustingFilters')
              : t('purchase.createFirstPO')
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t('purchase.poNumber')}</TableHead>
                  <TableHead>{t('purchase.vendor')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('purchase.deliveryDate')}</TableHead>
                  <TableHead className="text-end">{t('common.total')}</TableHead>
                  <TableHead>{t('purchase.approval')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => (
                  <TableRow
                    key={po.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onView(po)}
                  >
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{po.vendor.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(po.date)}</TableCell>
                    <TableCell>{formatDate(po.expectedDeliveryDate)}</TableCell>
                    <TableCell className="text-end font-medium">
                      {formatAmount(po.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {po.approvalLevel === 'level-1' ? t('purchase.approvalAuto') : po.approvalLevel === 'level-2' ? t('purchase.approvalManager') : t('purchase.approvalOwner')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={getStatusVariant(po.status)}>
                        {t(PO_STATUS_CONFIG[po.status]?.key)}
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
                          <DropdownMenuItem onClick={() => onView(po)}>
                            <Eye className="h-4 w-4 me-2" />{t('common.view')}
                          </DropdownMenuItem>
                          {(['draft', 'pending-approval', 'approved'] as string[]).includes(po.status) && (
                            <DropdownMenuItem onClick={() => onEdit(po)}>
                              <FileEdit className="h-4 w-4 me-2" />{t('common.edit')}
                            </DropdownMenuItem>
                          )}
                          {po.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() => submitForApproval(po.id)}
                              disabled={isSubmitting}
                            >
                              <ClipboardCheck className="h-4 w-4 me-2" />{t('purchase.submitForApproval')}
                            </DropdownMenuItem>
                          )}
                          {po.status === 'pending-approval' && onApprove && (
                            <DropdownMenuItem onClick={() => onApprove(po)}>
                              <CheckCircle className="h-4 w-4 me-2" />{t('purchase.reviewApprove')}
                            </DropdownMenuItem>
                          )}
                          {po.status === 'approved' && (
                            <DropdownMenuItem
                              onClick={() => sendPO({ id: po.id })}
                              disabled={isSending}
                            >
                              <Send className="h-4 w-4 me-2" />{t('purchase.sendToVendor')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {!['cancelled', 'closed', 'received'].includes(po.status) && (
                            <DropdownMenuItem
                              onClick={() => setCancelConfirm({ isOpen: true, po })}
                              className="text-destructive focus:text-destructive"
                            >
                              <Ban className="h-4 w-4 me-2" />{t('purchase.cancelPO')}
                            </DropdownMenuItem>
                          )}
                          {po.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm({ isOpen: true, po })}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 me-2" />{t('common.delete')}
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
            {purchaseOrders.map((po) => (
              <Card
                key={po.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onView(po)}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-primary">{po.poNumber}</p>
                      <p className="font-medium">{po.vendor.name}</p>
                    </div>
                    <StatusBadge variant={getStatusVariant(po.status)}>
                      {t(PO_STATUS_CONFIG[po.status]?.key)}
                    </StatusBadge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">{t('common.date')}</p>
                      <p className="font-medium">{formatDate(po.date)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('purchase.delivery')}</p>
                      <p className="font-medium">{formatDate(po.expectedDeliveryDate)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('purchase.totalAmount')}</p>
                      <span className="text-lg font-bold">{formatAmount(po.total)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {po.approvalLevel === 'level-1' ? t('purchase.approvalAuto') : po.approvalLevel === 'level-2' ? t('purchase.approvalManager') : t('purchase.approvalOwner')}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(po)}>
                            <Eye className="h-4 w-4 me-2" />{t('common.view')}
                          </DropdownMenuItem>
                          {(['draft', 'pending-approval', 'approved'] as string[]).includes(po.status) && (
                            <DropdownMenuItem onClick={() => onEdit(po)}>
                              <FileEdit className="h-4 w-4 me-2" />{t('common.edit')}
                            </DropdownMenuItem>
                          )}
                          {po.status === 'draft' && (
                            <DropdownMenuItem onClick={() => submitForApproval(po.id)} disabled={isSubmitting}>
                              <ClipboardCheck className="h-4 w-4 me-2" />{t('common.submit')}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, po: null })}
        onConfirm={handleDelete}
        title={t('purchase.deletePurchaseOrder')}
        description={t('purchase.deletePOConfirmation', { number: deleteConfirm.po?.poNumber })}
        confirmLabel={t('common.delete')}
        variant="destructive"
        isLoading={isDeleting}
      />

      {/* Cancel Confirmation */}
      <ConfirmationDialog
        isOpen={cancelConfirm.isOpen}
        onClose={() => setCancelConfirm({ isOpen: false, po: null })}
        onConfirm={handleCancel}
        title={t('purchase.cancelPurchaseOrder')}
        description={t('purchase.cancelPOConfirmation', { number: cancelConfirm.po?.poNumber })}
        confirmLabel={t('purchase.cancelPO')}
        variant="destructive"
        isLoading={isCancelling}
      />
    </div>
  )
}

export default PurchaseOrderList
