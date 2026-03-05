import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  showBackButton?: boolean
  backButtonHref?: string
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  showBackButton = false,
  backButtonHref,
  actions,
  className,
  children,
}: PageHeaderProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleBack = () => {
    if (backButtonHref) {
      navigate(backButtonHref)
    } else {
      navigate(-1)
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between md:pb-6',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 shrink-0"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground md:text-base">{description}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">{actions}</div>
      )}

      {/* Children (additional content) */}
      {children}
    </div>
  )
}

export default PageHeader
