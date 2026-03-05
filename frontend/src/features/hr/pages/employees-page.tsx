/**
 * Employees Page
 * Phase 10: HR Module
 */

import { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { EmployeeList } from '../components/employee-list'
import { EmployeeForm } from '../components/employee-form'
import { EmployeeDetailPanel } from '../components/employee-detail-panel'
import { sampleEmployees, sampleDepartments } from '@/data/employees.data'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import type { EmployeeListItem, Employee, EmployeeFormData, EmployeeFilters } from '../types/employee.types'

export function EmployeesPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<EmployeeFilters>({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const isLoading = false
  const isSubmitting = false

  // Derive EmployeeListItem[] from Employee[]
  const employees: EmployeeListItem[] = sampleEmployees.map((e) => ({
    id: e.id,
    employeeId: e.employeeId,
    fullName: e.fullName,
    email: e.email,
    phone: e.phone,
    profilePhotoUrl: e.profilePhotoUrl,
    departmentName: e.departmentName,
    designationName: e.designationName,
    branchName: e.branchName,
    joinDate: e.joinDate,
    status: e.status,
    nationality: e.nationality,
    totalSalary: e.salary.totalSalary,
    emiratesIdExpiry: e.emiratesId.expiryDate,
    visaExpiry: e.visa.expiryDate ?? '',
  }))
  const departments = sampleDepartments.map((d) => ({ id: d.id, name: d.name }))
  const designations: Array<{ id: string; name: string }> = []
  const branches: Array<{ id: string; name: string }> = []

  const selectedEmployee = selectedEmployeeId
    ? sampleEmployees.find((e) => e.id === selectedEmployeeId) ?? null
    : null
  const isLoadingDetail = false

  const handleEmployeeClick = (emp: EmployeeListItem) => {
    setSelectedEmployeeId(emp.id)
    setIsDetailOpen(true)
  }

  // Track whether we're waiting for employee data to open the edit form
  const pendingEditRef = useRef(false)

  const handleEditEmployee = (emp: EmployeeListItem) => {
    const full = sampleEmployees.find((e) => e.id === emp.id)
    if (full) {
      setEditingEmployee(full)
      setIsFormOpen(true)
    }
    pendingEditRef.current = false
  }

  const handleDeleteEmployee = (emp: EmployeeListItem) => {
    setDeleteId(emp.id)
  }

  const handleFormSubmit = (_data: EmployeeFormData) => {
    if (editingEmployee) {
      toast.success(t('hr.employeeUpdated'))
    } else {
      toast.success(t('hr.employeeCreated'))
    }
    setIsFormOpen(false)
    setEditingEmployee(undefined)
  }

  const confirmDelete = () => {
    if (deleteId) {
      toast.success(t('hr.employeeDeleted'))
      setDeleteId(null)
    }
  }

  const handleFiltersChange = useCallback((newFilters: Record<string, string>) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        search: newFilters.search || undefined,
        status: (newFilters.status as EmployeeFilters['status']) || undefined,
        departmentId: newFilters.departmentId || undefined,
        branchId: newFilters.branchId || undefined,
      }
      // Avoid re-render if values haven't changed
      if (
        prev.search === next.search &&
        prev.status === next.status &&
        prev.departmentId === next.departmentId &&
        prev.branchId === next.branchId
      ) {
        return prev
      }
      return next
    })
  }, [])

  // Filter employees based on current filters
  let filteredEmployees = [...employees]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    filteredEmployees = filteredEmployees.filter(
      (e) => e.fullName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q),
    )
  }
  if (filters.status) {
    filteredEmployees = filteredEmployees.filter((e) => e.status === filters.status)
  }
  if (filters.departmentId) {
    const dept = sampleDepartments.find((d) => d.id === filters.departmentId)
    if (dept) {
      filteredEmployees = filteredEmployees.filter((e) => e.departmentName === dept.name)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title={t('hr.employeesTitle')}
        description={t('hr.employeesDescription')}
        actions={
          <button
            onClick={() => { setEditingEmployee(undefined); setIsFormOpen(true) }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 h-10"
          >
            <UserPlus className="h-4 w-4 me-2" />
            {t('hr.addEmployee')}
          </button>
        }
      />

      <EmployeeList
        employees={filteredEmployees}
        isLoading={isLoading}
        onEmployeeClick={handleEmployeeClick}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        departments={departments}
        branches={branches.map((b) => ({ id: b.id, name: b.name }))}
        onFiltersChange={handleFiltersChange}
        onAddEmployee={() => { setEditingEmployee(undefined); setIsFormOpen(true) }}
        onExport={() => {
          // Export employees as CSV
          const headers = [t('hr.employeeId'), t('common.name'), t('common.department'), t('hr.designation'), t('hr.branch'), t('common.status'), t('hr.joinDate'), t('hr.nationality'), t('common.phone'), t('common.email')]
          const rows = filteredEmployees.map((e) => [e.employeeId, e.fullName, e.departmentName, e.designationName, e.branchName, e.status, e.joinDate, e.nationality, e.phone, e.email])
          const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
          const blob = new Blob([csv], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`
          a.click()
          URL.revokeObjectURL(url)
        }}
      />

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingEmployee(undefined) }}
        employee={editingEmployee}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        departments={departments}
        designations={designations.map((d) => ({ id: d.id, name: d.name }))}
        branches={branches.map((b) => ({ id: b.id, name: b.name }))}
      />

      <EmployeeDetailPanel
        employee={selectedEmployee as Employee | null}
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedEmployeeId(null) }}
        onEdit={(emp) => { setEditingEmployee(emp); setIsDetailOpen(false); setIsFormOpen(true) }}
        isLoading={isLoadingDetail}
      />

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title={t('hr.deleteEmployee')}
        description={t('hr.deleteEmployeeConfirm')}
        variant="destructive"
      />
    </div>
  )
}

export default EmployeesPage
