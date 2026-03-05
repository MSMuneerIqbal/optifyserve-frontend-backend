/**
 * Job Assignment Modal
 * Phase 12: Dispatcher Command Center
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  MapPin, Clock, Star, Briefcase, Loader2,
  CheckCircle, Award, Navigation, Phone, MessageCircle,
} from 'lucide-react'
import { JOB_PRIORITY_CONFIG, SERVICE_TYPE_CONFIG } from '@/features/jobs/types/job.types'
import { TECHNICIAN_STATUS_CONFIG } from '@/features/jobs/types/technician.types'
import type { JobLocation, DispatcherAssignmentSuggestion } from '../types/dispatcher.types'

interface JobAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  job: JobLocation | null
  suggestions: DispatcherAssignmentSuggestion[]
  isLoadingSuggestions: boolean
  isAssigning: boolean
  onAssign: (technicianId: string, notifyTechnician?: boolean) => void
}

export function JobAssignmentModal({
  isOpen,
  onClose,
  job,
  suggestions,
  isLoadingSuggestions,
  isAssigning,
  onAssign,
}: JobAssignmentModalProps) {
  const { t } = useTranslation()
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true)

  if (!job) return null

  const priorityCfg = JOB_PRIORITY_CONFIG[job.priority]
  const serviceCfg = SERVICE_TYPE_CONFIG[job.serviceType]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            {t('dispatcher.assignTechnician')}
          </DialogTitle>
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs">{job.jobNumber}</Badge>
              <Badge className={cn('text-xs', priorityCfg.color)}>{t(priorityCfg.key)}</Badge>
              <Badge variant="outline" className="text-xs">{t(serviceCfg.key)}</Badge>
            </div>
            <p className="text-sm font-medium">{job.title}</p>
            <p className="text-xs text-muted-foreground">{job.customerName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{job.serviceAddress.area}, {job.serviceAddress.building}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{job.scheduledTime} - {job.estimatedDuration} {t('dispatcher.minEstimated')}</span>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* WhatsApp Notification Toggle */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <Checkbox
              id="notify-whatsapp"
              checked={notifyWhatsApp}
              onCheckedChange={(checked) => setNotifyWhatsApp(checked === true)}
            />
            <Label htmlFor="notify-whatsapp" className="flex items-center gap-1.5 text-sm cursor-pointer">
              <MessageCircle className="h-4 w-4 text-green-600" />
              {t('dispatcher.sendWhatsAppNotification')}
            </Label>
          </div>

          <h4 className="text-sm font-semibold mb-3">{t('dispatcher.suggestedTechnicians')}</h4>

          {isLoadingSuggestions ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-muted-foreground">{t('dispatcher.noAvailableTechnicians')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => {
                const statusCfg = TECHNICIAN_STATUS_CONFIG[suggestion.status]

                return (
                  <Card
                    key={suggestion.technicianId}
                    className={cn(
                      'p-4 transition-all',
                      suggestion.isBestMatch && 'ring-2 ring-green-500 bg-green-50/50'
                    )}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">{suggestion.technicianName}</p>
                              {suggestion.isBestMatch && (
                                <Badge className="bg-green-600 text-white text-xs">
                                  <Award className="h-3 w-3 me-1" />
                                  {t('dispatcher.bestMatch')}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge className={cn('text-xs', statusCfg.color)}>
                                {t(statusCfg.key)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {suggestion.primarySkill.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-primary">{suggestion.score}</span>
                            <span className="text-xs text-muted-foreground">/100</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{t('dispatcher.matchScore')}</p>
                        </div>
                      </div>

                      {/* Score Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Navigation className="h-3 w-3 text-blue-500" />
                          <span>{suggestion.distanceKm} km</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-amber-500" />
                          <span>{suggestion.estimatedTravelMinutes} {t('dispatcher.minETA')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3 w-3 text-primary" />
                          <span>{suggestion.activeJobCount} {t('dispatcher.activeJobs')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3 w-3 text-amber-400" />
                          <span>{suggestion.avgRating.toFixed(1)} {t('dispatcher.rating')}</span>
                        </div>
                      </div>

                      {/* Skill Match */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {suggestion.skillMatch ? (
                          <Badge variant="outline" className="text-xs text-green-700 border-green-300 bg-green-50">
                            <CheckCircle className="h-3 w-3 me-1" />
                            {t('dispatcher.skillMatch')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-amber-700 border-amber-300 bg-amber-50">
                            {t('dispatcher.differentSpecialty')}
                          </Badge>
                        )}
                        {suggestion.reasons.map((reason, i) => (
                          <span key={i} className="text-xs text-muted-foreground">
                            {i > 0 && '·'} {reason}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => onAssign(suggestion.technicianId, notifyWhatsApp)}
                          disabled={isAssigning}
                        >
                          {isAssigning ? (
                            <Loader2 className="h-4 w-4 me-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 me-1" />
                          )}
                          {t('dispatcher.assign')}
                        </Button>
                        <Button variant="outline" size="sm" className="shrink-0">
                          <Phone className="h-4 w-4 me-1" />
                          {t('common.call')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
