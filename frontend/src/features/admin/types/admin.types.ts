/**
 * Platform Administration Types
 * Extracted from settings.types.ts for standalone admin module
 */

export type SubscriptionPlan = 'basic' | 'standard' | 'premium' | 'enterprise'
export type TenantStatus = 'active' | 'trial' | 'suspended' | 'cancelled'

export interface Tenant {
  id: string
  companyName: string
  companyNameAr?: string
  trn: string
  ownerName: string
  ownerEmail: string
  plan: SubscriptionPlan
  status: TenantStatus
  enabledModules: string[]
  userCount: number
  branchCount: number
  storageUsedMB: number
  monthlyRevenue: number
  trialEndsAt?: string
  createdAt: string
  lastLoginAt?: string
}

export interface TenantFormData {
  companyName: string
  trn: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  plan: SubscriptionPlan
  enabledModules: string[]
  trialDays: number
}

export interface SubscriptionPlanConfig {
  id: SubscriptionPlan
  name: string
  description: string
  priceMonthly: number
  priceYearly: number
  maxUsers: number
  maxBranches: number
  storageLimitMB: number
  includedModules: string[]
  features: string[]
}

export interface ModuleConfig {
  id: string
  name: string
  description: string
  icon: string
  plan: SubscriptionPlan
  isAddon: boolean
  monthlyPrice?: number
}

export const AVAILABLE_MODULES: ModuleConfig[] = [
  { id: 'crm', name: 'CRM', description: 'Customers & Leads', icon: 'Users', plan: 'basic', isAddon: false },
  { id: 'sales', name: 'Sales', description: 'Quotations & Invoices', icon: 'FileText', plan: 'basic', isAddon: false },
  { id: 'inventory', name: 'Inventory', description: 'Stock Management', icon: 'Package', plan: 'standard', isAddon: false },
  { id: 'purchase', name: 'Purchase', description: 'Vendors & POs', icon: 'ShoppingCart', plan: 'standard', isAddon: false },
  { id: 'accounts', name: 'Accounts', description: 'Finance & VAT', icon: 'DollarSign', plan: 'standard', isAddon: false },
  { id: 'hr', name: 'HR & Payroll', description: 'Employees & Payroll', icon: 'UserCircle', plan: 'premium', isAddon: false },
  { id: 'jobs', name: 'Jobs & Service', description: 'Service Management', icon: 'Briefcase', plan: 'premium', isAddon: false },
  { id: 'dispatcher', name: 'Dispatcher', description: 'Field Operations', icon: 'Radio', plan: 'premium', isAddon: false },
  { id: 'reports', name: 'Advanced Reports', description: 'Custom Analytics', icon: 'BarChart3', plan: 'enterprise', isAddon: true, monthlyPrice: 99 },
  { id: 'api', name: 'API Access', description: 'REST API Integration', icon: 'Code', plan: 'enterprise', isAddon: true, monthlyPrice: 149 },
  { id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp Business', icon: 'MessageCircle', plan: 'standard', isAddon: true, monthlyPrice: 49 },
]

export const SUBSCRIPTION_PLANS: SubscriptionPlanConfig[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential tools for small teams',
    priceMonthly: 199,
    priceYearly: 1990,
    maxUsers: 5,
    maxBranches: 1,
    storageLimitMB: 5120,
    includedModules: ['crm', 'sales'],
    features: ['Customer Management', 'Quotations & Invoices', 'Email Support', '5 Users'],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Complete operations management',
    priceMonthly: 499,
    priceYearly: 4990,
    maxUsers: 15,
    maxBranches: 3,
    storageLimitMB: 20480,
    includedModules: ['crm', 'sales', 'inventory', 'purchase', 'accounts'],
    features: ['Everything in Basic', 'Inventory & Purchase', 'Accounts & VAT', 'Multi-Branch (3)', '15 Users', 'Priority Support'],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Full enterprise solution',
    priceMonthly: 999,
    priceYearly: 9990,
    maxUsers: 50,
    maxBranches: 10,
    storageLimitMB: 102400,
    includedModules: ['crm', 'sales', 'inventory', 'purchase', 'accounts', 'hr', 'jobs', 'dispatcher'],
    features: ['Everything in Standard', 'HR & Payroll', 'Jobs & Dispatcher', 'GPS Tracking', '50 Users', '10 Branches', 'Dedicated Support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solution for large organizations',
    priceMonthly: 0,
    priceYearly: 0,
    maxUsers: 999,
    maxBranches: 999,
    storageLimitMB: 512000,
    includedModules: ['crm', 'sales', 'inventory', 'purchase', 'accounts', 'hr', 'jobs', 'dispatcher', 'reports', 'api'],
    features: ['Everything in Premium', 'Advanced Reports', 'API Access', 'Unlimited Users', 'Unlimited Branches', 'Custom Integrations', '24/7 Support', 'SLA Guarantee'],
  },
]
