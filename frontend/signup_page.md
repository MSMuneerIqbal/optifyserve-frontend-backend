Read this entire instruction before writing any code.

You are building the Signup / Free Trial Registration page for OptifyServe ERP.
This is a frontend-only task. No backend calls yet. Follow the existing codebase patterns exactly.

==================================================
UNDERSTAND THE FLOW FIRST
==================================================

User journey:

1. User visits www.optifyserve.com (marketing website)
2. Clicks "Start Free Trial" or "Register Free"
3. Gets redirected to app.optifyserve.com/signup (this page)
4. Fills in their details and selects a plan
5. Clicks "Start Free Trial"
6. In template mode: simulates 1.5s loading, then redirects to /dashboard
7. User lands on dashboard with 15-day trial banner visible

This signup page creates a NEW TENANT (company), not just a user account.
Every person who signs up is registering their whole company.
The primary user becomes the Company Admin automatically.

==================================================
READ THESE FILES BEFORE CODING
==================================================

Read these files first to understand existing patterns:

1. frontend/src/contexts/auth-context.tsx — understand login() pattern, copy the same approach for register()
2. frontend/src/features/auth/pages/login-page.tsx — this is the split-screen design to match
3. frontend/src/features/auth/components/login-form.tsx — form pattern to follow
4. frontend/src/i18n/locales/en.json — check existing auth keys
5. frontend/src/i18n/locales/ar.json — must add Arabic keys too
6. frontend/src/lib/validations.ts — add signup Zod schema here
7. frontend/src/app/App.tsx — add /signup route here
8. frontend/src/lib/constants.ts — check subscription plan constants
9. frontend/src/features/settings/theme/themeTypes.ts — check THEME_PRESETS for branding colors

Do not start coding until you have read all of these.

==================================================
SUBSCRIPTION PLANS TO DISPLAY
==================================================

Show 3 plans on the signup page. User must select one before submitting.

PLAN 1 — Starter (Free Trial)

- Price: Free for 15 days
- Badge: "Most Popular"
- Color: Primary blue
- Features included:
  - Up to 5 users
  - CRM (Customers + Leads)
  - Sales (Quotations + Invoices)
  - Basic Dashboard
  - Email support

PLAN 2 — Standard (Free Trial)

- Price: AED 299/month after trial
- Badge: none
- Color: Emerald green
- Features included:
  - Up to 20 users
  - Everything in Starter
  - Inventory Management
  - Purchase Module
  - Accounts & Finance
  - Priority support

PLAN 3 — Premium (Free Trial)

- Price: AED 599/month after trial
- Badge: "Full Access"
- Color: Orange accent
- Features included:
  - Unlimited users
  - Everything in Standard
  - HR & Payroll
  - Jobs & Dispatcher
  - Platform Admin
  - Dedicated support
  - WhatsApp integration

All plans start with a 15-day free trial. No credit card required.
Default selected plan: Starter.

==================================================
PAGE LAYOUT — SPLIT SCREEN (match login page)
==================================================

The page must use the same split-screen layout as the login page.

LEFT PANEL (hidden on mobile):

- Same branding panel as login page
- OptifyServe logo at top
- Headline: "Start your 15-day free trial"
- Subheadline: "No credit card required. Cancel anytime."
- Show 3 trust badges:
  - "UAE VAT Compliant"
  - "Arabic + English"
  - "Secure & Encrypted"
- Show a short list of what they get:
  - ✓ Full ERP access for 15 days
  - ✓ All modules available to explore
  - ✓ No setup fees
  - ✓ Cancel anytime
- Footer: "Already have an account? Sign in →" (link to /login)
- Use the same gradient background as the login branding panel

RIGHT PANEL (the actual form):

- OptifyServe logo (mobile only — hidden on desktop since left panel shows it)
- Heading: "Create your account"
- Subheading: "Set up your company in under 2 minutes"
- Progress indicator: Step 1 of 2 (Company Info) → Step 2 (Choose Plan)
  - Step 1 fields
  - Step 2 plan selection
  - Single "Start Free Trial" submit button on step 2
- "Already have an account? Sign in" link below the form

==================================================
FORM — STEP 1: COMPANY INFORMATION
==================================================

Fields (in this order):

1. Company Name \*
   - Placeholder: "Your Company LLC"
   - Validation: required, min 2 chars, max 100 chars

2. Full Name \*
   - Placeholder: "Ahmed Al Maktoum"
   - Validation: required, min 2 chars, max 100 chars

