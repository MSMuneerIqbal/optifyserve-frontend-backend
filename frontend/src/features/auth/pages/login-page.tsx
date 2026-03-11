/**
 * Login Page
 * Futuristic split-screen login with bg-futuristic background
 * matching optifyserve.com design language
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
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
      {/* ──────────────────────────────────────────────────────────
          Left Panel — Futuristic Branding (desktop only)
          ────────────────────────────────────────────────────────── */}
      <div className="relative hidden w-[55%] overflow-hidden lg:flex lg:flex-col">
        {/* Futuristic background — grid, gradients, pulse glow */}
        <div className="bg-futuristic" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
          {/* Top — Company Name */}
          <div>
            <h1 className="text-lg font-bold text-white">{t('auth.brandName')}</h1>
            <p className="text-xs text-white/60">{t('auth.brandTagline')}</p>
          </div>

          {/* Center — Hero */}
          <div className="space-y-8">
            <div className="space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-4 py-1.5 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 text-cyan-300" />
                <span className="text-xs font-semibold text-white">{t('auth.trustedBy')}</span>
              </div>

              {/* Title — shining gradient text */}
              <h2
                className="text-shine bg-clip-text text-4xl font-extrabold leading-tight text-transparent xl:text-5xl"
                style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa 0%, #ffffff 25%, #38bdf8 50%, #34d399 75%, #60a5fa 100%)' }}
              >
                {t('auth.heroTitle1')}
              </h2>
              <p className="text-xl font-semibold leading-snug text-white xl:text-2xl">
                {t('auth.heroTitle2')}
              </p>

              {/* Slogan — shining */}
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-gradient-to-r from-blue-400 to-emerald-400" />
                <p
                  className="text-shine bg-clip-text text-sm font-bold uppercase tracking-widest text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #94a3b8 0%, #ffffff 30%, #38bdf8 60%, #94a3b8 100%)' }}
                >
                  {t('auth.heroSlogan')}
                </p>
              </div>

              <p className="max-w-lg text-sm leading-relaxed text-white/80 xl:text-base">
                {t('auth.heroDescription')}
              </p>
            </div>

            {/* Feature grid — glass cards with bright text */}
            <div className="grid grid-cols-2 gap-3 xl:gap-4">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.08]"
                >
                  <feature.icon
                    className="mb-2.5 h-5 w-5 transition-colors drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]"
                    style={{ color: i % 2 === 0 ? '#60a5fa' : '#34d399' }}
                  />
                  <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — Stats */}
          <div className="flex items-center gap-8">
            <div>
              <p
                className="text-shine bg-clip-text text-2xl font-extrabold text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #ffffff, #38bdf8, #60a5fa)' }}
              >
                99.9%
              </p>
              <p className="text-xs font-medium text-white/70">{t('auth.uptimeSLA')}</p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div>
              <p
                className="text-shine bg-clip-text text-2xl font-extrabold text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #38bdf8, #ffffff, #34d399, #38bdf8)' }}
              >
                7
              </p>
              <p className="text-xs font-medium text-white/70">{t('auth.emiratesCovered')}</p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div>
              <p
                className="text-shine bg-clip-text text-2xl font-extrabold text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #ffffff, #34d399, #60a5fa)' }}
              >
                24/7
              </p>
              <p className="text-xs font-medium text-white/70">{t('auth.support')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          Right Panel — Clean Login Form
          ────────────────────────────────────────────────────────── */}
      <div className="flex w-full flex-col bg-background lg:w-[45%]">
        {/* Header — Logo + Language Switcher */}
        <div className="flex items-center justify-between px-6 py-4 sm:px-10">
          <img src="/logo-full.png" alt="OptifyServe" className="h-14 object-contain sm:h-16" />
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
