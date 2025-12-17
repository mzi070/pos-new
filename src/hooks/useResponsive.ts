import { useEffect, useState } from 'react';

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Custom hook for responsive design queries
 * Usage: const isMobile = useMediaQuery('md');
 */
export function useMediaQuery(breakpoint: Breakpoint | number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const value = typeof breakpoint === 'number' ? breakpoint : BREAKPOINTS[breakpoint];

    const mediaQuery = window.matchMedia(`(min-width: ${value}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return matches;
}

/**
 * Hook to detect current viewport size
 */
export function useViewport() {
  const isMobile = !useMediaQuery('md');
  const isTablet = useMediaQuery('md') && !useMediaQuery('lg');
  const isDesktop = useMediaQuery('lg');
  const isLandscape = useMediaQuery(1024) && !isMobile;

  return { isMobile, isTablet, isDesktop, isLandscape };
}

/**
 * Hook to detect device orientation
 */
export function useOrientation() {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('orientationchange', handleChange);
    window.addEventListener('resize', handleChange);

    return () => {
      window.removeEventListener('orientationchange', handleChange);
      window.removeEventListener('resize', handleChange);
    };
  }, []);

  return { isPortrait, isLandscape: !isPortrait };
}

/**
 * Hook for touch device detection
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const hasTouch = () => {
      return (
        window.matchMedia('(hover: none)').matches ||
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        (window as any).DocumentTouch !== undefined
      );
    };

    setIsTouch(hasTouch());
  }, []);

  return isTouch;
}

/**
 * Hook for safe area insets (notch, safe area)
 */
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateInsets = () => {
      const root = document.documentElement;
      setInsets({
        top: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-left') || '0'),
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);

    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}
