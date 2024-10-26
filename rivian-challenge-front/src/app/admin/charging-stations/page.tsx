'use client';

import { useState, useEffect } from 'react';
import { ChargingStation } from '@/types';
import { chargingStationsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { DeleteConfirmation } from '@/components/ui/DeleteConfirmation';
import { ChargingStationForm } from '@/components/forms/ChargingStationForm';
import { formatDate } from '@/utils';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function ChargingStationsManagement() {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await chargingStationsApi.getAll();
      setStations(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch charging stations. Please try again later.');
      console.error('Error fetching charging stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (station: ChargingStation) => {
    setSelectedStation(station);
    setIsEditModalOpen(true);
  };

  const handleDelete = (station: ChargingStation) => {
    setSelectedStation(station);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = async (updatedStation: Partial<ChargingStation>) => {
    if (!selectedStation) {
      throw new Error('No station selected for update');
    }

    await chargingStationsApi.update(selectedStation.id, updatedStation);
    await fetchStations();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStation) return;

    try {
      await chargingStationsApi.delete(selectedStation.id);
      await fetchStations();
      setIsDeleteModalOpen(false);
      setSelectedStation(null);
    } catch (error) {
      console.error('Error deleting charging station:', error);
      throw new Error('Failed to delete charging station. Please try again later.');
    }
  };

  const handleCreate = async (newStation: Omit<ChargingStation, 'id' | 'createdAt' | 'updatedAt'>) => {
    await chargingStationsApi.create(newStation);
    await fetchStations();
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-gray-500">Loading charging stations...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Charging Stations Management</h1>
        <Button
          onClick={() => {
            setSelectedStation(null);
            setIsEditModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Station
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
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {station.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(station.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(station.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(station)}
                        size="sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(station)}
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

      <ChargingStationForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStation(null);
        }}
        onSubmit={selectedStation ? handleUpdate : handleCreate}
        initialData={selectedStation}
        title={selectedStation ? 'Edit Charging Station' : 'Create Charging Station'}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStation(null);
        }}
        onConfirm={handleDeleteConfirm}
        entityName="charging station"
      />
    </div>
  );
}