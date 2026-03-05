import { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PAGINATION_SIZES } from '@/lib/constants'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  showRowsSelected?: boolean
}

export function DataTablePagination<TData>({
  table,
  showRowsSelected = true,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation()
  const { pageSize, pageIndex } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const pageCount = table.getPageCount()

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      {/* Row Selection Info */}
      {showRowsSelected && (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <span>
              {t('common.rowsSelected', {
                count: table.getFilteredSelectedRowModel().rows.length,
                total: totalRows,
              })}
            </span>
          ) : (
            <span>
              {t('common.showingResults', {
                from: pageIndex * pageSize + 1,
                to: Math.min((pageIndex + 1) * pageSize, totalRows),
                total: totalRows,
              })}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <p className="hidden text-sm font-medium sm:block">{t('common.rowsPerPage')}</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-9 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGINATION_SIZES.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Info */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t('common.pageOf', { page: pageIndex + 1, total: pageCount || 1 })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="hidden h-9 w-9 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('common.goToFirstPage')}</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('common.goToPreviousPage')}</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('common.goToNextPage')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden h-9 w-9 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('common.goToLastPage')}</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataTablePagination
