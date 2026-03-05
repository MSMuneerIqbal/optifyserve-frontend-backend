/**
 * Employee Document Type Definitions
 * Phase 10: HR Module
 *
 * Document management with expiry tracking
 */

import type { StatusBadgeVariant } from '@/types/common.types'

/** Document type identifiers */
export type DocumentTypeId =
  | 'emirates_id'
  | 'passport'
  | 'visa'
  | 'labor_card'
  | 'employment_contract'
  | 'educational_certificate'
  | 'experience_letter'
  | 'medical_certificate'
  | 'salary_certificate'
  | 'noc'
  | 'other'

/** Document verification status */
export type DocumentVerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired'

/** Document verification status config */
export const DOCUMENT_VERIFICATION_CONFIG: Record<DocumentVerificationStatus, { key: string; variant: StatusBadgeVariant }> = {
  pending: { key: 'status.pending', variant: 'warning' },
  verified: { key: 'status.verified', variant: 'success' },
  rejected: { key: 'status.rejected', variant: 'error' },
  expired: { key: 'status.expired', variant: 'neutral' },
}

/** Document type definition */
export interface DocumentType {
  id: DocumentTypeId
  name: string
  hasExpiry: boolean
  required: boolean
  maxFiles: number
  allowedFormats: string[]
  description: string
}

/** Document types configuration */
export const DOCUMENT_TYPES: DocumentType[] = [
  { id: 'emirates_id', name: 'Emirates ID', hasExpiry: true, required: true, maxFiles: 2, allowedFormats: ['pdf', 'jpg', 'png'], description: 'Front and back of Emirates ID' },
  { id: 'passport', name: 'Passport', hasExpiry: true, required: true, maxFiles: 5, allowedFormats: ['pdf', 'jpg', 'png'], description: 'All relevant passport pages' },
  { id: 'visa', name: 'UAE Visa', hasExpiry: true, required: true, maxFiles: 2, allowedFormats: ['pdf', 'jpg', 'png'], description: 'UAE residence/employment visa' },
  { id: 'labor_card', name: 'Labor Card', hasExpiry: true, required: true, maxFiles: 2, allowedFormats: ['pdf', 'jpg', 'png'], description: 'Ministry of Labor card' },
  { id: 'employment_contract', name: 'Employment Contract', hasExpiry: false, required: true, maxFiles: 5, allowedFormats: ['pdf'], description: 'Signed employment contract' },
  { id: 'educational_certificate', name: 'Educational Certificate', hasExpiry: false, required: false, maxFiles: 10, allowedFormats: ['pdf', 'jpg', 'png'], description: 'Degree/diploma certificates' },
  { id: 'experience_letter', name: 'Experience Letter', hasExpiry: false, required: false, maxFiles: 10, allowedFormats: ['pdf', 'jpg', 'png'], description: 'Previous employer experience letters' },
  { id: 'medical_certificate', name: 'Medical Certificate', hasExpiry: true, required: false, maxFiles: 5, allowedFormats: ['pdf', 'jpg', 'png'], description: 'Medical fitness certificate' },
  { id: 'salary_certificate', name: 'Salary Certificate', hasExpiry: false, required: false, maxFiles: 5, allowedFormats: ['pdf'], description: 'Salary certificates issued' },
  { id: 'noc', name: 'No Objection Certificate', hasExpiry: false, required: false, maxFiles: 5, allowedFormats: ['pdf'], description: 'NOC documents' },
  { id: 'other', name: 'Other Document', hasExpiry: false, required: false, maxFiles: 10, allowedFormats: ['pdf', 'jpg', 'png', 'doc', 'docx'], description: 'Any other relevant documents' },
]

/** Employee document */
export interface EmployeeDocument {
  id: string
  employeeId: string
  employeeName: string
  documentTypeId: DocumentTypeId
  documentTypeName: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileFormat: string
  issueDate?: string
  expiryDate?: string
  verificationStatus: DocumentVerificationStatus
  verifiedBy?: string
  verifiedAt?: string
  notes?: string
  uploadedAt: string
  updatedAt: string
}

/** Document upload form data */
export interface DocumentUploadFormData {
  employeeId: string
  documentTypeId: DocumentTypeId
  issueDate?: string
  expiryDate?: string
  notes?: string
  file: File
}

/** Document expiry alert */
export interface DocumentExpiryAlert {
  id: string
  employeeId: string
  employeeName: string
  employeePhoto?: string
  departmentName: string
  documentTypeId: DocumentTypeId
  documentTypeName: string
  expiryDate: string
  daysUntilExpiry: number
  severity: 'expired' | 'critical' | 'warning' | 'info'
}

/** Expiry alert severity config */
export const EXPIRY_SEVERITY_CONFIG: Record<DocumentExpiryAlert['severity'], { key: string; variant: StatusBadgeVariant; color: string }> = {
  expired: { key: 'status.expired', variant: 'error', color: 'text-red-600' },
  critical: { key: 'status.critical7Days', variant: 'error', color: 'text-red-500' },
  warning: { key: 'status.warning30Days', variant: 'warning', color: 'text-amber-500' },
  info: { key: 'status.upcoming90Days', variant: 'info', color: 'text-blue-500' },
}

/** Document filters */
export interface DocumentFilters {
  employeeId?: string
  documentTypeId?: DocumentTypeId
  verificationStatus?: DocumentVerificationStatus
  expiryBefore?: string
  page?: number
  pageSize?: number
}
