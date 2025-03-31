import React, { InputHTMLAttributes, useState } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  floatingLabel?: boolean;
  icon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  error,
  helperText,
  className,
  floatingLabel = false,
  icon,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = rest.value && String(rest.value).length > 0;

  if (floatingLabel) {
    return (
      <div className="mb-4 relative">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            id={id}
            className={`
              block w-full rounded-lg border bg-white px-3 py-3 shadow-sm
              transition-all duration-200
              ${icon ? 'pl-10' : 'pl-3'}
              ${error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-300 placeholder-gray-400'}
              ${(isFocused || hasValue) ? 'pt-6 pb-2' : ''}
              ${className}
            `}
            placeholder={!floatingLabel ? label : ''}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => setIsFocused(e.target.value !== '')}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={`${id}-error`}
            {...rest}
          />
          <label
            htmlFor={id}
            className={`
              absolute left-3 pointer-events-none transition-all duration-200
              ${icon ? 'left-10' : 'left-3'}
              ${(isFocused || hasValue)
                ? 'transform -translate-y-3 scale-75 text-indigo-600 top-4'
                : 'top-1/2 -translate-y-1/2 text-gray-500'}
            `}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600" id={`${id}-error`}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500" id={`${id}-description`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`
            block w-full rounded-lg border px-3 py-2.5 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-300 placeholder-gray-400'}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${id}-error`}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500" id={`${id}-description`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormInput;
