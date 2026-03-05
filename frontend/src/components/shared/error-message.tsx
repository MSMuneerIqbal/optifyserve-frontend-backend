import { useTranslation } from 'react-i18next'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  error: string | Error | null
  title?: string
  onRetry?: () => void
  variant?: 'default' | 'destructive' | 'inline'
  className?: string
}

export function ErrorMessage({
  error,
  title,
  onRetry,
  variant = 'default',
  className,
}: ErrorMessageProps) {
  const { t } = useTranslation()
  if (!error) return null

  const errorMessage = error instanceof Error ? error.message : error

  if (variant === 'inline') {
    return (
      <span className={cn('text-sm text-destructive', className)}>
        <AlertCircle className="me-1 inline h-4 w-4" />
        {errorMessage}
      </span>
    )
  }

  return (
    <Alert variant="destructive" className={cn('', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title || t('common.error', 'Error')}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{errorMessage}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
            <RefreshCw className="me-2 h-4 w-4" />
            {t('common.retry')}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Full page error component
export function FullPageError({
  error,
  onRetry,
}: {
  error: string | Error
  onRetry?: () => void
}) {
  const errorMessage = error instanceof Error ? error.message : error

  const { t } = useTranslation()
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{t('common.somethingWentWrong', 'Something went wrong')}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{errorMessage}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="me-2 h-4 w-4" />
          {t('common.retry')}
        </Button>
      )}
    </div>
  )
}

export default ErrorMessage
