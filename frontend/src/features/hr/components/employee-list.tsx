/**
 * Employee List Component
 * Phase 10: HR Module
 *
 * Data table for displaying and managing employees with
 * search, collapsible filters, and responsive column visibility.
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
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
import { cn, formatDate, getInitials } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import {
  Search,
  MoreHorizontal,
  Filter,
  ChevronDown,
  Plus,
  Download,
  UserPlus,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import type {
  EmployeeListItem,
  EmployeeStatus,
} from '../types/employee.types'
import { EMPLOYEE_STATUS_CONFIG } from '../types/employee.types'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EmployeeListProps {
  employees: EmployeeListItem[]
  isLoading: boolean
  onEmployeeClick: (employee: EmployeeListItem) => void
  onEditEmployee: (employee: EmployeeListItem) => void
  onDeleteEmployee: (employee: EmployeeListItem) => void
  departments: { id: string; name: string }[]
  branches: { id: string; name: string }[]
  onFiltersChange?: (filters: Record<string, string>) => void
  onAddEmployee?: () => void
  onExport?: () => void
}

// ---------------------------------------------------------------------------
// Status badge colour map
// ---------------------------------------------------------------------------

const STATUS_CLASS_MAP: Record<EmployeeStatus, string> = {
  active: 'bg-green-100 text-green-800 hover:bg-green-100',
  inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  on_leave: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  terminated: 'bg-red-100 text-red-800 hover:bg-red-100',
  probation: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EmployeeList({
  employees,
  isLoading,
  onEmployeeClick,
  onEditEmployee,
  onDeleteEmployee,
  departments,
  branches,
  onFiltersChange,
  onAddEmployee,
  onExport,
}: EmployeeListProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchInput, setSearchInput] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [branchFilter, setBranchFilter] = useState<string>('all')

  const debouncedSearch = useDebounce(searchInput, 300)

  // Notify parent when filters change (use ref for callback to avoid re-render loop)
  const onFiltersChangeRef = useRef(onFiltersChange)
  onFiltersChangeRef.current = onFiltersChange

  useEffect(() => {
    if (onFiltersChangeRef.current) {
      const next: Record<string, string> = {}
      if (debouncedSearch) next.search = debouncedSearch
      if (statusFilter !== 'all') next.status = statusFilter
      if (departmentFilter !== 'all') next.departmentId = departmentFilter
      if (branchFilter !== 'all') next.branchId = branchFilter
      onFiltersChangeRef.current(next)
    }
  }, [debouncedSearch, statusFilter, departmentFilter, branchFilter])

  // Client-side filtered data (used when parent is not handling filters)
  const filteredData = useMemo(() => {
    let result = employees

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.phone.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((e) => e.status === statusFilter)
    }

    if (departmentFilter !== 'all') {
      result = result.filter((e) =>
        departments.find((d) => d.id === departmentFilter && d.name === e.departmentName)
      )
    }

    if (branchFilter !== 'all') {
      result = result.filter((e) =>
        branches.find((b) => b.id === branchFilter && b.name === e.branchName)
      )
    }

    return result
  }, [employees, debouncedSearch, statusFilter, departmentFilter, branchFilter, departments, branches])

  const handleClearFilters = useCallback(() => {
    setStatusFilter('all')
    setDepartmentFilter('all')
    setBranchFilter('all')
  }, [])

  // Column definitions
  const columns = useMemo<ColumnDef<EmployeeListItem>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: t('hr.employee'),
        cell: ({ row }) => {
          const employee = row.original
          return (
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage
                  src={employee.profilePhotoUrl}
                  alt={employee.fullName}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {getInitials(employee.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{employee.fullName}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {employee.employeeId}
                </p>
              </div>
            </div>
          )
        },
        enableSorting: true,
      },
      {
        accessorKey: 'departmentName',
        header: t('common.department'),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.departmentName}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'designationName',
        header: t('hr.designation'),
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <span className="text-sm hidden md:table-cell">{row.original.designationName}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'branchName',
        header: t('hr.branch'),
        meta: { className: 'hidden lg:table-cell' },
        cell: ({ row }) => (
          <span className="text-sm hidden lg:table-cell">{row.original.branchName}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'joinDate',
        header: t('hr.joinDate'),
        meta: { className: 'hidden lg:table-cell' },
        cell: ({ row }) => (
          <span className="text-sm hidden lg:table-cell">
            {formatDate(row.original.joinDate)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'nationality',
        header: t('hr.nationality'),
        meta: { className: 'hidden lg:table-cell' },
        cell: ({ row }) => (
          <span className="text-sm hidden lg:table-cell">{row.original.nationality}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'totalSalary',
        header: t('hr.totalSalary'),
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => (
          <span className="text-sm font-medium text-emerald-600 hidden md:table-cell">
            {formatAmount(row.original.totalSalary)}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'status',
        header: t('common.status'),
        cell: ({ row }) => {
          const status = row.original.status
          const config = EMPLOYEE_STATUS_CONFIG[status]
          return (
            <Badge
              className={cn('text-xs font-medium', STATUS_CLASS_MAP[status])}
            >
              {t(config.key)}
            </Badge>
          )
        },
        enableSorting: true,
      },
      {
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
          const employee = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={t('common.actions')}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEmployeeClick(employee)
                  }}
                >
                  <Eye className="h-4 w-4 me-2" />
                  {t('common.view')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditEmployee(employee)
                  }}
                >
                  <Pencil className="h-4 w-4 me-2" />
                  {t('common.edit')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteEmployee(employee)
                  }}
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
    [t, onEmployeeClick, onEditEmployee, onDeleteEmployee]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const hasActiveFilters =
    statusFilter !== 'all' || departmentFilter !== 'all' || branchFilter !== 'all'

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t('hr.searchEmployees')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="ps-9"
          />
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((prev) => !prev)}
            className={cn(hasActiveFilters && 'border-primary/70 text-primary')}
          >
            <Filter className="h-4 w-4 me-2" />
            {t('common.filter')}
            {hasActiveFilters && (
              <span className="ms-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary text-white text-[10px] font-bold">
                !
              </span>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 ms-2 transition-transform duration-200',
                showFilters && 'rotate-180'
              )}
            />
          </Button>

          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 me-2" />
            {t('common.export')}
          </Button>

          <Button size="sm" onClick={onAddEmployee}>
            <UserPlus className="h-4 w-4 me-2" />
            <span className="hidden sm:inline">{t('hr.addEmployee')}</span>
            <Plus className="h-4 w-4 sm:hidden" />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg border border-border">
          {/* Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t('common.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.allStatus')}</SelectItem>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
              <SelectItem value="on_leave">{t('hr.onLeave')}</SelectItem>
              <SelectItem value="terminated">{t('hr.terminated')}</SelectItem>
              <SelectItem value="probation">{t('hr.probation')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Department */}
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('common.department')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('hr.allDepartments')}</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Branch */}
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('hr.branch')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('hr.allBranches')}</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              {t('common.clearFilters')}
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    className={cn(
                      header.column.getCanSort() && 'cursor-pointer select-none'
                    )}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-muted-foreground">
                            {header.column.getIsSorted() === 'asc'
                              ? ' ↑'
                              : header.column.getIsSorted() === 'desc'
                              ? ' ↓'
                              : ''}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    <span className="text-sm">{t('hr.loadingEmployees')}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50 min-h-[44px]"
                  onClick={() => onEmployeeClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <UserPlus className="h-8 w-8 opacity-40" />
                    <p className="font-medium">{t('hr.noEmployeesFound')}</p>
                    <p className="text-sm">
                      {debouncedSearch || hasActiveFilters
                        ? t('common.adjustFilters')
                        : t('hr.addFirstEmployee')}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer row count */}
      {!isLoading && filteredData.length > 0 && (
        <p className="text-sm text-muted-foreground text-end px-1">
          {t('hr.showingOf', {
            showing: table.getRowModel().rows.length,
            total: filteredData.length,
          })}{' '}
          {filteredData.length !== 1 ? t('hr.employeePlural') : t('hr.employee')}
        </p>
      )}
    </div>
  )
}

export default EmployeeList
