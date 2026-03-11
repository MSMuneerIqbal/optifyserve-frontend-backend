/**
 * Application Layout Component
 * Main layout wrapper with sidebar, top navigation, and content area
 */

import { useState, useRef, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useIsDesktop } from '@/hooks/use-media-query'
import { useAuth } from '@/contexts/auth-context'
import { Sidebar } from './sidebar'
import { MobileSidebar } from './mobile-sidebar'
import { TopNav } from './top-nav'

interface AppLayoutProps {
  children?: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation()
  const isDesktop = useIsDesktop()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar-collapsed', false)
  const prevIsDesktopRef = useRef(isDesktop)

  // Close mobile menu when switching to desktop
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (isDesktop && !prevIsDesktopRef.current && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
    prevIsDesktopRef.current = isDesktop
  }, [isDesktop, mobileMenuOpen])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Transform user data for TopNav
  const topNavUser = user
    ? {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        companyName: user.companyName,
      }
    : undefined

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          isDesktop && (sidebarCollapsed ? 'lg:ms-16' : 'lg:ms-64')
        )}
      >
        {/* Top Navigation */}
        <TopNav
          onMenuClick={handleToggleMobileMenu}
          user={topNavUser}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main key={location.pathname} className="animate-page-enter flex-1 p-4 md:p-6 lg:p-8">
          {children || <Outlet />}
        </main>

        {/* Footer */}
        <footer className="border-t bg-white px-4 py-3 text-center text-xs text-muted-foreground md:px-6">
          <p>{t('common.footer', { year: new Date().getFullYear() })}</p>
        </footer>
      </div>
    </div>
  )
}

export default AppLayout
