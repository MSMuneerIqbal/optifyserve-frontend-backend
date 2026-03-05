/**
 * Department & Designation Type Definitions
 * Phase 10: HR Module
 */

/** Department interface */
export interface Department {
  id: string
  name: string
  code: string
  description?: string
  headId?: string
  headName?: string
  parentId?: string
  parentName?: string
  employeeCount: number
  branchId: string
  branchName: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

/** Designation interface */
export interface Designation {
  id: string
  name: string
  code: string
  departmentId: string
  departmentName: string
  level: number
  description?: string
  employeeCount: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

/** Department form data */
export interface DepartmentFormData {
  name: string
  code: string
  description?: string
  headId?: string
  parentId?: string
  branchId: string
}

/** Designation form data */
export interface DesignationFormData {
  name: string
  code: string
  departmentId: string
  level: number
  description?: string
}

/** Branch interface */
export interface Branch {
  id: string
  name: string
  code: string
  address: string
  emirate: string
  phone?: string
  email?: string
  status: 'active' | 'inactive'
}
