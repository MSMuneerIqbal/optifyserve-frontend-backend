/**
 * Customer List Component
 * Phase 4: CRM Module - Customer Management
 *
 * Data table for displaying and managing customers
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import {
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  Eye,
  Pencil,
  Trash2,
  Download,
  Filter,
  ChevronDown,
  Building2,
  User,
  Landmark,
  ArrowUpDown,
} from 'lucide-react'
import type { Customer, CustomerFilters, CustomerType, CustomerStatus } from '../types/customer.types'
import { UAE_EMIRATES } from '@/lib/constants'

interface CustomerListProps {
  customers: Customer[]
  isLoading?: boolean
  onCustomerClick?: (customer: Customer) => void
  onEditCustomer?: (customer: Customer) => void
  onDeleteCustomer?: (customerId: string) => void
  filters?: CustomerFilters
  onFiltersChange?: (filters: CustomerFilters) => void
}

// Status badge configuration
const statusConfig: Record<CustomerStatus, { key: string; className: string }> = {
  active: {
    key: 'status.active',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  inactive: {
    key: 'status.inactive',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
  blocked: {
    key: 'status.blocked',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

// Customer type icons
const customerTypeIcons: Record<CustomerType, typeof Building2> = {
  corporate: Building2,
  individual: User,
  government: Landmark,
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function CustomerList({
  customers,
  isLoading,
  onCustomerClick,
  onEditCustomer,
  onDeleteCustomer,
  filters = {},
  onFiltersChange,
}: CustomerListProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)

  // Debounced search
  const handleSearch = (value: string) => {
    setSearchValue(value)
    // Debounce would be better here, simplified for now
    onFiltersChange?.({ ...filters, search: value })
  }

  // Column definitions
  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ms-4 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('crm.customer')}
            <ArrowUpDown className="ms-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const customer = row.original
          const TypeIcon = customerTypeIcons[customer.customerType]

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{customer.name}</span>
                  <TypeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
                {customer.company && (
                  <p className="text-sm text-muted-foreground truncate">
                    {customer.company}
                  </p>
                )}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'phone',
        header: t('crm.contact'),
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <a
                href={`tel:${row.original.phone}`}
                className="hover:text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {row.original.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <a
                href={`mailto:${row.original.email}`}
                className="hover:text-primary hover:underline truncate max-w-[180px]"
                onClick={(e) => e.stopPropagation()}
              >
                {row.original.email}
              </a>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'customerType',
        header: t('common.type'),
        cell: ({ row }) => {
          const type = row.original.customerType
          return (
            <Badge variant="outline" className="capitalize">
              {type}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'address.emirate',
        header: t('crm.emirate'),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.address.emirate}</span>
        ),
      },
      {
        accessorKey: 'totalJobs',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ms-4 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('crm.jobsTab')}
            <ArrowUpDown className="ms-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.totalJobs}</span>
        ),
      },
      {
        accessorKey: 'lifetimeValue',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ms-4 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('crm.lifetimeValue')}
            <ArrowUpDown className="ms-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium text-emerald-600">
            {formatAmount(row.original.lifetimeValue)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: t('common.status'),
        cell: ({ row }) => {
          const status = row.original.status
          const config = statusConfig[status]
          return (
            <Badge className={cn('text-xs', config.className)}>
              {t(config.key)}
            </Badge>
          )
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const customer = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onCustomerClick?.(customer)}>
                  <Eye className="h-4 w-4 me-2" />
                  {t('common.viewDetails')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditCustomer?.(customer)}>
                  <Pencil className="h-4 w-4 me-2" />
                  {t('common.edit')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDeleteCustomer?.(customer.id)}
                >
                  <Trash2 className="h-4 w-4 me-2" />
                  {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        size: 50,
      },
    ],
    [onCustomerClick, onEditCustomer, onDeleteCustomer, t]
  )

  const table = useReactTable({
    data: customers,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const selectedCount = Object.keys(rowSelection).length

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('crm.searchCustomers')}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="ps-9"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 me-2" />
            {t('common.filters')}
            <ChevronDown
              className={cn(
                'h-4 w-4 ms-2 transition-transform',
                showFilters && 'rotate-180'
              )}
            />
          </Button>

          {selectedCount > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedCount} {t('common.selected')}
              </span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 me-2" />
                {t('common.export')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              onFiltersChange?.({
                ...filters,
                status: value === 'all' ? undefined : (value as CustomerStatus),
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('common.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.allStatus')}</SelectItem>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
              <SelectItem value="blocked">{t('status.blocked')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.customerType || 'all'}
            onValueChange={(value) =>
              onFiltersChange?.({
                ...filters,
                customerType: value === 'all' ? undefined : (value as CustomerType),
              })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('common.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.allTypes')}</SelectItem>
              <SelectItem value="individual">{t('status.individual')}</SelectItem>
              <SelectItem value="corporate">{t('status.corporate')}</SelectItem>
              <SelectItem value="government">{t('status.government')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.emirate || 'all'}
            onValueChange={(value) =>
              onFiltersChange?.({
                ...filters,
                emirate: value === 'all' ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('crm.emirate')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('crm.allEmirates')}</SelectItem>
              {UAE_EMIRATES.map((emirate) => (
                <SelectItem key={emirate} value={emirate}>
                  {emirate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onFiltersChange?.({
                search: filters.search,
                page: 1,
                pageSize: filters.pageSize,
              })
            }
          >
            {t('common.clearFilters')}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onCustomerClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <User className="h-8 w-8 mb-2" />
                    <p>{t('crm.noCustomersFound')}</p>
                    <p className="text-sm">{t('crm.tryAdjusting')}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default CustomerList
