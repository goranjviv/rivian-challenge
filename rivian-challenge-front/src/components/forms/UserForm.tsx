'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => Promise<void>;
  initialData?: User | null;
  title: string;
}

export function UserForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}: UserFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userType: 'Employee' as const,
    travelDistanceKm: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        email: initialData.email,
        userType: initialData.userType,
        travelDistanceKm: initialData.travelDistanceKm
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        userType: 'Employee',
        travelDistanceKm: 0
      });
    }
    setError(null);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Type
            </label>
            <select
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value as 'Employee' | 'CompanyAdmin' })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                       disabled:bg-gray-50 disabled:text-gray-500"
              required
              disabled={isSubmitting}
            >
              <option value="Employee">Employee</option>
              <option value="CompanyAdmin">Company Admin</option>
            </select>
          </div>

          <div>
            <Input
              label="Travel Distance (km)"
              type="number"
              value={formData.travelDistanceKm}
              onChange={(e) => setFormData({ ...formData, travelDistanceKm: Number(e.target.value) })}
              required
              min={1}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              isLoading={isSubmitting}
            >
              {initialData ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}