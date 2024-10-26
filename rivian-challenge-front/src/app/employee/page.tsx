'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EmployeePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard by default
    router.push('/employee/dashboard');
  }, [router]);

  return null;
}