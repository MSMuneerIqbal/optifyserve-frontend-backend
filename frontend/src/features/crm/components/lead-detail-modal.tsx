/**
 * Lead Detail Modal Component
 * Phase 5: CRM Module - Lead Management
 *
 * Modal showing lead details with follow-up timeline
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Building2,
  User,
  Target,
  TrendingUp,
  XCircle,
  CalendarPlus,
  UserPlus,
  FileText,
  MessageCircle,
  PhoneCall,
  Video,
  Send,
  Loader2,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { sampleLeads, sampleFollowUps } from '@/data/leads.data'
import { FollowUpForm } from './follow-up-form'
import { LostReasonDialog } from './lost-reason-dialog'
import type { Lead, LeadStage, FollowUpType } from '../types/lead.types'

interface LeadDetailModalProps {
  leadId: string | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (lead: Lead) => void
}

// Stage badge configuration (labels resolved via i18n)
const stageConfig: Record<LeadStage, { labelKey: string; className: string }> = {
  new: { labelKey: 'status.new', className: 'bg-gray-100 text-gray-800' },
  contacted: { labelKey: 'status.contacted', className: 'bg-sky-100 text-sky-800' },
  'follow-up': { labelKey: 'crm.followUp', className: 'bg-amber-100 text-amber-800' },
  qualified: { labelKey: 'crm.qualified', className: 'bg-blue-100 text-blue-800' },
  proposal: { labelKey: 'status.proposal', className: 'bg-primary/10 text-primary' },
  negotiation: { labelKey: 'status.negotiation', className: 'bg-purple-100 text-purple-800' },
  'closed-won': { labelKey: 'status.won', className: 'bg-green-100 text-green-800' },
  'closed-lost': { labelKey: 'status.lost', className: 'bg-red-100 text-red-800' },
}

// Follow-up type icons
const followUpIcons: Record<FollowUpType, typeof Phone> = {
  call: PhoneCall,
  email: Send,
  meeting: Video,
  whatsapp: MessageCircle,
  'site-visit': MapPin,
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function LeadDetailModal({
  leadId,
  isOpen,
  onClose,
  onEdit,
}: LeadDetailModalProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [activeTab, setActiveTab] = useState('overview')
  const [isFollowUpFormOpen, setIsFollowUpFormOpen] = useState(false)
  const [isLostDialogOpen, setIsLostDialogOpen] = useState(false)

  // Look up lead from static data
  const isLoadingLead = false
  const isSubmitting = false
  const lead = useMemo(
    () => sampleLeads.find((l) => l.id === leadId) ?? null,
    [leadId]
  )
  const followUps = useMemo(
    () => sampleFollowUps.filter((f) => f.leadId === leadId),
    [leadId]
  )

  const isLoadingFollowUps = isLoadingLead
  const isConverting = isSubmitting
  const isMarkingLost = isSubmitting
  const isCreatingFollowUp = isSubmitting

  if (!leadId) return null

  const stage = lead ? stageConfig[lead.stage] : null
  const isClosedStage = lead?.stage === 'closed-won' || lead?.stage === 'closed-lost'

  const handleConvert = () => {
    if (lead) {
      toast.success(t('crm.leadConverted'))
      onClose()
    }
  }

  const handleMarkAsLost = (_reason: string) => {
    if (lead) {
      toast.success(t('crm.leadMarkedLost'))
      setIsLostDialogOpen(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col">
          {isLoadingLead ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : lead ? (
            <>
              {/* Header */}
              <DialogHeader className="p-6 pb-4 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-xl">{lead.name}</DialogTitle>
                      <Badge className={cn('text-xs', stage?.className)}>
                        {stage ? t(stage.labelKey) : ''}
                      </Badge>
                    </div>
                    {lead.company && (
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {lead.company}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {lead.leadNumber}
                    </p>
                  </div>

                  {/* Probability Score */}
                  <div className="text-end">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">{lead.probability}%</span>
                    </div>
                    <Progress
                      value={lead.probability}
                      className="w-24 h-2 mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t('crm.winProbability')}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${lead.phone}`}>
                      <Phone className="h-4 w-4 me-2" />
                      {t('crm.call')}
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 me-2" />
                      {t('crm.whatsapp')}
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${lead.email}`}>
                      <Mail className="h-4 w-4 me-2" />
                      {t('common.email')}
                    </a>
                  </Button>
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(lead)}>
                      <FileText className="h-4 w-4 me-2" />
                      {t('common.edit')}
                    </Button>
                  )}
                </div>
              </DialogHeader>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <TabsList className="mx-6 mt-4 grid grid-cols-3">
                  <TabsTrigger value="overview">{t('crm.overview')}</TabsTrigger>
                  <TabsTrigger value="follow-ups">{t('crm.followUpHistory')}</TabsTrigger>
                  <TabsTrigger value="activity">{t('crm.activityTab')}</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 px-6 pb-6">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-4 space-y-4">
                    {/* Value & Timeline */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs">{t('crm.estimatedValue')}</span>
                          </div>
                          <p className="text-xl font-bold text-emerald-600">
                            {formatAmount(lead.estimatedValue.min)} -{' '}
                            {formatAmount(lead.estimatedValue.max)}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs">{t('crm.expectedClose')}</span>
                          </div>
                          <p className="text-xl font-bold">
                            {lead.expectedCloseDate
                              ? format(new Date(lead.expectedCloseDate), 'MMM d, yyyy')
                              : t('crm.notSet')}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Contact Information */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          {t('crm.contactInfo')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{lead.phone}</span>
                          {lead.alternatePhone && (
                            <span className="text-sm text-muted-foreground">
                              / {lead.alternatePhone}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{lead.email}</span>
                        </div>
                        {lead.address && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="text-sm">
                              {[lead.address.street, lead.address.city, lead.address.emirate]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Lead Details */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">{t('crm.leadDetails')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('crm.source')}</span>
                          <span className="capitalize">{lead.source.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('crm.priority')}</span>
                          <span className="capitalize">{lead.priority}</span>
                        </div>
                        {lead.assignedTo && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('crm.assignedTo')}</span>
                            <span className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={lead.assignedTo.avatar} />
                                <AvatarFallback className="text-[8px]">
                                  {getInitials(lead.assignedTo.name)}
                                </AvatarFallback>
                              </Avatar>
                              {lead.assignedTo.name}
                            </span>
                          </div>
                        )}
                        {lead.lastContactDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('crm.lastContact')}</span>
                            <span>
                              {format(new Date(lead.lastContactDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                        {lead.nextFollowUpDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('crm.nextFollowUp')}</span>
                            <span className="text-primary font-medium">
                              {format(new Date(lead.nextFollowUpDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Service Interests */}
                    {lead.serviceInterests.length > 0 && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">
                            {t('crm.serviceInterests')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {lead.serviceInterests.map((service) => (
                              <Badge key={service.id} variant="outline">
                                {service.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Notes */}
                    {lead.notes && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">{t('common.notes')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {lead.notes}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Lost Reason */}
                    {lead.lostReason && (
                      <Card className="border-red-200 bg-red-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-red-800">
                            {t('crm.lostReason')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-red-700">{lead.lostReason}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Follow-ups Tab */}
                  <TabsContent value="follow-ups" className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{t('crm.followUpHistory')}</h3>
                      {!isClosedStage && (
                        <Button
                          size="sm"
                          onClick={() => setIsFollowUpFormOpen(true)}
                        >
                          <CalendarPlus className="h-4 w-4 me-2" />
                          {t('crm.addFollowUp')}
                        </Button>
                      )}
                    </div>

                    {isLoadingFollowUps ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                      </div>
                    ) : followUps && followUps.length > 0 ? (
                      <div className="space-y-4">
                        {followUps.map((followUp, index) => {
                          const Icon = followUpIcons[followUp.type]
                          return (
                            <div key={followUp.id} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div
                                  className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center',
                                    followUp.status === 'completed'
                                      ? 'bg-green-100 text-green-600'
                                      : followUp.status === 'missed'
                                      ? 'bg-red-100 text-red-600'
                                      : 'bg-blue-100 text-blue-600'
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                {index < followUps.length - 1 && (
                                  <div className="w-0.5 flex-1 bg-border my-2" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm capitalize">
                                    {followUp.type.replace('-', ' ')}
                                  </span>
                                  <Badge
                                    className={cn(
                                      'text-[10px]',
                                      followUp.status === 'completed'
                                        ? 'bg-green-100 text-green-700'
                                        : followUp.status === 'missed'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                    )}
                                  >
                                    {followUp.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {followUp.notes}
                                </p>
                                {followUp.outcome && (
                                  <p className="text-sm mt-1">
                                    <span className="text-muted-foreground">{t('crm.outcome')}: </span>
                                    {followUp.outcome}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                  <span>
                                    {format(new Date(followUp.date), 'MMM d, yyyy')}
                                    {followUp.time && ` at ${followUp.time}`}
                                  </span>
                                  <span>•</span>
                                  <span>{followUp.createdBy.name}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>{t('crm.noFollowUps')}</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('crm.leadCreatedDate')}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t('crm.lastUpdated')}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(lead.updatedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>

              {/* Footer Actions */}
              {!isClosedStage && (
                <>
                  <Separator />
                  <div className="p-4 flex items-center justify-between">
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setIsLostDialogOpen(true)}
                    >
                      <XCircle className="h-4 w-4 me-2" />
                      {t('crm.markAsLost')}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={onClose}>
                        {t('common.close')}
                      </Button>
                      <Button onClick={handleConvert} disabled={isConverting}>
                        {isConverting && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
                        <UserPlus className="h-4 w-4 me-2" />
                        {t('crm.convertToCustomer')}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              {t('crm.leadNotFound')}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Follow-up Form Dialog */}
      {lead && (
        <FollowUpForm
          isOpen={isFollowUpFormOpen}
          onClose={() => setIsFollowUpFormOpen(false)}
          onSubmit={() => {
            toast.success(t('crm.followUpAdded'))
            setIsFollowUpFormOpen(false)
          }}
          isLoading={isCreatingFollowUp}
        />
      )}

      {/* Lost Reason Dialog */}
      <LostReasonDialog
        isOpen={isLostDialogOpen}
        onClose={() => setIsLostDialogOpen(false)}
        onConfirm={handleMarkAsLost}
        isLoading={isMarkingLost}
      />
    </>
  )
}

export default LeadDetailModal
