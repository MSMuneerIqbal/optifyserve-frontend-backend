/**
 * CRM Feature Module Index
 * Phase 4 & 5: CRM Module
 */

// Pages
export { CustomersPage } from './pages/customers-page'
export { LeadsPage } from './pages/leads-page'

// Customer Components (Phase 4)
export { CustomerList } from './components/customer-list'
export { CustomerDetailPanel } from './components/customer-detail-panel'
export { CustomerForm } from './components/customer-form'

// Lead Components (Phase 5)
export { LeadCard } from './components/lead-card'
export { LeadKanban } from './components/lead-kanban'
export { LeadDetailModal } from './components/lead-detail-modal'
export { LeadForm } from './components/lead-form'
export { FollowUpForm } from './components/follow-up-form'
export { LostReasonDialog } from './components/lost-reason-dialog'

// Customer Types (Phase 4)
export type {
  Customer,
  CustomerFormData,
  CustomerFilters,
  CustomerType,
  CustomerStatus,
  CustomerStats,
  CustomerJob,
  CustomerInvoice,
  CustomerActivity,
  CustomerListResponse,
  Address,
  AssignedSalesRep,
  ContactPerson,
} from './types/customer.types'

// Lead Types (Phase 5)
export type {
  Lead,
  LeadFormData,
  LeadFilters,
  LeadSource,
  LeadStage,
  LeadPriority,
  FollowUp,
  FollowUpFormData,
  FollowUpType,
  FollowUpStatus,
  StageSummary,
  LeadConversionData,
  AssignedUser,
  ServiceInterest,
} from './types/lead.types'
