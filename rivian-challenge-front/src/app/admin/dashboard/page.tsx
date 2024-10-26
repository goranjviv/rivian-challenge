'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ChargingStation } from '@/types';
import { usersApi, chargingStationsApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { formatNumber, formatDistance } from '@/utils';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, stationsData] = await Promise.all([
          usersApi.getAll(),
          chargingStationsApi.getAll()
        ]);
        setUsers(usersData);
        setStations(stationsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const averageTravelDistance = users.length
    ? users.reduce((acc, user) => acc + user.travelDistanceKm, 0) / users.length
    : 0;

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of your system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push('/admin/users')}
        >
          <div className="p-6">
            <h3 className="font-medium text-gray-900">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatNumber(users.length)}
            </p>
          </div>
        </Card>
        
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push('/admin/charging-stations')}
        >
          <div className="p-6">
            <h3 className="font-medium text-gray-900">Charging Stations</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatNumber(stations.length)}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium text-gray-900">Average Travel Distance</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatDistance(Math.round(averageTravelDistance))}
          </p>
        </Card>
      </div>
    </div>
  );
}