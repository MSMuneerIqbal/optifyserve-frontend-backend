import { useTranslation } from 'react-i18next';
import { Check, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { SUBSCRIPTION_PLANS } from '../types/admin.types';

const CURRENT_PLAN = 'premium';

const planAccentColors: Record<string, string> = {
  basic: 'border-t-gray-400',
  standard: 'border-t-blue-500',
  premium: 'border-t-purple-500',
  enterprise: 'border-t-amber-500',
};

const planButtonVariants: Record<string, 'outline' | 'default' | 'secondary'> = {
  basic: 'outline',
  standard: 'default',
  premium: 'default',
  enterprise: 'secondary',
};

export function SubscriptionPlans() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{t('settings.subscriptionPlans')}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t('settings.subscriptionPlansDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = plan.id === CURRENT_PLAN;
          const isPopular = plan.id === 'standard';
          const isEnterprise = plan.id === 'enterprise';

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative border-t-4 flex flex-col',
                planAccentColors[plan.id],
                isCurrent && 'ring-2 ring-purple-500 shadow-lg'
              )}
            >
              {isCurrent && (
                <Badge className="absolute -top-3 start-1/2 -translate-x-1/2 bg-purple-600">
                  {t('settings.currentPlan')}
                </Badge>
              )}
              {isPopular && !isCurrent && (
                <Badge className="absolute -top-3 start-1/2 -translate-x-1/2 bg-blue-600">
                  <Star className="h-3 w-3 me-1" />
                  {t('settings.popular')}
                </Badge>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="pt-3">
                  {isEnterprise ? (
                    <div>
                      <span className="text-2xl font-bold">{t('settings.contactSales')}</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        AED {plan.priceMonthly.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">/{t('settings.month')}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <Separator className="mb-4" />

                {/* Limits */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('settings.users')}</span>
                    <span className="font-medium">
                      {plan.maxUsers === -1 ? t('settings.unlimited') : t('settings.upTo', { count: plan.maxUsers })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('settings.branches')}</span>
                    <span className="font-medium">
                      {plan.maxBranches === -1 ? t('settings.unlimited') : t('settings.upTo', { count: plan.maxBranches })}
                    </span>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Modules */}
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    {t('settings.modulesIncluded')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.includedModules.map((module) => (
                      <Badge key={module} variant="secondary" className="text-xs font-normal">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Features */}
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    {t('settings.features')}
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      {t('settings.currentPlan')}
                    </Button>
                  ) : isEnterprise ? (
                    <Button variant="secondary" className="w-full">
                      <Zap className="h-4 w-4 me-2" />
                      {t('settings.contactSales')}
                    </Button>
                  ) : (
                    <Button variant={planButtonVariants[plan.id]} className="w-full">
                      {t('settings.selectPlan')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pricing Note */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            {t('settings.pricingNote')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
