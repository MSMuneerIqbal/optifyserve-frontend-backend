/**
 * Login Page
 * Modern split-screen login with animated branding panel
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  ShieldCheck,
  BarChart3,
  Users,
  Globe,
  Zap,
} from 'lucide-react'

import { LoginForm } from '../components/login-form'
import { useAuth } from '@/contexts/auth-context'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { sampleCompanyProfile } from '@/data/settings.data'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: BarChart3,
      title: t('auth.featureAnalytics'),
      description: t('auth.featureAnalyticsDesc'),
    },
    {
      icon: Users,
      title: t('auth.featureMultiBranch'),
      description: t('auth.featureMultiBranchDesc'),
    },
    {
      icon: ShieldCheck,
      title: t('auth.featureVAT'),
      description: t('auth.featureVATDesc'),
    },
    {
      icon: Globe,
      title: t('auth.featureCloud'),
      description: t('auth.featureCloudDesc'),
    },
  ]

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="relative hidden w-[55%] overflow-hidden bg-primary lg:flex lg:flex-col">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />

        {/* Decorative shapes */}
        <div className="absolute -start-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -end-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute start-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-white/[0.03]" />
        <div className="absolute bottom-1/4 start-1/4 h-32 w-32 rounded-full bg-white/[0.04]" />

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
          {/* Top — Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{t('auth.brandName')}</h1>
              <p className="text-xs text-white/60">{t('auth.brandTagline')}</p>
            </div>
          </div>

          {/* Center — Hero */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 text-yellow-300" />
                <span className="text-xs font-medium text-white/90">{t('auth.trustedBy')}</span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
                {t('auth.heroTitle1')}
                <br />
                <span className="text-white/80">{t('auth.heroTitle2')}</span>
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/60 xl:text-base">
                {t('auth.heroDescription')}
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3 xl:gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.1]"
                >
                  <feature.icon className="mb-2.5 h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
                  <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — Stats */}
          <div className="flex items-center gap-8">
            <div>
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-xs text-white/50">{t('auth.uptimeSLA')}</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-2xl font-bold text-white">7</p>
              <p className="text-xs text-white/50">{t('auth.emiratesCovered')}</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-xs text-white/50">{t('auth.support')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full flex-col bg-background lg:w-[45%]">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b p-4 lg:hidden">
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

        {/* Desktop language switcher */}
        <div className="hidden justify-end p-4 lg:flex">
          <LanguageSwitcher />
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[400px]">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t('auth.welcomeBack')}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('auth.enterCredentials')}
              </p>
            </div>

            {/* Form */}
            <LoginForm />

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">
                  {t('auth.secureLogin')}
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs">{t('auth.sslBadge')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                <span className="text-xs">{t('auth.uaeHosted')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-start">
            <p className="text-xs text-muted-foreground">
              {t('auth.copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <a href="#privacy" className="hover:text-foreground hover:underline">
                {t('auth.privacy')}
              </a>
              <a href="#terms" className="hover:text-foreground hover:underline">
                {t('auth.terms')}
              </a>
              <a
                href={`mailto:${sampleCompanyProfile.email}`}
                className="hover:text-foreground hover:underline"
              >
                {t('auth.support')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
