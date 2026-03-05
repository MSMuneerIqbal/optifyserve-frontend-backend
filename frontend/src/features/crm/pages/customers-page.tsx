/**
 * Customers Page
 * Phase 4: CRM Module - Customer Management
 *
 * Main page for managing customers
 */

import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { Plus, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { CustomerList } from '../components/customer-list'
import { CustomerDetailPanel } from '../components/customer-detail-panel'
import { CustomerForm } from '../components/customer-form'
import { sampleCustomers } from '@/data/customers.data'
import type { Customer, CustomerFilters, CustomerFormData } from '../types/customer.types'

export function CustomersPage() {
  const { t } = useTranslation()
  // State
  const [filters, setFilters] = useState<CustomerFilters>({
    page: 1,
    pageSize: 25,
  })
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null)
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)

  // Static data
  const customers = sampleCustomers
  const isLoading = false
  const isSubmitting = false
  const error = null
  const totalCount = customers.length
  const currentPage = filters.page ?? 1
  const pageSize = filters.pageSize ?? 25

  const pagination = useMemo(() => {
    const totalPages = Math.ceil(totalCount / pageSize)
    return {
      page: currentPage,
      pageSize,
      totalItems: totalCount,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    }
  }, [totalCount, currentPage, pageSize])

  const refetch = useCallback(() => {
    // No-op with static data
  }, [])

  // Handlers
  const handleCustomerClick = useCallback((customer: Customer) => {
    setSelectedCustomerId(customer.id)
    setIsDetailPanelOpen(true)
  }, [])

  const handleEditCustomer = useCallback((customer: Customer) => {
    setCustomerToEdit(customer)
    setIsFormOpen(true)
  }, [])

  const handleDeleteCustomer = useCallback((customerId: string) => {
    setCustomerToDelete(customerId)
  }, [])

  const handleCreateCustomer = useCallback(() => {
    setCustomerToEdit(null)
    setIsFormOpen(true)
  }, [])

  const handleFormSubmit = useCallback(
    (_data: CustomerFormData) => {
      if (customerToEdit) {
        toast.success(t('crm.customerUpdated'))
      } else {
        toast.success(t('crm.customerCreated'))
      }
      setIsFormOpen(false)
      setCustomerToEdit(null)
    },
    [customerToEdit, t]
  )

  const handleConfirmDelete = useCallback(() => {
    if (customerToDelete) {
      toast.success(t('crm.customerDeleted'))
      setCustomerToDelete(null)
      if (selectedCustomerId === customerToDelete) {
        setIsDetailPanelOpen(false)
        setSelectedCustomerId(null)
      }
    }
  }, [customerToDelete, selectedCustomerId, t])

  const handleCloseDetailPanel = useCallback(() => {
    setIsDetailPanelOpen(false)
    setSelectedCustomerId(null)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
    setCustomerToEdit(null)
  }, [])

  const handleFiltersChange = useCallback((newFilters: CustomerFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  // Handle edit from detail panel
  const handleEditFromPanel = useCallback((customer: Customer) => {
    setIsDetailPanelOpen(false)
    setTimeout(() => {
      setCustomerToEdit(customer)
      setIsFormOpen(true)
    }, 100)
  }, [])

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t('crm.customersTitle')}
        description={t('crm.customersDescription')}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 me-2" />
            {t('common.import')}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 me-2" />
            {t('common.export')}
          </Button>
          <Button onClick={handleCreateCustomer}>
            <Plus className="h-4 w-4 me-2" />
            {t('crm.addCustomer')}
          </Button>
        </div>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">{t('crm.totalCustomers')}</p>
          <p className="text-2xl font-bold">{pagination?.totalItems ?? customers.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">{t('crm.activeCustomers')}</p>
          <p className="text-2xl font-bold text-green-600">
            {customers.filter((c) => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">{t('crm.corporate')}</p>
          <p className="text-2xl font-bold text-blue-600">
            {customers.filter((c) => c.customerType === 'corporate').length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">{t('crm.government')}</p>
          <p className="text-2xl font-bold text-purple-600">
            {customers.filter((c) => c.customerType === 'government').length}
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            {t('crm.failedToLoadCustomers')}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2"
          >
            {t('common.retry')}
          </Button>
        </div>
      )}

      {/* Customer List */}
      <CustomerList
        customers={customers}
        isLoading={isLoading}
        onCustomerClick={handleCustomerClick}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('common.showingXToYOfZ', {
              from: ((pagination.page - 1) * pagination.pageSize) + 1,
              to: Math.min(pagination.page * pagination.pageSize, pagination.totalItems),
              total: pagination.totalItems,
              items: t('crm.customers').toLowerCase()
            })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPreviousPage}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
              }
            >
              {t('common.previous')}
            </Button>
            <span className="text-sm">
              {t('common.pageXOfY', { page: pagination.page, total: pagination.totalPages })}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
              }
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Customer Detail Panel */}
      <CustomerDetailPanel
        customerId={selectedCustomerId}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
        onEdit={handleEditFromPanel}
      />

      {/* Customer Form Dialog */}
      <CustomerForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        customer={customerToEdit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!customerToDelete}
        title={t('crm.deleteCustomer')}
        description={t('crm.deleteCustomerConfirmation')}
        onConfirm={handleConfirmDelete}
        onClose={() => setCustomerToDelete(null)}
        variant="destructive"
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default CustomersPage
