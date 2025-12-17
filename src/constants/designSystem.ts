/**
 * Design System & Theme Configuration
 * Centralized color palette, typography, and spacing
 */

export const COLORS = {
  // Primary - Modern Blue
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb', // Main primary
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Success - Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
  },

  // Warning - Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Danger - Red
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral - Gray
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Info - Light Blue
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
} as const;

export const TYPOGRAPHY = {
  // Headings
  heading: {
    xl: {
      fontSize: '32px',
      lineHeight: '1.2',
      fontWeight: 'bold',
      letterSpacing: '-0.02em',
    },
    lg: {
      fontSize: '28px',
      lineHeight: '1.2',
      fontWeight: 'bold',
      letterSpacing: '-0.01em',
    },
    md: {
      fontSize: '24px',
      lineHeight: '1.2',
      fontWeight: 'bold',
    },
    sm: {
      fontSize: '20px',
      lineHeight: '1.2',
      fontWeight: '600',
    },
    xs: {
      fontSize: '16px',
      lineHeight: '1.2',
      fontWeight: '600',
    },
  },

  // Body text
  body: {
    lg: {
      fontSize: '18px',
      lineHeight: '1.6',
      fontWeight: '400',
    },
    md: {
      fontSize: '16px',
      lineHeight: '1.6',
      fontWeight: '400',
    },
    sm: {
      fontSize: '14px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    xs: {
      fontSize: '12px',
      lineHeight: '1.5',
      fontWeight: '400',
    },
  },

  // Special styles
  label: {
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.5',
  },
  caption: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '1.4',
  },
} as const;

export const SPACING = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
} as const;

export const SIZES = {
  // Touch targets (minimum 44px)
  touch: {
    sm: '32px', // For secondary actions
    md: '44px', // Standard touch target
    lg: '48px', // Large buttons
    xl: '56px', // Extra large
  },

  // Container sizes
  container: {
    mobile: '100%',
    tablet: '720px',
    desktop: '1200px',
  },

  // Sidebar widths
  sidebar: {
    collapsed: '64px',
    expanded: '240px',
  },

  // Card sizes
  card: {
    sm: '280px',
    md: '320px',
    lg: '360px',
  },
} as const;

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
} as const;

export const BORDER_RADIUS = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

/**
 * Theme object combining all design tokens
 */
export const DESIGN_SYSTEM = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  sizes: SIZES,
  shadows: SHADOWS,
  transitions: TRANSITIONS,
  borderRadius: BORDER_RADIUS,
} as const;

/**
 * Get contrast color based on background
 */
export function getContrastColor(backgroundColor: string): string {
  // If dark color, return light text
  // If light color, return dark text
  const rgb = parseInt(backgroundColor.replace('#', ''), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#1f2937' : '#ffffff';
}

/**
 * Status color mapping
 */
export const STATUS_COLORS = {
  success: COLORS.success[600],
  error: COLORS.danger[600],
  warning: COLORS.warning[600],
  info: COLORS.info[600],
  pending: COLORS.warning[600],
  processing: COLORS.info[600],
  completed: COLORS.success[600],
} as const;
