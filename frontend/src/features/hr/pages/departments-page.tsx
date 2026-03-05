/**
 * Departments & Designations Page
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { DepartmentList } from '../components/department-list'
import { DepartmentForm, DesignationForm } from '../components/department-form'
import { sampleDepartments, sampleBranches } from '@/data/employees.data'
import { toast } from 'sonner'
import type { Department, Designation, DepartmentFormData, DesignationFormData, Branch } from '../types/department.types'

export function DepartmentsPage() {
  const { t } = useTranslation()
  const [isDeptFormOpen, setIsDeptFormOpen] = useState(false)
  const [isDesigFormOpen, setIsDesigFormOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | undefined>(undefined)
  const [editingDesig, setEditingDesig] = useState<Designation | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'dept' | 'desig'; id: string } | null>(null)

  const isLoadingDepts = false
  const isSubmitting = false

  const departments = sampleDepartments
  const designations: Designation[] = []
  const branches: Branch[] = sampleBranches

  const handleDeptSubmit = (_data: DepartmentFormData) => {
    if (editingDept) {
      toast.success(t('hr.deptUpdated'))
    } else {
      toast.success(t('hr.deptCreated'))
    }
    setIsDeptFormOpen(false)
    setEditingDept(undefined)
  }

  const handleDesigSubmit = (_data: DesignationFormData) => {
    if (editingDesig) {
      toast.success(t('hr.desigUpdated'))
    } else {
      toast.success(t('hr.desigCreated'))
    }
    setIsDesigFormOpen(false)
    setEditingDesig(undefined)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      toast.success(deleteTarget.type === 'dept' ? t('hr.deptDeleted') : t('hr.desigDeleted'))
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title={t('hr.departmentsTitle')} description={t('hr.departmentsDescription')} />

      <DepartmentList
        departments={departments}
        designations={designations}
        isLoading={isLoadingDepts}
        onCreateDepartment={() => { setEditingDept(undefined); setIsDeptFormOpen(true) }}
        onEditDepartment={(d) => { setEditingDept(d); setIsDeptFormOpen(true) }}
        onDeleteDepartment={(d) => setDeleteTarget({ type: 'dept', id: d.id })}
        onCreateDesignation={() => { setEditingDesig(undefined); setIsDesigFormOpen(true) }}
        onEditDesignation={(d) => { setEditingDesig(d); setIsDesigFormOpen(true) }}
        onDeleteDesignation={(d) => setDeleteTarget({ type: 'desig', id: d.id })}
      />

      <DepartmentForm
        isOpen={isDeptFormOpen}
        onClose={() => { setIsDeptFormOpen(false); setEditingDept(undefined) }}
        department={editingDept}
        onSubmit={handleDeptSubmit}
        isLoading={isSubmitting}
        branches={branches}
        departments={departments}
      />

      <DesignationForm
        isOpen={isDesigFormOpen}
        onClose={() => { setIsDesigFormOpen(false); setEditingDesig(undefined) }}
        designation={editingDesig}
        onSubmit={handleDesigSubmit}
        isLoading={isSubmitting}
        departments={departments}
      />

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={deleteTarget?.type === 'dept' ? t('hr.deleteDept') : t('hr.deleteDesig')}
        description={t('hr.deleteConfirm')}
        variant="destructive"
      />
    </div>
  )
}

export default DepartmentsPage
