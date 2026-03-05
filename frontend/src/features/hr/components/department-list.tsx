/**
 * Department & Designation List
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, MoreHorizontal, Pencil, Trash2, Users, Building2 } from 'lucide-react'
import type { Department, Designation } from '../types/department.types'

interface DepartmentListProps {
  departments: Department[]
  designations: Designation[]
  isLoading: boolean
  onCreateDepartment: () => void
  onEditDepartment: (dept: Department) => void
  onDeleteDepartment: (dept: Department) => void
  onCreateDesignation: () => void
  onEditDesignation: (desig: Designation) => void
  onDeleteDesignation: (desig: Designation) => void
}

export function DepartmentList({
  departments,
  designations,
  isLoading,
  onCreateDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onCreateDesignation,
  onEditDesignation,
  onDeleteDesignation,
}: DepartmentListProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('departments')

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="departments">
                <Building2 className="h-4 w-4 me-1.5" />
                <span className="hidden sm:inline">{t('hr.departments')}</span>
                <span className="sm:hidden">{t('hr.depts')}</span>
              </TabsTrigger>
              <TabsTrigger value="designations">
                <Users className="h-4 w-4 me-1.5" />
                <span className="hidden sm:inline">{t('hr.designations')}</span>
                <span className="sm:hidden">{t('hr.desig')}</span>
              </TabsTrigger>
            </TabsList>
            <Button
              size="sm"
              onClick={activeTab === 'departments' ? onCreateDepartment : onCreateDesignation}
            >
              <Plus className="h-4 w-4 me-1.5" />
              {activeTab === 'departments' ? t('hr.addDepartment') : t('hr.addDesignation')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Departments Tab */}
          <TabsContent value="departments" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.name')}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t('common.code')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('hr.branch')}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t('hr.head')}</TableHead>
                    <TableHead className="text-center">{t('hr.employees')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : departments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        {t('hr.noDepartmentsFound')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">{dept.code}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{dept.branchName}</TableCell>
                        <TableCell className="hidden lg:table-cell">{dept.headName || '-'}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{dept.employeeCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={dept.status === 'active' ? 'default' : 'secondary'}>
                            {dept.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEditDepartment(dept)}>
                                <Pencil className="h-4 w-4 me-2" />{t('common.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => onDeleteDepartment(dept)}
                              >
                                <Trash2 className="h-4 w-4 me-2" />{t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Designations Tab */}
          <TabsContent value="designations" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.name')}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t('common.code')}</TableHead>
                    <TableHead>{t('common.department')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('hr.level')}</TableHead>
                    <TableHead className="text-center">{t('hr.employees')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : designations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        {t('hr.noDesignationsFound')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    designations.map((desig) => (
                      <TableRow key={desig.id}>
                        <TableCell className="font-medium">{desig.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">{desig.code}</Badge>
                        </TableCell>
                        <TableCell>{desig.departmentName}</TableCell>
                        <TableCell className="hidden md:table-cell">{desig.level}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{desig.employeeCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={desig.status === 'active' ? 'default' : 'secondary'}>
                            {desig.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEditDesignation(desig)}>
                                <Pencil className="h-4 w-4 me-2" />{t('common.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => onDeleteDesignation(desig)}
                              >
                                <Trash2 className="h-4 w-4 me-2" />{t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

export default DepartmentList
