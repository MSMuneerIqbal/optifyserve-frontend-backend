/**
 * Document Expiry Alerts Component
 * Phase 10: HR Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { AlertTriangle, Bell } from 'lucide-react'
import type { DocumentExpiryAlert } from '../types/document.types'
import { EXPIRY_SEVERITY_CONFIG } from '../types/document.types'

interface DocumentExpiryAlertsProps {
  alerts: DocumentExpiryAlert[]
  isLoading: boolean
}

export function DocumentExpiryAlerts({ alerts, isLoading }: DocumentExpiryAlertsProps) {
  const { t } = useTranslation()
  const sortedAlerts = [...alerts].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)

  const expiredCount = alerts.filter((a) => a.severity === 'expired').length
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-600" />
            {t('hr.documentExpiryAlerts')}
          </CardTitle>
          <div className="flex gap-2">
            {expiredCount > 0 && (
              <Badge variant="destructive" className="text-xs">{expiredCount} {t('hr.expired')}</Badge>
            )}
            {criticalCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                {criticalCount} {t('hr.critical')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm">{t('hr.noDocumentExpiryAlerts')}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {sortedAlerts.map((alert) => {
              const config = EXPIRY_SEVERITY_CONFIG[alert.severity]
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border',
                    alert.severity === 'expired' && 'bg-red-50 border-red-200',
                    alert.severity === 'critical' && 'bg-red-50/50 border-red-100',
                    alert.severity === 'warning' && 'bg-amber-50 border-amber-200',
                    alert.severity === 'info' && 'bg-blue-50 border-blue-200',
                  )}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs">{getInitials(alert.employeeName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{alert.employeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.documentTypeName} - {alert.departmentName}
                    </p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className={cn('text-xs font-medium', config.color)}>
                      {alert.daysUntilExpiry < 0
                        ? t('hr.expiredDaysAgo', { days: Math.abs(alert.daysUntilExpiry) })
                        : alert.daysUntilExpiry === 0
                          ? t('hr.expiresToday')
                          : t('hr.daysLeft', { days: alert.daysUntilExpiry })}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(alert.expiryDate)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DocumentExpiryAlerts
