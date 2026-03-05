/**
 * Vendor List Component
 * Phase 8: Purchase Module
 *
 * Displays list of vendors with filtering and actions
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
  Phone,
  Mail,
  Star,
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
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { toast } from 'sonner'
import { sampleVendors } from '@/data/vendors.data'
import { VENDOR_STATUS_CONFIG, VENDOR_CATEGORY_KEYS } from '../types/vendor.types'
import type { Vendor, VendorStatus, VendorFilters } from '../types/vendor.types'

interface VendorListProps {
  onView: (vendor: Vendor) => void
  onEdit: (vendor: Vendor) => void
  className?: string
}

export function VendorList({ onView, onEdit, className }: VendorListProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  // Filter state
  const [filters, setFilters] = useState<VendorFilters>({
    page: 1,
    pageSize: 25,
  })
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; vendor: Vendor | null }>({
    isOpen: false,
    vendor: null,
  })

  const isLoading = false
  const error = null
  const isDeleting = false

  const vendors = sampleVendors
  const totalCount = vendors.length
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

  const handleFilterChange = (key: keyof VendorFilters, value: string | undefined) => {
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
    if (deleteConfirm.vendor) {
      toast.success(t('purchase.vendorDeletedSuccess', { name: deleteConfirm.vendor.name }))
      setDeleteConfirm({ isOpen: false, vendor: null })
    }
  }

  const getStatusVariant = (status: VendorStatus) => {
    return VENDOR_STATUS_CONFIG[status]?.variant || 'neutral'
  }

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
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
        <p className="text-destructive">{t('purchase.failedToLoadVendors')}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          {t('common.retry')}
        </Button>
      </div>
    )
  }

  const hasActiveFilters = filters.search || filters.status || filters.category

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('purchase.searchVendors')}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.status')}</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger><SelectValue placeholder={t('purchase.allStatuses')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('purchase.allStatuses')}</SelectItem>
                    <SelectItem value="active">{t('status.active')}</SelectItem>
                    <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                    <SelectItem value="blocked">{t('status.blocked')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('purchase.category')}</label>
                <Select
                  value={filters.category || 'all'}
                  onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger><SelectValue placeholder={t('purchase.allCategories')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('purchase.allCategories')}</SelectItem>
                    <SelectItem value="equipment">{t('purchase.equipmentSupplier')}</SelectItem>
                    <SelectItem value="spare-parts">{t('purchase.spareParts')}</SelectItem>
                    <SelectItem value="consumables">{t('purchase.consumables')}</SelectItem>
                    <SelectItem value="raw-materials">{t('purchase.rawMaterials')}</SelectItem>
                    <SelectItem value="tools">{t('purchase.toolsInstruments')}</SelectItem>
                    <SelectItem value="safety">{t('purchase.safetyEquipment')}</SelectItem>
                    <SelectItem value="electrical">{t('purchase.electricalSupplies')}</SelectItem>
                    <SelectItem value="plumbing">{t('purchase.plumbingSupplies')}</SelectItem>
                    <SelectItem value="hvac">{t('purchase.hvacSupplies')}</SelectItem>
                    <SelectItem value="general">{t('purchase.generalSupplies')}</SelectItem>
                    <SelectItem value="services">{t('purchase.services')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {vendors.length === 0 ? (
        <EmptyState
          icon="document"
          title={t('purchase.noVendorsFound')}
          description={
            hasActiveFilters
              ? t('common.tryAdjustingFilters')
              : t('purchase.addFirstVendor')
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t('purchase.vendor')}</TableHead>
                  <TableHead>{t('purchase.category')}</TableHead>
                  <TableHead>{t('common.contact')}</TableHead>
                  <TableHead className="text-end">{t('purchase.totalOrders')}</TableHead>
                  <TableHead className="text-end">{t('purchase.totalSpend')}</TableHead>
                  <TableHead className="text-center">{t('purchase.rating')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow
                    key={vendor.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onView(vendor)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        {vendor.taxRegistrationNumber && (
                          <p className="text-xs text-muted-foreground">TRN: {vendor.taxRegistrationNumber}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(VENDOR_CATEGORY_KEYS[vendor.categories[0]])}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {vendor.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {vendor.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-end">{vendor.totalPurchaseOrders}</TableCell>
                    <TableCell className="text-end font-medium">
                      {formatAmount(vendor.totalPurchaseValue)}
                    </TableCell>
                    <TableCell className="text-center">{renderRating(vendor.rating)}</TableCell>
                    <TableCell>
                      <StatusBadge variant={getStatusVariant(vendor.status)}>
                        {t(VENDOR_STATUS_CONFIG[vendor.status]?.key)}
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
                          <DropdownMenuItem onClick={() => onView(vendor)}>
                            <Eye className="h-4 w-4 me-2" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(vendor)}>
                            <FileEdit className="h-4 w-4 me-2" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm({ isOpen: true, vendor })}
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
            {vendors.map((vendor) => (
              <Card
                key={vendor.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onView(vendor)}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">{vendor.name}</p>
                      <Badge variant="outline" className="mt-1">{t(VENDOR_CATEGORY_KEYS[vendor.categories[0]])}</Badge>
                    </div>
                    <StatusBadge variant={getStatusVariant(vendor.status)}>
                      {t(VENDOR_STATUS_CONFIG[vendor.status]?.key)}
                    </StatusBadge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">{t('purchase.totalOrders')}</p>
                      <p className="font-medium">{vendor.totalPurchaseOrders}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('purchase.totalSpend')}</p>
                      <p className="font-medium">{formatAmount(vendor.totalPurchaseValue)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {vendor.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderRating(vendor.rating)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(vendor)}>
                            <Eye className="h-4 w-4 me-2" />{t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(vendor)}>
                            <FileEdit className="h-4 w-4 me-2" />{t('common.edit')}
                          </DropdownMenuItem>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, vendor: null })}
        onConfirm={handleDelete}
        title={t('purchase.deleteVendor')}
        description={t('purchase.deleteVendorConfirmation', { name: deleteConfirm.vendor?.name })}
        confirmLabel={t('common.delete')}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default VendorList
