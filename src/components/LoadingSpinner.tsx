import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'primary';
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  text,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const variantClasses = {
    light: 'text-white',
    dark: 'text-gray-800',
    primary: 'text-indigo-600',
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className={`absolute inset-0 rounded-full border-2 border-t-transparent animate-spin ${variantClasses[variant]}`}></div>
        <div className={`absolute inset-0 rounded-full border-2 border-b-transparent animate-spin duration-1000 ${variantClasses[variant]}`}></div>
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 opacity-10 animate-pulse"></div>
      </div>
      {text && (
        <p className={`mt-3 text-sm font-medium ${variantClasses[variant]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center animate-fadeIn">
          <div className={`relative ${size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-12 w-12' : 'h-16 w-16'}`}>
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin text-indigo-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-b-transparent animate-spin duration-1000 text-indigo-600"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 opacity-10 animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-700 font-medium">
            {text || 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return spinnerContent;
};

// Additional loading components for different use cases
export const ButtonSpinner: React.FC = () => (
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
);

export const PageLoader: React.FC<{ message?: string }> = ({ message = "Loading page..." }) => (
  <div className="w-full h-64 flex flex-col items-center justify-center">
    <div className="relative h-12 w-12">
      <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin text-indigo-600"></div>
      <div className="absolute inset-0 rounded-full border-4 border-b-transparent animate-spin duration-1000 text-indigo-600"></div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 opacity-10 animate-pulse"></div>
    </div>
    <p className="mt-4 text-gray-500 font-medium">
      {message}
    </p>
  </div>
);

export default LoadingSpinner;
