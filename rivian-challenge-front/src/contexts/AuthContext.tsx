'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserType } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isUser(value: any): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'fullName' in value &&
    'email' in value &&
    'userType' in value &&
    'travelDistanceKm' in value &&
    typeof value.fullName === 'string' &&
    typeof value.email === 'string' &&
    ['Employee', 'CompanyAdmin'].includes(value.userType) &&
    typeof value.travelDistanceKm === 'number'
  );
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/user/me', {
        headers: {
          'Authorization': `VeryWeakAuth ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (isUser(userData)) {
          setUser(userData);
        } else {
          console.error('Invalid user data received');
          localStorage.removeItem('token');
        }
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    }
    
    setLoading(false);
  };

  const login = async (email: string) => {
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token, user } = await response.json();
      
      if (!isUser(user)) {
        throw new Error('Invalid user data received');
      }

      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};