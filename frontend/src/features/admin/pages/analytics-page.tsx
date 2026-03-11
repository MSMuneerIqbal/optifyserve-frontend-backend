import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { PlatformAnalytics } from '../components/platform-analytics'

export function AnalyticsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.platformAnalytics')}
        description={t('settings.platformAnalyticsDescription')}
      />
      <PlatformAnalytics />
    </div>
  )
}

export default AnalyticsPage
