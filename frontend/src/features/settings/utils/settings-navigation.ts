/**
 * Settings Navigation Configuration
 * Phase 13: Settings Module
 */

import type { SettingsNavGroup, SettingsCategory } from '../types/settings.types'

export const SETTINGS_NAVIGATION: SettingsNavGroup[] = [
  {
    label: 'Personal',
    icon: 'User',
    items: [
      { id: 'personal-profile', label: 'My Profile', icon: 'User' },
      { id: 'personal-password', label: 'Change Password', icon: 'Lock' },
      { id: 'personal-notifications', label: 'Notifications', icon: 'Bell' },
      { id: 'personal-preferences', label: 'Preferences', icon: 'Palette' },
    ],
  },
  {
    label: 'Company',
    icon: 'Building2',
    adminOnly: true,
    items: [
      { id: 'company-profile', label: 'Company Profile', icon: 'Building2', adminOnly: true },
      { id: 'company-branches', label: 'Branches', icon: 'MapPin', adminOnly: true },
      { id: 'company-departments', label: 'Departments', icon: 'FolderTree', adminOnly: true },
      { id: 'company-customization', label: 'Customization', icon: 'Paintbrush', adminOnly: true },
    ],
  },
  {
    label: 'Users & Permissions',
    icon: 'Users',
    adminOnly: true,
    items: [
      { id: 'users-list', label: 'Users', icon: 'Users', adminOnly: true },
      { id: 'users-roles', label: 'Roles & Permissions', icon: 'Shield', adminOnly: true },
      { id: 'users-invitations', label: 'Invitations', icon: 'Mail', adminOnly: true },
    ],
  },
  {
    label: 'Subscription',
    icon: 'CreditCard',
    adminOnly: true,
    items: [
      { id: 'subscription-plan', label: 'Current Plan', icon: 'Crown', adminOnly: true },
      { id: 'subscription-billing', label: 'Billing History', icon: 'Receipt', adminOnly: true },
    ],
  },
  {
    label: 'Integrations',
    icon: 'Plug',
    adminOnly: true,
    items: [
      { id: 'integrations-whatsapp', label: 'WhatsApp', icon: 'MessageCircle', adminOnly: true },
      { id: 'integrations-email', label: 'Email (SMTP)', icon: 'Mail', adminOnly: true },
      { id: 'integrations-maps', label: 'Google Maps', icon: 'Map', adminOnly: true },
      { id: 'integrations-payment', label: 'Payment Gateway', icon: 'CreditCard', adminOnly: true },
      { id: 'integrations-api', label: 'API Keys', icon: 'Key', adminOnly: true },
    ],
  },
  {
    label: 'Security',
    icon: 'Shield',
    adminOnly: true,
    items: [
      { id: 'security-password', label: 'Password Policy', icon: 'Lock', adminOnly: true },
      { id: 'security-2fa', label: 'Two-Factor Auth', icon: 'Smartphone', adminOnly: true },
      { id: 'security-sessions', label: 'Sessions', icon: 'Monitor', adminOnly: true },
    ],
  },
  {
    label: 'Notifications',
    icon: 'Bell',
    adminOnly: true,
    items: [
      { id: 'notifications-channels', label: 'Channels', icon: 'Radio', adminOnly: true },
      { id: 'notifications-templates', label: 'Templates', icon: 'FileText', adminOnly: true },
    ],
  },
  {
    label: 'Data Management',
    icon: 'Database',
    adminOnly: true,
    items: [
      { id: 'data-export', label: 'Export Data', icon: 'Download', adminOnly: true },
      { id: 'data-import', label: 'Import Data', icon: 'Upload', adminOnly: true },
      { id: 'data-backup', label: 'Backup & Restore', icon: 'HardDrive', adminOnly: true },
    ],
  },
  {
    label: 'Appearance & Branding',
    icon: 'Palette',
    adminOnly: true,
    items: [
      { id: 'appearance-theme', label: 'Theme Colors', icon: 'Paintbrush', adminOnly: true },
    ],
  },
  {
    label: 'Tax & Compliance',
    icon: 'Calculator',
    adminOnly: true,
    items: [
      { id: 'tax-configuration', label: 'VAT Configuration', icon: 'Calculator', adminOnly: true },
      { id: 'audit-logs', label: 'Audit Logs', icon: 'ScrollText', adminOnly: true },
    ],
  },
  {
    label: 'Super Admin',
    icon: 'Crown',
    superAdminOnly: true,
    items: [
      { id: 'super-admin-tenants', label: 'Tenant Management', icon: 'Building', superAdminOnly: true },
      { id: 'super-admin-plans', label: 'Subscription Plans', icon: 'CreditCard', superAdminOnly: true },
      { id: 'super-admin-modules', label: 'Module Assignment', icon: 'Puzzle', superAdminOnly: true },
      { id: 'super-admin-analytics', label: 'Platform Analytics', icon: 'BarChart3', superAdminOnly: true },
    ],
  },
]

/** Get the default category for a given role */
export function getDefaultCategory(role: string): SettingsCategory {
  if (role === 'super_admin') return 'super-admin-tenants'
  if (role === 'admin') return 'company-profile'
  return 'personal-profile'
}

/** Filter navigation groups based on user role */
export function getFilteredNavigation(role: string): SettingsNavGroup[] {
  const isSuperAdmin = role === 'super_admin'
  const isAdmin = role === 'admin' || isSuperAdmin

  return SETTINGS_NAVIGATION.filter(group => {
    if (group.superAdminOnly && !isSuperAdmin) return false
    if (group.adminOnly && !isAdmin) return false
    return true
  }).map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.superAdminOnly && !isSuperAdmin) return false
      if (item.adminOnly && !isAdmin) return false
      return true
    }),
  }))
}
