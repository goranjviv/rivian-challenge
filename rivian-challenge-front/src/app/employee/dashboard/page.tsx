'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChargingSession, QueueEntry, QueueEntryFormData, ChargingStation } from '@/types';
import { stationQueuingApi } from '@/lib/api';
import { ChargingSessionCard } from '@/components/charging/ChargingSessionCard';
import { QueueEntryForm } from '@/components/charging/QueueEntryForm';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/utils';

const POLLING_INTERVAL = 60000; // 1 minute in milliseconds

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [queueEntry, setQueueEntry] = useState<QueueEntry | null>(null);
  const [unstartedSession, setUnstartedSession] = useState<ChargingSession | null>(null);
  const [currentSessions, setCurrentSessions] = useState<ChargingSession[]>([]);
  const [availableChargers, setAvailableChargers] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQueueFormOpen, setIsQueueFormOpen] = useState(false);

  // Memoize fetchData to prevent unnecessary recreations
  const fetchData = useCallback(async () => {
    try {
      const [queueData, unstartedData, sessionsData, chargersData] = await Promise.allSettled([
        stationQueuingApi.getMyQueuedEntry(),
        stationQueuingApi.getMyUnstartedSession(),
        stationQueuingApi.getCurrentSessions(),
        stationQueuingApi.getAvailableChargers()
      ]);

      if (queueData.status === 'fulfilled') {
        setQueueEntry(queueData.value);
      } else {
        console.error('Failed to fetch queue entry:', queueData.reason);
      }

      if (unstartedData.status === 'fulfilled') {
        setUnstartedSession(unstartedData.value);
      } else {
        console.error('Failed to fetch unstarted session:', unstartedData.reason);
      }

      if (sessionsData.status === 'fulfilled') {
        setCurrentSessions(sessionsData.value || []);
      } else {
        console.error('Failed to fetch current sessions:', sessionsData.reason);
      }

      if (chargersData.status === 'fulfilled') {
        setAvailableChargers(chargersData.value || []);
      } else {
        console.error('Failed to fetch available chargers:', chargersData.reason);
      }

      setError(null);
    } catch (error) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array as none of the dependencies change

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup polling
  useEffect(() => {
    // Set up the interval
    const intervalId = setInterval(() => {
      fetchData();
    }, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchData]);

  const handleStartCharging = async (sessionId: string) => {
    try {
      await stationQueuingApi.startChargingSession(sessionId);
      await fetchData(); // Refresh all data immediately
    } catch (error) {
      setError('Failed to start charging session');
      console.error('Error starting charging session:', error);
    }
  };

  const handleEnterQueue = async (data: QueueEntryFormData) => {
    try {
      await stationQueuingApi.enterQueue(data);
      await fetchData(); // Refresh all data immediately
      setIsQueueFormOpen(false);
    } catch (error) {
      throw error; // Let the form handle the error
    }
  };

  const hasUserSession = currentSessions.some(
    session => session.employee.email === user?.email
  );

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const renderCurrentSessions = () => {
    const userSessions = currentSessions.filter(
      session => session.employee.email === user?.email
    );
    const otherSessions = currentSessions.filter(
      session => session.employee.email !== user?.email
    );

    return (
      <div className="space-y-6">
        {userSessions.map((session) => (
          <ChargingSessionCard 
            key={session.id} 
            session={session}
            isCurrentUser={true}
          />
        ))}
        {otherSessions.map((session) => (
          <ChargingSessionCard 
            key={session.id} 
            session={session}
            isCurrentUser={false}
          />
        ))}
      </div>
    );
  };

  const showQueueEntry = queueEntry && !unstartedSession;
  const showQueueButton = !queueEntry && !unstartedSession && !hasUserSession;

  return (
    <div className="p-8 space-y-6">
      {error && (
        <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Available Chargers Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Available Charging Stations</h2>
        <div className="space-y-4">
          {availableChargers.length === 0 ? (
            <div>
              <p className="text-gray-500 mb-4">
                There are no available chargers at the moment.
              </p>
              {showQueueButton && (
                <Button onClick={() => setIsQueueFormOpen(true)} className="w-full">
                  Enter Charging Queue
                </Button>
              )}
            </div>
          ) : (
            <div>
              <div className="space-y-2 mb-4">
                {availableChargers.map((charger) => (
                  <div 
                    key={charger.id}
                    className="text-gray-900 p-2 bg-gray-50 rounded-md"
                  >
                    {charger.name}
                  </div>
                ))}
              </div>
              {showQueueButton && (
                <Button onClick={() => setIsQueueFormOpen(true)} className="w-full">
                  Enter Charging Queue
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card 1: Queue Entry Status (if exists and no unstarted session) */}
      {showQueueEntry && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Queue Status</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500">Preferred Duration</label>
              <p className="text-gray-900">{queueEntry.preferredChargingTimeInHours} hours</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Priority Charge</label>
              <p className="text-gray-900">{queueEntry.isPriority ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Queued At</label>
              <p className="text-gray-900">{formatDateTime(queueEntry.createdAt)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Card 2: Reserved Charge Start (if exists) */}
      {unstartedSession && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Start your reserved charge</h2>
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Charging Station</label>
                <p className="text-gray-900">{unstartedSession.chargingStation.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Assigned Time</label>
                <p className="text-gray-900">
                  {formatDateTime(unstartedSession.assignedStartsAt)} - {formatDateTime(unstartedSession.assignedEndsAt)}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleStartCharging(unstartedSession.id)}
              className="w-full"
            >
              Start Charging Session
            </Button>
          </div>
        </div>
      )}

      {/* Card 3: Current Sessions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Charging Sessions</h2>
        {currentSessions.length === 0 ? (
          <div className="text-center text-gray-500">
            No active charging sessions
          </div>
        ) : (
          renderCurrentSessions()
        )}
      </div>

      {/* Queue Entry Form */}
      <QueueEntryForm
        isOpen={isQueueFormOpen}
        onClose={() => setIsQueueFormOpen(false)}
        onSubmit={handleEnterQueue}
      />
    </div>
  );
}