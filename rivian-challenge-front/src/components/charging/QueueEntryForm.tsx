'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';
import { QueueEntryFormData } from '@/types';

interface QueueEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QueueEntryFormData) => Promise<void>;
}

export function QueueEntryForm({ isOpen, onClose, onSubmit }: QueueEntryFormProps) {
  const [formData, setFormData] = useState<QueueEntryFormData>({
    preferredChargingTimeInHours: 1,
    isPriority: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to enter queue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Enter Charging Queue</h2>
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
              label="Preferred Charge Duration (hours)"
              type="number"
              min={1}
              step={1}
              value={formData.preferredChargingTimeInHours}
              onChange={(e) => setFormData({
                ...formData,
                preferredChargingTimeInHours: parseInt(e.target.value)
              })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPriority"
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              checked={formData.isPriority}
              onChange={(e) => setFormData({
                ...formData,
                isPriority: e.target.checked
              })}
              disabled={isSubmitting}
            />
            <label htmlFor="isPriority" className="ml-2 block text-sm text-gray-900">
              Priority Charge
            </label>
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
              Enter Queue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}