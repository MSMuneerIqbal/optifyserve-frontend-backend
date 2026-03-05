/**
 * Employee Type Definitions
 * Phase 10: HR Module
 *
 * Complete employee profile types with UAE-specific fields
 */

import type { PaginatedResponse, StatusBadgeVariant } from '@/types/common.types'

/** Employee status */
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated' | 'probation'

/** Contract type as per UAE Labor Law */
export type ContractType = 'limited' | 'unlimited'

/** Gender */
export type Gender = 'male' | 'female'

/** Marital status */
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed'

/** Employee status config for badges */
export const EMPLOYEE_STATUS_CONFIG: Record<EmployeeStatus, { key: string; variant: StatusBadgeVariant }> = {
  active: { key: 'status.active', variant: 'success' },
  inactive: { key: 'status.inactive', variant: 'neutral' },
  on_leave: { key: 'status.onLeave', variant: 'warning' },
  terminated: { key: 'status.terminated', variant: 'error' },
  probation: { key: 'status.probation', variant: 'info' },
}

/** Emirates ID information */
export interface EmiratesID {
  number: string
  expiryDate: string
  frontImageUrl?: string
  backImageUrl?: string
  verified: boolean
}

/** Passport information */
export interface PassportInfo {
  number: string
  nationality: string
  issueDate: string
  expiryDate: string
  placeOfIssue: string
  imageUrl?: string
}

/** UAE Visa information */
export interface VisaInfo {
  number: string
  type: 'employment' | 'residence' | 'visit' | 'transit'
  issueDate: string
  expiryDate: string
  sponsoredBy: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
}

/** Labor Card information */
export interface LaborCard {
  number: string
  issueDate: string
  expiryDate: string
  status: 'active' | 'expired' | 'pending'
}

/** Bank account details */
export interface BankDetails {
  bankName: string
  accountNumber: string
  iban: string
  branchName?: string
  swiftCode?: string
}

/** Emergency contact */
export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  alternatePhone?: string
  address?: string
}

/** Employee address */
export interface EmployeeAddress {
  street: string
  building?: string
  flatNumber?: string
  area: string
  city: string
  emirate: string
  poBox?: string
  country: string
}

/** Salary structure */
export interface SalaryStructure {
  basicSalary: number
  housingAllowance: number
  transportAllowance: number
  mobileAllowance: number
  otherAllowances: number
  totalSalary: number
}

/** Complete Employee interface */
export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  alternatePhone?: string
  dateOfBirth: string
  gender: Gender
  maritalStatus: MaritalStatus
  nationality: string
  profilePhotoUrl?: string

  // Employment details
  joinDate: string
  probationEndDate?: string
  confirmationDate?: string
  terminationDate?: string
  contractType: ContractType
  contractStartDate: string
  contractEndDate?: string
  departmentId: string
  departmentName: string
  designationId: string
  designationName: string
  branchId: string
  branchName: string
  reportingManagerId?: string
  reportingManagerName?: string
  status: EmployeeStatus

  // UAE-specific documents
  emiratesId: EmiratesID
  passport: PassportInfo
  visa: VisaInfo
  laborCard: LaborCard

  // Financial
  salary: SalaryStructure
  bankDetails: BankDetails

  // Address
  address: EmployeeAddress

  // Emergency contact
  emergencyContact: EmergencyContact

  // Metadata
  companyId: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

/** Employee list item (lighter version for lists) */
export interface EmployeeListItem {
  id: string
  employeeId: string
  fullName: string
  email: string
  phone: string
  profilePhotoUrl?: string
  departmentName: string
  designationName: string
  branchName: string
  joinDate: string
  status: EmployeeStatus
  nationality: string
  totalSalary: number
  emiratesIdExpiry: string
  visaExpiry: string
}

/** Employee filters */
export interface EmployeeFilters {
  search?: string
  status?: EmployeeStatus
  departmentId?: string
  branchId?: string
  designationId?: string
  nationality?: string
  contractType?: ContractType
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/** Employee form data for create/edit */
export interface EmployeeFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  alternatePhone?: string
  dateOfBirth: string
  gender: Gender
  maritalStatus: MaritalStatus
  nationality: string

  joinDate: string
  contractType: ContractType
  contractStartDate: string
  contractEndDate?: string
  departmentId: string
  designationId: string
  branchId: string
  reportingManagerId?: string

  emiratesId: {
    number: string
    expiryDate: string
  }
  passport: {
    number: string
    nationality: string
    issueDate: string
    expiryDate: string
    placeOfIssue: string
  }
  visa: {
    number: string
    type: VisaInfo['type']
    issueDate: string
    expiryDate: string
    sponsoredBy: string
  }
  laborCard: {
    number: string
    issueDate: string
    expiryDate: string
  }

  salary: {
    basicSalary: number
    housingAllowance: number
    transportAllowance: number
    mobileAllowance: number
    otherAllowances: number
  }
  bankDetails: {
    bankName: string
    accountNumber: string
    iban: string
    branchName?: string
  }

  address: {
    street: string
    building?: string
    flatNumber?: string
    area: string
    city: string
    emirate: string
    poBox?: string
  }

  emergencyContact: {
    name: string
    relationship: string
    phone: string
    alternatePhone?: string
  }
}

/** Employee list response */
export type EmployeeListResponse = PaginatedResponse<EmployeeListItem>

/** Common nationalities in UAE */
export const UAE_NATIONALITIES = [
  'Emirati', 'Indian', 'Pakistani', 'Filipino', 'Bangladeshi', 'Sri Lankan',
  'Nepali', 'Egyptian', 'Jordanian', 'Syrian', 'Lebanese', 'Sudanese',
  'British', 'American', 'Canadian', 'Australian', 'South African',
  'Iranian', 'Afghan', 'Ethiopian', 'Nigerian', 'Other',
] as const

/** UAE banks */
export const UAE_BANKS = [
  'Emirates NBD', 'Abu Dhabi Commercial Bank (ADCB)', 'First Abu Dhabi Bank (FAB)',
  'Dubai Islamic Bank', 'Mashreq Bank', 'Commercial Bank of Dubai',
  'Sharjah Islamic Bank', 'RAK Bank', 'National Bank of Fujairah',
  'Ajman Bank', 'Emirates Islamic', 'Al Hilal Bank', 'Other',
] as const

/** Relationship options */
export const RELATIONSHIPS = [
  'Spouse', 'Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter',
  'Friend', 'Colleague', 'Other',
] as const
