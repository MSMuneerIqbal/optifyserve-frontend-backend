/**
 * Auth Context
 * Simple React Context for authentication (replaces Redux auth).
 * Login sets a mock user + localStorage. Logout clears it.
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { User } from '@/features/auth/types/auth.types'

interface RegisterData {
  companyName: string
  fullName: string
  email: string
  phone: string
  password: string
  emirate: string
  selectedPlan: 'starter' | 'standard' | 'premium'
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'erp_auth_user'

const mockUser: User = {
  id: 'usr_001',
  email: 'admin@uaeservice.ae',
  name: 'Ahmed Al Maktoum',
  role: 'super-admin',
  permissions: [
    'manage_users', 'manage_settings', 'manage_roles',
    'view_dashboard', 'manage_crm', 'manage_sales',
    'manage_inventory', 'manage_purchase', 'manage_accounts',
    'manage_hr', 'manage_jobs', 'manage_dispatch',
  ],
  companyId: 'comp_001',
  companyName: 'UAE Service Pro LLC',
  tenantId: 'tenant_001',
  avatar: undefined,
  phone: '+971 50 123 4567',
  department: 'Management',
}

/**
 * AUTH BYPASS: Auto-login enabled for development / UI template mode.
 * The mockUser is always set so the backend developer can access all pages
 * without needing to log in.
 *
 * To re-enable login page, change `AUTO_LOGIN` to `false`.
 */
const AUTO_LOGIN = false

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // When AUTO_LOGIN is true, always return mockUser (skip login page)
    if (AUTO_LOGIN) return mockUser
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const isAuthenticated = user !== null

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600))
    const loggedInUser: User = { ...mockUser, email }
    setUser(loggedInUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    const newUser: User = {
      id: 'usr_new_001',
      email: data.email,
      name: data.fullName,
      role: 'admin',
      permissions: [
        'manage_users', 'manage_settings', 'manage_roles',
        'view_dashboard', 'manage_crm', 'manage_sales',
        'manage_inventory', 'manage_purchase', 'manage_accounts',
        'manage_hr', 'manage_jobs', 'manage_dispatch',
      ],
      companyId: 'comp_new_001',
      companyName: data.companyName,
      tenantId: 'tenant_new_001',
      phone: data.phone,
      trialEndsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      selectedPlan: data.selectedPlan,
    }
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setUser(e.newValue ? JSON.parse(e.newValue) : null)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
