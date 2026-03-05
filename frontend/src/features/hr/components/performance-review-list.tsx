/**
 * Performance Review List Component
 * Phase 10: HR Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Eye, Star, ClipboardList } from 'lucide-react'
import type { PerformanceReview } from '../types/performance.types'
import { REVIEW_STATUS_CONFIG, RATING_LABELS } from '../types/performance.types'
import type { RatingScore } from '../types/performance.types'

interface PerformanceReviewListProps {
  reviews: PerformanceReview[]
  isLoading: boolean
  onViewReview: (review: PerformanceReview) => void
}

function getRatingBadge(rating?: number) {
  if (!rating) return null
  const rounded = Math.round(rating) as RatingScore
  const clamped = Math.min(5, Math.max(1, rounded)) as RatingScore
  const config = RATING_LABELS[clamped]
  return (
    <span className={cn('flex items-center gap-1 text-sm font-medium', config.color)}>
      <Star className="h-3.5 w-3.5 fill-current" />
      {rating.toFixed(1)}
    </span>
  )
}

export function PerformanceReviewList({ reviews, isLoading, onViewReview }: PerformanceReviewListProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          {t('hr.performanceReviews')}
          <Badge variant="secondary" className="ms-2">{reviews.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('hr.employee')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('hr.period')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('hr.reviewDate')}</TableHead>
                <TableHead>{t('hr.rating')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    {t('hr.noPerformanceReviews')}
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => {
                  const config = REVIEW_STATUS_CONFIG[review.status]
                  return (
                    <TableRow key={review.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewReview(review)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{getInitials(review.employeeName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{review.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{review.designationName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{review.periodLabel}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">
                        {formatDate(review.endDate)}
                      </TableCell>
                      <TableCell>
                        {getRatingBadge(review.overallRating || review.overallManagerRating)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs',
                            review.status === 'completed' && 'bg-green-100 text-green-800',
                            review.status === 'manager_review' && 'bg-blue-100 text-blue-800',
                            review.status === 'self_assessment' && 'bg-amber-100 text-amber-800',
                            review.status === 'draft' && 'bg-slate-100 text-slate-800',
                          )}
                        >
                          {t(config.key)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onViewReview(review) }}>
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
      </CardContent>
    </Card>
  )
}

export default PerformanceReviewList
