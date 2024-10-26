'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
}

export function Button({
  className = '',
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  ...props
}: Partial<ButtonProps>) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2";
  
  const variantStyles = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : children}
    </button>
  );
}