/**
 * Login Form Component — UI Template Mode
 * Click "Sign In" to enter the app instantly (no validation).
 * Email/password fields are shown for UI display only.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/contexts/auth-context'
import { sampleCompanyProfile } from '@/data/settings.data'

/**
 * UI Template Mode: No validation required.
 * Click "Sign In" to enter the app instantly.
 */

interface LoginFormProps {
  onForgotPassword?: () => void
}

type LoginFormData = {
  email: string
  password: string
  rememberMe: boolean
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      await login(sampleCompanyProfile.email, 'demo')
      navigate('/dashboard', { replace: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">{t('auth.emailLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    autoComplete="email"
                    disabled={isLoading}
                    className="h-11 ps-10 text-sm"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium">{t('auth.passwordLabel')}</FormLabel>
                {onForgotPassword ? (
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs text-primary hover:underline focus:outline-none"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                ) : (
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                    tabIndex={-1}
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                )}
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.passwordPlaceholder')}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="h-11 ps-10 pe-11 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    {showPassword ? (
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

        {/* Remember Me */}
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                  id="rememberMe"
                />
              </FormControl>
              <label
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground cursor-pointer select-none"
              >
                {t('auth.keepSignedIn')}
              </label>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-11 w-full text-sm font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
              {t('auth.signingIn')}
            </>
          ) : (
            <>
              {t('auth.signIn')}
              <ArrowRight className="ms-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
