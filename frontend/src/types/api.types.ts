// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
}

// API Error Response
export interface ApiErrorResponse {
  success: false
  message: string
  code?: string
  errors?: Record<string, string[]>
  stack?: string
}

// Request Config
export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
  signal?: AbortSignal
}

// Query Parameters for list endpoints
export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}

// Mutation Response
export interface MutationResponse<T = unknown> {
  success: boolean
  data?: T
  message: string
}

// Delete Response
export interface DeleteResponse {
  success: boolean
  message: string
  deletedId: string
}

// Bulk Delete Response
export interface BulkDeleteResponse {
  success: boolean
  message: string
  deletedCount: number
  failedCount: number
  errors?: Array<{
    id: string
    message: string
  }>
}

// Upload Response
export interface UploadResponse {
  success: boolean
  url: string
  filename: string
  size: number
  mimeType: string
}

// Health Check Response
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  version: string
  uptime: number
  timestamp: string
  services: Record<
    string,
    {
      status: 'up' | 'down'
      latency?: number
    }
  >
}

// WebSocket Message
export interface WebSocketMessage<T = unknown> {
  type: string
  payload: T
  timestamp: string
}

// Notification from Server
export interface ServerNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

// Token Response
export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}

// Refresh Token Request
export interface RefreshTokenRequest {
  refreshToken: string
}

// Change Password Request
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Reset Password Request
export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

// Forgot Password Request
export interface ForgotPasswordRequest {
  email: string
}

// API Method Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// API Endpoint Configuration
export interface ApiEndpoint {
  path: string
  method: HttpMethod
  requiresAuth: boolean
  permissions?: string[]
}

// Batch Request
export interface BatchRequest {
  requests: Array<{
    id: string
    endpoint: string
    method: HttpMethod
    body?: unknown
  }>
}

// Batch Response
export interface BatchResponse {
  responses: Array<{
    id: string
    status: number
    data?: unknown
    error?: string
  }>
}
