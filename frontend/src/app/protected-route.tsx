/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects to login if not authenticated
 */

import { useTranslation } from 'react-i18next'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  requiredRoles?: string[]
}

function AccessDenied() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <div className="mx-auto max-w-md space-y-4 p-4">
        <h1 className="text-2xl font-bold text-destructive">{t('common.accessDenied')}</h1>
        <p className="text-muted-foreground">
          {t('common.accessDeniedDescription')}
        </p>
        <a
          href="/dashboard"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          {t('common.goToDashboard')}
        </a>
      </div>
    </div>
  )
}

export function ProtectedRoute({
  children,
  requiredPermissions,
  requiredRoles,
}: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some((permission) =>
      user?.permissions.includes(permission)
    )
    if (!hasPermission) {
      return <AccessDenied />
    }
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = user?.role && requiredRoles.includes(user.role)
    if (!hasRole) {
      return <AccessDenied />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
