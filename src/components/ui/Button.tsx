import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

/**
 * Accessible button component
 * Touch target: 44px on mobile, 40px on desktop
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'h-8 sm:h-7 px-3 text-xs sm:text-xs',
    md: 'h-11 sm:h-10 px-4 text-sm sm:text-sm', // 44px mobile, 40px desktop
    lg: 'h-12 sm:h-11 px-6 text-base sm:text-base', // 48px mobile, 44px desktop
  };

  const variantClasses = {
    primary:
      'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-800 dark:active:bg-blue-900 shadow-md hover:shadow-lg',
    secondary:
      'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 active:bg-slate-400 dark:active:bg-slate-500',
    danger:
      'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600 active:bg-red-800 dark:active:bg-red-900',
    success:
      'bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-800 dark:active:bg-green-900',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

interface ButtonGroupProps {
  children: ReactNode;
  direction?: 'row' | 'col';
  className?: string;
}

/**
 * Button group for organizing multiple buttons
 */
export function ButtonGroup({ children, direction = 'row', className = '' }: ButtonGroupProps) {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';

  return (
    <div className={`
      flex ${directionClass} gap-2 sm:gap-3
      flex-wrap sm:flex-nowrap
      ${className}
    `}>
      {children}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

/**
 * Responsive card component
 * Works across all devices with appropriate padding and shadows
 */
export function Card({ children, className = '', hover = false, clickable = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800
        rounded-lg border border-slate-200 dark:border-slate-700
        p-3 sm:p-4 md:p-6
        transition-all duration-200
        ${hover ? 'hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600' : ''}
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card header section
 */
export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`border-b border-slate-200 dark:border-slate-700 pb-3 sm:pb-4 mb-3 sm:mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card body section
 */
export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`space-y-3 sm:space-y-4 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card footer section
 */
export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`border-t border-slate-200 dark:border-slate-700 pt-3 sm:pt-4 mt-3 sm:mt-4 ${className}`}>
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Badge component for status indicators and labels
 */
export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs sm:text-sm',
    lg: 'px-4 py-1.5 text-sm sm:text-base',
  };

  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100',
    primary: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    warning: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
    danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    info: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200',
  };

  return (
    <span className={`
      ${baseClasses}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}

interface AlertProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Alert component for notifications
 */
export function Alert({ children, variant = 'info', title, icon, className = '' }: AlertProps) {
  const variantClasses = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  };

  return (
    <div
      className={`
        border rounded-lg p-3 sm:p-4
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <div className="flex gap-3">
        {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{children}</p>
        </div>
      </div>
    </div>
  );
}

interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

/**
 * Progress bar component
 */
export function Progress({
  value,
  max = 100,
  variant = 'primary',
  showLabel = false,
  className = '',
}: ProgressProps) {
  const percentage = (value / max) * 100;

  const variantClasses = {
    primary: 'bg-blue-600 dark:bg-blue-500',
    success: 'bg-green-600 dark:bg-green-500',
    warning: 'bg-amber-600 dark:bg-amber-500',
    danger: 'bg-red-600 dark:bg-red-500',
  };

  return (
    <div className={className}>
      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${variantClasses[variant]} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{Math.round(percentage)}%</p>}
    </div>
  );
}

interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Divider component
 */
export function Divider({ className = '', orientation = 'horizontal' }: DividerProps) {
  const orientationClass = orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full';

  return (
    <div
      className={`
        bg-slate-200 dark:bg-slate-700
        ${orientationClass}
        ${className}
      `}
    />
  );
}
