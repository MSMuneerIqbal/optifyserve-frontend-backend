/**
 * Performance Review Form
 * Phase 10: HR Module
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { Loader2, Plus, Trash2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DEFAULT_RATING_CATEGORIES, RATING_LABELS } from '../types/performance.types'
import type { RatingScore } from '../types/performance.types'

function createReviewSchema(t: (key: string) => string) {
  return z.object({
    employeeId: z.string().min(1, t('validation.employeeRequired')),
    period: z.enum(['quarterly', 'semi_annual', 'annual'] as const),
    year: z.coerce.number().min(2020).max(2030),
    startDate: z.string().min(1, t('validation.required')),
    endDate: z.string().min(1, t('validation.required')),
    categoryRatings: z.array(z.object({
      categoryId: z.string(),
      managerRating: z.coerce.number().min(1).max(5),
      comments: z.string().optional(),
    })),
    managerComments: z.string().min(10, t('validation.detailedCommentsRequired')),
    strengths: z.string().min(5, t('validation.required')),
    areasOfImprovement: z.string().min(5, t('validation.required')),
    newGoals: z.array(z.object({
      title: z.string().min(3, t('validation.goalTitleRequired')),
      description: z.string().min(5, t('validation.goalDescriptionRequired')),
      targetDate: z.string().min(1, t('validation.targetDateRequired')),
    })),
  })
}

type ReviewFormValues = z.infer<ReturnType<typeof createReviewSchema>>

interface PerformanceReviewFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ReviewFormValues) => void
  isLoading: boolean
  employees: { id: string; name: string }[]
}

export function PerformanceReviewForm({ isOpen, onClose, onSubmit, isLoading, employees }: PerformanceReviewFormProps) {
  const { t } = useTranslation()
  const reviewSchema = useMemo(() => createReviewSchema(t), [t])
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema) as unknown as import('react-hook-form').Resolver<ReviewFormValues>,
    defaultValues: {
      employeeId: '',
      period: 'annual',
      year: new Date().getFullYear(),
      startDate: '',
      endDate: '',
      categoryRatings: DEFAULT_RATING_CATEGORIES.map((cat) => ({
        categoryId: cat.id,
        managerRating: 3,
        comments: '',
      })),
      managerComments: '',
      strengths: '',
      areasOfImprovement: '',
      newGoals: [{ title: '', description: '', targetDate: '' }],
    },
  })

  const { fields: goalFields, append: addGoal, remove: removeGoal } = useFieldArray({
    control: form.control,
    name: 'newGoals',
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>{t('hr.newPerformanceReview')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-6 pb-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="employeeId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('hr.employee')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('hr.selectEmployee')} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="period" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('hr.reviewPeriod')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="quarterly">{t('hr.quarterly')}</SelectItem>
                          <SelectItem value="semi_annual">{t('hr.semiAnnual')}</SelectItem>
                          <SelectItem value="annual">{t('hr.annual')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('hr.periodStart')} *</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="endDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('hr.periodEnd')} *</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Separator />

                {/* Ratings */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('hr.performanceRatings')}</h3>
                  <div className="space-y-4">
                    {DEFAULT_RATING_CATEGORIES.map((category, index) => (
                      <Card key={category.id} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{category.name}</p>
                            <p className="text-xs text-muted-foreground">{category.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t('hr.weight')}: {category.weight}%</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {([1, 2, 3, 4, 5] as RatingScore[]).map((rating) => {
                              const currentRating = form.watch(`categoryRatings.${index}.managerRating`)
                              return (
                                <button
                                  key={rating}
                                  type="button"
                                  className={cn(
                                    'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
                                    currentRating >= rating
                                      ? 'bg-amber-100 text-amber-600'
                                      : 'bg-muted text-muted-foreground hover:bg-muted/80',
                                  )}
                                  onClick={() => form.setValue(`categoryRatings.${index}.managerRating`, rating)}
                                >
                                  <Star className={cn('h-4 w-4', currentRating >= rating && 'fill-current')} />
                                </button>
                              )
                            })}
                            <span className={cn(
                              'ms-2 text-xs font-medium min-w-[80px]',
                              RATING_LABELS[form.watch(`categoryRatings.${index}.managerRating`) as RatingScore]?.color,
                            )}>
                              {t(RATING_LABELS[form.watch(`categoryRatings.${index}.managerRating`) as RatingScore]?.key)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Comments */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">{t('hr.managerAssessment')}</h3>
                  <FormField control={form.control} name="strengths" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('hr.keyStrengths')} *</FormLabel>
                      <FormControl><Textarea {...field} rows={3} placeholder={t('hr.strengthsPlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="areasOfImprovement" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('hr.areasForImprovement')} *</FormLabel>
                      <FormControl><Textarea {...field} rows={3} placeholder={t('hr.improvementPlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="managerComments" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('hr.overallComments')} *</FormLabel>
                      <FormControl><Textarea {...field} rows={3} placeholder={t('hr.overallCommentsPlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Separator />

                {/* Goals */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-muted-foreground">{t('hr.goalsForNextPeriod')}</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addGoal({ title: '', description: '', targetDate: '' })}>
                      <Plus className="h-4 w-4 me-1" />{t('hr.addGoal')}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {goalFields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <FormField control={form.control} name={`newGoals.${index}.title`} render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">{t('hr.goalTitle')}</FormLabel>
                                  <FormControl><Input {...field} placeholder={t('hr.goalTitle')} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name={`newGoals.${index}.targetDate`} render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">{t('hr.targetDate')}</FormLabel>
                                  <FormControl><Input type="date" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            </div>
                            {goalFields.length > 1 && (
                              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 mt-6" onClick={() => removeGoal(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                          <FormField control={form.control} name={`newGoals.${index}.description`} render={({ field }) => (
                            <FormItem>
                              <FormControl><Textarea {...field} rows={2} placeholder={t('hr.goalDescription')} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="px-6 py-4 border-t shrink-0">
              <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {t('hr.submitReview')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PerformanceReviewForm
