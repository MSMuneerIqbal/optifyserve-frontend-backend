/**
 * Customer Detail Panel Component
 * Phase 4: CRM Module - Customer Management
 *
 * Slide-out panel showing customer details with tabs
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  Landmark,
  Pencil,
  MessageCircle,
  Briefcase,
  FileText,
  Clock,
  TrendingUp,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { sampleCustomers, sampleCustomerStats } from '@/data/customers.data'
import type { Customer, CustomerType, CustomerStatus, CustomerJob, CustomerInvoice, CustomerActivity } from '../types/customer.types'

interface CustomerDetailPanelProps {
  customerId: string | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (customer: Customer) => void
}

// Status badge configuration (labels resolved via i18n)
const statusConfig: Record<CustomerStatus, { labelKey: string; className: string }> = {
  active: { labelKey: 'status.active', className: 'bg-green-100 text-green-800' },
  inactive: { labelKey: 'status.inactive', className: 'bg-gray-100 text-gray-800' },
  blocked: { labelKey: 'status.blocked', className: 'bg-red-100 text-red-800' },
}

// Customer type icons
const customerTypeIcons: Record<CustomerType, typeof Building2> = {
  corporate: Building2,
  individual: User,
  government: Landmark,
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

// Job status icon
function getJobStatusIcon(status: CustomerJob['status']) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case 'in-progress':
      return <Clock className="h-4 w-4 text-blue-600" />
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-amber-600" />
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return null
  }
}

// Invoice status badge configuration (labels resolved via i18n)
const invoiceStatusConfig: Record<string, { labelKey: string; className: string }> = {
  paid: { labelKey: 'status.paid', className: 'bg-green-100 text-green-800' },
  sent: { labelKey: 'status.sent', className: 'bg-blue-100 text-blue-800' },
  'partially-paid': { labelKey: 'status.partial', className: 'bg-amber-100 text-amber-800' },
  overdue: { labelKey: 'status.overdue', className: 'bg-red-100 text-red-800' },
  draft: { labelKey: 'status.draft', className: 'bg-gray-100 text-gray-800' },
  cancelled: { labelKey: 'status.cancelled', className: 'bg-gray-100 text-gray-800' },
}

// Activity type icons
function getActivityIcon(type: CustomerActivity['type']) {
  switch (type) {
    case 'job_completed':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case 'payment_received':
      return <CreditCard className="h-4 w-4 text-emerald-600" />
    case 'invoice_sent':
      return <FileText className="h-4 w-4 text-blue-600" />
    case 'note_added':
      return <MessageCircle className="h-4 w-4 text-purple-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

export function CustomerDetailPanel({
  customerId,
  isOpen,
  onClose,
  onEdit,
}: CustomerDetailPanelProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [activeTab, setActiveTab] = useState('overview')

  // Look up customer from static data
  const isLoadingCustomer = false
  const customer = useMemo(
    () => sampleCustomers.find((c) => c.id === customerId) ?? null,
    [customerId]
  )
  const stats = sampleCustomerStats

  // These sub-resources are not available in static data; provide empty defaults
  const jobs: CustomerJob[] = []
  const invoices: CustomerInvoice[] = []
  const activities: CustomerActivity[] = []
  const isLoadingJobs = false
  const isLoadingInvoices = false
  const isLoadingActivities = false

  if (!customerId) return null

  const TypeIcon = customer ? customerTypeIcons[customer.customerType] : User

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[520px] p-0 flex flex-col">
        {isLoadingCustomer ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : customer ? (
          <>
            {/* Header */}
            <SheetHeader className="p-6 pb-4 border-b">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-xl truncate">{customer.name}</SheetTitle>
                    <TypeIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {customer.customerNumber}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={cn('text-xs', statusConfig[customer.status].className)}>
                      {t(statusConfig[customer.status].labelKey)}
                    </Badge>
                    {customer.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-4">
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${customer.phone}`}>
                    <Phone className="h-4 w-4 me-2" />
                    {t('crm.call')}
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 me-2" />
                    {t('crm.whatsapp')}
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`mailto:${customer.email}`}>
                    <Mail className="h-4 w-4 me-2" />
                    {t('common.email')}
                  </a>
                </Button>
                <Button size="sm" onClick={() => onEdit?.(customer)}>
                  <Pencil className="h-4 w-4 me-2" />
                  {t('common.edit')}
                </Button>
              </div>
            </SheetHeader>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="mx-6 mt-4 grid grid-cols-4">
                <TabsTrigger value="overview">{t('crm.overview')}</TabsTrigger>
                <TabsTrigger value="jobs">{t('crm.jobsTab')}</TabsTrigger>
                <TabsTrigger value="invoices">{t('crm.invoicesTab')}</TabsTrigger>
                <TabsTrigger value="activity">{t('crm.activityTab')}</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-6 pb-6">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-4 space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-xs">{t('crm.totalJobs')}</span>
                        </div>
                        <p className="text-2xl font-bold">{stats?.totalJobs ?? customer.totalJobs}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs">{t('crm.lifetimeValue')}</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">
                          {formatAmount(customer.lifetimeValue)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <CreditCard className="h-4 w-4" />
                          <span className="text-xs">{t('crm.outstanding')}</span>
                        </div>
                        <p className={cn(
                          'text-2xl font-bold',
                          customer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'
                        )}>
                          {formatAmount(customer.outstandingBalance)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs">{t('crm.paymentScore')}</span>
                        </div>
                        <p className="text-2xl font-bold">{stats?.paymentReliability ?? 0}%</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Contact Information */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{t('crm.contactInfo')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">
                          {customer.address.street}, {customer.address.city}, {customer.address.emirate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Profile */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{t('crm.businessProfile')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('crm.customerType')}</span>
                        <span className="capitalize">{customer.customerType}</span>
                      </div>
                      {customer.taxRegistrationNumber && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('crm.trn')}</span>
                          <span className="font-mono">{customer.taxRegistrationNumber}</span>
                        </div>
                      )}
                      {customer.paymentTerms && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('crm.paymentTerms')}</span>
                          <span className="capitalize">{customer.paymentTerms.replace('-', ' ')}</span>
                        </div>
                      )}
                      {customer.creditLimit && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('crm.creditLimit')}</span>
                          <span>{formatAmount(customer.creditLimit)}</span>
                        </div>
                      )}
                      {customer.assignedSalesRep && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('crm.salesRep')}</span>
                          <span>{customer.assignedSalesRep.name}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Jobs Tab */}
                <TabsContent value="jobs" className="mt-4 space-y-3">
                  {isLoadingJobs ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  ) : jobs?.length ? (
                    jobs.map((job) => (
                      <Card key={job.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {getJobStatusIcon(job.status)}
                                <Badge variant="outline" className="text-xs font-mono">
                                  {job.jobNumber}
                                </Badge>
                              </div>
                              <p className="font-medium mt-1 truncate">{job.title}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {format(new Date(job.scheduledDate), 'MMM d, yyyy')}
                                </span>
                                {job.technician && (
                                  <span>{job.technician.name}</span>
                                )}
                              </div>
                            </div>
                            <span className="font-semibold text-emerald-600">
                              {formatAmount(job.amount)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>{t('crm.noJobsFound')}</p>
                    </div>
                  )}
                </TabsContent>

                {/* Invoices Tab */}
                <TabsContent value="invoices" className="mt-4 space-y-3">
                  {isLoadingInvoices ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  ) : invoices?.length ? (
                    invoices.map((invoice) => (
                      <Card key={invoice.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  {invoice.invoiceNumber}
                                </Badge>
                                {(() => {
                                  const cfg = invoiceStatusConfig[invoice.status] || invoiceStatusConfig.draft
                                  return <Badge className={cn('text-xs', cfg.className)}>{t(cfg.labelKey)}</Badge>
                                })()}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>{t('crm.date')}: {format(new Date(invoice.date), 'MMM d, yyyy')}</span>
                                <span>{t('crm.due')}: {format(new Date(invoice.dueDate), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                            <div className="text-end">
                              <p className="font-semibold">{formatAmount(invoice.amount)}</p>
                              {invoice.paidAmount > 0 && invoice.paidAmount < invoice.amount && (
                                <p className="text-sm text-muted-foreground">
                                  {t('crm.paid')}: {formatAmount(invoice.paidAmount)}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>{t('crm.noInvoicesFound')}</p>
                    </div>
                  )}
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="mt-4">
                  {isLoadingActivities ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  ) : activities?.length ? (
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <div key={activity.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              {getActivityIcon(activity.type)}
                            </div>
                            {index < activities.length - 1 && (
                              <div className="w-0.5 flex-1 bg-border my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>{activity.user.name}</span>
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>{t('crm.noActivityRecorded')}</p>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {t('crm.customerNotFound')}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CustomerDetailPanel