3. Work Email \*
   - Placeholder: "ahmed@company.com"
   - Validation: required, valid email format
   - Helper text: "We'll send your login details here"

4. Phone Number \*
   - Placeholder: "+971 50 123 4567"
   - Validation: required, min 7 chars

5. Password \*
   - Placeholder: "Create a strong password"
   - Show/hide toggle (eye icon)
   - Validation: required, min 8 chars, must contain uppercase, lowercase, number
   - Strength indicator bar below field (Weak / Fair / Strong / Very Strong)

6. Confirm Password \*
   - Placeholder: "Repeat your password"
   - Show/hide toggle
   - Validation: must match password

7. Country/Emirate (select dropdown)
   - Options: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah, Other
   - Default: Dubai

"Next: Choose Plan →" button to proceed to Step 2.
Validate all Step 1 fields before allowing Next.

==================================================
FORM — STEP 2: CHOOSE YOUR PLAN
==================================================

Layout:

- Heading: "Choose your plan"
- Subheading: "All plans include a 15-day free trial. No credit card required."
- Display 3 plan cards horizontally (stack vertically on mobile)
- Each card shows:
  - Plan name
  - Price (AED X/month after trial — or "Free" for Starter during trial)
  - Badge if applicable
  - Feature list with checkmarks
  - "Select" button or highlighted border when selected
- Selected plan has: highlighted border (primary color), checkmark icon on card, filled select button
- Terms checkbox:
  - "I agree to OptifyServe Terms of Service and Privacy Policy"
  - Terms and Privacy Policy are clickable links (no-op in template mode)
  - Validation: must be checked to submit
- "← Back" link to go back to Step 1
- "Start Free Trial" submit button (full width, primary color)
  - Shows loading spinner for 1.5s on click
  - Then redirects to /dashboard

==================================================
TEMPLATE MODE BEHAVIOR
==================================================

Since there is no backend yet, simulate the signup:

onSubmit:

1. Validate all fields with Zod
2. Set isLoading = true
3. Show spinner on button: "Creating your account..."
4. Wait 1500ms (simulate API call)
5. Create a mock user object matching the User type in auth-context.tsx:
   {
   id: 'usr*new_001',
   email: formData.email,
   name: formData.fullName,
   role: 'admin',
   permissions: [...all admin permissions],
   companyId: 'comp_new_001',
   companyName: formData.companyName,
   tenantId: 'tenant_new_001',
   phone: formData.phone,
   trialEndsAt: new Date(Date.now() + 15 * 24 _ 60 _ 60 \_ 1000).toISOString(),
   selectedPlan: formData.selectedPlan,
   }
6. Store in localStorage (same key as login)
7. Show success toast: "Welcome to OptifyServe! Your 15-day trial has started."
8. Navigate to /dashboard
9. isLoading = false

==================================================
TRIAL BANNER ON DASHBOARD
==================================================

After signup, the user should see a trial banner.
Add a TrialBanner component to the AppLayout that:

- Only shows when user has trialEndsAt in their profile
- Shows: "🎉 Your 15-day free trial is active. X days remaining. Upgrade now →"
- Banner color: amber/warning background
- "Upgrade now" is a link to /settings (or no-op in template mode)
- Has a dismiss (X) button — dismissed state saved to localStorage
- Position: below TopNav, above page content
- Does NOT show on login or signup pages

==================================================
ROUTING
==================================================

Add to frontend/src/app/App.tsx:

- /signup → SignupPage (PUBLIC route, no auth required)
- If already authenticated and visits /signup → redirect to /dashboard

The /signup route must be accessible without login.
It sits alongside /login and /forgot-password as a public route.

==================================================
TRANSLATIONS
==================================================

Add all new strings to both:

- frontend/src/i18n/locales/en.json
- frontend/src/i18n/locales/ar.json

Add under namespace "auth":

- auth.createAccount
- auth.companyInfo
- auth.choosePlan
- auth.companyName
- auth.fullName
- auth.workEmail
- auth.phoneNumber
- auth.password
- auth.confirmPassword
- auth.emirate
- auth.nextChoosePlan
- auth.backToCompanyInfo
- auth.startFreeTrial
- auth.creatingAccount
- auth.alreadyHaveAccount
- auth.signInHere
- auth.trialHeadline
- auth.trialSubheadline
- auth.noCardRequired
- auth.agreeToTerms
- auth.termsOfService
- auth.privacyPolicy
- auth.passwordStrengthWeak
- auth.passwordStrengthFair
- auth.passwordStrengthStrong
- auth.passwordStrengthVeryStrong
- auth.step1of2
- auth.step2of2
- auth.selectPlan
- auth.selected
- auth.perMonthAfterTrial
- auth.allPlansIncludeTrial
- auth.welcomeToast (Welcome to OptifyServe! Your 15-day trial has started.)

