/**
 * Expense List Component
 * Phase 9: Accounts/Finance Module
 *
 * Displays list of expenses with filtering and actions
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
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared/empty-state'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { StatusBadge } from '@/components/shared/status-badge'
import { useCurrency } from '@/contexts/currency-context'
import { formatDate, cn } from '@/lib/utils'
import { sampleExpenses } from '@/data/accounts.data'
import { EXPENSE_STATUS_CONFIG, EXPENSE_CATEGORY_KEYS } from '../types/expense.types'
import type { Expense, ExpenseStatus, ExpenseFilters } from '../types/expense.types'

interface ExpenseListProps {
  onView: (expense: Expense) => void
  onEdit: (expense: Expense) => void
  onApprove?: (expense: Expense) => void
  className?: string
}

export function ExpenseList({ onView, onEdit, onApprove, className }: ExpenseListProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [filters, setFilters] = useState<ExpenseFilters>({ page: 1, pageSize: 25 })
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; expense: Expense | null }>({
    isOpen: false,
    expense: null,
  })

  const isLoading = false
  const error = null
  const isSubmitting = false

  const expenses = sampleExpenses as unknown as Expense[]
  const isDeleting = false
  const deleteExpense = (_id: string) => {
    toast.success(t('common.deleted'))
  }
  const submitExpense = (_id: string) => {
    toast.success(t('common.submittedForApproval'))
  }

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchValue, page: 1 }))
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleFilterChange = (key: keyof ExpenseFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 25 })
    setSearchValue('')
  }

  const handleDelete = () => {
    if (deleteConfirm.expense) {
      deleteExpense(deleteConfirm.expense.id)
      setDeleteConfirm({ isOpen: false, expense: null })
    }
  }

  const getStatusVariant = (status: ExpenseStatus) => {
    return EXPENSE_STATUS_CONFIG[status]?.variant || 'neutral'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{t('common.loadError')}</p>
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
              placeholder={t('common.searchPlaceholder')}
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
            <span className="hidden sm:inline">{t('common.filter')}</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ms-1 h-5 w-5 p-0 justify-center">!</Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
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
                  onValueChange={(v) => handleFilterChange('status', v === 'all' ? undefined : v)}
                >
                  <SelectTrigger><SelectValue placeholder={t('common.allStatuses')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                    {Object.entries(EXPENSE_STATUS_CONFIG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{t(cfg.key)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.category')}</label>
                <Select
                  value={filters.category || 'all'}
                  onValueChange={(v) => handleFilterChange('category', v === 'all' ? undefined : v)}
                >
                  <SelectTrigger><SelectValue placeholder={t('common.allCategories')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allCategories')}</SelectItem>
                    {Object.entries(EXPENSE_CATEGORY_KEYS).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{t(val)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.fromDate')}</label>
                <Input type="date" value={filters.dateFrom || ''} onChange={(e) => handleFilterChange('dateFrom', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.toDate')}</label>
                <Input type="date" value={filters.dateTo || ''} onChange={(e) => handleFilterChange('dateTo', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {expenses.length === 0 ? (
        <EmptyState
          icon="document"
          title={t('common.noResults')}
          description={hasActiveFilters ? t('common.adjustFilters') : t('common.noData')}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t('common.expenseNumber')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('common.category')}</TableHead>
                  <TableHead>{t('accounts.paidTo')}</TableHead>
                  <TableHead className="text-end">{t('common.amount')}</TableHead>
                  <TableHead className="text-end">{t('common.vat')}</TableHead>
                  <TableHead className="text-end">{t('common.total')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onView(expense)}
                  >
                    <TableCell className="font-medium">{expense.expenseNumber}</TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(EXPENSE_CATEGORY_KEYS[expense.category])}</Badge>
                    </TableCell>
                    <TableCell>{expense.paidTo}</TableCell>
                    <TableCell className="text-end">{formatAmount(expense.amount)}</TableCell>
                    <TableCell className="text-end">{formatAmount(expense.vatAmount)}</TableCell>
                    <TableCell className="text-end font-medium">{formatAmount(expense.totalAmount)}</TableCell>
                    <TableCell>
                      <StatusBadge variant={getStatusVariant(expense.status)}>
                        {t(EXPENSE_STATUS_CONFIG[expense.status]?.key)}
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
                          <DropdownMenuItem onClick={() => onView(expense)}>
                            <Eye className="h-4 w-4 me-2" /> {t('common.view')}
                          </DropdownMenuItem>
                          {(['draft', 'pending-approval', 'rejected'] as string[]).includes(expense.status) && (
                            <DropdownMenuItem onClick={() => onEdit(expense)}>
                              <FileEdit className="h-4 w-4 me-2" /> {t('common.edit')}
                            </DropdownMenuItem>
                          )}
                          {expense.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() => submitExpense(expense.id)}
                              disabled={isSubmitting}
                            >
                              <Send className="h-4 w-4 me-2" /> {t('common.submitForApproval')}
                            </DropdownMenuItem>
                          )}
                          {expense.status === 'pending-approval' && onApprove && (
                            <DropdownMenuItem onClick={() => onApprove(expense)}>
                              <CheckCircle className="h-4 w-4 me-2" /> {t('common.review')}
                            </DropdownMenuItem>
                          )}
                          {(['draft', 'rejected'] as string[]).includes(expense.status) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm({ isOpen: true, expense })}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 me-2" /> {t('common.delete')}
                              </DropdownMenuItem>
                            </>
                          )}
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
            {expenses.map((expense) => (
              <Card
                key={expense.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onView(expense)}
              >
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-primary">{expense.expenseNumber}</p>
                      <p className="text-sm">{expense.paidTo}</p>
                      <Badge variant="outline" className="mt-1">{t(EXPENSE_CATEGORY_KEYS[expense.category])}</Badge>
                    </div>
                    <StatusBadge variant={getStatusVariant(expense.status)}>
                      {t(EXPENSE_STATUS_CONFIG[expense.status]?.key)}
                    </StatusBadge>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm text-muted-foreground">{formatDate(expense.date)}</span>
                    <span className="text-lg font-bold">{formatAmount(expense.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, expense: null })}
        onConfirm={handleDelete}
        title={t('common.deleteConfirmTitle')}
        description={`${t('common.deleteConfirmDescription')} ${deleteConfirm.expense?.expenseNumber}?`}
        confirmLabel={t('common.delete')}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ExpenseList
