import { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDebounce } from '@/hooks/use-debounce'
import { useEffect, useState } from 'react'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  searchColumn?: string
  globalFilter: string
  setGlobalFilter: (value: string) => void
  showColumnVisibility?: boolean
  filterComponent?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder,
  searchColumn,
  globalFilter,
  setGlobalFilter,
  showColumnVisibility = true,
  filterComponent,
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation()
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('common.searchPlaceholder')
  const [searchValue, setSearchValue] = useState(globalFilter)
  const debouncedSearch = useDebounce(searchValue, 300)

  useEffect(() => {
    if (searchColumn) {
      table.getColumn(searchColumn)?.setFilterValue(debouncedSearch)
    } else {
      setGlobalFilter(debouncedSearch)
    }
  }, [debouncedSearch, searchColumn, setGlobalFilter, table])

  const isFiltered =
    table.getState().columnFilters.length > 0 || globalFilter.length > 0

  const handleClearFilters = () => {
    setSearchValue('')
    setGlobalFilter('')
    table.resetColumnFilters()
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={resolvedSearchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-10 ps-9 pe-9"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => setSearchValue('')}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t('common.clearSearch')}</span>
            </Button>
          )}
        </div>

        {/* Additional Filters */}
        {filterComponent}

        {/* Clear Filters Button */}
        {isFiltered && (
          <Button variant="ghost" onClick={handleClearFilters} className="h-10 px-3">
            {t('common.clearFilters')}
            <X className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Column Visibility */}
      {showColumnVisibility && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <SlidersHorizontal className="me-2 h-4 w-4" />
              {t('common.columns')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{t('common.toggleColumns')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id.replace(/_/g, ' ')}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default DataTableToolbar
