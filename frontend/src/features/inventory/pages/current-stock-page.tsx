/**
 * Current Stock Page
 * Phase 7: Inventory Module
 *
 * Real-time stock levels across warehouses
 */

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CurrentStockTable } from '../components/current-stock-table'
import { LowStockAlerts } from '../components/low-stock-alerts'
import { sampleWarehouses } from '@/data/warehouses.data'

export function CurrentStockPage() {
  const { t } = useTranslation()
  const warehouses = sampleWarehouses

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('inventory.currentStockTitle')}
        description={t('inventory.currentStockDescription')}
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('inventory.allWarehouses')}</TabsTrigger>
          {warehouses?.slice(0, 4).map((wh) => (
            <TabsTrigger key={wh.id} value={wh.id}>
              {wh.code}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <CurrentStockTable />
        </TabsContent>

        {warehouses?.map((wh) => (
          <TabsContent key={wh.id} value={wh.id} className="space-y-4">
            <CurrentStockTable warehouseId={wh.id} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Low Stock Alerts Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">{t('inventory.lowStockAlerts')}</h2>
        <LowStockAlerts limit={15} />
      </div>
    </div>
  )
}

export default CurrentStockPage
