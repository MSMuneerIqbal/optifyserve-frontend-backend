/**
 * Chart of Accounts Tree Component
 * Phase 9: Accounts/Finance Module
 *
 * Hierarchical tree view of all accounts with expand/collapse
 * Fully responsive with mobile card view
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronRight,
  ChevronDown,
  Plus,
  FileEdit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  X,
  FolderTree,
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
import { cn } from '@/lib/utils'
import { sampleChartOfAccounts } from '@/data/accounts.data'
import {
  ACCOUNT_TYPE_CONFIG,
  ACCOUNT_CATEGORY_KEYS,
} from '../types/chart-of-accounts.types'
import type { Account, AccountType } from '../types/chart-of-accounts.types'

interface ChartOfAccountsTreeProps {
  onEdit: (account: Account) => void
  onAddChild: (parentAccount: Account) => void
  className?: string
}

/**
 * Build tree structure from flat accounts list
 */
function buildTree(flatAccounts: Account[]): Account[] {
  const map = new Map<string, Account & { children: Account[] }>()
  const roots: Account[] = []

  flatAccounts.forEach((a) => map.set(a.id, { ...a, children: [] }))

  flatAccounts.forEach((a) => {
    const node = map.get(a.id)!
    if (a.parentId && map.has(a.parentId)) {
      map.get(a.parentId)!.children.push(node)
    } else if (!a.parentId) {
      roots.push(node)
    }
  })

  return roots
}

