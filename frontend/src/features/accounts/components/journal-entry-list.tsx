/**
 * Journal Entry List Component
 * Phase 9: Accounts/Finance Module
 *
 * List of journal entries with filtering
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
  CheckCircle,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
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
import { useCurrency } from '@/contexts/currency-context'
import { formatDate, cn } from '@/lib/utils'
import { sampleJournalEntries } from '@/data/accounts.data'
import { JOURNAL_STATUS_CONFIG, JOURNAL_TYPE_KEYS } from '../types/journal-entry.types'
import type { JournalEntry, JournalEntryStatus, JournalEntryFilters } from '../types/journal-entry.types'

interface JournalEntryListProps {
  onView: (entry: JournalEntry) => void
  onEdit: (entry: JournalEntry) => void
  className?: string
}

export function JournalEntryList({ onView, onEdit, className }: JournalEntryListProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [filters, setFilters] = useState<JournalEntryFilters>({ page: 1, pageSize: 25 })
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; entry: JournalEntry | null }>({
    isOpen: false,
    entry: null,
  })

  const isLoading = false
  const error = null
  const entries = sampleJournalEntries

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchValue, page: 1 }))
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleFilterChange = (key: keyof JournalEntryFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 25 })
    setSearchValue('')
  }

  const handleDelete = () => {
    if (deleteConfirm.entry) {
      toast.success(`${t('common.deleted')}: ${deleteConfirm.entry.entryNumber}`)
      setDeleteConfirm({ isOpen: false, entry: null })
    }
  }

  const postEntry = (_id: string) => {
    toast.success(t('status.posted'))
  }

  const reverseEntry = (_id: string) => {
    toast.success(t('common.reversed'))
  }

  const getStatusVariant = (status: JournalEntryStatus) => {
    return JOURNAL_STATUS_CONFIG[status]?.variant || 'neutral'
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
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">{t('common.retry')}</Button>
      </div>
    )
  }

  const hasActiveFilters = filters.search || filters.status || filters.type

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
            {hasActiveFilters && <Badge variant="secondary" className="ms-1 h-5 w-5 p-0 justify-center">!</Badge>}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}><X className="h-4 w-4" /></Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.status')}</label>
                <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v === 'all' ? undefined : v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                    {Object.entries(JOURNAL_STATUS_CONFIG).map(([k, cfg]) => (
                      <SelectItem key={k} value={k}>{t(cfg.key)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('common.type')}</label>
                <Select value={filters.type || 'all'} onValueChange={(v) => handleFilterChange('type', v === 'all' ? undefined : v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allTypes')}</SelectItem>
                    {Object.entries(JOURNAL_TYPE_KEYS).map(([k, val]) => (
                      <SelectItem key={k} value={k}>{t(val)}</SelectItem>
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

      {entries.length === 0 ? (
        <EmptyState icon="document" title={t('common.noResults')} description={hasActiveFilters ? t('common.adjustFilters') : t('common.noData')} />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t('common.entryNumber')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('common.type')}</TableHead>
                  <TableHead>{t('accounts.narration')}</TableHead>
                  <TableHead className="text-end">{t('accounts.debit')}</TableHead>
                  <TableHead className="text-end">{t('accounts.credit')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(entry)}>
                    <TableCell className="font-medium">{entry.entryNumber}</TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(JOURNAL_TYPE_KEYS[entry.type])}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.narration}</TableCell>
                    <TableCell className="text-end">{formatAmount(entry.totalDebit)}</TableCell>
                    <TableCell className="text-end">{formatAmount(entry.totalCredit)}</TableCell>
                    <TableCell>
                      <StatusBadge variant={getStatusVariant(entry.status)}>
                        {t(JOURNAL_STATUS_CONFIG[entry.status]?.key)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(entry)}>
                            <Eye className="h-4 w-4 me-2" /> {t('common.view')}
                          </DropdownMenuItem>
                          {entry.status === 'draft' && (
                            <>
                              <DropdownMenuItem onClick={() => onEdit(entry)}>
                                <FileEdit className="h-4 w-4 me-2" /> {t('common.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => postEntry(entry.id)} disabled={!entry.isBalanced}>
                                <CheckCircle className="h-4 w-4 me-2" /> {t('common.post')}
                              </DropdownMenuItem>
                            </>
                          )}
                          {entry.status === 'posted' && (
                            <DropdownMenuItem onClick={() => reverseEntry(entry.id)}>
                              <RotateCcw className="h-4 w-4 me-2" /> {t('common.reverse')}
                            </DropdownMenuItem>
                          )}
                          {entry.status === 'draft' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm({ isOpen: true, entry })}
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
            {entries.map((entry) => (
              <Card key={entry.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onView(entry)}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-primary">{entry.entryNumber}</p>
                      <p className="text-sm truncate max-w-[200px]">{entry.narration}</p>
                      <Badge variant="outline" className="mt-1">{t(JOURNAL_TYPE_KEYS[entry.type])}</Badge>
                    </div>
                    <StatusBadge variant={getStatusVariant(entry.status)}>
                      {t(JOURNAL_STATUS_CONFIG[entry.status]?.key)}
                    </StatusBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">{t('accounts.debit')}</p>
                      <p className="font-medium">{formatAmount(entry.totalDebit)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('accounts.credit')}</p>
                      <p className="font-medium">{formatAmount(entry.totalCredit)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
                    {!entry.isBalanced && <Badge variant="destructive">{t('accounts.entryUnbalanced')}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, entry: null })}
        onConfirm={handleDelete}
        title={t('common.deleteConfirmTitle')}
        description={`${t('common.deleteConfirmDescription')} ${deleteConfirm.entry?.entryNumber}?`}
        confirmLabel={t('common.delete')}
        variant="destructive"
        isLoading={false}
      />
    </div>
  )
}

export default JournalEntryList