Add under namespace "common":

- common.trialBanner (🎉 Your free trial is active. {days} days remaining.)
- common.upgradeNow
- common.dismissBanner

Arabic translations: provide English text as fallback for all new keys (same as existing pattern in ar.json).

==================================================
VALIDATION SCHEMA
==================================================

Add to frontend/src/lib/validations.ts:

signupStep1Schema — validates company name, full name, email, phone, password, confirm password, emirate
signupStep2Schema — validates selectedPlan (enum: 'starter' | 'standard' | 'premium'), agreeToTerms (must be true)
signupSchema — full combined schema (step1 + step2)

Export all three.

==================================================
FILES TO CREATE
==================================================

Create these new files:

1. frontend/src/features/auth/pages/signup-page.tsx
   — Main page component with two-panel layout

2. frontend/src/features/auth/components/signup-form.tsx
   — Multi-step form with step management (Step 1 + Step 2)

3. frontend/src/features/auth/components/plan-selector.tsx
   — The 3 plan cards component for Step 2

4. frontend/src/features/auth/components/password-strength.tsx
   — Password strength indicator bar with label

5. frontend/src/components/shared/trial-banner.tsx
   — Trial countdown banner for AppLayout

==================================================
FILES TO MODIFY
==================================================

Modify these existing files:

1. frontend/src/app/App.tsx
   — Add /signup public route

2. frontend/src/contexts/auth-context.tsx
   — Add register() function matching the login() pattern
   — Add trialEndsAt and selectedPlan to User type if not already there

3. frontend/src/components/layout/app-layout.tsx
   — Import and render <TrialBanner /> below TopNav

4. frontend/src/lib/validations.ts
   — Add the three new Zod schemas

5. frontend/src/i18n/locales/en.json
   — Add all new translation keys

6. frontend/src/i18n/locales/ar.json
   — Add all new translation keys

7. frontend/src/features/auth/components/index.ts (barrel export)
   — Export SignupForm, PlanSelector, PasswordStrength

8. frontend/src/features/auth/pages/index.ts (barrel export)
   — Export SignupPage

9. frontend/src/components/shared/index.ts (barrel export)
   — Export TrialBanner

==================================================
DESIGN RULES
==================================================

