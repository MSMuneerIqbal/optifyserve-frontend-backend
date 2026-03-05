/**
 * HR Reports Page
 * Phase 10: HR Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/page-header'
import { sampleEmployees, sampleDocumentExpiryAlerts } from '@/data/employees.data'
// formatCurrency available for future use
import {
  Users, Building2, Globe, FileWarning, UserCheck,
  UserX, BarChart3,
} from 'lucide-react'

export function HRReportsPage() {
  const { t } = useTranslation()
  const employees = sampleEmployees
  const expiryAlerts = sampleDocumentExpiryAlerts

  const totalEmployees = employees.length
  const activeCount = employees.filter((e) => e.status === 'active').length
  const inactiveCount = employees.filter((e) => e.status !== 'active').length

  // Department breakdown
  const deptBreakdown = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.departmentName] = (acc[e.departmentName] || 0) + 1
    return acc
  }, {})

  // Nationality breakdown
  const natBreakdown = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.nationality] = (acc[e.nationality] || 0) + 1
    return acc
  }, {})

  // Branch breakdown
  const branchBreakdown = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.branchName] = (acc[e.branchName] || 0) + 1
    return acc
  }, {})

  const expiredDocs = expiryAlerts.filter((a) => a.severity === 'expired').length
  const criticalDocs = expiryAlerts.filter((a) => a.severity === 'critical').length

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title={t('hr.hrReportsTitle')} description={t('hr.hrReportsDescription')} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard icon={Users} label={t('hr.totalEmployees')} value={totalEmployees} color="text-primary" />
        <KPICard icon={UserCheck} label={t('hr.activeCount')} value={activeCount} color="text-green-600" />
        <KPICard icon={UserX} label={t('hr.inactiveTerminated')} value={inactiveCount} color="text-red-600" />
        <KPICard icon={Building2} label={t('hr.departmentsCount')} value={Object.keys(deptBreakdown).length} color="text-blue-600" />
        <KPICard icon={Globe} label={t('hr.nationalities')} value={Object.keys(natBreakdown).length} color="text-purple-600" />
        <KPICard icon={FileWarning} label={t('hr.docAlerts')} value={expiredDocs + criticalDocs} color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Department Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />{t('hr.headcountByDept')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(deptBreakdown).sort(([, a], [, b]) => b - a).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between">
                <span className="text-sm">{dept}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(count / totalEmployees) * 100}%` }}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs min-w-[28px] text-center">{count}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Nationality Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />{t('hr.headcountByNationality')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(natBreakdown).sort(([, a], [, b]) => b - a).slice(0, 8).map(([nat, count]) => (
              <div key={nat} className="flex items-center justify-between">
                <span className="text-sm">{nat}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${(count / totalEmployees) * 100}%` }}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs min-w-[28px] text-center">{count}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Branch Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />{t('hr.headcountByBranch')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(branchBreakdown).sort(([, a], [, b]) => b - a).map(([branch, count]) => (
              <div key={branch} className="flex items-center justify-between">
                <span className="text-sm">{branch}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${(count / totalEmployees) * 100}%` }}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs min-w-[28px] text-center">{count}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Document Expiry Summary */}
      {expiryAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-amber-600" />
              {t('hr.docExpirySummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{expiredDocs}</p>
                <p className="text-xs text-red-700">{t('hr.expired')}</p>
              </div>
              <div className="p-3 bg-red-50/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-500">{criticalDocs}</p>
                <p className="text-xs text-red-600">{t('hr.critical7Days')}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {expiryAlerts.filter((a) => a.severity === 'warning').length}
                </p>
                <p className="text-xs text-amber-700">{t('hr.warning30Days')}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {expiryAlerts.filter((a) => a.severity === 'info').length}
                </p>
                <p className="text-xs text-blue-700">{t('hr.upcoming90Days')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function KPICard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-xs text-muted-foreground truncate">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </Card>
  )
}

export default HRReportsPage
