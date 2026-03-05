/**
 * Stock Reports Page
 * Phase 7: Inventory Module
 *
 * Inventory reports and analytics
 */

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'
import { sampleStockReports } from '@/data/stock.data'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'

export function StockReportsPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const summaryLoading = false

  const summary = sampleStockReports
  const vatSummary = sampleStockReports.vatSummary

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('inventory.stockReportsTitle')}
        description={t('inventory.stockReportsDescription')}
      />

      {summaryLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">{t('common.loadingReports')}</div>
        </div>
      ) : summary ? (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {t('inventory.totalItems')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalItems}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.warehouseCount} {t('inventory.warehouses')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t('inventory.totalStockValue')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatAmount(summary.totalValue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('inventory.acrossAllWarehouses')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {t('inventory.lowStockItems')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn('text-2xl font-bold', summary.lowStockCount > 0 ? 'text-amber-600' : '')}>
                  {summary.lowStockCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.outOfStockCount} {t('inventory.outOfStock')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {t('inventory.potentialRevenue')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatAmount(summary.totalStock * 1.3)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('inventory.atCurrentStockLevels')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Reports Tabs */}
          <Tabs defaultValue="valuation" className="space-y-4">
            <TabsList>
              <TabsTrigger value="valuation">{t('inventory.stockValuation')}</TabsTrigger>
              <TabsTrigger value="aging">{t('inventory.stockAging')}</TabsTrigger>
              <TabsTrigger value="movement">{t('inventory.movementAnalysis')}</TabsTrigger>
              <TabsTrigger value="vat">{t('inventory.vatSummary')}</TabsTrigger>
            </TabsList>

            <TabsContent value="valuation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('inventory.stockValuationByMethod')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{t('inventory.fifoValuation')}</p>
                        <p className="text-sm text-muted-foreground">{t('inventory.firstInFirstOut')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {formatAmount(summary.totalValue)}
                        </p>
                        <Badge variant="secondary">{t('common.recommended')}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{t('inventory.weightedAverage')}</p>
                        <p className="text-sm text-muted-foreground">{t('inventory.averageCostPerUnit')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {formatAmount(summary.totalValue * 0.98)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aging" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('inventory.stockAgingAnalysis')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('inventory.fastMoving')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: '45%' }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('inventory.normalMoving')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: '35%' }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">35%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('inventory.slowMoving')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: '15%' }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('inventory.obsolete')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: '5%' }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="movement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('inventory.movementAnalysis')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('inventory.movementAnalyticsAvailable')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('inventory.vatSummary')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('inventory.standardRated')}</p>
                        <p className="text-lg font-bold">
                          {formatAmount(vatSummary?.standardRated || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('inventory.zeroRated')}</p>
                        <p className="text-lg font-bold">
                          {formatAmount(vatSummary?.zeroRated || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('inventory.exempt')}</p>
                        <p className="text-lg font-bold">
                          {formatAmount(vatSummary?.exempt || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('inventory.totalVatPayable')}</p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatAmount(vatSummary?.totalVat || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>{t('common.unableToLoadData')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StockReportsPage
