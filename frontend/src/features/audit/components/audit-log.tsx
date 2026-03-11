/**
 * Audit Log Component
 * Extracted from settings module for standalone audit feature
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  Search, Loader2, Download, Clock, User, Globe,
  FileText, Shield, Trash2, Edit2, LogIn, CheckCircle, Send,
} from 'lucide-react'
import type { AuditLogEntry, AuditLogFilters } from '../types/audit.types'

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  create: { icon: FileText, color: 'text-green-600 bg-green-50' },
  update: { icon: Edit2, color: 'text-blue-600 bg-blue-50' },
  delete: { icon: Trash2, color: 'text-red-600 bg-red-50' },
  approve: { icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
  login: { icon: LogIn, color: 'text-primary bg-primary/5' },
  dispatch: { icon: Send, color: 'text-amber-600 bg-amber-50' },
}

const MODULES = [
  'all', 'auth', 'crm', 'sales', 'inventory', 'purchase',
  'accounts', 'hr', 'jobs', 'settings',
]

const ACTIONS = ['all', 'create', 'update', 'delete', 'approve', 'login', 'dispatch']

interface AuditLogComponentProps {
  entries: AuditLogEntry[]
  isLoading: boolean
  filters: AuditLogFilters
  onFiltersChange: (filters: AuditLogFilters) => void
}

export function AuditLogComponent({
  entries,
  isLoading,
  filters,
  onFiltersChange,
}: AuditLogComponentProps) {
  const { t } = useTranslation()

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 1) {
      const mins = Math.floor(diffMs / (1000 * 60))
      return t('common.minutesAgo', { count: mins })
    }
    if (diffHours < 24) {
      return t('common.hoursAgo', { count: Math.floor(diffHours) })
    }
    return date.toLocaleDateString('en-AE', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('settings.searchLogs')}
            className="ps-9"
          />
        </div>
        <Select
          value={filters.module || 'all'}
          onValueChange={(v) => onFiltersChange({ ...filters, module: v === 'all' ? undefined : v })}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder={t('settings.modulePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {MODULES.map(m => (
              <SelectItem key={m} value={m}>
                {m === 'all' ? t('settings.allModules') : t(`settings.auditModule.${m}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.action || 'all'}
          onValueChange={(v) => onFiltersChange({ ...filters, action: v === 'all' ? undefined : v })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('settings.actionPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {ACTIONS.map(a => (
              <SelectItem key={a} value={a}>
                {a === 'all' ? t('settings.allActions') : t(`settings.auditAction.${a}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 me-1.5" />
          {t('common.export')}
        </Button>
      </div>

      {/* Log List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('settings.activityLog')}
            <Badge variant="secondary" className="text-xs">{entries.length} {t('settings.entries')}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : entries.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              {t('settings.noAuditEntries')}
            </div>
          ) : (
            <div className="divide-y">
              {entries.map(entry => {
                const actionCfg = ACTION_CONFIG[entry.action] || ACTION_CONFIG.update
                const ActionIcon = actionCfg.icon

                return (
                  <div key={entry.id} className="flex items-start gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
                    <div className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5',
                      actionCfg.color
                    )}>
                      <ActionIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{entry.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(entry.timestamp)}
                        </span>
                        <Badge variant="outline" className="text-xs">{entry.module}</Badge>
                        <Badge variant="secondary" className="text-xs">{entry.action}</Badge>
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <Globe className="h-3 w-3" />
                          {entry.ipAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
