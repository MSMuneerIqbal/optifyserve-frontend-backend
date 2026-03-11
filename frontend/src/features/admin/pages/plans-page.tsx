import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { SubscriptionPlans } from '../components/subscription-plans'

export function PlansPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.subscriptionPlans')}
        description={t('settings.subscriptionPlansDescription')}
      />
      <SubscriptionPlans />
    </div>
  )
}

export default PlansPage
