/**
 * Settings Page
 * Main settings page that hosts the right-side drawer.
 * When navigated to /settings, automatically opens the drawer.
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Building2, Bell, Plug, Settings, Lock,
  CreditCard, Database, User, Palette, Globe,
} from 'lucide-react'
import { SettingsDrawer } from '../components/settings-drawer'
import { getDefaultCategory } from '../utils/settings-navigation'
import { useAuth } from '@/contexts/auth-context'
import type { SettingsCategory } from '../types/settings.types'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('company-profile')
  const { user } = useAuth()
  const userRole = user?.role || 'staff'

  const QUICK_ACCESS = [
    { label: t('settings.companyProfile'), icon: Building2, category: 'company-profile' as SettingsCategory, adminOnly: true },
    { label: t('settings.notifications'), icon: Bell, category: 'notifications-channels' as SettingsCategory, adminOnly: false },
    { label: t('settings.integrations'), icon: Plug, category: 'integrations-whatsapp' as SettingsCategory, adminOnly: true },
    { label: t('settings.security'), icon: Lock, category: 'security-password' as SettingsCategory, adminOnly: true },
    { label: t('settings.subscription'), icon: CreditCard, category: 'subscription-plan' as SettingsCategory, adminOnly: true },
    { label: t('settings.dataManagement'), icon: Database, category: 'data-backup' as SettingsCategory, adminOnly: true },
    { label: t('settings.appearance'), icon: Palette, category: 'appearance-theme' as SettingsCategory, adminOnly: true },
    { label: t('settings.myProfile'), icon: User, category: 'personal-profile' as SettingsCategory, adminOnly: false },
    { label: t('settings.language'), icon: Globe, category: 'appearance-theme' as SettingsCategory, adminOnly: false },
  ]

  // Open drawer automatically on mount
  useEffect(() => {
    const defaultCat = getDefaultCategory(userRole)
    setActiveCategory(defaultCat)
    setIsDrawerOpen(true)
  }, [userRole])

  const handleOpenCategory = (category: SettingsCategory) => {
    setActiveCategory(category)
    setIsDrawerOpen(true)
  }

  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(newLang)
  }

  const isAdmin = userRole === 'admin' || userRole === 'super-admin'
  const quickAccess = QUICK_ACCESS.filter(item => !item.adminOnly || isAdmin)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title={t('settings.title')}
          description={t('settings.description')}
        />
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Settings className="h-4 w-4 me-2" />
          {t('settings.openSettings')}
        </Button>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {quickAccess.map((item, index) => (
          <Card
            key={`${item.category}-${index}`}
            className="cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all group"
            onClick={() => {
              if (item.icon === Globe) {
                handleLanguageToggle()
              } else {
                handleOpenCategory(item.category)
              }
            }}
          >
            <CardContent className="flex flex-col items-center gap-2 p-3 sm:p-4 text-center">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-primary">{item.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        userRole={userRole}
      />
    </div>
  )
}

export default SettingsPage
