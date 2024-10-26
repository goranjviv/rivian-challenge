'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  className = '',
  label,
  error,
  helperText,
  id,
  ...props
}: InputProps) {
  const inputStyles = `
    block w-full rounded-md border py-2 px-3 text-sm
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
    disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
    ${error ? 'border-red-500' : 'border-gray-200'}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={inputStyles}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}