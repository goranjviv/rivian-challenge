'use client';

import { DeleteConfirmationProps } from '@/types';
import { Button } from './Button';

export function DeleteConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  entityName 
}: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-medium text-gray-900">Confirm Delete</h2>
        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete this {entityName}? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}