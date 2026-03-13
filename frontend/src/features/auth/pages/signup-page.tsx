/**
 * Signup Page
 * Split-screen layout matching the login page design.
 * Left: branding panel with trial benefits. Right: multi-step signup form.
 */

import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Shield, Globe, Lock, CheckCircle2, ArrowRight } from 'lucide-react'

import { SignupForm } from '../components/signup-form'
import { useAuth } from '@/contexts/auth-context'
import { LanguageSwitcher } from '@/components/shared/language-switcher'

export function SignupPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const trustBadges = [
    { icon: Shield, label: t('auth.trustVAT') },
    { icon: Globe, label: t('auth.trustBilingual') },
    { icon: Lock, label: t('auth.trustSecure') },
  ]

  const trialBenefits = [
    t('auth.trialBenefit1'),
    t('auth.trialBenefit2'),
    t('auth.trialBenefit3'),
    t('auth.trialBenefit4'),
  ]

  return (
    <div className="flex min-h-screen">
      {/* ─── Left Panel — Branding (desktop only) ─── */}
      <div className="relative hidden w-[55%] overflow-hidden lg:flex lg:flex-col">
        <div className="bg-futuristic" aria-hidden="true" />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
          {/* Top — Logo */}
          <div>
            <h1 className="text-lg font-bold text-white">
              {t('auth.brandName')}
            </h1>
            <p className="text-xs text-white/60">{t('auth.brandTagline')}</p>
          </div>

          {/* Center — Trial pitch */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold leading-tight text-white xl:text-4xl">
                {t('auth.trialHeadline')}
              </h2>
              <p className="text-base text-white/80">
                {t('auth.trialSubheadline')}
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 backdrop-blur-sm"
                >
                  <badge.icon className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs font-semibold text-white">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Benefits list */}
            <ul className="space-y-3">
              {trialBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-white/90"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom — Sign in link */}
          <div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t('auth.alreadyHaveAccount')} {t('auth.signInHere')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Right Panel — Signup Form ─── */}
      <div className="flex w-full flex-col bg-background lg:w-[45%]">
        {/* Header — Logo + Language Switcher */}
        <div className="flex items-center justify-between px-6 py-4 sm:px-10">
          <img
            src="/logo-full.png"
            alt="OptifyServe"
            className="h-14 object-contain sm:h-16"
          />
          <LanguageSwitcher />
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-6 sm:px-10">
          <div className="w-full max-w-[460px]">
            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t('auth.createAccount')}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('auth.setupCompany')}
              </p>
            </div>

            {/* Form */}
            <SignupForm />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <p className="text-center text-xs text-muted-foreground">
            {t('auth.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
