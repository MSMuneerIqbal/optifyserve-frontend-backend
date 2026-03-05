/**
 * VAT Returns Page
 * Phase 9: Accounts/Finance Module
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { useCurrency } from '@/contexts/currency-context'
import { formatDate } from '@/lib/utils'
import { VATReturnForm } from '../components/vat-return-form'
import { VATCalculationTable } from '../components/vat-calculation-table'
import { sampleVATReturns } from '@/data/accounts.data'
import { VAT_RETURN_STATUS_CONFIG } from '../types/vat-return.types'
import type { VATReturn, VATReturnFormData } from '../types/vat-return.types'

export function VATReturnsPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null)

  const isLoading = false
  const list = sampleVATReturns

  const returns = { data: list }
  const selectedReturn = selectedReturnId ? list.find((r) => r.id === selectedReturnId) ?? null : null

  // Derive summary from list
  const summary = list.length > 0 ? {
    outputVAT: list.reduce((sum, r) => sum + (r.boxes?.box2VATOnStandardRatedSales ?? 0), 0),
    inputVAT: list.reduce((sum, r) => sum + (r.boxes?.box7VATOnStandardRatedPurchases ?? 0), 0),
    netVATDue: list.reduce((sum, r) => sum + (r.boxes?.box13NetVATDue ?? 0), 0),
    nextFilingDeadline: list[0]?.filingDeadline ?? new Date().toISOString(),
  } : null

  const handleCreate = useCallback(() => {
    setSelectedReturnId(null)
    setIsFormOpen(true)
  }, [])

  const handleSelectReturn = useCallback((vatReturn: VATReturn) => {
    setSelectedReturnId(vatReturn.id)
  }, [])

  const handleFormSubmit = (_data: VATReturnFormData) => {
    setIsFormOpen(false)
    toast.success(t('accounts.vatReturnCreated'))
  }

  const handleCalculate = () => {
    toast.success(t('accounts.vatReturnCalculated'))
  }

  const handleSubmit = () => {
    toast.success(t('accounts.vatReturnSubmitted'))
  }

  const handleFile = () => {
    toast.success(t('accounts.vatReturnFiled'))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('accounts.vatReturnsTitle')}
        description={t('accounts.vatReturnsDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('accounts.newVATReturn')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryCard label={t('accounts.outputVAT')} value={formatAmount(summary.outputVAT)} color="border-s-blue-500" />
          <SummaryCard label={t('accounts.inputVAT')} value={formatAmount(summary.inputVAT)} color="border-s-green-500" />
          <SummaryCard label={t('accounts.netVATDue')} value={formatAmount(summary.netVATDue)} color="border-s-amber-500" />
          <SummaryCard label={t('accounts.nextFiling')} value={formatDate(summary.nextFilingDeadline)} color="border-s-red-500" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left: VAT Returns List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('accounts.vatReturnsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">{t('common.loading')}</div>
              ) : !returns?.data?.length ? (
                <EmptyState icon="document" title={t('accounts.noVATReturns')} description={t('accounts.createFirstVAT')} />
              ) : (
                <div className="space-y-2">
                  {returns.data.map((vr) => (
                    <button
                      key={vr.id}
                      onClick={() => handleSelectReturn(vr)}
                      className={`w-full text-start p-3 rounded-lg border transition-colors hover:border-primary/50 ${
                        selectedReturnId === vr.id ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{vr.returnNumber}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(vr.periodFrom)} - {formatDate(vr.periodTo)}
                          </p>
                        </div>
                        <StatusBadge variant={VAT_RETURN_STATUS_CONFIG[vr.status].variant}>
                          {t(VAT_RETURN_STATUS_CONFIG[vr.status].key)}
                        </StatusBadge>
                      </div>
                      {vr.boxes && (
                        <p className="text-sm font-medium mt-2">
                          {t('accounts.netVAT')}: {formatAmount(vr.boxes.box13NetVATDue)}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Selected VAT Return Detail */}
        <div className="lg:col-span-2">
          {selectedReturn ? (
            <VATCalculationTable
              vatReturn={selectedReturn}
              onCalculate={handleCalculate}
              onSubmit={handleSubmit}
              onFile={handleFile}
              isCalculating={false}
              isSubmitting={false}
              isFiling={false}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">{t('accounts.selectVATReturn')}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('accounts.newVATReturn')}
            </SheetTitle>
          </SheetHeader>
          <VATReturnForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={false}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className={`rounded-lg border bg-white p-4 ${color ? `border-s-4 ${color}` : ''}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{value}</p>
    </div>
  )
}

export default VATReturnsPage
