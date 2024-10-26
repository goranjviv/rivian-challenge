'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  onClick?: any;
}

export function Card({
  children,
  className = '',
  title,
  description,
  onClick
}: CardProps) {
  return (
    <div onClick={onClick} className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {(title || description) && (
        <div className="border-b border-gray-200 px-6 py-4">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
}

// Additional subcomponents for more complex card layouts
export function CardHeader({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}