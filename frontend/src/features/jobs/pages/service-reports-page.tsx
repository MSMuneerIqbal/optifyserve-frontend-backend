/**
 * Service Reports Page
 * Phase 11: Jobs/Service Management Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatDate, cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { FileText, Eye, CheckCircle, Clock } from 'lucide-react'
import { sampleServiceReports } from '@/data/jobs.data'
import type { ServiceReport } from '../types/service-report.types'

type ReportStatus = ServiceReport['status']

const STATUS_CONFIG: Record<ReportStatus, { labelKey: string; color: string }> = {
  draft: { labelKey: 'status.draft', color: 'bg-slate-100 text-slate-700' },
  submitted: { labelKey: 'status.submitted', color: 'bg-blue-100 text-blue-700' },
  approved: { labelKey: 'status.approved', color: 'bg-green-100 text-green-700' },
}

export function ServiceReportsPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const isLoading = false
  const reports = sampleServiceReports
  const [selectedReport, setSelectedReport] = useState<ServiceReport | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('jobs.serviceReportsTitle')}
        description={t('jobs.serviceReportsDescription')}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('jobs.reports')}
            <Badge variant="secondary" className="ms-1">{reports.length}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('jobs.reportNumber')}</TableHead>
                  <TableHead>{t('jobs.job')}</TableHead>
                  <TableHead>{t('jobs.technician')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('jobs.checklist')}</TableHead>
                  <TableHead>{t('jobs.cost')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      {t('jobs.noServiceReports')}
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => {
                    const statusCfg = STATUS_CONFIG[report.status]
                    const completedItems = report.checklist.filter(i => i.status === 'completed').length

                    return (
                      <TableRow key={report.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedReport(report)}>
                        <TableCell>
                          <span className="font-mono text-xs">{report.reportNumber}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs text-muted-foreground">{report.jobNumber}</span>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{report.technicianName}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{formatDate(report.submittedAt || report.createdAt)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {completedItems}/{report.checklist.length}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{formatAmount(report.totalCost)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-xs', statusCfg.color)}>
                            {t(statusCfg.labelKey)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelectedReport(report) }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : reports.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t('jobs.noReports')}</p>
            ) : (
              reports.map((report) => {
                const statusCfg = STATUS_CONFIG[report.status]
                return (
                  <Card key={report.id} className="p-3 cursor-pointer hover:bg-muted/50" onClick={() => setSelectedReport(report)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-mono text-xs text-muted-foreground">{report.reportNumber}</span>
                        <p className="text-sm font-medium mt-0.5">{report.technicianName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</p>
                      </div>
                      <Badge className={cn('text-xs', statusCfg.color)}>{t(statusCfg.labelKey)}</Badge>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="w-[95vw] max-w-2xl h-[85vh] p-0 flex flex-col">
            <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedReport.reportNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">{t('jobs.technician')}</p>
                    <p className="font-medium">{selectedReport.technicianName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{t('common.status')}</p>
                    <Badge className={cn('text-xs', STATUS_CONFIG[selectedReport.status].color)}>
                      {t(STATUS_CONFIG[selectedReport.status].labelKey)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{t('jobs.duration')}</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {selectedReport.actualDuration} min
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{t('jobs.totalCost')}</p>
                    <p className="font-medium">{formatAmount(selectedReport.totalCost)}</p>
                  </div>
                </div>

                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">{t('jobs.workPerformed')}</p>
                  <p className="text-sm text-muted-foreground">{selectedReport.workPerformed}</p>
                </div>

                {selectedReport.recommendations && (
                  <div>
                    <p className="text-sm font-medium mb-1">{t('jobs.recommendations')}</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.recommendations}</p>
                  </div>
                )}

                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">
                    {t('jobs.checklist')} ({selectedReport.checklist.filter(i => i.status === 'completed').length}/{selectedReport.checklist.length})
                  </p>
                  <div className="space-y-1">
                    {selectedReport.checklist.map(item => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={cn('h-4 w-4', item.status === 'completed' ? 'text-green-500' : 'text-muted-foreground/30')} />
                        <span className={cn(item.status === 'completed' && 'line-through text-muted-foreground')}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedReport.partsUsed.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">{t('jobs.partsUsed')}</p>
                      {selectedReport.partsUsed.map((part, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span>{part.partName} x{part.quantity}</span>
                          <span className="font-medium">{formatAmount(part.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ServiceReportsPage
