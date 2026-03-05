import { useSyncExternalStore, useCallback } from 'react'

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined'

/**
 * Hook to track media query matches using useSyncExternalStore
 * This avoids the setState-in-useEffect pattern
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (!isBrowser) return () => {}
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', callback)
      return () => mediaQuery.removeEventListener('change', callback)
    },
    [query]
  )

  const getSnapshot = useCallback(() => {
    if (!isBrowser) return false
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// Convenience hooks for common breakpoints
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery('(min-width: 1280px)')
}

// Check if device supports touch
export function useIsTouchDevice(): boolean {
  const subscribe = useCallback(() => {
    // Touch support doesn't change at runtime, so no need to subscribe
    return () => {}
  }, [])

  const getSnapshot = useCallback(() => {
    if (!isBrowser) return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }, [])

  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// Get current breakpoint
export type Breakpoint = 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export function useBreakpoint(): Breakpoint {
  const is2xl = useMediaQuery('(min-width: 1536px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const isSm = useMediaQuery('(min-width: 640px)')

  if (is2xl) return '2xl'
  if (isXl) return 'xl'
  if (isLg) return 'lg'
  if (isMd) return 'md'
  if (isSm) return 'sm'
  return 'mobile'
}
