/**
 * Performance Reviews Page
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { PerformanceReviewList } from '../components/performance-review-list'
import { PerformanceReviewForm } from '../components/performance-review-form'
import { samplePerformanceReviews, sampleEmployees } from '@/data/employees.data'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Plus, Star } from 'lucide-react'
import { cn, formatDate, getInitials } from '@/lib/utils'
import { REVIEW_STATUS_CONFIG, RATING_LABELS } from '../types/performance.types'
import type { PerformanceReview, RatingScore } from '../types/performance.types'

export function PerformancePage() {
  const { t } = useTranslation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [viewingReview, setViewingReview] = useState<PerformanceReview | null>(null)

  const isLoading = false
  const isSubmitting = false

  const reviews = samplePerformanceReviews
  const employees = sampleEmployees.map((e) => ({ id: e.id, name: e.fullName }))

  const handleViewReview = (review: PerformanceReview) => {
    setViewingReview(review)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title={t('hr.performanceTitle')}
        description={t('hr.performanceDescription')}
        actions={
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 h-10"
          >
            <Plus className="h-4 w-4 me-2" />
            {t('hr.newReview')}
          </button>
        }
      />

      <PerformanceReviewList
        reviews={reviews}
        isLoading={isLoading}
        onViewReview={handleViewReview}
      />

      <PerformanceReviewForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={() => { toast.success(t('hr.reviewCreated')); setIsFormOpen(false) }}
        isLoading={isSubmitting}
        employees={employees}
      />

      {/* Review Detail Dialog */}
      <Dialog open={!!viewingReview} onOpenChange={() => setViewingReview(null)}>
        <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle>{t('hr.reviewDetails')}</DialogTitle>
          </DialogHeader>
          {viewingReview && (
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(viewingReview.employeeName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{viewingReview.employeeName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {viewingReview.designationName} - {viewingReview.departmentName}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs',
                      viewingReview.status === 'completed' && 'bg-green-100 text-green-800',
                      viewingReview.status === 'manager_review' && 'bg-blue-100 text-blue-800',
                      viewingReview.status === 'self_assessment' && 'bg-amber-100 text-amber-800',
                      viewingReview.status === 'draft' && 'bg-slate-100 text-slate-800',
                    )}
                  >
                    {t(REVIEW_STATUS_CONFIG[viewingReview.status].key)}
                  </Badge>
                </div>

                {/* Review Period */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('hr.period')}</p>
                    <p className="font-medium">{viewingReview.periodLabel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('hr.year')}</p>
                    <p className="font-medium">{viewingReview.year}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('hr.startDate')}</p>
                    <p className="font-medium">{formatDate(viewingReview.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('hr.endDate')}</p>
                    <p className="font-medium">{formatDate(viewingReview.endDate)}</p>
                  </div>
                </div>

                {/* Overall Rating */}
                {(viewingReview.overallRating || viewingReview.overallManagerRating) && (
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">{t('hr.overallRating')}</p>
                    <div className="flex items-center justify-center gap-2">
                      {(() => {
                        const rating = viewingReview.overallRating || viewingReview.overallManagerRating || 0
                        const rounded = Math.min(5, Math.max(1, Math.round(rating))) as RatingScore
                        const config = RATING_LABELS[rounded]
                        return (
                          <>
                            <Star className={cn('h-6 w-6 fill-current', config.color)} />
                            <span className={cn('text-2xl font-bold', config.color)}>
                              {rating.toFixed(1)}
                            </span>
                            <span className={cn('text-sm font-medium', config.color)}>
                              - {t(config.key)}
                            </span>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Category Ratings */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">{t('hr.categoryRatings')}</h4>
                  <div className="space-y-3">
                    {viewingReview.categoryRatings.map((cat) => {
                      const rating = (cat.managerRating || cat.selfRating || 3) as RatingScore
                      const clamped = Math.min(5, Math.max(1, rating)) as RatingScore
                      const config = RATING_LABELS[clamped]
                      return (
                        <div key={cat.categoryId} className="flex items-center justify-between border rounded-lg p-3">
                          <div>
                            <p className="text-sm font-medium">{cat.categoryName}</p>
                            <p className="text-xs text-muted-foreground">{t('hr.weight')}: {cat.weight}%</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {([1, 2, 3, 4, 5] as RatingScore[]).map((s) => (
                              <Star
                                key={s}
                                className={cn(
                                  'h-4 w-4',
                                  rating >= s ? cn('fill-current', config.color) : 'text-muted-foreground/30',
                                )}
                              />
                            ))}
                            <span className={cn('ms-2 text-sm font-medium', config.color)}>
                              {t(config.key)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Manager Assessment */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('hr.managerAssessment')}</h4>
                  {viewingReview.strengths && (
                    <div>
                      <p className="text-sm font-medium mb-1">{t('hr.keyStrengths')}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingReview.strengths}</p>
                    </div>
                  )}
                  {viewingReview.areasOfImprovement && (
                    <div>
                      <p className="text-sm font-medium mb-1">{t('hr.areasForImprovement')}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingReview.areasOfImprovement}</p>
                    </div>
                  )}
                  {viewingReview.managerComments && (
                    <div>
                      <p className="text-sm font-medium mb-1">{t('hr.overallComments')}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingReview.managerComments}</p>
                    </div>
                  )}
                </div>

                {/* Goals */}
                {viewingReview.newGoals.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">{t('hr.goals')}</h4>
                      <div className="space-y-2">
                        {viewingReview.newGoals.map((goal) => (
                          <div key={goal.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium">{goal.title}</p>
                              <Badge variant="outline" className="text-xs capitalize">{goal.status.replace('_', ' ')}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{goal.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t('hr.target')}: {formatDate(goal.targetDate)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Reviewer */}
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p>{t('hr.reviewedBy')}: <span className="font-medium text-foreground">{viewingReview.reviewerName}</span></p>
                  {viewingReview.completedAt && <p>{t('hr.completedDate')}: {formatDate(viewingReview.completedAt)}</p>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PerformancePage
