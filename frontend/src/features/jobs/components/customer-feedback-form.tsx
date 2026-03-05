/**
 * Customer Feedback Form Component
 * Phase 11: Jobs/Service Management Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Loader2, Star, MessageSquare } from 'lucide-react'
import { FEEDBACK_CATEGORY_KEYS, RATING_LABELS } from '../types/feedback.types'
import type { FeedbackRating, FeedbackCategory, FeedbackFormData } from '../types/feedback.types'

interface CustomerFeedbackFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FeedbackFormData) => void
  isLoading: boolean
  jobId: string
  jobNumber: string
  customerName: string
}

export function CustomerFeedbackForm({
  isOpen, onClose, onSubmit, isLoading, jobId, jobNumber, customerName,
}: CustomerFeedbackFormProps) {
  const { t } = useTranslation()
  const [overallRating, setOverallRating] = useState<FeedbackRating>(5)
  const [categoryRatings, setCategoryRatings] = useState<{ category: FeedbackCategory; rating: FeedbackRating }[]>([
    { category: 'service_quality', rating: 5 },
    { category: 'professionalism', rating: 5 },
    { category: 'timeliness', rating: 5 },
    { category: 'cleanliness', rating: 5 },
  ])
  const [comments, setComments] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState(true)

  const updateCategory = (category: FeedbackCategory, rating: FeedbackRating) => {
    setCategoryRatings(prev => prev.map(cr =>
      cr.category === category ? { ...cr, rating } : cr
    ))
  }

  const getCategoryRating = (category: FeedbackCategory): FeedbackRating => {
    return categoryRatings.find(cr => cr.category === category)?.rating || 5
  }

  const handleSubmit = () => {
    onSubmit({
      jobId,
      overallRating,
      categoryRatings,
      comments: comments || undefined,
      wouldRecommend,
    })
  }

  const StarRating = ({ value, onChange, size = 'md' }: { value: FeedbackRating; onChange: (v: FeedbackRating) => void; size?: 'sm' | 'md' }) => (
    <div className="flex items-center gap-1">
      {([1, 2, 3, 4, 5] as FeedbackRating[]).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              'transition-colors',
              size === 'sm' ? 'h-5 w-5' : 'h-7 w-7',
              star <= value ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30',
            )}
          />
        </button>
      ))}
      <span className={cn(
        'ms-2 text-muted-foreground',
        size === 'sm' ? 'text-xs' : 'text-sm',
      )}>
        {t(RATING_LABELS[value].key)}
      </span>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <DialogTitle>{t('jobs.customerFeedback')}</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            <Badge variant="outline" className="font-mono me-2">{jobNumber}</Badge>
            {customerName}
          </p>
        </DialogHeader>

        <div className="space-y-5">
          <div className="text-center py-3">
            <Label className="text-base">{t('jobs.overallRating')}</Label>
            <div className="flex justify-center mt-2">
              <StarRating value={overallRating} onChange={setOverallRating} size="md" />
            </div>
          </div>

          <Card className="p-4 space-y-3">
            <p className="text-sm font-medium">{t('jobs.rateEachArea')}</p>
            {(Object.entries(FEEDBACK_CATEGORY_KEYS) as [FeedbackCategory, string][]).map(([category, val]) => (
              <div key={category} className="flex items-center justify-between gap-3">
                <Label className="text-sm w-28 shrink-0">{t(val)}</Label>
                <StarRating
                  value={getCategoryRating(category)}
                  onChange={(v) => updateCategory(category, v)}
                  size="sm"
                />
              </div>
            ))}
          </Card>

          <div>
            <Label>{t('jobs.commentsOptional')}</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              placeholder={t('jobs.shareExperience')}
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm">{t('jobs.wouldRecommend')}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={wouldRecommend ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWouldRecommend(true)}
              >
                {t('common.yes')}
              </Button>
              <Button
                type="button"
                variant={!wouldRecommend ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setWouldRecommend(false)}
              >
                {t('common.no')}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
            {t('jobs.submitFeedback')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CustomerFeedbackForm
