import { ChargingSession } from '@/types';
import { Card } from '@/components/ui/Card';
import { Clock, Plug, User } from 'lucide-react';
import { formatDateTime } from '@/utils';

interface ChargingSessionCardProps {
  session: ChargingSession;
  isCurrentUser: boolean;
}

export function ChargingSessionCard({ session, isCurrentUser }: ChargingSessionCardProps) {
  const isActive = !!session.startedAt;
  const statusColor = isActive ? 'bg-green-100' : 'bg-yellow-100';
  const statusTextColor = isActive ? 'text-green-800' : 'text-yellow-800';
  const cardBgColor = isCurrentUser ? 'bg-yellow-50' : 'bg-white';

  return (
    <Card className={`overflow-hidden ${cardBgColor}`}>
      <div className={`px-4 py-2 ${statusColor} ${statusTextColor} text-sm font-medium flex items-center justify-between`}>
        <span>
          {isActive ? 'Active Session' : 'Scheduled Session'}
          {isCurrentUser && ' (Your Session)'}
        </span>
        <span className="text-xs">
          ID: {session.id}
        </span>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <Plug className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-medium">Charging Station</div>
            <div className="text-sm text-gray-500">{session.chargingStation.name}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-medium">Employee</div>
            <div className="text-sm text-gray-500">{session.employee.fullName}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium">Time Slot</div>
              <div className="text-sm text-gray-500">
                {formatDateTime(session.assignedStartsAt)} - {formatDateTime(session.assignedEndsAt)}
              </div>
            </div>
          </div>
          
          {session.startedAt && (
            <div className="ml-8 text-sm">
              <span className="text-gray-500">Started at: </span>
              <span className="text-gray-700">{formatDateTime(session.startedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}