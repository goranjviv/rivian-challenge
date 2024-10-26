'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email);
      onSuccess?.();
    } catch (err) {
      setError('Invalid email');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
  );
}