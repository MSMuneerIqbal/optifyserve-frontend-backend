# Responsive Design Requirements

## Critical Requirement: Fully Responsive

**EVERY component, EVERY page, EVERY module MUST be fully responsive.**

This is **NOT optional**. This is an **enterprise SaaS application** that users will access from:

- Mobile phones (iPhone, Android)
- Tablets (iPad, Android tablets)
- Laptops (13", 15", 17")
- Desktop monitors (24", 27", 32"+)

### Accessibility Compliance

Responsive design must also meet **WCAG 2.2 Level AA** requirements:
- **SC 2.5.8 Target Size (Minimum)**: Interactive elements must be at least 24x24 CSS pixels, with 44x44px recommended
- **SC 1.4.4 Resize Text**: Content must be readable at 200% zoom without loss of functionality
- **SC 1.4.10 Reflow**: Content must reflow at 320px width (400% zoom) without horizontal scrolling

---

## Mandatory Responsive Breakpoints

Use Tailwind CSS responsive prefixes:

```typescript
// Mobile First Approach
// Default (no prefix): Mobile (375px+)
// sm: Tablet (640px+)
// md: Tablet Landscape (768px+)
// lg: Desktop (1024px+)
// xl: Large Desktop (1280px+)
// 2xl: Extra Large (1536px+)
```

### Test At These EXACT Sizes:

- **Mobile (Portrait):** 375px x 667px (iPhone SE)
- **Mobile (Large):** 430px x 932px (iPhone 15/16 Pro Max)
- **Tablet (Portrait):** 768px x 1024px (iPad)
- **Tablet (Landscape):** 1024px x 768px (iPad Landscape)
- **Laptop:** 1366px x 768px (Common laptop)
- **Desktop:** 1920px x 1080px (Full HD)
- **Large Desktop:** 2560px x 1440px (2K)

---

## Responsive Design Rules

### Rule 1: Mobile-First Approach

**ALWAYS start with mobile layout, then scale up:**

```tsx
// ❌ WRONG - Desktop first
<div className="grid-cols-4 md:grid-cols-2 sm:grid-cols-1">

// ✅ CORRECT - Mobile first
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### Rule 2: Grid Systems Must Adapt

```tsx
// KPI Cards Example
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 column mobile, 2 tablet, 4 desktop */}
</div>

// Data Table Example
<div className="overflow-x-auto"> {/* Scroll on mobile */}
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>
```

### Rule 3: Navigation Must Adapt

**Desktop:** Full sidebar (280px width)  
**Tablet:** Collapsed sidebar (64px width) OR hidden with hamburger  
**Mobile:** Hidden sidebar, hamburger menu opens as drawer

```tsx
// Sidebar component
<aside className="
  hidden           // Hidden on mobile
  lg:block        // Visible on desktop
  w-64            // Full width on desktop
  md:w-16         // Collapsed on tablet
">
```

### Rule 4: Typography Scales

```tsx
// Page Titles
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Dashboard
</h1>

// Body Text
<p className="text-sm md:text-base">
  Content here
</p>
```

### Rule 5: Spacing Scales

```tsx
// Padding
<div className="p-4 md:p-6 lg:p-8">

// Gaps
<div className="gap-2 md:gap-4 lg:gap-6">
```

### Rule 6: Touch Targets (Mobile)

**Minimum touch target: 44x44px (Apple HIG / WCAG 2.2 recommended) or 48x48dp (Material Design 3)**

WCAG 2.2 SC 2.5.8 Level AA requires minimum 24x24px, but 44x44px is strongly recommended for enterprise apps.

```tsx
// Buttons
<button className="
  h-12         // 48px height minimum
  px-6        // Adequate padding
  text-base   // Readable text size
">
  Click Me
</button>

// Icon buttons
<button className="
  w-12 h-12   // 48x48px minimum
  flex items-center justify-center
">
  <Icon className="w-6 h-6" />
</button>
```

### Rule 7: Forms Must Be Mobile-Friendly

```tsx
// Input fields
<input className="
  h-12                    // Tall enough for touch
  text-base              // 16px+ (prevents iOS zoom)
  w-full                 // Full width on mobile
  px-4                   // Good padding
" />

// Labels
<label className="
  text-sm md:text-base   // Readable on all devices
  mb-2                   // Space above input
  block                  // Full width
">
  Email Address
</label>
```

### Rule 8: Modals/Dialogs Must Adapt

```tsx
// Desktop: 600px width, centered
// Mobile: Full screen OR 90% width

<Dialog>
  <DialogContent className="
    w-full              // Full width on mobile
    max-w-lg           // Max 512px on desktop
    h-auto             // Auto height
    max-h-[90vh]       // Max 90% viewport height
    overflow-y-auto    // Scroll if content too long
  ">
```

### Rule 9: Data Tables Must Be Responsive

**Option A: Horizontal Scroll**

```tsx
<div className="overflow-x-auto">
  <table className="min-w-full">{/* Table content */}</table>
</div>
```

**Option B: Card View on Mobile**

```tsx
// Desktop: Table
// Mobile: Stacked cards

<div className="hidden md:block">
  <table>{/* Desktop table */}</table>
</div>

<div className="md:hidden space-y-4">
  {items.map(item => (
    <Card key={item.id}>
      {/* Mobile card layout */}
    </Card>
  ))}
</div>
```

### Rule 10: Images Must Be Responsive

```tsx
<img
  src="/logo.png"
  alt="Company Logo"
  className="
    w-32 md:w-40 lg:w-48    // Scales with viewport
    h-auto                   // Maintain aspect ratio
    object-contain           // Proper scaling
  "
/>
```

---

## Testing Checklist (Every Component)

Before marking a component as "done", test at ALL these sizes:

### Mobile (375px):

- [ ] All text is readable (no text cut off)
- [ ] All buttons are tappable (44×44px minimum)
- [ ] No horizontal scroll (unless intentional like tables)
- [ ] Images fit properly
- [ ] Forms are usable (inputs big enough)
- [ ] Navigation works (hamburger menu)
- [ ] Cards stack vertically
- [ ] Spacing looks good

### Tablet (768px):

- [ ] Layout uses more horizontal space
- [ ] Sidebar visible or collapsed appropriately
- [ ] Grids show 2 columns (where applicable)
- [ ] Typography scales up slightly
- [ ] Touch targets still adequate

### Desktop (1920px):

- [ ] Layout doesn't stretch too wide (max-width applied)
- [ ] Sidebar fully visible (280px)
- [ ] Grids show 4 columns (where applicable)
- [ ] Content is centered or properly aligned
- [ ] No wasted white space

---

## Specific Component Responsive Requirements

### Sidebar

```tsx
// Mobile: Hidden, hamburger menu
// Tablet: Collapsed (64px, icons only)
// Desktop: Full width (280px, icons + text)

<aside className="
  fixed left-0 top-0 h-screen
  w-64                          // Desktop: 280px
  lg:w-64
  md:w-16                      // Tablet: 64px (collapsed)
  -translate-x-full            // Mobile: Hidden
  lg:translate-x-0             // Desktop: Visible
  transition-transform
  bg-sidebar                   // Use CSS variable (not bg-slate-900)
  z-50
">
```

### Top Navigation

```tsx
// Mobile: Minimal (logo + hamburger)
// Desktop: Full (breadcrumb + search + actions)

<nav className="h-16 flex items-center justify-between px-4">
  {/* Mobile: Just logo + hamburger */}
  <div className="flex items-center gap-4">
    <button className="lg:hidden">
      <MenuIcon />
    </button>
    <Logo />
  </div>

  {/* Desktop: Full navigation */}
  <div className="hidden lg:flex items-center gap-6">
    <Breadcrumb />
    <Search />
    <Notifications />
    <UserMenu />
  </div>
</nav>
```

### Dashboard KPI Cards

```tsx
<div
  className="
  grid 
  grid-cols-1        // Mobile: 1 column
  sm:grid-cols-2     // Tablet: 2 columns
  lg:grid-cols-4     // Desktop: 4 columns
  gap-4 md:gap-6
"
>
  {kpiCards.map((card) => (
    <KPICard key={card.id} {...card} />
  ))}
</div>
```

### Charts

```tsx
// Mobile: Full width, 250px height
// Desktop: Full width, 400px height

<ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
  <LineChart data={data}>{/* Chart configuration */}</LineChart>
</ResponsiveContainer>
```

### Forms

```tsx
// Mobile: Stacked vertically
// Desktop: Two columns

<form className="space-y-6">
  <div
    className="
    grid 
    grid-cols-1         // Mobile: 1 column
    md:grid-cols-2      // Desktop: 2 columns
    gap-4 md:gap-6
  "
  >
    <div>
      <label>First Name</label>
      <input className="h-12 w-full" />
    </div>
    <div>
      <label>Last Name</label>
      <input className="h-12 w-full" />
    </div>
  </div>
</form>
```

### Data Tables

```tsx
// Mobile: Horizontal scroll OR card view
// Desktop: Full table

// Option 1: Scroll
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <table className="min-w-full">
    {/* Table */}
  </table>
</div>

// Option 2: Responsive cards
<div className="block md:hidden">
  {/* Mobile card view */}
</div>
<div className="hidden md:block">
  {/* Desktop table view */}
</div>
```

### Modals/Dialogs

```tsx
<Dialog>
  <DialogContent className="
    w-[95vw]           // Mobile: 95% of viewport
    md:w-auto          // Desktop: Auto width
    max-w-2xl          // Max 672px
    max-h-[90vh]       // Max 90% of viewport height
    overflow-y-auto    // Scroll if needed
  ">
```

---

## Mobile-Specific Considerations

### 1. Hamburger Menu Implementation

```tsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

// Hamburger button (mobile only)
<button
  className="lg:hidden"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  <MenuIcon />
</button>

// Mobile menu drawer
{mobileMenuOpen && (
  <div className="fixed inset-0 z-50 lg:hidden">
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/50"
      onClick={() => setMobileMenuOpen(false)}
    />

    {/* Menu content */}
    <nav className="fixed inset-y-0 start-0 w-64 bg-background">
      {/* Navigation items — uses logical start for RTL support */}
    </nav>
  </div>
)}
```

### 2. Bottom Navigation (Optional for Mobile)

```tsx
// Alternative mobile navigation pattern
<nav
  className="
  fixed bottom-0 inset-x-0
  lg:hidden                      // Only on mobile
  h-16
  bg-background border-t         // Use CSS variable (not bg-white)
  flex items-center justify-around
"
>
  <button>Dashboard</button>
  <button>Customers</button>
  <button>Jobs</button>
  <button>More</button>
</nav>
```

### 3. Swipe Gestures (Future Enhancement)

- Swipe to delete items in lists
- Swipe to open side panels
- Pull to refresh

### 4. Mobile-Optimized Inputs

```tsx
// Prevent iOS zoom on focus
<input
  type="email"
  className="text-base"  // 16px+ prevents zoom
  inputMode="email"      // Shows email keyboard
/>

<input
  type="tel"
  inputMode="tel"        // Shows number pad
/>

<input
  type="number"
  inputMode="numeric"    // Shows numeric keyboard
/>
```

---

## Common Responsive Mistakes to Avoid

### Don't Do This:

```tsx
// Fixed widths
<div className="w-[1200px]">  // ❌ Will overflow on small screens

// Hardcoded pixel values for text
<h1 style={{fontSize: '32px'}}> // ❌ Won't scale

// No overflow handling on tables
<table>...</table>  // ❌ Will break layout on mobile

// Tiny touch targets
<button className="w-6 h-6">  // ❌ Too small to tap

// Desktop-only assumptions
<div className="flex">  // ❌ Might need to stack on mobile
```

### Do This Instead:

```tsx
// Responsive widths
<div className="w-full max-w-7xl mx-auto px-4">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Overflow handling
<div className="overflow-x-auto">
  <table className="min-w-full">...</table>
</div>

// Adequate touch targets
<button className="w-12 h-12">

// Responsive flex direction
<div className="flex flex-col md:flex-row">
```

---

## Definition of Done

Before marking ANY component as complete, verify:

- [ ] **Tested at 375px** (iPhone SE)
- [ ] **Tested at 768px** (iPad Portrait)
- [ ] **Tested at 1024px** (iPad Landscape / Small laptop)
- [ ] **Tested at 1920px** (Full HD Desktop)
- [ ] All text is readable at all sizes
- [ ] All buttons/links are tappable (44×44px minimum)
- [ ] No horizontal overflow (unless intentional)
- [ ] Navigation works on mobile (hamburger menu)
- [ ] Forms are usable on mobile (inputs 48px+ height)
- [ ] Images scale properly
- [ ] Spacing looks good at all sizes
- [ ] No layout breaks at any breakpoint
- [ ] Tested in both portrait and landscape (mobile/tablet)

---

## Debugging Responsive Issues

### In Chrome DevTools:

1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Test these presets:
   - iPhone SE (375x667)
   - iPhone 15 Pro Max (430x932)
   - iPad (768x1024)
   - iPad Pro (1024x1366)
   - Responsive (custom)
4. Toggle between Portrait/Landscape
5. Check "Show media queries" to see breakpoints

### Common Fixes:

**Text Overflow:**

```tsx
<p className="truncate">        // Single line with ellipsis
<p className="line-clamp-2">   // 2 lines with ellipsis
```

**Horizontal Scroll:**

```tsx
<div className="overflow-x-auto">  // Allow scroll
<div className="overflow-hidden">  // Hide overflow
```

**Stack on Mobile:**

```tsx
<div className="flex flex-col md:flex-row gap-4">
```

**Hide on Mobile:**

```tsx
<div className="hidden md:block">  // Only show on desktop
```

**Show Only on Mobile:**

```tsx
<div className="block md:hidden">  // Only show on mobile
```

---

## UAE-Specific Mobile Considerations

### 1. Arabic (RTL) — Already Implemented

This project has **full Arabic RTL support** (EN + AR with automatic layout mirroring). All code MUST use Tailwind logical properties:

```tsx
// CORRECT — logical properties (RTL-safe)
<div className="ms-4">   // margin-inline-start (not margin-left)
<div className="pe-6">   // padding-inline-end (not padding-right)
<div className="start-0"> // inset-inline-start (not left-0)

// WRONG — physical properties (breaks RTL)
<div className="ml-4">   // Never use ml-*, mr-*, pl-*, pr-*, left-*, right-*
```

### 2. WhatsApp Integration (Mobile-Friendly)

```tsx
// WhatsApp click-to-chat
<a
  href={`https://wa.me/971${phoneNumber}?text=Hello`}
  className="flex items-center gap-2 h-12 px-4"
>
  <WhatsAppIcon />
  <span>WhatsApp</span>
</a>
```

### 3. Click-to-Call

```tsx
<a href={`tel:+971${phoneNumber}`} className="text-primary hover:underline">
  {formatPhoneNumber(phoneNumber)}
</a>
```

---

## Summary

**Every single component you build MUST be responsive.**

- Test at 375px, 768px, 1024px, 1920px
- Mobile-first approach
- Touch-friendly (44x44px minimum)
- Proper overflow handling
- Scaled typography
- Adaptive layouts
- No horizontal scroll (unless tables)
- Working navigation on all devices
- RTL layout tested (EN + AR)

**If it's not responsive, it's not done.**
