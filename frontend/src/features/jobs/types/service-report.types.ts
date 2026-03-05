/**
 * Service Report Type Definitions
 * Phase 11: Jobs/Service Management Module
 */

/** Checklist item status */
export type ChecklistItemStatus = 'pending' | 'completed' | 'skipped' | 'na'

/** Checklist item */
export interface ChecklistItem {
  id: string
  label: string
  status: ChecklistItemStatus
  notes?: string
  isRequired: boolean
}

/** Photo attachment */
export interface ServicePhoto {
  id: string
  url: string
  caption?: string
  category: 'before' | 'after'
  uploadedAt: string
}

/** Digital signature */
export interface DigitalSignature {
  dataUrl: string // base64 encoded signature image
  signedBy: string
  signedAt: string
}

/** Service report */
export interface ServiceReport {
  id: string
  reportNumber: string
  jobId: string
  jobNumber: string

  // Timing
  startTime: string
  endTime: string
  actualDuration: number // minutes
  travelTime?: number // minutes

  // Checklist
  checklist: ChecklistItem[]

  // Work details
  workPerformed: string
  recommendations?: string

  // Parts
  partsUsed: {
    partId: string
    partName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
  totalPartsCost: number

  // Labor
  baseServiceCharge: number
  overtimeCharge: number
  totalLaborCost: number
  totalCost: number

  // Photos
  beforePhotos: ServicePhoto[]
  afterPhotos: ServicePhoto[]

  // Signatures
  technicianSignature?: DigitalSignature
  customerSignature?: DigitalSignature

  // Meta
  technicianId: string
  technicianName: string
  submittedAt?: string
  status: 'draft' | 'submitted' | 'approved'
  createdAt: string
  updatedAt: string
}

/** Service report form data */
export interface ServiceReportFormData {
  jobId: string
  startTime: string
  endTime: string
  travelTime?: number
  checklist: {
    id: string
    label: string
    status: ChecklistItemStatus
    notes?: string
    isRequired: boolean
  }[]
  workPerformed: string
  recommendations?: string
  partsUsed: {
    partId: string
    partName: string
    quantity: number
    unitPrice: number
  }[]
  baseServiceCharge: number
  overtimeCharge: number
}

/** Default checklist items for service types */
export const DEFAULT_CHECKLISTS: Record<string, { label: string; isRequired: boolean }[]> = {
  ac_repair: [
    { label: 'Inspect compressor', isRequired: true },
    { label: 'Check refrigerant levels', isRequired: true },
    { label: 'Clean filters', isRequired: true },
    { label: 'Check thermostat', isRequired: true },
    { label: 'Inspect ductwork', isRequired: false },
    { label: 'Test electrical connections', isRequired: true },
    { label: 'Check drainage', isRequired: true },
    { label: 'Test cooling performance', isRequired: true },
  ],
  plumbing: [
    { label: 'Locate water shut-off', isRequired: true },
    { label: 'Inspect pipes for leaks', isRequired: true },
    { label: 'Check water pressure', isRequired: true },
    { label: 'Test drainage flow', isRequired: true },
    { label: 'Inspect fixtures', isRequired: false },
    { label: 'Check water heater', isRequired: false },
  ],
  electrical: [
    { label: 'Turn off main breaker', isRequired: true },
    { label: 'Inspect wiring', isRequired: true },
    { label: 'Test circuits', isRequired: true },
    { label: 'Check grounding', isRequired: true },
    { label: 'Inspect panel', isRequired: true },
    { label: 'Test outlets/switches', isRequired: false },
  ],
  default: [
    { label: 'Site inspection', isRequired: true },
    { label: 'Identify issue', isRequired: true },
    { label: 'Perform repair/service', isRequired: true },
    { label: 'Test functionality', isRequired: true },
    { label: 'Clean work area', isRequired: true },
    { label: 'Brief customer', isRequired: true },
  ],
}
