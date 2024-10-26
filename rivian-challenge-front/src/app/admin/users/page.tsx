'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { usersApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { DeleteConfirmation } from '@/components/ui/DeleteConfirmation';
import { UserForm } from '@/components/forms/UserForm';
import { formatDate } from '@/utils';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = async (updatedUser: Partial<User>) => {
    if (!selectedUser) {
      throw new Error('No user selected for update');
    }

    await usersApi.update(selectedUser.id, updatedUser);
    await fetchUsers();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await usersApi.delete(selectedUser.id);
      await fetchUsers();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user. Please try again later.');
    }
  };

  const handleCreate = async (newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    await usersApi.create(newUser);
    await fetchUsers();
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setIsEditModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travel Distance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.userType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.travelDistanceKm}km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(user)}
                        size="sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(user)}
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={selectedUser ? handleUpdate : handleCreate}
        initialData={selectedUser}
        title={selectedUser ? 'Edit User' : 'Create User'}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        entityName="user"
      />
    </div>
  );
}