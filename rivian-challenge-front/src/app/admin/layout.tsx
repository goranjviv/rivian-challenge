'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedTypes={['CompanyAdmin']}>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthGuard>
  );
}