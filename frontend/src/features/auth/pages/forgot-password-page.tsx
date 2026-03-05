/**
 * Forgot Password Page
 * Clean password reset page matching login design
 */

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { ArrowLeft, Building2, Loader2, Mail, CheckCircle2, KeyRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LanguageSwitcher } from '@/components/shared/language-switcher'

type ForgotPasswordData = { email: string }

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const forgotPasswordSchema = useMemo(() => z.object({
    email: z.string().email(t('validation.validEmail')),
  }), [t])

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsLoading(false)
    setSubmittedEmail(data.email)
    setIsSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold">{t('auth.brandName')}</h1>
            <p className="text-xs text-muted-foreground">{t('auth.brandTagline')}</p>
          </div>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px]">
          {!isSubmitted ? (
            <>
              {/* Icon */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <KeyRound className="h-7 w-7 text-primary" />
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-bold tracking-tight">{t('auth.resetPassword')}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('auth.resetDescription')}
              </p>

              {/* Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
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

                  <Button
                    type="submit"
                    className="h-11 w-full text-sm font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        {t('auth.sending')}
                      </>
                    ) : (
                      t('auth.sendResetLink')
                    )}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight">{t('auth.checkEmail')}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('auth.resetLinkSent')}
              </p>

              <div className="mt-4 rounded-lg border bg-muted/50 px-4 py-3">
                <p className="text-sm font-medium">{submittedEmail}</p>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                {t('auth.noEmailReceived')}
              </p>

              <Button
                variant="outline"
                className="mt-6 h-11 w-full"
                onClick={() => {
                  setIsSubmitted(false)
                  form.reset()
                }}
              >
                {t('auth.tryAnotherEmail')}
              </Button>
            </>
          )}

          {/* Back link */}
          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t('auth.backToSignIn')}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          {t('auth.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
