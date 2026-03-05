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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Contact,
  Target,
  FileSignature,
  Receipt,
  Boxes,
  Warehouse,
  ArrowLeftRight,
  BarChart3,
  ClipboardList,
  PackageCheck,
  RotateCcw,
  Wallet,
  FolderTree,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  BookOpen,
  Calculator,
  PieChart,
  Landmark,
  Activity,
  UserCheck,
  CalendarOff,
  Banknote,
  Award,
  FileCheck,
  Star,
  BarChart,
  User,
  Wrench,
  Calendar,
  MapPin,
  ClipboardCheck,
  Radio,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
  {
    nameKey: 'nav.sales',
    href: '/sales',
    icon: FileText,
    subItems: [
      { nameKey: 'nav.quotations', href: '/sales/quotations', icon: FileSignature },
      { nameKey: 'nav.invoices', href: '/sales/invoices', icon: Receipt },
    ]
  },
  {
    nameKey: 'nav.inventory',
    href: '/inventory',
    icon: Package,
    subItems: [
      { nameKey: 'nav.items', href: '/inventory/items', icon: Boxes },
      { nameKey: 'nav.warehouses', href: '/inventory/warehouses', icon: Warehouse },
      { nameKey: 'nav.stockMovements', href: '/inventory/movements', icon: ArrowLeftRight },
      { nameKey: 'nav.reports', href: '/inventory/reports', icon: BarChart3 },
    ]
  },
  {
    nameKey: 'nav.purchase',
    href: '/purchase',
    icon: ShoppingCart,
    subItems: [
      { nameKey: 'nav.vendors', href: '/purchase/vendors', icon: Building2 },
      { nameKey: 'nav.purchaseOrders', href: '/purchase/orders', icon: ClipboardList },
      { nameKey: 'nav.goodsReceipt', href: '/purchase/grn', icon: PackageCheck },
      { nameKey: 'nav.returns', href: '/purchase/returns', icon: RotateCcw },
      { nameKey: 'nav.payments', href: '/purchase/payments', icon: Wallet },
    ]
  },
  {
    nameKey: 'nav.accounts',
    href: '/accounts',
    icon: DollarSign,
    subItems: [
      { nameKey: 'nav.dashboard', href: '/accounts/dashboard', icon: Activity },
      { nameKey: 'nav.chartOfAccounts', href: '/accounts/chart', icon: FolderTree },
      { nameKey: 'nav.receivable', href: '/accounts/receivable', icon: ArrowUpRight },
      { nameKey: 'nav.payable', href: '/accounts/payable', icon: ArrowDownRight },
      { nameKey: 'nav.expenses', href: '/accounts/expenses', icon: CreditCard },
      { nameKey: 'nav.journalEntries', href: '/accounts/journal', icon: BookOpen },
      { nameKey: 'nav.vatReturns', href: '/accounts/vat', icon: Calculator },
      { nameKey: 'nav.reports', href: '/accounts/reports', icon: PieChart },
      { nameKey: 'nav.reconciliation', href: '/accounts/reconciliation', icon: Landmark },
    ]
  },
  {
    nameKey: 'nav.hr',
    href: '/hr',
    icon: UserCircle,
    subItems: [
      { nameKey: 'nav.employees', href: '/hr/employees', icon: Users },
      { nameKey: 'nav.departments', href: '/hr/departments', icon: Building2 },
      { nameKey: 'nav.attendance', href: '/hr/attendance', icon: UserCheck },
      { nameKey: 'nav.leave', href: '/hr/leave', icon: CalendarOff },
      { nameKey: 'nav.payroll', href: '/hr/payroll', icon: Banknote },
      { nameKey: 'nav.eosb', href: '/hr/eosb', icon: Award },
      { nameKey: 'nav.documents', href: '/hr/documents', icon: FileCheck },
      { nameKey: 'nav.performance', href: '/hr/performance', icon: Star },
      { nameKey: 'nav.reports', href: '/hr/reports', icon: BarChart },
      { nameKey: 'nav.myPortal', href: '/hr/portal', icon: User },
    ]
  },
  {
    nameKey: 'nav.jobs',
    href: '/jobs',
    icon: Briefcase,
    subItems: [
      { nameKey: 'nav.allJobs', href: '/jobs', icon: Briefcase },
      { nameKey: 'nav.technicians', href: '/jobs/technicians', icon: Wrench },
      { nameKey: 'nav.schedule', href: '/jobs/schedule', icon: Calendar },
      { nameKey: 'nav.serviceReports', href: '/jobs/reports', icon: ClipboardCheck },
      { nameKey: 'nav.mapView', href: '/jobs/map', icon: MapPin },
      { nameKey: 'nav.analytics', href: '/jobs/analytics', icon: BarChart3 },
    ]
  },
  {
    nameKey: 'nav.dispatcher',
    href: '/dispatcher',
    icon: Radio,
  },
  { nameKey: 'nav.settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['nav.crm', 'nav.sales', 'nav.inventory', 'nav.purchase', 'nav.accounts', 'nav.hr', 'nav.jobs'])
  const themeColors = useAppSelector((s) => s.theme.colors)

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const renderNavItem = (item: NavigationItem) => {
    const isActive = isActiveRoute(item.href)
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = expandedMenus.includes(item.nameKey)
    const Icon = item.icon

    // Style helpers for theme-aware colors
    const activeStyle = { backgroundColor: themeColors.primary }
    const hoverBg = 'hover:bg-white/10'
    const textMuted = { color: themeColors.sidebarText, opacity: 0.7 }
    const textMutedIcon = { color: themeColors.sidebarText, opacity: 0.5 }

    // For items with subitems
    if (hasSubItems) {
      const isSubActive = item.subItems!.some(sub => location.pathname === sub.href)

      if (isCollapsed) {
        // When collapsed, show tooltip with submenu links
        return (
          <Tooltip key={item.nameKey}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  'flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all',
                  !isSubActive && hoverBg
                )}
                style={isSubActive ? activeStyle : textMuted}
              >
                <Icon className="h-5 w-5 shrink-0" style={isSubActive ? { color: '#fff' } : textMutedIcon} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="p-0">
              <div className="py-1">
                <div className="px-3 py-1.5 text-sm font-semibold text-slate-900">{t(item.nameKey)}</div>
                {item.subItems!.map(subItem => (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-slate-100',
                      location.pathname === subItem.href ? 'font-medium' : 'text-slate-700'
                    )}
                    style={location.pathname === subItem.href ? { color: themeColors.primary } : undefined}
                  >
                    <subItem.icon className="h-4 w-4" />
                    {t(subItem.nameKey)}
                  </Link>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )
      }

      // Expanded sidebar with submenu
      return (
        <div key={item.nameKey}>
          <button
            onClick={() => toggleSubmenu(item.nameKey)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              !isSubActive && hoverBg
            )}
            style={isSubActive ? { backgroundColor: 'rgba(255,255,255,0.1)', color: themeColors.sidebarText } : textMuted}
          >
            <Icon className="h-5 w-5 shrink-0" style={isSubActive ? { color: themeColors.sidebarText } : textMutedIcon} />
            <span className="flex-1 text-start">{t(item.nameKey)}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          </button>
          {isExpanded && (
            <div className="mt-1 ms-4 space-y-1 border-s border-white/15 ps-3">
              {item.subItems!.map(subItem => {
                const SubIcon = subItem.icon
                const isSubItemActive = location.pathname === subItem.href
                return (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                      !isSubItemActive && hoverBg
                    )}
                    style={isSubItemActive ? { ...activeStyle, color: '#fff' } : textMuted}
                  >
                    <SubIcon className="h-4 w-4" style={isSubItemActive ? { color: '#fff' } : textMutedIcon} />
                    {t(subItem.nameKey)}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    // Regular nav item without subitems
    const linkContent = (
      <Link
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
          !isActive && hoverBg,
          isCollapsed && 'justify-center px-2'
        )}
        style={isActive ? { ...activeStyle, color: '#fff' } : textMuted}
      >
        <Icon
          className="h-5 w-5 shrink-0"
          style={isActive ? { color: '#fff' } : textMutedIcon}
        />
        {!isCollapsed && <span>{t(item.nameKey)}</span>}
        {!isCollapsed && item.badge && (
          <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium" style={{ backgroundColor: themeColors.primary, opacity: 0.85 }}>
            {item.badge}
          </span>
        )}
      </Link>
    )

    if (isCollapsed) {
      return (
        <Tooltip key={item.nameKey}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {t(item.nameKey)}
            {item.badge && (
              <span className="ms-2 rounded-full bg-primary px-1.5 py-0.5 text-xs">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      )
    }

    return <div key={item.nameKey}>{linkContent}</div>
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed inset-inline-start-0 top-0 z-40 h-screen flex-col text-white transition-all duration-300 ease-in-out',
          'hidden lg:flex',
          isCollapsed ? 'w-16' : 'w-64'
        )}
        style={{ backgroundColor: themeColors.sidebarBg, color: themeColors.sidebarText }}
      >
        {/* Logo Section */}
        <div
          className={cn(
            'flex h-16 items-center border-b border-white/10',
            isCollapsed ? 'justify-center px-2' : 'px-6'
          )}
        >
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: themeColors.primary }}>
              <Building2 className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-semibold tracking-tight">{t('nav.brandName')}</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-sidebar px-2 py-4">
          {navigation.map(renderNavItem)}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="border-t border-white/10 p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              'w-full hover:bg-white/10',
              isCollapsed ? 'justify-center' : 'justify-start'
            )}
            style={{ color: themeColors.sidebarText, opacity: 0.7 }}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ms-2">{t('common.collapse')}</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}

export default Sidebar
