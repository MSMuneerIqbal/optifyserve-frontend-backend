import { z } from 'zod'
import { UAE_EMIRATES, CUSTOMER_TYPES, LEAD_SOURCES, LEAD_STAGES } from './constants'

// Email validation
export const emailSchema = z.string().email('Please enter a valid email address')

// UAE Phone validation
export const phoneSchema = z
  .string()
  .regex(
    /^(\+971|00971|0)?[0-9]{9}$/,
    'Please enter a valid UAE phone number (e.g., +971501234567 or 0501234567)'
  )

// TRN (Tax Registration Number) validation
export const trnSchema = z
  .string()
  .length(15, 'TRN must be exactly 15 digits')
  .regex(/^\d{15}$/, 'TRN must contain only numbers')

// Optional TRN
export const optionalTrnSchema = z
  .string()
  .length(15, 'TRN must be exactly 15 digits')
  .regex(/^\d{15}$/, 'TRN must contain only numbers')
  .optional()
  .or(z.literal(''))

// Emirates validation
export const emirateSchema = z.enum(UAE_EMIRATES, {
  message: 'Please select a valid emirate',
})

// Currency/Amount validation
export const currencySchema = z.number().min(0, 'Amount must be positive')

// Positive integer
export const positiveIntegerSchema = z.number().int().positive('Value must be a positive integer')

// Percentage validation (0-100)
export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage cannot exceed 100')

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  emirate: emirateSchema,
  country: z.string().default('UAE'),
})

// Customer type validation
export const customerTypeSchema = z.enum(CUSTOMER_TYPES, {
  message: 'Please select a valid customer type',
})

// Lead source validation
export const leadSourceSchema = z.enum(LEAD_SOURCES, {
  message: 'Please select a valid lead source',
})

// Lead stage validation
export const leadStageSchema = z.enum(LEAD_STAGES, {
  message: 'Please select a valid lead stage',
})

// Date validation (must be a valid date string or Date object)
export const dateSchema = z.coerce.date({
  message: 'Please enter a valid date',
})

// Future date validation
export const futureDateSchema = z.coerce.date().refine((date) => date > new Date(), {
  message: 'Date must be in the future',
})

// Past date validation
export const pastDateSchema = z.coerce.date().refine((date) => date < new Date(), {
  message: 'Date must be in the past',
})

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

// Simple password (for login - no complexity check)
export const loginPasswordSchema = z.string().min(6, 'Password must be at least 6 characters')

// URL validation
export const urlSchema = z.string().url('Please enter a valid URL')

// SKU validation
export const skuSchema = z
  .string()
  .min(3, 'SKU must be at least 3 characters')
  .max(50, 'SKU must not exceed 50 characters')
  .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens')

// Barcode validation
export const barcodeSchema = z
  .string()
  .regex(/^[0-9]{8,13}$/, 'Barcode must be 8-13 digits')
  .optional()
  .or(z.literal(''))

// Common form schemas

// Login form schema
export const loginFormSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
  rememberMe: z.boolean().optional(),
})

// Customer form schema
export const customerFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().optional(),
  customerType: customerTypeSchema,
  taxRegistrationNumber: optionalTrnSchema,
  address: addressSchema,
})

// Lead form schema
export const leadFormSchema = z.object({
  name: nameSchema,
  company: z.string().optional(),
  email: emailSchema,
  phone: phoneSchema,
  source: leadSourceSchema,
  estimatedValueMin: currencySchema,
  estimatedValueMax: currencySchema,
  expectedCloseDate: dateSchema.optional(),
  probability: percentageSchema.optional(),
  notes: z.string().optional(),
})

// Follow-up form schema
export const followUpFormSchema = z.object({
  date: dateSchema,
  type: z.enum(['call', 'email', 'meeting']),
  notes: z.string().min(1, 'Notes are required'),
})

// Invoice item schema
export const invoiceItemSchema = z.object({
  itemId: z.string().min(1, 'Item is required'),
  itemName: z.string(),
  description: z.string().optional(),
  quantity: positiveIntegerSchema,
  unitPrice: currencySchema,
  discount: percentageSchema.optional().default(0),
  vatStatus: z.enum(['standard', 'zero-rated', 'exempt']).default('standard'),
})

// Payment form schema
export const paymentFormSchema = z.object({
  amount: currencySchema.refine((val) => val > 0, 'Amount must be greater than 0'),
  paymentDate: dateSchema,
  paymentMethod: z.enum(['cash', 'bank-transfer', 'cheque', 'card']),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

// Subscription plans
export const SUBSCRIPTION_PLANS = ['starter', 'standard', 'premium'] as const
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number]

// Signup Step 1 schema — Company Information
export const signupStep1Schema = z
  .object({
    companyName: z
      .string()
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name must not exceed 100 characters'),
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(7, 'Phone number must be at least 7 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    emirate: z.string().min(1, 'Please select an emirate'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Signup Step 2 schema — Plan Selection
export const signupStep2Schema = z.object({
  selectedPlan: z.enum(SUBSCRIPTION_PLANS, {
    message: 'Please select a plan',
  }),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
})

// Combined signup schema (no refine — use for useForm resolver)
export const signupSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  emirate: z.string().min(1, 'Please select an emirate'),
  selectedPlan: z.enum(SUBSCRIPTION_PLANS, {
    message: 'Please select a plan',
  }),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
})

// Export types inferred from schemas
export type SignupStep1Data = z.infer<typeof signupStep1Schema>
export type SignupStep2Data = z.infer<typeof signupStep2Schema>
export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginFormSchema>
export type CustomerFormData = z.infer<typeof customerFormSchema>
export type LeadFormData = z.infer<typeof leadFormSchema>
export type FollowUpFormData = z.infer<typeof followUpFormSchema>
export type InvoiceItemData = z.infer<typeof invoiceItemSchema>
export type PaymentFormData = z.infer<typeof paymentFormSchema>
export type AddressData = z.infer<typeof addressSchema>
