/**
 * Service Report Form Component
 * Phase 11: Jobs/Service Management Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, FileText, Camera, Wrench, CheckSquare } from 'lucide-react'
import { ServiceChecklist } from './service-checklist'
import { PhotoUpload } from './photo-upload'
import { SignaturePad } from './signature-pad'
import { DEFAULT_CHECKLISTS } from '../types/service-report.types'
import type { ChecklistItem, ServicePhoto } from '../types/service-report.types'
import type { ServiceType } from '../types/job.types'

interface ServiceReportFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ServiceReportSubmitData) => void
  isLoading: boolean
  jobId: string
  jobTitle: string
  jobNumber: string
  serviceType: ServiceType
}

interface ServiceReportSubmitData {
  workPerformed: string
  findings: string
  recommendations: string
  checklistItems: ChecklistItem[]
  beforePhotos: ServicePhoto[]
  afterPhotos: ServicePhoto[]
  technicianSignature?: string
  customerSignature?: string
  laborHours: number
}

export function ServiceReportForm({
  isOpen, onClose, onSubmit, isLoading,
  jobId: _jobId, jobTitle, jobNumber, serviceType,
}: ServiceReportFormProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('details')
  const [workPerformed, setWorkPerformed] = useState('')
  const [findings, setFindings] = useState('')
  const [recommendations, setRecommendations] = useState('')
  const [laborHours, setLaborHours] = useState(1)

  // Initialize checklist items with id and status from defaults
  const defaultItems = DEFAULT_CHECKLISTS[serviceType] || DEFAULT_CHECKLISTS.default
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    defaultItems.map((item, index) => ({
      id: `chk_${index}_${Date.now()}`,
      label: item.label,
      isRequired: item.isRequired,
      status: 'pending' as const,
    }))
  )
  const [beforePhotos, setBeforePhotos] = useState<ServicePhoto[]>([])
  const [afterPhotos, setAfterPhotos] = useState<ServicePhoto[]>([])
  const [techSignature, setTechSignature] = useState<string>()
  const [custSignature, setCustSignature] = useState<string>()

  const handleAddPhoto = (category: 'before' | 'after', file: File) => {
    const photo: ServicePhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      url: URL.createObjectURL(file),
      caption: file.name,
      category,
      uploadedAt: new Date().toISOString(),
    }
    if (category === 'before') {
      setBeforePhotos(prev => [...prev, photo])
    } else {
      setAfterPhotos(prev => [...prev, photo])
    }
  }

  const handleRemovePhoto = (category: 'before' | 'after', id: string) => {
    if (category === 'before') {
      setBeforePhotos(prev => prev.filter(p => p.id !== id))
    } else {
      setAfterPhotos(prev => prev.filter(p => p.id !== id))
    }
  }

  const requiredItems = checklistItems.filter(i => i.isRequired)
  const requiredDone = requiredItems.filter(i => i.status === 'completed').length
  const canSubmit = workPerformed.trim().length > 0 && requiredDone === requiredItems.length

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      workPerformed,
      findings,
      recommendations,
      checklistItems,
      beforePhotos,
      afterPhotos,
      technicianSignature: techSignature,
      customerSignature: custSignature,
      laborHours,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <DialogTitle>{t('jobs.serviceReport')}</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            <Badge variant="outline" className="font-mono me-2">{jobNumber}</Badge>
            {jobTitle}
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
          <TabsList className="mx-6 grid grid-cols-4 shrink-0">
            <TabsTrigger value="details" className="text-xs sm:text-sm">
              <Wrench className="h-3 w-3 me-1 hidden sm:block" />{t('common.details')}
            </TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs sm:text-sm">
              <CheckSquare className="h-3 w-3 me-1 hidden sm:block" />{t('jobs.checklist')}
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-xs sm:text-sm">
              <Camera className="h-3 w-3 me-1 hidden sm:block" />{t('jobs.photos')}
            </TabsTrigger>
            <TabsTrigger value="signatures" className="text-xs sm:text-sm">
              {t('jobs.sign')}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-6">
            <TabsContent value="details" className="space-y-4 mt-4 pb-6">
              <div>
                <Label>{t('jobs.workPerformed')} *</Label>
                <Textarea
                  value={workPerformed}
                  onChange={(e) => setWorkPerformed(e.target.value)}
                  rows={3}
                  placeholder={t('jobs.describeWorkDone')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{t('jobs.findings')}</Label>
                <Textarea
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  rows={2}
                  placeholder={t('jobs.findingsPlaceholder')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{t('jobs.recommendations')}</Label>
                <Textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  rows={2}
                  placeholder={t('jobs.recommendationsPlaceholder')}
                  className="mt-1"
                />
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>{t('jobs.laborHours')}</Label>
                  <input
                    type="number"
                    value={laborHours}
                    onChange={(e) => setLaborHours(Number(e.target.value))}
                    min={0.5}
                    step={0.5}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="checklist" className="mt-4 pb-6">
              <ServiceChecklist
                items={checklistItems}
                onChange={setChecklistItems}
              />
            </TabsContent>

            <TabsContent value="photos" className="space-y-6 mt-4 pb-6">
              <PhotoUpload
                label={t('jobs.beforePhotos')}
                category="before"
                photos={beforePhotos}
                onAdd={(file) => handleAddPhoto('before', file)}
                onRemove={(id) => handleRemovePhoto('before', id)}
              />
              <Separator />
              <PhotoUpload
                label={t('jobs.afterPhotos')}
                category="after"
                photos={afterPhotos}
                onAdd={(file) => handleAddPhoto('after', file)}
                onRemove={(id) => handleRemovePhoto('after', id)}
              />
            </TabsContent>

            <TabsContent value="signatures" className="space-y-6 mt-4 pb-6">
              <SignaturePad
                label={t('jobs.technicianSignature')}
                onSignature={setTechSignature}
                initialSignature={techSignature}
              />
              <Separator />
              <SignaturePad
                label={t('jobs.customerSignature')}
                onSignature={setCustSignature}
                initialSignature={custSignature}
              />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <div className="flex items-center gap-2 me-auto">
            {!canSubmit && (
              <p className="text-xs text-amber-600">
                {workPerformed.trim().length === 0
                  ? t('jobs.workPerformedRequired')
                  : t('jobs.requiredItemsCompleted', { done: requiredDone, total: requiredItems.length })
                }
              </p>
            )}
          </div>
          <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !canSubmit}>
            {isLoading && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
            {t('jobs.submitReport')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceReportForm
