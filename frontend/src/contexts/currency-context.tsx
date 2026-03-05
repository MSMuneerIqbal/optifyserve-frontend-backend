import { createContext, useContext, useState, useCallback, useEffect } from 'react'

type CurrencyCode = 'AED' | 'USD'

interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
  formatAmount: (amount: number, showSymbol?: boolean) => string
  formatCompact: (amount: number) => string
  convert: (amount: number) => number
}

const STORAGE_KEY = 'erp_currency'
const AED_TO_USD = 0.2722 // 1 AED ≈ 0.2722 USD (1 USD = 3.6725 AED)

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return (stored === 'USD' ? 'USD' : 'AED') as CurrencyCode
  })

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code)
    localStorage.setItem(STORAGE_KEY, code)
  }, [])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setCurrencyState(e.newValue as CurrencyCode)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const convert = useCallback(
    (amount: number): number => {
      if (currency === 'USD') return amount * AED_TO_USD
      return amount
    },
    [currency]
  )

  const formatAmount = useCallback(
    (amount: number, showSymbol = true): string => {
      const converted = convert(amount)
      const formatted = new Intl.NumberFormat('en-AE', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(converted)
      return showSymbol ? `${currency} ${formatted}` : formatted
    },
    [currency, convert]
  )

  const formatCompact = useCallback(
    (amount: number): string => {
      const converted = convert(amount)
      if (converted >= 1000000) {
        return `${currency} ${(converted / 1000000).toFixed(1)}M`
      }
      if (converted >= 1000) {
        return `${currency} ${(converted / 1000).toFixed(1)}K`
      }
      return formatAmount(amount)
    },
    [currency, convert, formatAmount]
  )

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatAmount, formatCompact, convert }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
