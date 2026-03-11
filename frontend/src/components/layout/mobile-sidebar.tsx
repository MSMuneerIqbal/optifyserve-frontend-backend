import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/store/hooks'
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  ShoppingCart,
  DollarSign,
  UserCircle,
  Briefcase,
  Settings,
  X,
  Building2,
  ChevronDown,
  Contact,
  Target,
  Radio,
  ShieldCheck,
  Shield,
  Crown,
  CreditCard,
  BarChart3,
  ScrollText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface SubMenuItem {
  nameKey: string
  href: string
  icon: React.ElementType
}

interface NavigationItem {
  nameKey: string
  href: string
  icon: React.ElementType
  badge?: number
  subItems?: SubMenuItem[]
}

const navigation: NavigationItem[] = [
  { nameKey: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    nameKey: 'nav.crm',
    href: '/crm',
    icon: Users,
    subItems: [
      { nameKey: 'nav.customers', href: '/crm/customers', icon: Contact },
      { nameKey: 'nav.leads', href: '/crm/leads', icon: Target },
    ]
  },
  { nameKey: 'nav.sales', href: '/sales', icon: FileText },
  { nameKey: 'nav.inventory', href: '/inventory', icon: Package },
  { nameKey: 'nav.purchase', href: '/purchase', icon: ShoppingCart },
  { nameKey: 'nav.accounts', href: '/accounts', icon: DollarSign },
  { nameKey: 'nav.hr', href: '/hr', icon: UserCircle },
  { nameKey: 'nav.jobs', href: '/jobs', icon: Briefcase },
  { nameKey: 'nav.dispatcher', href: '/dispatcher', icon: Radio },
  {
    nameKey: 'nav.userManagement',
    href: '/users',
    icon: ShieldCheck,
    subItems: [
      { nameKey: 'nav.users', href: '/users/list', icon: Users },
      { nameKey: 'nav.rolesPermissions', href: '/users/roles', icon: Shield },
    ]
  },
  {
    nameKey: 'nav.platformAdmin',
    href: '/admin',
    icon: Crown,
    subItems: [
      { nameKey: 'nav.tenants', href: '/admin/tenants', icon: Building2 },
      { nameKey: 'nav.subscriptionPlans', href: '/admin/plans', icon: CreditCard },
      { nameKey: 'nav.platformAnalytics', href: '/admin/analytics', icon: BarChart3 },
    ]
  },
  { nameKey: 'nav.auditLogs', href: '/audit', icon: ScrollText },
  { nameKey: 'nav.settings', href: '/settings', icon: Settings },
]

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['nav.crm'])
  const themeColors = useAppSelector((s) => s.theme.colors)
  const isRtl = i18n.language === 'ar'

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  const toggleSubmenu = (nameKey: string) => {
    setExpandedMenus(prev =>
      prev.includes(nameKey)
        ? prev.filter(item => item !== nameKey)
        : [...prev, nameKey]
    )
  }

  const renderNavItem = (item: NavigationItem) => {
    const isActive = isActiveRoute(item.href)
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = expandedMenus.includes(item.nameKey)
    const Icon = item.icon

    const activeStyle = { backgroundColor: themeColors.primary }
    const textMuted = { color: themeColors.sidebarText, opacity: 0.85 }
    const textMutedIcon = { color: themeColors.sidebarText, opacity: 0.65 }

    if (hasSubItems) {
      const isSubActive = item.subItems!.some(sub => location.pathname === sub.href)

      return (
        <div key={item.nameKey}>
          <button
            onClick={() => toggleSubmenu(item.nameKey)}
            className={cn(
              'sidebar-nav-item flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium',
              !isSubActive && 'hover:bg-white/10'
            )}
            style={isSubActive ? { backgroundColor: 'rgba(255,255,255,0.1)', color: themeColors.sidebarText } : textMuted}
          >
            <Icon className="sidebar-icon-hover h-5 w-5 shrink-0" style={isSubActive ? { color: themeColors.sidebarText } : textMutedIcon} />
            <span className="flex-1 text-start">{t(item.nameKey)}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          </button>
          {isExpanded && (
            <div className="sidebar-submenu-enter mt-1 ms-4 space-y-1 border-s border-white/15 ps-3">
              {item.subItems!.map(subItem => {
                const SubIcon = subItem.icon
                const isSubItemActive = location.pathname === subItem.href
                return (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    onClick={onClose}
                    className={cn(
                      'sidebar-nav-item flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm',
                      !isSubItemActive && 'hover:bg-white/10'
                    )}
                    style={isSubItemActive ? { ...activeStyle, color: '#fff' } : textMuted}
                  >
                    <SubIcon className="sidebar-icon-hover h-4 w-4" style={isSubItemActive ? { color: '#fff' } : textMutedIcon} />
                    {t(subItem.nameKey)}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.nameKey}
        to={item.href}
        onClick={onClose}
        className={cn(
          'sidebar-nav-item flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium',
          !isActive && 'hover:bg-white/10'
        )}
        style={isActive ? { ...activeStyle, color: '#fff' } : textMuted}
      >
        <Icon className="sidebar-icon-hover h-5 w-5 shrink-0" style={isActive ? { color: '#fff' } : textMutedIcon} />
        <span>{t(item.nameKey)}</span>
        {item.badge && (
          <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium" style={{ backgroundColor: themeColors.primary, opacity: 0.85 }}>
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isRtl ? 'right' : 'left'} className="w-[85vw] max-w-64 p-0 flex flex-col" style={{ backgroundColor: themeColors.sidebarBg, color: themeColors.sidebarText }}>
        <SheetHeader className="border-b border-white/10 p-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="OptifyServe" className="h-9 w-9 rounded-lg object-contain" />
              <SheetTitle className="text-lg font-semibold" style={{ color: themeColors.sidebarText }}>{t('nav.brandName')}</SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-white/10"
              style={{ color: themeColors.sidebarText, opacity: 0.85 }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {navigation.map(renderNavItem)}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
