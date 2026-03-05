import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
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
import { cn } from '@/lib/utils'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { TableEmptyState } from '../empty-state'
import { LoadingSpinner } from '../loading-spinner'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  searchPlaceholder?: string
  searchColumn?: string
  isLoading?: boolean
  showPagination?: boolean
  showToolbar?: boolean
  showColumnVisibility?: boolean
  emptyMessage?: string
  emptyDescription?: string
  pageSize?: number
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  searchPlaceholder,
  searchColumn,
  isLoading = false,
  showPagination = true,
  showToolbar = true,
  showColumnVisibility = true,
  emptyMessage,
  emptyDescription,
  pageSize = 25,
  className,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation()
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('common.searchPlaceholder')
  const resolvedEmptyMessage = emptyMessage ?? t('common.noData')
  const resolvedEmptyDescription = emptyDescription ?? t('common.noRecords')
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  if (isLoading) {
    return <LoadingSpinner text={t('common.loading')} />
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      {showToolbar && (
        <DataTableToolbar
          table={table}
          searchPlaceholder={resolvedSearchPlaceholder}
          searchColumn={searchColumn}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          showColumnVisibility={showColumnVisibility}
        />
      )}

      {/* Table */}
      <div className="rounded-md border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      onRowClick && 'cursor-pointer hover:bg-slate-50'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24">
                    <TableEmptyState title={resolvedEmptyMessage} description={resolvedEmptyDescription} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && data.length > 0 && <DataTablePagination table={table} />}
    </div>
  )
}

export default DataTable
