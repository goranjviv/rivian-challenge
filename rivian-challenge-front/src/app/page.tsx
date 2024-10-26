'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.userType === "CompanyAdmin") {
      router.push('/admin/dashboard');
    } else if (user?.userType === "Employee") {
      router.push('/employee/dashboard');
    } else {
      // pass
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email);
      if (user?.userType === 'CompanyAdmin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    } catch (err) {
      setError('Invalid email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500">
              Enter your email to sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm 
                         placeholder:text-gray-400 
                         focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white
                       hover:bg-sky-700 
                       focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}