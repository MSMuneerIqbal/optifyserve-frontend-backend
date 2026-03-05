import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  Calendar,
  Download,
  Users,
  Building2,
  HardDrive,
  LayoutGrid,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
interface MockSubscription {
  id: string
  plan: string
  planName: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  amount: number
  monthlyPrice: number
  currency: string
  interval: string
  features: string[]
  maxUsers: number
  maxBranches: number
  maxStorage: number
  usage: { users: number; branches: number; storage: number }
}

interface MockBillingInvoice {
  id: string
  invoiceNumber: string
  date: string
  amount: number
  totalAmount: number
  currency: string
  status: string
  description: string
  downloadUrl: string
}

const mockSubscription: MockSubscription = {
  id: 'sub_001',
  plan: 'enterprise',
  planName: 'Enterprise',
  status: 'active',
  currentPeriodStart: '2025-01-01',
  currentPeriodEnd: '2025-12-31',
  amount: 2999,
  monthlyPrice: 2999,
  currency: 'AED',
  interval: 'yearly',
  features: ['Unlimited Modules', 'Multi-Branch Support', 'Advanced Reporting & Analytics', 'Full API Access', 'Priority Support (24/7)', 'Custom Integrations', 'Dispatcher Console', 'Audit Logs & Compliance', 'White-label Options'],
  maxUsers: 50,
  maxBranches: 10,
  maxStorage: 50,
  usage: { users: 24, branches: 3, storage: 12.5 },
}

const mockBillingHistory: MockBillingInvoice[] = [
  { id: 'inv_001', invoiceNumber: 'INV-2025-001', date: '2025-01-01', amount: 2999, totalAmount: 3148.95, currency: 'AED', status: 'paid', description: 'Enterprise Plan - Annual', downloadUrl: '#' },
  { id: 'inv_002', invoiceNumber: 'INV-2024-001', date: '2024-01-01', amount: 2999, totalAmount: 3148.95, currency: 'AED', status: 'paid', description: 'Enterprise Plan - Annual', downloadUrl: '#' },
  { id: 'inv_003', invoiceNumber: 'INV-2023-001', date: '2023-01-01', amount: 1999, totalAmount: 2098.95, currency: 'AED', status: 'paid', description: 'Professional Plan - Annual', downloadUrl: '#' },
]

const statusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  unpaid: 'bg-amber-100 text-amber-700 border-amber-200',
  overdue: 'bg-red-100 text-red-700 border-red-200',
  refunded: 'bg-gray-100 text-gray-700 border-gray-200',
};

const featureIcons: Record<string, React.ReactNode> = {
  'Unlimited Modules': <LayoutGrid className="h-4 w-4" />,
  'Multi-Branch Support': <Building2 className="h-4 w-4" />,
  'Advanced Reporting & Analytics': <CreditCard className="h-4 w-4" />,
  'Full API Access': <HardDrive className="h-4 w-4" />,
  'Priority Support (24/7)': <Users className="h-4 w-4" />,
  'Custom Integrations': <LayoutGrid className="h-4 w-4" />,
  'Dispatcher Console': <Building2 className="h-4 w-4" />,
  'Audit Logs & Compliance': <CreditCard className="h-4 w-4" />,
  'White-label Options': <LayoutGrid className="h-4 w-4" />,
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function SubscriptionView() {
  const { t } = useTranslation();
  const subscription: MockSubscription = mockSubscription;
  const billingHistory: MockBillingInvoice[] = mockBillingHistory;

  const usageMeters: { label: string; used: number; limit: number; icon: React.ReactNode; unit?: string }[] = [
    {
      label: t('settings.users'),
      used: subscription.usage.users,
      limit: subscription.maxUsers,
      icon: <Users className="h-4 w-4 text-primary" />,
    },
    {
      label: t('settings.branches'),
      used: subscription.usage.branches,
      limit: subscription.maxBranches,
      icon: <Building2 className="h-4 w-4 text-blue-500" />,
    },
    {
      label: t('settings.storage'),
      used: subscription.usage.storage,
      limit: subscription.maxStorage,
      icon: <HardDrive className="h-4 w-4 text-purple-500" />,
      unit: 'GB',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{t('settings.currentSubscription')}</CardTitle>
              <CardDescription className="mt-1">
                {t('settings.currentSubscriptionDescription')}
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 me-1" />
              {subscription.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold capitalize">{subscription.plan} {t('settings.plan')}</h3>
                <p className="text-sm text-muted-foreground">
                  {subscription.currency} {subscription.monthlyPrice.toLocaleString()} / {t('settings.month')}
                </p>
              </div>
            </div>
            <Button variant="outline">{t('settings.upgradePlan')}</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t('settings.currentPeriodEnds')}</p>
                <p className="text-sm font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t('settings.autoRenew')}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Switch
                    id="auto-renew"
                    defaultChecked={subscription.status === 'active'}
                  />
                  <Label htmlFor="auto-renew" className="text-sm">
                    {subscription.status === 'active' ? t('settings.enabled') : t('settings.disabled')}
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t('settings.memberSince')}</p>
                <p className="text-sm font-medium">{formatDate(subscription.currentPeriodStart)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Meters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('settings.usage')}</CardTitle>
          <CardDescription>{t('settings.usageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {usageMeters.map((meter) => {
              const percentage = Math.round((meter.used / meter.limit) * 100);
              const isHigh = percentage >= 80;
              const isCritical = percentage >= 95;

              return (
                <div key={meter.label} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {meter.icon}
                      <span className="text-sm font-medium">{meter.label}</span>
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isCritical
                          ? 'text-red-600'
                          : isHigh
                          ? 'text-amber-600'
                          : 'text-muted-foreground'
                      )}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn(
                      'h-2',
                      isCritical
                        ? '[&>div]:bg-red-500'
                        : isHigh
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-primary'
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    {meter.used}
                    {meter.unit ? ` ${meter.unit}` : ''} {t('settings.of')} {meter.limit}
                    {meter.unit ? ` ${meter.unit}` : ''} {t('settings.used')}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('settings.planFeatures')}</CardTitle>
          <CardDescription>
            {t('settings.planFeaturesDescription', { plan: subscription.plan })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {subscription.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
              >
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  {featureIcons[feature] || <LayoutGrid className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{feature}</p>
                  <p className="text-xs text-green-600">{t('settings.active')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('settings.billingHistory')}</CardTitle>
          <CardDescription>{t('settings.billingHistoryDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('settings.invoice')}</TableHead>
                  <TableHead>{t('settings.date')}</TableHead>
                  <TableHead className="text-end">{t('settings.amount')}</TableHead>
                  <TableHead>{t('settings.status')}</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <span className="font-mono text-sm">{invoice.invoiceNumber}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(invoice.date)}</span>
                    </TableCell>
                    <TableCell className="text-end">
                      <span className="text-sm font-medium">
                        {invoice.currency} {invoice.totalAmount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('capitalize text-xs', statusColors[invoice.status])}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
