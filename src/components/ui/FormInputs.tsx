import React, { useState, forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  floatingLabel?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

/**
 * Touch-friendly form input with floating label
 * Minimum height: 44px on mobile, 40px on desktop
 */
export const Input = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      success,
      floatingLabel = false,
      required,
      leftIcon,
      rightIcon,
      onRightIconClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = (props.value as string)?.length > 0;

    return (
      <div className="w-full">
        <div className="relative">
          {label && !floatingLabel && (
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <div className="relative">
            {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{leftIcon}</div>}

            <input
              ref={ref}
              {...props}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              className={`
                w-full h-11 sm:h-10 px-3 py-2 text-base sm:text-sm
                ${leftIcon ? 'pl-10' : ''}
                ${rightIcon ? 'pr-10' : ''}
                border-2 rounded-lg transition
                ${
                  error
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                    : success
                      ? 'border-green-500 focus:border-green-600 focus:ring-green-100'
                      : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900'
                }
                bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                placeholder-slate-400 dark:placeholder-slate-500
                disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed
                ${className}
              `}
            />

            {floatingLabel && label && (
              <label
                className={`
                  absolute left-3 transition-all pointer-events-none
                  ${isFocused || hasValue ? 'text-xs -top-2 bg-white dark:bg-slate-800 px-1' : 'text-base top-2.5'}
                `}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            {rightIcon && (
              <button
                type="button"
                onClick={onRightIconClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {rightIcon}
              </button>
            )}

            {success && !rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                <Check size={20} />
              </div>
            )}

            {error && !rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                <AlertCircle size={20} />
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

type PasswordInputProps = Omit<FormInputProps, 'type'>;

/**
 * Password input with show/hide toggle
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      ref={ref}
      rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      onRightIconClick={() => setShowPassword(!showPassword)}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

/**
 * Touch-friendly select component
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, required, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          {...props}
          className={`
            w-full h-11 sm:h-10 px-3 py-2 text-base sm:text-sm
            border-2 rounded-lg transition
            ${
              error
                ? 'border-red-500 focus:border-red-600'
                : 'border-slate-300 dark:border-slate-600 focus:border-blue-500'
            }
            bg-white dark:bg-slate-800 text-slate-900 dark:text-white
            disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed
            ${className}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Touch-friendly textarea with auto-resize
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, required, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          {...props}
          className={`
            w-full px-3 py-2 text-base sm:text-sm
            border-2 rounded-lg transition min-h-32
            ${
              error
                ? 'border-red-500 focus:border-red-600'
                : 'border-slate-300 dark:border-slate-600 focus:border-blue-500'
            }
            bg-white dark:bg-slate-800 text-slate-900 dark:text-white
            placeholder-slate-400 dark:placeholder-slate-500
            disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed
            resize-vertical
            ${className}
          `}
        />

        {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Accessible checkbox component
 * Touch target: 44px
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex items-start">
      <div className="flex h-11 sm:h-10 items-center">
        <input
          ref={ref}
          type="checkbox"
          {...props}
          className={`
            h-5 w-5 rounded cursor-pointer
            border-2 border-slate-300 dark:border-slate-600
            text-blue-600 focus:ring-blue-500 focus:ring-2
            ${className}
          `}
        />
      </div>
      {label && (
        <label className="ml-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer py-2">{label}</label>
      )}
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/**
 * Accessible radio component
 * Touch target: 44px
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ label, className = '', ...props }, ref) => {
  return (
    <div className="flex items-center h-11 sm:h-10">
      <input
        ref={ref}
        type="radio"
        {...props}
        className={`
          h-5 w-5 cursor-pointer
          border-2 border-slate-300 dark:border-slate-600
          text-blue-600 focus:ring-blue-500 focus:ring-2
          ${className}
        `}
      />
      {label && (
        <label className="ml-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">{label}</label>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

/**
 * Form wrapper with proper spacing
 */
export function Form({ children, onSubmit, className = '' }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
}

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Form group for related fields
 */
export function FormGroup({ children, className = '' }: FormGroupProps) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}
