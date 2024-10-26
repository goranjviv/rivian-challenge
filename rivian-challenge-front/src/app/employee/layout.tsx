'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedTypes={['Employee']}>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthGuard>
  );
}