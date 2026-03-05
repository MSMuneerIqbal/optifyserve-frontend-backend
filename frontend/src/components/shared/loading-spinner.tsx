import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'fullPage' | 'inline'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  text,
}: LoadingSpinnerProps) {
  const spinner = (
    <Loader2 className={cn('animate-spin text-primary', sizeClasses[size], className)} />
  )

  if (variant === 'fullPage') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-2">
        {spinner}
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </span>
    )
  }

  // Default - centered in container
  return (
    <div className="flex min-h-32 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {spinner}
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  )
}

// Button loading spinner
export function ButtonSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
}

// Page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-4 w-32 rounded bg-slate-200" />
        </div>
        <div className="h-10 w-32 rounded bg-slate-200" />
      </div>

      {/* Content skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-slate-200" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border bg-white">
        <div className="h-12 border-b bg-slate-50" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b" />
        ))}
      </div>
    </div>
  )
}

export default LoadingSpinner
