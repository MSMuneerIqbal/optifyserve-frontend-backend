import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from './breadcrumb'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { CurrencySwitcher } from '@/components/shared/currency-switcher'
import { getInitials } from '@/lib/utils'

interface TopNavProps {
  onMenuClick: () => void
  user?: {
    name: string
    email: string
    avatar?: string
    companyName?: string
  }
  onLogout?: () => void
}

export function TopNav({ onMenuClick, user, onLogout }: TopNavProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const notificationCount = 3

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label={t('common.toggleMenu')}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Building2 className="h-4 w-4 text-white" />
        </div>
      </Link>

      {/* Breadcrumb - Hidden on mobile */}
      <div className="hidden flex-1 lg:block">
        <Breadcrumb />
      </div>

      {/* Search Bar - Hidden on mobile */}
      <form onSubmit={handleSearch} className="hidden md:block">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('topNav.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 ps-9 lg:w-80"
          />
        </div>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-2 ms-auto">
        {/* Mobile Search Button */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>

        {/* Company Switcher - Hidden on mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden gap-2 md:flex">
              <Building2 className="h-4 w-4" />
              <span className="max-w-32 truncate">{user?.companyName || t('topNav.selectCompany')}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('topNav.switchCompany')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Building2 className="me-2 h-4 w-4" />
              {t('topNav.mainCompany')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Building2 className="me-2 h-4 w-4" />
              {t('topNav.branchOfficeDubai')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Currency Switcher */}
        <CurrencySwitcher />

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              {t('topNav.notifications')}
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
                {t('topNav.markAllRead')}
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">{t('topNav.newQuotationApproved')}</p>
              <p className="text-xs text-muted-foreground">{t('topNav.quotationApprovedDesc')}</p>
              <p className="text-xs text-muted-foreground">{t('topNav.hoursAgo', { count: 2 })}</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">{t('topNav.lowStockAlert')}</p>
              <p className="text-xs text-muted-foreground">{t('topNav.lowStockAlertDesc')}</p>
              <p className="text-xs text-muted-foreground">{t('topNav.hoursAgo', { count: 4 })}</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              <Link to="/notifications" className="text-sm text-primary">
                {t('topNav.viewAllNotifications')}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pe-2 ps-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-white">
                  {getInitials(user?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-24 truncate text-sm font-medium md:block">
                {user?.name || t('topNav.user')}
              </span>
              <ChevronDown className="hidden h-4 w-4 md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || t('topNav.user')}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex cursor-pointer">
                <User className="me-2 h-4 w-4" />
                {t('topNav.profile')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex cursor-pointer">
                <Settings className="me-2 h-4 w-4" />
                {t('nav.settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="me-2 h-4 w-4" />
              {t('topNav.logOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default TopNav
