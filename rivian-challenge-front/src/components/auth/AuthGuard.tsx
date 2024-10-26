'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { UserType } from '@/types';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedTypes: UserType[];
}

export function AuthGuard({ children, allowedTypes }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
        return;
      }

      if (!allowedTypes.includes(user.userType)) {
        if (user.userType === 'CompanyAdmin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
        return;
      }
    }
  }, [user, loading, router, allowedTypes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (user && allowedTypes.includes(user.userType)) {
    return <>{children}</>;
  }

  return null;
}