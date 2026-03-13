/**
 * Signup Form Component — Multi-Step
 * Step 1: Company Information
 * Step 2: Plan Selection + Terms
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/contexts/auth-context'
import { signupSchema } from '@/lib/validations'
import type { SubscriptionPlan } from '@/lib/validations'
import { PasswordStrength } from './password-strength'
import { PlanSelector } from './plan-selector'

const EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'RAK',
  'UAQ',
  'Fujairah',
  'Other',
] as const

interface SignupFormValues {
  companyName: string
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  emirate: string
  selectedPlan: SubscriptionPlan
  agreeToTerms: boolean
}

export function SignupForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      companyName: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      emirate: 'Dubai',
      selectedPlan: 'starter',
      agreeToTerms: false,
    },
    mode: 'onTouched',
  })

  const watchPassword = form.watch('password')

  const handleNextStep = async () => {
    // Validate only step 1 fields
    const step1Fields = [
      'companyName',
      'fullName',
      'email',
      'phone',
      'password',
      'confirmPassword',
      'emirate',
    ] as const

    const valid = await form.trigger(step1Fields)

    if (valid) {
      // Check password match manually (refine doesn't work with useForm trigger)
      const values = form.getValues()
      if (values.password !== values.confirmPassword) {
        form.setError('confirmPassword', {
          message: 'Passwords do not match',
        })
        return
      }
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    try {
      await registerUser({
        companyName: data.companyName,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        emirate: data.emirate,
        selectedPlan: data.selectedPlan,
      })
      toast.success(t('auth.welcomeToast'))
      navigate('/dashboard', { replace: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Progress indicator */}
        <div className="flex items-center gap-3 text-sm">
          <div
            className={
              step === 1
                ? 'font-semibold text-primary'
                : 'text-muted-foreground'
            }
          >
            {t('auth.step1of2')} — {t('auth.companyInfo')}
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <div
            className={
              step === 2
                ? 'font-semibold text-primary'
                : 'text-muted-foreground'
            }
          >
            {t('auth.step2of2')} — {t('auth.choosePlan')}
          </div>
        </div>

        {/* ─── Step 1: Company Information ─── */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {t('auth.companyName')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder={t('auth.companyNamePlaceholder')}
                        className="h-11 ps-10 text-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {t('auth.fullName')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder={t('auth.fullNamePlaceholder')}
                        className="h-11 ps-10 text-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Work Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {t('auth.workEmail')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder={t('auth.workEmailPlaceholder')}
                        autoComplete="email"
                        className="h-11 ps-10 text-sm"
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {t('auth.workEmailHelper')}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {t('auth.phoneNumber')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="tel"
                        placeholder={t('auth.phoneNumberPlaceholder')}
                        className="h-11 ps-10 text-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {t('auth.password')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.passwordCreatePlaceholder')}
                        autoComplete="new-password"
                        className="h-11 ps-10 pe-11 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <PasswordStrength password={watchPassword} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {t('auth.confirmPassword')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        autoComplete="new-password"
                        className="h-11 ps-10 pe-11 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute end-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Emirate */}
            <FormField
              control={form.control}
              name="emirate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {t('auth.emirate')}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMIRATES.map((emirate) => (
                        <SelectItem key={emirate} value={emirate}>
                          {emirate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Next Button */}
            <Button
              type="button"
              className="h-11 w-full text-sm font-medium"
              onClick={handleNextStep}
            >
              {t('auth.nextChoosePlan')}
              <ArrowRight className="ms-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ─── Step 2: Choose Plan ─── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold">
                {t('auth.choosePlanHeading')}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('auth.allPlansIncludeTrial')}
              </p>
            </div>

            {/* Plan Cards */}
            <FormField
              control={form.control}
              name="selectedPlan"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PlanSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms Checkbox */}
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="agreeToTerms"
                        className="mt-0.5"
                      />
                    </FormControl>
                    <label
                      htmlFor="agreeToTerms"
                      className="cursor-pointer select-none text-sm text-muted-foreground"
                    >
                      {t('auth.agreeToTerms')}{' '}
                      <a
                        href="#terms"
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('auth.termsOfService')}
                      </a>{' '}
                      {t('auth.and')}{' '}
                      <a
                        href="#privacy"
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t('auth.privacyPolicy')}
                      </a>
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="h-11 w-full text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    {t('auth.creatingAccount')}
                  </>
                ) : (
                  t('auth.startFreeTrial')
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="h-11 w-full text-sm"
                onClick={handleBack}
                disabled={isLoading}
              >
                <ArrowLeft className="me-2 h-4 w-4" />
                {t('auth.backToCompanyInfo')}
              </Button>
            </div>
          </div>
        )}

        {/* Sign in link */}
        <p className="text-center text-sm text-muted-foreground">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            {t('auth.signInHere')}
          </Link>
        </p>
      </form>
    </Form>
  )
}
