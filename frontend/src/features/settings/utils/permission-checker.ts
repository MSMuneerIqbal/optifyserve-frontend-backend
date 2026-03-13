/**
 * Permission Checker Utility
 * Phase 13: Settings Module
 */

import type { UserRole } from '../types/settings.types'

/** Role hierarchy from highest to lowest privilege */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'super-admin': 100,
  admin: 80,
  manager: 60,
  staff: 40,
  technician: 20,
}

/** Check if a user role has at least the specified minimum role */
export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole]
}

/** Check if user is a super admin */
export function isSuperAdmin(role: UserRole): boolean {
  return role === 'super-admin'
}

/** Check if user is a company admin or higher */
export function isCompanyAdmin(role: UserRole): boolean {
  return hasMinimumRole(role, 'admin')
}

/** Check if user is a manager or higher */
export function isManager(role: UserRole): boolean {
  return hasMinimumRole(role, 'manager')
}

/** Get role display label */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    'super-admin': 'Super Admin',
    admin: 'Administrator',
    manager: 'Manager',
    staff: 'Staff',
    technician: 'Technician',
  }
  return labels[role]
}

/** Get role badge color */
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    'super-admin': 'bg-red-100 text-red-700',
    admin: 'bg-purple-100 text-purple-700',
    manager: 'bg-blue-100 text-blue-700',
    staff: 'bg-primary/10 text-primary',
    technician: 'bg-amber-100 text-amber-700',
  }
  return colors[role]
}

/** Check if user has a specific permission */
export function hasPermission(userPermissions: string[], permission: string): boolean {
  if (userPermissions.includes('*')) return true
  return userPermissions.includes(permission)
}

/** Check if user has any of the specified permissions */
export function hasAnyPermission(userPermissions: string[], permissions: string[]): boolean {
  if (userPermissions.includes('*')) return true
  return permissions.some(p => userPermissions.includes(p))
}
