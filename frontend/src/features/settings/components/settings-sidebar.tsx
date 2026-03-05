/**
 * Settings Sidebar - Category Navigation
 * Phase 13: Settings Module
 *
 * Left panel in the settings drawer showing grouped categories
 * with role-based visibility.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import {
  User, Lock, Bell, Palette, Building2, MapPin, FolderTree, Paintbrush,
  Users, Shield, Mail, CreditCard, Crown, Receipt, MessageCircle, Map,
  Key, Smartphone, Monitor, Radio, FileText, Database, Download, Upload,
  HardDrive, Calculator, ScrollText, BarChart3, Plug,
} from 'lucide-react'
import { getFilteredNavigation } from '../utils/settings-navigation'
import type { SettingsCategory } from '../types/settings.types'

const ICON_MAP: Record<string, React.ElementType> = {
  User, Lock, Bell, Palette, Building2, MapPin, FolderTree, Paintbrush,
  Users, Shield, Mail, CreditCard, Crown, Receipt, MessageCircle, Map,
  Key, Smartphone, Monitor, Radio, FileText, Database, Download, Upload,
  HardDrive, Calculator, ScrollText, BarChart3, Plug, Building: Building2,
  Puzzle: Key,
}

interface SettingsSidebarProps {
  activeCategory: SettingsCategory
  onCategoryChange: (category: SettingsCategory) => void
  userRole: string
}

export function SettingsSidebar({
  activeCategory,
  onCategoryChange,
  userRole,
}: SettingsSidebarProps) {
  const { t } = useTranslation()
  const navigation = getFilteredNavigation(userRole)
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([])

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    )
  }

  return (
    <div className="w-full sm:w-[220px] lg:w-[240px] shrink-0 border-r bg-white overflow-y-auto">
      <nav className="py-2">
        {navigation.map(group => {
          const GroupIcon = ICON_MAP[group.icon] || Building2
          const isCollapsed = collapsedGroups.includes(group.label)

          return (
            <div key={group.label} className="mb-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GroupIcon className="h-3.5 w-3.5" />
                  <span>{t(`settings.nav.${group.label}`, group.label)}</span>
                </div>
                <ChevronDown className={cn(
                  'h-3 w-3 transition-transform',
                  isCollapsed && '-rotate-90'
                )} />
              </button>

              {/* Group Items */}
              {!isCollapsed && (
                <div className="space-y-0.5 px-2">
                  {group.items.map(item => {
                    const ItemIcon = ICON_MAP[item.icon] || FileText
                    const isActive = activeCategory === item.id

                    return (
                      <button
                        key={item.id}
                        onClick={() => onCategoryChange(item.id)}
                        className={cn(
                          'flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-all',
                          isActive
                            ? 'bg-primary/5 text-primary font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <ItemIcon className={cn(
                          'h-4 w-4 shrink-0',
                          isActive ? 'text-primary' : 'text-gray-400'
                        )} />
                        <span className="truncate">{t(`settings.nav.${item.label}`, item.label)}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
