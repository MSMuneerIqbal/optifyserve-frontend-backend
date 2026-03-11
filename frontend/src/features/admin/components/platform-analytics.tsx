import { useTranslation } from 'react-i18next';
import {
  DollarSign,
  Building2,
  Users,
  LayoutGrid,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KPICard {
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  iconBg: string;
}

const KPI_KEYS = [
  {
    labelKey: 'settings.kpiTotalRevenue',
    value: 'AED 187,500',
    change: '+12.5%',
    changeType: 'increase' as const,
    icon: <DollarSign className="h-5 w-5 text-green-600" />,
    iconBg: 'bg-green-100',
  },
  {
    labelKey: 'settings.kpiActiveTenants',
    value: '48',
    change: '+6',
    changeType: 'increase' as const,
    icon: <Building2 className="h-5 w-5 text-primary" />,
    iconBg: 'bg-primary/10',
  },
  {
    labelKey: 'settings.kpiTotalUsers',
    value: '1,247',
    change: '+89',
    changeType: 'increase' as const,
    icon: <Users className="h-5 w-5 text-blue-600" />,
    iconBg: 'bg-blue-100',
  },
  {
    labelKey: 'settings.kpiModulesActivated',
    value: '312',
    change: '+24',
    changeType: 'increase' as const,
    icon: <LayoutGrid className="h-5 w-5 text-purple-600" />,
    iconBg: 'bg-purple-100',
  },
];

interface PopularModule {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const POPULAR_MODULE_KEYS = [
  { nameKey: 'settings.moduleCRM', count: 45, percentage: 94, color: 'bg-primary' },
  { nameKey: 'settings.moduleSales', count: 43, percentage: 90, color: 'bg-blue-500' },
  { nameKey: 'settings.moduleAccounts', count: 40, percentage: 83, color: 'bg-green-500' },
  { nameKey: 'settings.moduleInventory', count: 36, percentage: 75, color: 'bg-amber-500' },
  { nameKey: 'settings.moduleHR', count: 32, percentage: 67, color: 'bg-purple-500' },
  { nameKey: 'settings.moduleProjects', count: 28, percentage: 58, color: 'bg-cyan-500' },
  { nameKey: 'settings.modulePurchase', count: 25, percentage: 52, color: 'bg-orange-500' },
  { nameKey: 'settings.moduleDispatcher', count: 18, percentage: 38, color: 'bg-pink-500' },
];

interface RecentActivity {
  id: string;
  action: string;
  tenant: string;
  timestamp: string;
  type: 'signup' | 'upgrade' | 'suspend' | 'module' | 'payment';
}

const RECENT_ACTIVITY_KEYS: Array<{
  id: string;
  actionKey: string;
  tenant: string;
  timestampKey: string;
  type: 'signup' | 'upgrade' | 'suspend' | 'module' | 'payment';
}> = [
  { id: '1', actionKey: 'settings.actNewTenantRegistered', tenant: 'Gulf Star Maintenance LLC', timestampKey: 'settings.hoursAgo_2', type: 'signup' },
  { id: '2', actionKey: 'settings.actPlanUpgradedPremium', tenant: 'Emirates Technical Services', timestampKey: 'settings.hoursAgo_5', type: 'upgrade' },
  { id: '3', actionKey: 'settings.actPaymentReceived4500', tenant: 'Al Habtoor Facilities', timestampKey: 'settings.hoursAgo_8', type: 'payment' },
  { id: '4', actionKey: 'settings.actTenantSuspended', tenant: 'Quick Fix Solutions', timestampKey: 'settings.daysAgo_1', type: 'suspend' },
  { id: '5', actionKey: 'settings.actModuleActivatedDispatcher', tenant: 'National Service Co.', timestampKey: 'settings.daysAgo_1', type: 'module' },
  { id: '6', actionKey: 'settings.actNewTenantRegistered', tenant: 'Bright Clean Services', timestampKey: 'settings.daysAgo_2', type: 'signup' },
  { id: '7', actionKey: 'settings.actPlanDowngradedBasic', tenant: 'Desert Cool AC Services', timestampKey: 'settings.daysAgo_2', type: 'upgrade' },
  { id: '8', actionKey: 'settings.actPaymentReceived2800', tenant: 'ProTech Maintenance', timestampKey: 'settings.daysAgo_3', type: 'payment' },
];

const ACTIVITY_TYPE_BADGE_KEYS: Record<string, { labelKey: string; className: string }> = {
  signup: { labelKey: 'settings.actTypeBadgeSignup', className: 'bg-green-100 text-green-700' },
  upgrade: { labelKey: 'settings.actTypeBadgePlanChange', className: 'bg-blue-100 text-blue-700' },
  suspend: { labelKey: 'settings.actTypeBadgeSuspended', className: 'bg-red-100 text-red-700' },
  module: { labelKey: 'settings.actTypeBadgeModule', className: 'bg-purple-100 text-purple-700' },
  payment: { labelKey: 'settings.actTypeBadgePayment', className: 'bg-amber-100 text-amber-700' },
};

export function PlatformAnalytics() {
  const { t } = useTranslation();

  const kpiCards: KPICard[] = KPI_KEYS.map((k) => ({
    ...k,
    label: t(k.labelKey),
  }));

  const popularModules: PopularModule[] = POPULAR_MODULE_KEYS.map((m) => ({
    ...m,
    name: t(m.nameKey),
  }));

  const recentActivities: RecentActivity[] = RECENT_ACTIVITY_KEYS.map((a) => ({
    ...a,
    action: t(a.actionKey),
    timestamp: t(a.timestampKey),
  }));

  const activityTypeBadge: Record<string, { label: string; className: string }> = Object.fromEntries(
    Object.entries(ACTIVITY_TYPE_BADGE_KEYS).map(([key, val]) => [key, { label: t(val.labelKey), className: val.className }])
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{t('settings.platformAnalytics')}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t('settings.platformAnalyticsDescription')}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={cn('p-2.5 rounded-lg', kpi.iconBg)}>{kpi.icon}</div>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    kpi.changeType === 'increase'
                      ? 'text-green-600 border-green-200'
                      : 'text-red-600 border-red-200'
                  )}
                >
                  {kpi.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenant Growth Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('settings.tenantGrowth')}
            </CardTitle>
            <CardDescription>
              {t('settings.tenantGrowthDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/30">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('settings.tenantGrowthChartPlaceholder')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('settings.rechartsIntegrationPending')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Popular Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              {t('settings.mostPopularModules')}
            </CardTitle>
            <CardDescription>{t('settings.moduleAdoptionDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularModules.map((module) => (
                <div key={module.name} className="flex items-center gap-3">
                  <span className="text-sm w-20 shrink-0 font-medium">{module.name}</span>
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', module.color)}
                      style={{ width: `${module.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-end shrink-0">
                    {module.count} {t('settings.tenants')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tenant Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('settings.recentTenantActivity')}
          </CardTitle>
          <CardDescription>{t('settings.recentTenantActivityDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn('text-xs', activityTypeBadge[activity.type].className)}
                  >
                    {activityTypeBadge[activity.type].label}
                  </Badge>
                  <div>
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.tenant}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ms-4">
                  {activity.timestamp}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
