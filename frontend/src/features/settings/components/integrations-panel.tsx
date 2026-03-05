/**
 * Integrations Panel Component
 * Phase 13: Settings Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Loader2, MessageCircle, Map, CreditCard, BookOpen, Cloud, Phone,
  CheckCircle, XCircle, AlertTriangle, ExternalLink, RefreshCw,
} from 'lucide-react'
import type { Integration } from '../types/settings.types'

const ICON_MAP: Record<string, React.ElementType> = {
  MessageCircle,
  Map,
  CreditCard,
  BookOpen,
  Cloud,
  Phone,
}

const STATUS_CONFIG_KEYS = {
  connected: { color: 'bg-green-100 text-green-700', icon: CheckCircle, labelKey: 'status.connected' },
  disconnected: { color: 'bg-gray-100 text-gray-600', icon: XCircle, labelKey: 'status.disconnected' },
  error: { color: 'bg-red-100 text-red-700', icon: AlertTriangle, labelKey: 'status.error' },
}

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  communication: 'settings.communication',
  payment: 'settings.payment',
  accounting: 'settings.accounting',
  maps: 'settings.mapsGPS',
  storage: 'settings.storage',
}

interface IntegrationsPanelProps {
  integrations: Integration[]
  isLoading: boolean
  onToggle: (id: string, connect: boolean) => void
  isToggling: boolean
}

export function IntegrationsPanel({
  integrations,
  isLoading,
  onToggle,
  isToggling,
}: IntegrationsPanelProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Group by category
  const grouped = integrations.reduce<Record<string, Integration[]>>((acc, int) => {
    if (!acc[int.category]) acc[int.category] = []
    acc[int.category].push(int)
    return acc
  }, {})

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-AE', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('status.connected')}</p>
          <p className="text-xl font-bold text-green-600">
            {integrations.filter(i => i.status === 'connected').length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('status.disconnected')}</p>
          <p className="text-xl font-bold text-gray-500">
            {integrations.filter(i => i.status === 'disconnected').length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('status.errors')}</p>
          <p className="text-xl font-bold text-red-600">
            {integrations.filter(i => i.status === 'error').length}
          </p>
        </Card>
      </div>

      {/* Integration Groups */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            {t(CATEGORY_LABEL_KEYS[category] || category)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(integration => {
              const IconComponent = ICON_MAP[integration.icon] || Cloud
              const statusCfg = STATUS_CONFIG_KEYS[integration.status]
              const StatusIcon = statusCfg.icon

              return (
                <Card key={integration.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                        integration.status === 'connected' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                      )}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{integration.name}</p>
                          <Badge className={cn('text-xs', statusCfg.color)}>
                            <StatusIcon className="h-3 w-3 me-1" />
                            {t(statusCfg.labelKey)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{integration.description}</p>
                        {integration.lastSyncAt && (
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {t('settings.lastSync')}: {formatDate(integration.lastSyncAt)}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          {integration.status === 'connected' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() => onToggle(integration.id, false)}
                                disabled={isToggling}
                              >
                                {t('settings.disconnect')}
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs">
                                <RefreshCw className="h-3 w-3 me-1" />
                                {t('settings.sync')}
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => onToggle(integration.id, true)}
                              disabled={isToggling}
                            >
                              {isToggling ? (
                                <Loader2 className="h-3 w-3 me-1 animate-spin" />
                              ) : (
                                <ExternalLink className="h-3 w-3 me-1" />
                              )}
                              {t('settings.connect')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
