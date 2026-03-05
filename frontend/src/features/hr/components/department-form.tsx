/**
 * Department & Designation Form
 * Phase 10: HR Module
 */

import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { Department, Designation, DepartmentFormData, DesignationFormData, Branch } from '../types/department.types'

// Department schema factory
function createDepartmentSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('validation.nameMin2')),
    code: z.string().min(2, t('validation.codeMin2')).max(10),
    description: z.string().optional(),
    headId: z.string().optional(),
    parentId: z.string().optional(),
    branchId: z.string().min(1, t('validation.branchRequired')),
  })
}

// Designation schema factory
function createDesignationSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('validation.nameMin2')),
    code: z.string().min(2, t('validation.codeMin2')).max(10),
    departmentId: z.string().min(1, t('validation.departmentRequired')),
    level: z.coerce.number().min(1, t('validation.levelMin1')).max(20),
    description: z.string().optional(),
  })
}

interface DepartmentFormProps {
  isOpen: boolean
  onClose: () => void
  department?: Department
  onSubmit: (data: DepartmentFormData) => void
  isLoading: boolean
  branches: Branch[]
  departments: Department[]
}

export function DepartmentForm({ isOpen, onClose, department, onSubmit, isLoading, branches }: DepartmentFormProps) {
  const { t } = useTranslation()
  const departmentSchema = useMemo(() => createDepartmentSchema(t), [t])
  const isEditing = !!department
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: '', code: '', description: '', headId: '', parentId: '', branchId: '' },
  })

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        code: department.code,
        description: department.description || '',
        headId: department.headId || '',
        parentId: department.parentId || '',
        branchId: department.branchId,
      })
    } else {
      form.reset({ name: '', code: '', description: '', headId: '', parentId: '', branchId: '' })
    }
  }, [department, form])

  const handleSubmit = (data: DepartmentFormData) => {
    onSubmit(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('hr.editDepartment') : t('hr.createDepartment')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.name')} *</FormLabel>
                  <FormControl><Input {...field} placeholder={t('hr.deptNamePlaceholder')} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.code')} *</FormLabel>
                  <FormControl><Input {...field} placeholder={t('hr.deptCodePlaceholder')} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="branchId" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('hr.branch')} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder={t('hr.selectBranch')} /></SelectTrigger></FormControl>
                  <SelectContent>
                    {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.description')}</FormLabel>
                <FormControl><Textarea {...field} placeholder={t('hr.deptDescriptionPlaceholder')} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {isEditing ? t('common.update') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

interface DesignationFormProps {
  isOpen: boolean
  onClose: () => void
  designation?: Designation
  onSubmit: (data: DesignationFormData) => void
  isLoading: boolean
  departments: Department[]
}

export function DesignationForm({ isOpen, onClose, designation, onSubmit, isLoading, departments }: DesignationFormProps) {
  const { t } = useTranslation()
  const designationSchema = useMemo(() => createDesignationSchema(t), [t])
  const isEditing = !!designation
  const form = useForm<DesignationFormData>({
    resolver: zodResolver(designationSchema) as unknown as import('react-hook-form').Resolver<DesignationFormData>,
    defaultValues: { name: '', code: '', departmentId: '', level: 1, description: '' },
  })

  useEffect(() => {
    if (designation) {
      form.reset({
        name: designation.name,
        code: designation.code,
        departmentId: designation.departmentId,
        level: designation.level,
        description: designation.description || '',
      })
    } else {
      form.reset({ name: '', code: '', departmentId: '', level: 1, description: '' })
    }
  }, [designation, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('hr.editDesignation') : t('hr.createDesignation')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.name')} *</FormLabel>
                  <FormControl><Input {...field} placeholder={t('hr.desigNamePlaceholder')} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.code')} *</FormLabel>
                  <FormControl><Input {...field} placeholder={t('hr.desigCodePlaceholder')} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="departmentId" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.department')} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder={t('hr.selectDepartment')} /></SelectTrigger></FormControl>
                  <SelectContent>
                    {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="level" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('hr.level')} *</FormLabel>
                <FormControl><Input type="number" {...field} min={1} max={20} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.description')}</FormLabel>
                <FormControl><Textarea {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {isEditing ? t('common.update') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DepartmentForm
