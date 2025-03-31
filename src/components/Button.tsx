import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  icon,
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
    secondary: 'bg-accent text-accent-foreground hover:bg-accent/80',
    outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  const sizeClasses = {
    sm: 'h-8 rounded-md px-3 text-xs',
    md: 'h-9 px-4 py-2',
    lg: 'h-10 rounded-md px-8',
  };

  const loadingClasses = isLoading ? 'opacity-75 cursor-not-allowed' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';

  const iconClasses = '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loadingClasses,
    widthClasses,
    disabledClasses,
    iconClasses,
    className,
  ].join(' ');

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