export function ChartOfAccountsTree({ onEdit, onAddChild, className }: ChartOfAccountsTreeProps) {
  const { t } = useTranslation()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [searchValue, setSearchValue] = useState('')
  const [typeFilter, setTypeFilter] = useState<AccountType | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; account: Account | null }>({
    isOpen: false,
    account: null,
  })

  const isLoading = false
  const error = null
  const accounts = useMemo(() => buildTree(sampleChartOfAccounts), [])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => {
    if (accounts) {
      const allIds = new Set<string>()
      const collect = (accs: Account[]) => {
        accs.forEach((a) => {
          if (a.children && a.children.length > 0) {
            allIds.add(a.id)
            collect(a.children)
          }
        })
      }
      collect(accounts)
      setExpandedIds(allIds)
    }
  }

  const collapseAll = () => setExpandedIds(new Set())

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    if (!accounts) return []
    const filterTree = (accs: Account[]): Account[] => {
      return accs
        .map((a) => {
          const children = a.children ? filterTree(a.children) : []
          const matchesSearch = !searchValue ||
            a.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            a.code.toLowerCase().includes(searchValue.toLowerCase())
          const matchesType = typeFilter === 'all' || a.type === typeFilter
          if ((matchesSearch && matchesType) || children.length > 0) {
            return { ...a, children }
          }
          return null
        })
        .filter(Boolean) as Account[]
    }
    return filterTree(accounts)
  }, [accounts, searchValue, typeFilter])

  const handleDelete = () => {
    if (deleteConfirm.account) {
      toast.success(`${t('common.delete')}: "${deleteConfirm.account.name}"`)
      setDeleteConfirm({ isOpen: false, account: null })
    }
  }

  const clearFilters = () => {
    setSearchValue('')
    setTypeFilter('all')
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

  const hasActiveFilters = searchValue || typeFilter !== 'all'

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
              className="ps-9 h-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            {t('common.expandAll')}
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            {t('common.collapseAll')}
          </Button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('accounts.accountType')}</label>
                <Select
                  value={typeFilter}
                  onValueChange={(v) => setTypeFilter(v as AccountType | 'all')}
                >
                  <SelectTrigger><SelectValue placeholder={t('common.allTypes')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allTypes')}</SelectItem>
                    {Object.entries(ACCOUNT_TYPE_CONFIG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{t(cfg.key)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredAccounts.length === 0 ? (
        <EmptyState
          icon="document"
          title={t('common.noResults')}
          description={hasActiveFilters ? t('common.adjustFilters') : t('common.noData')}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[400px]">{t('accounts.accountName')}</TableHead>
                  <TableHead>{t('accounts.accountType')}</TableHead>
                  <TableHead>{t('common.category')}</TableHead>
                  <TableHead className="text-end">{t('accounts.balance')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <AccountTreeRows
                    key={account.id}
                    account={account}
                    level={0}
                    expandedIds={expandedIds}
                    onToggle={toggleExpand}
                    onEdit={onEdit}
                    onAddChild={onAddChild}
                    onDelete={(a) => setDeleteConfirm({ isOpen: true, account: a })}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2">
            {filteredAccounts.map((account) => (
              <AccountTreeCards
                key={account.id}
                account={account}
                level={0}
                expandedIds={expandedIds}
                onToggle={toggleExpand}
                onEdit={onEdit}
                onAddChild={onAddChild}
                onDelete={(a) => setDeleteConfirm({ isOpen: true, account: a })}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, account: null })}
        onConfirm={handleDelete}
        title={t('common.deleteConfirmTitle')}
        description={`${t('common.deleteConfirmDescription')} "${deleteConfirm.account?.code} - ${deleteConfirm.account?.name}"?`}
        confirmLabel={t('common.delete')}
        variant="destructive"
        isLoading={false}
      />
    </div>
  )
}

// Desktop tree rows (recursive)
interface AccountTreeRowsProps {
  account: Account
  level: number
  expandedIds: Set<string>
  onToggle: (id: string) => void
  onEdit: (account: Account) => void
  onAddChild: (account: Account) => void
  onDelete: (account: Account) => void
}

function AccountTreeRows({
  account,
  level,
  expandedIds,
  onToggle,
  onEdit,
  onAddChild,
  onDelete,
}: AccountTreeRowsProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const hasChildren = account.children && account.children.length > 0
  const isExpanded = expandedIds.has(account.id)
  const typeConfig = ACCOUNT_TYPE_CONFIG[account.type]

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        <TableCell>
          <div className="flex items-center" style={{ paddingInlineStart: `${level * 24}px` }}>
            <button
              onClick={() => hasChildren && onToggle(account.id)}
              className={cn(
                'me-2 p-0.5 rounded hover:bg-muted',
                !hasChildren && 'invisible'
              )}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <FolderTree className="h-4 w-4 me-2 text-muted-foreground" />
            <div>
              <span className="font-mono text-sm font-medium text-primary">{account.code}</span>
              <span className="ms-2">{account.name}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <StatusBadge variant={typeConfig.variant}>{t(typeConfig.key)}</StatusBadge>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {t(ACCOUNT_CATEGORY_KEYS[account.category])}
        </TableCell>
        <TableCell className="text-end font-medium">
          {formatAmount(account.balance)}
        </TableCell>
        <TableCell>
          <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
            {account.status === 'active' ? t('status.active') : t('status.inactive')}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(account)}>
                <FileEdit className="h-4 w-4 me-2" /> {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddChild(account)}>
                <Plus className="h-4 w-4 me-2" /> {t('accounts.addSubAccount')}
              </DropdownMenuItem>
              {!account.isSystemAccount && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(account)}
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
      {isExpanded &&
        hasChildren &&
        account.children!.map((child) => (
          <AccountTreeRows
            key={child.id}
            account={child}
            level={level + 1}
            expandedIds={expandedIds}
            onToggle={onToggle}
            onEdit={onEdit}
            onAddChild={onAddChild}
            onDelete={onDelete}
          />
        ))}
    </>
  )
}

// Mobile tree cards (recursive)
interface AccountTreeCardsProps {
  account: Account
  level: number
  expandedIds: Set<string>
  onToggle: (id: string) => void
  onEdit: (account: Account) => void
  onAddChild: (account: Account) => void
  onDelete: (account: Account) => void
}

function AccountTreeCards({
  account,
  level,
  expandedIds,
  onToggle,
  onEdit,
  onAddChild,
  onDelete,
}: AccountTreeCardsProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const hasChildren = account.children && account.children.length > 0
  const isExpanded = expandedIds.has(account.id)
  const typeConfig = ACCOUNT_TYPE_CONFIG[account.type]

  return (
    <div style={{ marginInlineStart: `${level * 16}px` }}>
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="pt-3 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2 flex-1">
              {hasChildren && (
                <button onClick={() => onToggle(account.id)} className="mt-1 p-0.5 rounded hover:bg-muted">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-medium text-primary">{account.code}</span>
                  <StatusBadge variant={typeConfig.variant}>{t(typeConfig.key)}</StatusBadge>
                </div>
                <p className="font-medium mt-0.5">{account.name}</p>
                <p className="text-sm text-muted-foreground">{t(ACCOUNT_CATEGORY_KEYS[account.category])}</p>
                <p className="text-sm font-medium mt-1">{t('accounts.balance')}: {formatAmount(account.balance)}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(account)}>
                  <FileEdit className="h-4 w-4 me-2" /> {t('common.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddChild(account)}>
                  <Plus className="h-4 w-4 me-2" /> {t('accounts.addSubAccount')}
                </DropdownMenuItem>
                {!account.isSystemAccount && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(account)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 me-2" /> {t('common.delete')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      {isExpanded &&
        hasChildren &&
        account.children!.map((child) => (
          <AccountTreeCards
            key={child.id}
            account={child}
            level={level + 1}
            expandedIds={expandedIds}
            onToggle={onToggle}
            onEdit={onEdit}
            onAddChild={onAddChild}
            onDelete={onDelete}
          />
        ))}
    </div>
  )
}

export default ChartOfAccountsTree
