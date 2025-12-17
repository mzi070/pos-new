import { type ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main responsive container for page layouts
 * Handles padding and width constraints across devices
 */
export function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  return (
    <div className={`
      w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8
      max-w-7xl
      ${className}
    `}>
      {children}
    </div>
  );
}

interface GridProps {
  children: ReactNode;
  columns?: { mobile: number; tablet: number; desktop: number };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Responsive grid component
 * Defaults: 1 col mobile, 2 col tablet, 3 col desktop
 */
export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '',
}: GridProps) {
  const gapClasses = {
    sm: 'gap-2 md:gap-3',
    md: 'gap-3 md:gap-4 lg:gap-6',
    lg: 'gap-4 md:gap-6 lg:gap-8',
  };

  return (
    <div className={`
      grid
      grid-cols-${columns.mobile}
      md:grid-cols-${columns.tablet}
      lg:grid-cols-${columns.desktop}
      ${gapClasses[gap]}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface FlexProps {
  children: ReactNode;
  direction?: 'row' | 'col';
  justify?: 'start' | 'center' | 'between' | 'around' | 'end';
  items?: 'start' | 'center' | 'end' | 'stretch';
  gap?: 'sm' | 'md' | 'lg';
  wrap?: boolean;
  className?: string;
}

/**
 * Flexible layout component
 */
export function Flex({
  children,
  direction = 'row',
  justify = 'start',
  items = 'center',
  gap = 'md',
  wrap = false,
  className = '',
}: FlexProps) {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    end: 'justify-end',
  };
  const itemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={`
      flex
      ${directionClass}
      ${justifyClasses[justify]}
      ${itemsClasses[items]}
      ${gapClasses[gap]}
      ${wrap ? 'flex-wrap' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface StackProps {
  children: ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Vertical stack component
 */
export function Stack({
  children,
  spacing = 'md',
  fullWidth = true,
  className = '',
}: StackProps) {
  const spacingClasses = {
    xs: 'space-y-2',
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return (
    <div className={`
      flex flex-col
      ${spacingClasses[spacing]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: ReactNode;
  direction?: { mobile: 'row' | 'col'; tablet: 'row' | 'col'; desktop: 'row' | 'col' };
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Stack that changes direction based on breakpoint
 */
export function ResponsiveStack({
  children,
  direction = { mobile: 'col', tablet: 'row', desktop: 'row' },
  spacing = 'md',
  className = '',
}: ResponsiveStackProps) {
  const spacingClasses = {
    sm: 'gap-3 md:gap-4',
    md: 'gap-4 md:gap-5 lg:gap-6',
    lg: 'gap-6 md:gap-7 lg:gap-8',
  };

  return (
    <div className={`
      flex
      flex-${direction.mobile}
      md:flex-${direction.tablet}
      lg:flex-${direction.desktop}
      ${spacingClasses[spacing]}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface HiddenProps {
  children: ReactNode;
  below?: 'sm' | 'md' | 'lg' | 'xl';
  above?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Hide content at specific breakpoints
 */
export function Hidden({ children, below, above }: HiddenProps) {
  const hideClasses = [];

  if (below) {
    const hideMap = {
      sm: 'sm:hidden',
      md: 'md:hidden',
      lg: 'lg:hidden',
      xl: 'xl:hidden',
    };
    hideClasses.push(hideMap[below]);
  }

  if (above) {
    const hideMap = {
      sm: 'hidden sm:block',
      md: 'hidden md:block',
      lg: 'hidden lg:block',
      xl: 'hidden xl:block',
    };
    hideClasses.push(hideMap[above]);
  }

  return <div className={hideClasses.join(' ')}>{children}</div>;
}

/**
 * Show only at specific breakpoint
 */
export function Show({ children, only }: { children: ReactNode; only: 'mobile' | 'tablet' | 'desktop' }) {
  const showClasses = {
    mobile: 'md:hidden',
    tablet: 'hidden md:block lg:hidden',
    desktop: 'hidden lg:block',
  };

  return <div className={showClasses[only]}>{children}</div>;
}

/**
 * Responsive padding component
 */
export function ResponsivePadding({
  children,
  padding = { mobile: 'md', tablet: 'lg', desktop: 'xl' },
  className = '',
}: {
  children: ReactNode;
  padding?: { mobile: 'sm' | 'md' | 'lg' | 'xl'; tablet: 'sm' | 'md' | 'lg' | 'xl'; desktop: 'sm' | 'md' | 'lg' | 'xl' };
  className?: string;
}) {
  const paddingMap = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-6',
  };

  return (
    <div className={`
      ${paddingMap[padding.mobile]}
      md:${paddingMap[padding.tablet]}
      lg:${paddingMap[padding.desktop]}
      ${className}
    `}>
      {children}
    </div>
  );
}

/**
 * Safe area component for notch and safe areas
 */
export function SafeArea({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`
      pt-[max(1rem,env(safe-area-inset-top))]
      pb-[max(1rem,env(safe-area-inset-bottom))]
      pl-[max(1rem,env(safe-area-inset-left))]
      pr-[max(1rem,env(safe-area-inset-right))]
      ${className}
    `}>
      {children}
    </div>
  );
}
