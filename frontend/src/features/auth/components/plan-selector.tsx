/**
 * Plan Selector Component
 * Displays 3 subscription plan cards for signup Step 2.
 */

import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { SubscriptionPlan } from '@/lib/validations'

interface PlanConfig {
  id: SubscriptionPlan
  nameKey: string
  priceKey: string
  priceParams?: Record<string, string>
  badgeKey?: string
  colorClass: string
  borderClass: string
  badgeClass: string
  features: string[]
}

const plans: PlanConfig[] = [
  {
    id: 'starter',
    nameKey: 'auth.planStarter',
    priceKey: 'auth.freeForTrial',
    badgeKey: 'auth.planMostPopular',
    colorClass: 'text-primary',
    borderClass: 'border-primary',
    badgeClass: 'bg-primary/10 text-primary hover:bg-primary/10',
    features: [
      'auth.planFeatureUsers5',
      'auth.planFeatureCRM',
      'auth.planFeatureSales',
      'auth.planFeatureDashboard',
      'auth.planFeatureEmailSupport',
    ],
  },
  {
    id: 'standard',
    nameKey: 'auth.planStandard',
    priceKey: 'auth.perMonthAfterTrial',
    priceParams: { price: '299' },
    colorClass: 'text-emerald-600',
    borderClass: 'border-emerald-500',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10',
    features: [
      'auth.planFeatureUsers20',
      'auth.planFeatureEverythingStarter',
      'auth.planFeatureInventory',
      'auth.planFeaturePurchase',
      'auth.planFeatureAccounts',
      'auth.planFeaturePrioritySupport',
    ],
  },
  {
    id: 'premium',
    nameKey: 'auth.planPremium',
    priceKey: 'auth.perMonthAfterTrial',
    priceParams: { price: '599' },
    badgeKey: 'auth.planFullAccess',
    colorClass: 'text-orange-600',
    borderClass: 'border-orange-500',
    badgeClass: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/10',
    features: [
      'auth.planFeatureUnlimitedUsers',
      'auth.planFeatureEverythingStandard',
      'auth.planFeatureHR',
      'auth.planFeatureJobs',
      'auth.planFeatureAdmin',
      'auth.planFeatureDedicatedSupport',
      'auth.planFeatureWhatsApp',
    ],
  },
]

interface PlanSelectorProps {
  value: SubscriptionPlan
  onChange: (plan: SubscriptionPlan) => void
}

export function PlanSelector({ value, onChange }: PlanSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {plans.map((plan) => {
        const isSelected = value === plan.id

        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onChange(plan.id)}
            className={cn(
              'relative flex flex-col rounded-xl border-2 p-4 text-start transition-all hover:shadow-md',
              isSelected
                ? cn(plan.borderClass, 'shadow-md')
                : 'border-border hover:border-muted-foreground/30'
            )}
          >
            {/* Selected checkmark */}
            {isSelected && (
              <CheckCircle2
                className={cn('absolute end-3 top-3 h-5 w-5', plan.colorClass)}
              />
            )}

            {/* Badge */}
            {plan.badgeKey && (
              <Badge
                variant="secondary"
                className={cn('mb-3 w-fit text-xs', plan.badgeClass)}
              >
                {t(plan.badgeKey)}
              </Badge>
            )}

            {/* Plan name */}
            <h3 className={cn('text-lg font-bold', plan.colorClass)}>
              {t(plan.nameKey)}
            </h3>

            {/* Price */}
            <p className="mt-1 text-sm text-muted-foreground">
              {t(plan.priceKey, plan.priceParams)}
            </p>

            {/* Features */}
            <ul className="mt-4 flex-1 space-y-2">
              {plan.features.map((featureKey) => (
                <li
                  key={featureKey}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2
                    className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', plan.colorClass)}
                  />
                  <span>{t(featureKey)}</span>
                </li>
              ))}
            </ul>

            {/* Select button */}
            <div
              className={cn(
                'mt-4 rounded-lg py-2 text-center text-sm font-semibold transition-colors',
                isSelected
                  ? cn('bg-primary text-primary-foreground')
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {isSelected ? t('auth.selected') : t('auth.selectPlan')}
            </div>
          </button>
        )
      })}
    </div>
  )
}
