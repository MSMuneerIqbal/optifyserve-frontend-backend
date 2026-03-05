import { useTranslation } from 'react-i18next'
import { DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrency } from '@/contexts/currency-context'

const currencies = [
  { code: 'AED' as const, label: 'AED - UAE Dirham', shortLabel: 'AED' },
  { code: 'USD' as const, label: 'USD - US Dollar', shortLabel: 'USD' },
]

export function CurrencySwitcher() {
  const { t } = useTranslation()
  const { currency, setCurrency } = useCurrency()

  const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2" title={t('common.switchCurrency')}>
          <DollarSign className="h-4 w-4" />
          <span className="text-xs font-medium">{currentCurrency.shortLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={currency === curr.code ? 'bg-accent font-medium' : ''}
          >
            {curr.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
