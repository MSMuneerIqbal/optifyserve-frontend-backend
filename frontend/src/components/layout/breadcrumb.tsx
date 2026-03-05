import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

function generateBreadcrumbs(pathname: string, t: (key: string) => string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1

    const isId = /^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment)

    if (!isId) {
      const translationKey = `breadcrumb.${segment}`
      const translated = t(translationKey)
      const label = translated !== translationKey
        ? translated
        : segment.charAt(0).toUpperCase() + segment.slice(1)

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      })
    }
  })

  return breadcrumbs
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const breadcrumbs = items || generateBreadcrumbs(location.pathname, t)

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav aria-label={t('breadcrumb.breadcrumbLabel')} className={cn('flex items-center text-sm', className)}>
      <ol className="flex items-center gap-1.5">
        {/* Home Link */}
        <li>
          <Link
            to="/dashboard"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">{t('common.home')}</span>
          </Link>
        </li>

        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
            {item.href ? (
              <Link
                to={item.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