- Match existing OptifyServe branding exactly (primary blue #1D4ED8, emerald, orange)
- Use Inter font (already loaded)
- Use only shadcn/ui components already installed (Button, Input, Label, Card, Badge, Checkbox, Select, Progress, Separator)
- Use Lucide React icons (Building2, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, Shield, Clock, Zap)
- Use Tailwind CSS only — no inline styles
- Use logical Tailwind properties (ms-_, me-_, ps-_, pe-_) for RTL support
- All strings via useTranslation() — no hardcoded English strings
- Loading states on submit button
- Error states under each field (react-hook-form + Zod)
- Fully responsive: mobile-first
  - Mobile: single column, no left panel
  - Tablet: single column, no left panel
  - Desktop (lg+): split screen

==================================================
DO NOT DO
==================================================

- Do not make any API calls
- Do not install new npm packages
- Do not modify any existing page other than what is listed in FILES TO MODIFY
- Do not change the login page
- Do not change the theme system
- Do not change any Redux store
- Do not hardcode any UI strings — use t() for everything

==================================================
IMPLEMENTATION ORDER
==================================================

Follow this order exactly. Do not skip any step. Do not merge steps.

PHASE A — FRONTEND IMPLEMENTATION

1. Add Zod schemas to frontend/src/lib/validations.ts
2. Add translation keys to frontend/src/i18n/locales/en.json
3. Add translation keys to frontend/src/i18n/locales/ar.json
4. Update User type and add register() to frontend/src/contexts/auth-context.tsx
5. Create frontend/src/features/auth/components/password-strength.tsx
6. Create frontend/src/features/auth/components/plan-selector.tsx
7. Create frontend/src/features/auth/components/signup-form.tsx
8. Create frontend/src/features/auth/pages/signup-page.tsx
9. Create frontend/src/components/shared/trial-banner.tsx
10. Add /signup route to frontend/src/app/App.tsx
11. Add <TrialBanner /> to frontend/src/components/layout/app-layout.tsx
12. Update all barrel exports

PHASE B — FRONTEND TESTING
(Run all tests before touching any spec file)

PHASE C — SPEC FILE UPDATES
(Only after all tests pass)

==================================================
PHASE B — FRONTEND TESTING (MANDATORY)
==================================================

After completing all frontend implementation, run the following tests.
Do not proceed to Phase C until every test passes.
Report the result of each test as PASS or FAIL.

--- TEST GROUP 1: ROUTING ---

TEST-01: Public access to /signup

- Action: Visit /signup without being logged in
- Expected: Signup page loads correctly, no redirect
- Pass condition: Page renders with split-screen layout

TEST-02: Auth guard on /signup

- Action: Log in first, then visit /signup directly
- Expected: Redirected to /dashboard automatically
- Pass condition: User never sees the signup form when already authenticated

TEST-03: Navigation links

- Action: On signup page, click "Already have an account? Sign in"
- Expected: Navigates to /login
- Pass condition: Login page loads

TEST-04: Back navigation from Step 2

- Action: Complete Step 1, reach Step 2, click "← Back"
- Expected: Returns to Step 1 with all Step 1 data still filled in
- Pass condition: Form data is preserved, not reset

--- TEST GROUP 2: FORM VALIDATION (STEP 1) ---

TEST-05: Empty form submission

- Action: Click "Next: Choose Plan →" with all fields empty
- Expected: Validation errors appear under each required field
- Pass condition: At least 6 error messages visible, no navigation to Step 2

TEST-06: Invalid email

- Action: Enter "notanemail" in Work Email field, click Next
- Expected: Email validation error appears
- Pass condition: Error message shown, stays on Step 1

TEST-07: Password too short

- Action: Enter "abc123" (less than 8 chars) in Password, click Next
- Expected: Password validation error shown
- Pass condition: Error message shown, stays on Step 1

TEST-08: Password missing uppercase

- Action: Enter "password123" (no uppercase) in Password, click Next
- Expected: Password strength validation error shown
- Pass condition: Error message shown, stays on Step 1

TEST-09: Passwords do not match

- Action: Enter "Password123" and "Password456" in the two password fields, click Next
- Expected: Confirm password mismatch error shown
- Pass condition: Error message shown, stays on Step 1

TEST-10: Password strength indicator

- Action: Type progressively stronger passwords:
  - "pass" → should show Weak (red)
  - "password1" → should show Fair (orange)
  - "Password1" → should show Strong (yellow-green)
  - "Password1!" → should show Very Strong (green)
- Expected: Strength bar and label update in real time
- Pass condition: All 4 strength levels display correctly

TEST-11: Valid Step 1 submission

- Action: Fill all Step 1 fields correctly with valid data, click Next
- Expected: Navigates to Step 2 without errors
- Pass condition: Plan selector is visible, Step 1 form is hidden

--- TEST GROUP 3: FORM VALIDATION (STEP 2) ---

TEST-12: Submit without selecting plan

- Action: On Step 2, do not select a plan (or deselect), click "Start Free Trial"
- Expected: Validation error asking user to select a plan
- Pass condition: Error shown, stays on Step 2

TEST-13: Submit without accepting terms

- Action: Select a plan but leave terms checkbox unchecked, click "Start Free Trial"
- Expected: Validation error on the terms checkbox
- Pass condition: Error shown, stays on Step 2

TEST-14: Plan selection UI

- Action: Click each of the 3 plan cards one at a time
- Expected: Clicked card gets highlighted border, checkmark icon, selected state
- Pass condition: Only one plan selected at a time, visual state updates correctly

TEST-15: Default plan preselected

- Action: Load Step 2 without clicking anything
- Expected: Starter plan is already selected by default
- Pass condition: Starter card shows selected visual state on load

--- TEST GROUP 4: SIGNUP SUBMISSION ---

TEST-16: Loading state on submit

- Action: Fill entire form correctly, click "Start Free Trial"
- Expected: Button shows spinner and text changes to "Creating your account..."
- Pass condition: Loading state visible for ~1.5 seconds

TEST-17: Success toast

- Action: Complete full valid signup
- Expected: Toast notification appears: "Welcome to OptifyServe! Your 15-day trial has started."
- Pass condition: Toast visible after submit

TEST-18: Redirect after signup

- Action: Complete full valid signup
- Expected: Navigates to /dashboard after ~1.5s
- Pass condition: Dashboard page loads, URL is /dashboard

TEST-19: User stored in localStorage

- Action: Complete signup, open browser devtools → Application → localStorage
- Expected: User object stored with trialEndsAt, selectedPlan, companyName fields
- Pass condition: All three new fields present in stored user object

--- TEST GROUP 5: TRIAL BANNER ---

TEST-20: Banner visible after signup

- Action: Complete signup, land on /dashboard
- Expected: Amber trial banner visible below TopNav
- Pass condition: Banner shows with days remaining (15) and "Upgrade now" link

TEST-21: Banner on other pages

- Action: Navigate to /crm/customers, /sales/invoices, /hr/employees
- Expected: Trial banner visible on all authenticated pages
- Pass condition: Banner persists across navigation

TEST-22: Banner not on auth pages

- Action: Log out, visit /login and /signup
- Expected: Trial banner is NOT visible
- Pass condition: No banner on public pages

TEST-23: Banner dismiss

- Action: Click the X button on the trial banner
- Expected: Banner disappears immediately
- Pass condition: Banner hidden after click

TEST-24: Banner dismiss persists

- Action: Dismiss banner, navigate to another page, come back
- Expected: Banner stays dismissed
- Pass condition: localStorage stores dismissed state, banner does not reappear

TEST-25: Banner shows correct days

- Action: Check the trial banner text
- Expected: Shows "15 days remaining" for a new signup
- Pass condition: Number matches expected trial length

--- TEST GROUP 6: RESPONSIVENESS ---

TEST-26: Mobile layout (375px)

- Action: Resize browser to 375px width
- Expected: Left branding panel hidden, form takes full width, plan cards stack vertically
- Pass condition: No horizontal scroll, all form elements visible and usable

TEST-27: Tablet layout (768px)

- Action: Resize browser to 768px width
- Expected: Left panel still hidden, form centered, plan cards stack vertically
- Pass condition: Layout looks clean, no overflow

TEST-28: Desktop layout (1280px+)

- Action: Resize browser to 1280px width
- Expected: Split screen visible — left branding panel + right form
- Pass condition: Both panels visible, correct proportions

--- TEST GROUP 7: BILINGUAL / RTL ---

TEST-29: Arabic language

- Action: Switch language to Arabic using the language switcher
- Expected: Signup page text switches to Arabic, layout mirrors to RTL
- Pass condition: Form fields, labels, buttons all in Arabic, layout direction correct

TEST-30: No raw translation keys visible

- Action: In both English and Arabic, scan the entire signup page and trial banner
- Expected: No raw keys like "auth.startFreeTrial" visible anywhere
- Pass condition: All strings show actual translated text

--- TEST COMPLETION GATE ---

All 30 tests must PASS before moving to Phase C.
If any test FAILS:

- Fix the issue immediately
- Re-run only the failed test
- Do not proceed to Phase C until all 30 pass
- Document any deviation from expected behavior

==================================================
PHASE C — UPDATE SPEC FILES (AFTER TESTS PASS)
==================================================

After all 30 tests pass, update the following spec files to reflect
what was actually implemented. Do not update specs before tests pass.

--- UPDATE 1: backend/BACKEND_SPECIFICATION.md ---

Find the Auth module section and add or update:

A. Add new API endpoint: POST /api/v1/auth/register
Document it as:
POST /api/v1/auth/register
Body: {
companyName: string,
fullName: string,
email: string,
phone: string,
password: string,
emirate: string,
selectedPlan: 'starter' | 'standard' | 'premium'
}
Response: {
user: User,
tokens: { accessToken: string, refreshToken: string },
tenant: { id: string, name: string, plan: string, trialEndsAt: string }
}
Notes:

- Creates a new tenant record
- Creates the first user as role: 'admin'
- Sets trialEndsAt = now + 15 days
- Sends welcome email via Nodemailer (queue via BullMQ)
- Returns JWT access token (15min) + refresh token (7d)

B. Add to the Tenant Strategy section:

- Trial tenants are created via /register endpoint
- Trial period: 15 days from registration
- trialEndsAt stored on tenant record
- After trial expires: read-only mode (block write operations via middleware)
- Plan upgrade clears trialEndsAt and sets active subscription

C. Add to the BullMQ Queue Jobs section:

- QUEUE JOB: send-welcome-email
  Triggered by: successful registration
  Payload: { email, fullName, companyName, trialEndsAt, selectedPlan }
  Handler: Nodemailer welcome email with trial details

D. Add to the Subscription Plans section (create if it does not exist):
Plans:

- starter: CRM + Sales + Dashboard, up to 5 users
- standard: starter + Inventory + Purchase + Accounts, up to 20 users
- premium: all modules, unlimited users
  All plans: 15-day free trial on registration

--- UPDATE 2: database/DATABASE_SPECIFICATION.md ---

Find the tenants table definition and add or update these fields:

A. Add to tenants table:

- selected_plan: ENUM ('starter', 'standard', 'premium') NOT NULL DEFAULT 'starter'
- trial_ends_at: TIMESTAMPTZ — set to NOW() + INTERVAL '15 days' on insert
- trial_started_at: TIMESTAMPTZ — set to NOW() on insert
- is_trial_active: BOOLEAN — computed or updated by trigger
- subscription_status: ENUM ('trial', 'active', 'expired', 'cancelled') DEFAULT 'trial'

B. Add to the Enum Strategy section:
Add these new enums:

- subscription_plan: 'starter', 'standard', 'premium'
- subscription_status: 'trial', 'active', 'expired', 'cancelled'

C. Add to the Seed Strategy section:

- Default seed now includes one trial tenant (matching the template mode mock user)
- Trial tenant has: plan = 'starter', trial_ends_at = NOW() + 15 days

D. Add to the Triggers section:

- TRIGGER: on tenants INSERT, auto-set trial_ends_at = NOW() + INTERVAL '15 days'
- TRIGGER: on tenants UPDATE, recompute is_trial_active = (trial_ends_at > NOW())

E. Add to the Index Strategy section:

- INDEX on tenants(trial_ends_at) — for scheduled job that expires trials
- INDEX on tenants(subscription_status) — for filtering active vs expired tenants

F. Add a new section: Trial Expiry Strategy

- A BullMQ scheduled job runs daily
- Finds all tenants where trial_ends_at < NOW() AND subscription_status = 'trial'
- Updates subscription_status = 'expired'
- Sends expiry notification email via Nodemailer

--- UPDATE 3: frontend/FRONTEND_ANALYSIS.md ---

Add a new section at the bottom titled:
"## Signup & Trial System (Added Post-Analysis)"

Content to add:

- Route: /signup (public, no auth required)
- Creates: new tenant + first admin user
- Form: 2-step (Company Info → Plan Selection)
- Plans: starter, standard, premium (all 15-day trial)
- Trial banner: shown on all authenticated pages, dismissible
- New frontend files: signup-page.tsx, signup-form.tsx, plan-selector.tsx, password-strength.tsx, trial-banner.tsx
- New User fields: trialEndsAt, selectedPlan
- New Zod schemas: signupStep1Schema, signupStep2Schema, signupSchema
- New translation keys: 30 keys added to auth and common namespaces
- Backend implication: POST /api/v1/auth/register creates tenant + admin user + starts trial
- Database implication: tenants table needs trial fields (trial_ends_at, subscription_status, selected_plan)

--- SPEC UPDATE RULES ---

- Only add or update — do not delete existing content from spec files
- Preserve all existing formatting and section structure
- Add a note at the top of each updated section:
  "Updated: Signup & Trial system added [date]"
- Do not change anything unrelated to the signup feature
- If a section does not exist yet in the spec file, create it at the end

==================================================
AFTER COMPLETING ALL THREE PHASES
==================================================

Output a final completion report in this exact format:

---

SIGNUP PAGE — COMPLETION REPORT

PHASE A — FRONTEND IMPLEMENTATION
Files created: [list each file]
Files modified: [list each file]
Status: COMPLETE

PHASE B — FRONTEND TESTING
Tests passed: [N] / 30
Tests failed: [N] / 30
Failed tests: [list any that failed, or "None"]
Status: [ALL PASSED / SOME FAILED]

PHASE C — SPEC UPDATES
backend/BACKEND_SPECIFICATION.md: [UPDATED / SKIPPED — reason]
database/DATABASE_SPECIFICATION.md: [UPDATED / SKIPPED — reason]
frontend/FRONTEND_ANALYSIS.md: [UPDATED / SKIPPED — reason]
Status: COMPLETE

DEVIATIONS FROM SPEC
[List any deviation from this prompt and why, or "None"]

READY FOR BACKEND IMPLEMENTATION: [YES / NO]
If NO, state what is blocking.

---
