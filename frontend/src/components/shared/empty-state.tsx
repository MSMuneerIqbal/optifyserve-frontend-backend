import { useTranslation } from 'react-i18next'
import { Inbox, Search, FileText, Users, Package, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type IconType = 'inbox' | 'search' | 'document' | 'users' | 'package' | 'folder'

const icons: Record<IconType, React.ElementType> = {
  inbox: Inbox,
  search: Search,
  document: FileText,
  users: Users,
  package: Package,
  folder: FolderOpen,
}

interface EmptyStateProps {
  icon?: IconType
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary'
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: {
    container: 'py-8',
    icon: 'h-10 w-10',
    iconWrapper: 'h-16 w-16',
    title: 'text-base',
    description: 'text-sm',
  },
  md: {
    container: 'py-12',
    icon: 'h-12 w-12',
    iconWrapper: 'h-20 w-20',
    title: 'text-lg',
    description: 'text-sm',
  },
  lg: {
    container: 'py-16',
    icon: 'h-14 w-14',
    iconWrapper: 'h-24 w-24',
    title: 'text-xl',
    description: 'text-base',
  },
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const Icon = icons[icon]
  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        className
      )}
    >
      <div
        className={cn(
          'mb-4 flex items-center justify-center rounded-full bg-slate-100',
          sizes.iconWrapper
        )}
      >
        <Icon className={cn('text-slate-400', sizes.icon)} />
      </div>

      <h3 className={cn('font-semibold text-slate-900', sizes.title)}>{title}</h3>

      {description && (
        <p className={cn('mt-1 max-w-sm text-muted-foreground', sizes.description)}>
          {description}
        </p>
      )}

      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Table-specific empty state
export function TableEmptyState({
  title,
  description,
  action,
}: {
  title?: string
  description?: string
  action?: EmptyStateProps['action']
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="mb-4 h-12 w-12 text-slate-300" />
      <h3 className="text-sm font-medium text-slate-900">{title || t('common.noData')}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description || t('common.noRecords')}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline" size="sm" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Search empty state
export function SearchEmptyState({
  searchTerm,
  onClear,
}: {
  searchTerm?: string
  onClear?: () => void
}) {
  const { t } = useTranslation()
  return (
    <EmptyState
      icon="search"
      title={t('common.noResults')}
      description={
        searchTerm
          ? t('common.noResultsSearch', { term: searchTerm })
          : t('common.noResultsGeneric')
      }
      action={
        onClear
          ? {
              label: t('common.clearSearch'),
              onClick: onClear,
              variant: 'outline',
            }
          : undefined
      }
    />
  )
}

export default EmptyState
