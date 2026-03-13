/**
 * Authentication Types for UAE Service ERP
 * Phase 2: Authentication Module
 */

/**
 * User roles in the ERP system
 */
export type UserRole = 'super-admin' | 'admin' | 'manager' | 'staff' | 'technician'

/**
 * Authenticated user information
 */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: string[]
  companyId: string
  companyName: string
  tenantId: string
  avatar?: string
  phone?: string
  department?: string
  createdAt?: string
  lastLoginAt?: string
  trialEndsAt?: string
  selectedPlan?: 'starter' | 'standard' | 'premium'
}

/**
 * JWT token pair returned from authentication
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * Credentials for login
 */
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Response from login API
 */
export interface LoginResponse {
  user: User
  tokens: AuthTokens
  message?: string
}

/**
 * Response from token refresh API
 */
export interface RefreshTokenResponse {
  tokens: AuthTokens
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirm {
  token: string
  password: string
  confirmPassword: string
}

/**
 * Change password request (for authenticated users)
 */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Authentication state in the store
 */
export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Authentication actions in the store
 */
export interface AuthActions {
  setAuth: (user: User, tokens: AuthTokens) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

/**
 * Complete auth store type
 */
export type AuthStore = AuthState & AuthActions

/**
 * Permission check result
 */
export interface PermissionCheck {
  hasPermission: boolean
  reason?: string
}
