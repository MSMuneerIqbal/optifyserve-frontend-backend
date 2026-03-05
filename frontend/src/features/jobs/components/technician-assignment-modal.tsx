/**
 * Technician Assignment Modal Component
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Star, Clock, MapPin, CheckCircle, Award, XCircle } from 'lucide-react'
import { formatDistance, formatTravelTime } from '../utils/eta-calculator'
import type { TechnicianAssignmentSuggestion } from '../types/technician.types'

interface TechnicianAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
  jobNumber: string
  suggestions: TechnicianAssignmentSuggestion[]
  isLoading: boolean
  isAssigning: boolean
  onAssign: (technicianId: string) => void
}

export function TechnicianAssignmentModal({
  isOpen, onClose, jobTitle, jobNumber, suggestions,
  isLoading, isAssigning: _isAssigning, onAssign,
}: TechnicianAssignmentModalProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('jobs.assignTechnician')}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            <Badge variant="outline" className="font-mono me-2">{jobNumber}</Badge>
            {jobTitle}
          </p>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto py-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : suggestions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t('jobs.noAvailableTechnicians')}
            </p>
          ) : (
            suggestions.map((suggestion, index) => (
              <Card
                key={suggestion.technician.id}
                className={cn(
                  'p-4 cursor-pointer transition-all hover:border-primary/30',
                  index === 0 && 'border-primary/70 bg-primary/5',
                )}
                onClick={() => onAssign(suggestion.technician.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                      {suggestion.technician.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{suggestion.technician.name}</p>
                        {index === 0 && (
                          <Badge className="bg-primary text-xs">
                            <Award className="h-3 w-3 me-1" />{t('jobs.bestMatch')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{suggestion.technician.employeeId}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-primary">{suggestion.score}</p>
                    <p className="text-xs text-muted-foreground">{t('jobs.score')}</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{formatDistance(suggestion.distanceKm)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>ETA {formatTravelTime(suggestion.estimatedTravelMinutes)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span>{suggestion.technician.avgRating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    {suggestion.skillMatch ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-400" />
                    )}
                    <span>{t('jobs.skill')}: {suggestion.skillMatch ? t('jobs.match') : t('jobs.noMatch')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">{t('jobs.jobsLabel')}:</span>
                    <span>{suggestion.technician.activeJobCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">{t('jobs.workload')}:</span>
                    <span>{suggestion.currentWorkload}</span>
                  </div>
                </div>

                {suggestion.reasons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {suggestion.reasons.map((reason, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{reason}</Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TechnicianAssignmentModal
