import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to locale string with full date and time
export function formatDateTime(date: string | Date): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

// Format date to locale string
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format number to locale string
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

// Format distance with unit
export function formatDistance(km: number): string {
  return `${km}km`;
}

// Check if string is valid email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Delay function for testing/demo purposes
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get initials from full name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Route guards
export function isAdminRoute(path: string): boolean {
  return path.startsWith('/admin');
}

export function isEmployeeRoute(path: string): boolean {
  return path.startsWith('/employee');
}

// Local storage helpers
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Error handler
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}