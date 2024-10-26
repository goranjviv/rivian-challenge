import { ChargingSession, ChargingStation, QueueEntry, QueueEntryFormData, User } from "@/types";

const API_BASE_URL = 'http://localhost:3000';

interface ApiOptions {
  params?: Record<string, string>;
  body?: any;
  headers?: Record<string, string>;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

async function request<T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  options: ApiOptions = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  const url = new URL(API_BASE_URL + endpoint);

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `VeryWeakAuth ${token}`;
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
      throw new Error('Unauthorized');
    }

    if (response.status === 403) {
      throw new Error('Forbidden');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    // Handle empty response
    const contentLength = response.headers.get('Content-Length');
    const contentType = response.headers.get('Content-Type');
    
    if (contentLength === '0' || !contentType?.includes('application/json')) {
      return null as T;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiOptions, 'body'>) =>
    request<T>(endpoint, 'GET', options),

  post: <T>(endpoint: string, body: any, options?: ApiOptions) =>
    request<T>(endpoint, 'POST', { ...options, body }),

  patch: <T>(endpoint: string, body: any, options?: ApiOptions) =>
    request<T>(endpoint, 'PATCH', { ...options, body }),

  delete: <T>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, 'DELETE', options),
};

// Usage example with type safety
interface LoginResponse {
  token: string;
  user: {
    fullName: string;
    email: string;
    userType: 'Employee' | 'CompanyAdmin';
    travelDistanceKm: number;
  };
}

// Example API calls
export const authApi = {
  login: (email: string) =>
    api.post<LoginResponse>(endpoints.auth.login, { email }),
  
  getCurrentUser: () =>
    api.get<LoginResponse['user']>(endpoints.auth.me),
};

// API endpoints
export const endpoints = {
  auth: {
    login: '/user/login',
    me: '/user/me',
  },
  users: {
    list: '/user',
    create: '/user',
    update: (id: string) => `/user/${id}`,
    delete: (id: string) => `/user/${id}`,
  },
  chargingStations: {
    list: '/charging-station',
    create: '/charging-station',
    update: (id: string) => `/charging-station/${id}`,
    delete: (id: string) => `/charging-station/${id}`,
  },
  chargingSessions: {
    current: '/station-queuing/current-charging-sessions',
  },
  stationQueuing: {
    current: '/station-queuing/current-charging-sessions',
    myQueuedEntry: '/station-queuing/my-queued-entry',
    myUnstartedSession: '/station-queuing/my-unstarted-session',
    enterQueue: '/station-queuing/enter-charging-queue',
    startCharging: '/station-queuing/start-charging-session',
    availableChargers: '/station-queuing/available-chargers',
  },
} as const;

// API services
export const usersApi = {
  getAll: () => api.get<User[]>(endpoints.users.list),
  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<User>(endpoints.users.create, user),
  update: (id: string, user: Partial<User>) => 
    api.patch<User>(endpoints.users.update(id), user),
  delete: (id: string) => 
    api.delete(endpoints.users.delete(id)),
};

export const chargingStationsApi = {
  getAll: () => api.get<ChargingStation[]>(endpoints.chargingStations.list),
  create: (station: Omit<ChargingStation, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<ChargingStation>(endpoints.chargingStations.create, station),
  update: (id: string, station: Partial<ChargingStation>) => 
    api.patch<ChargingStation>(endpoints.chargingStations.update(id), station),
  delete: (id: string) => 
    api.delete(endpoints.chargingStations.delete(id)),
};

export const chargingSessionsApi = {
  getCurrent: () => 
    api.get<ChargingSession[]>(endpoints.chargingSessions.current),
};

export const stationQueuingApi = {
  getCurrentSessions: () => api.get<ChargingSession[]>(endpoints.stationQueuing.current),
  getMyQueuedEntry: () => 
    api.get<QueueEntry | null>(endpoints.stationQueuing.myQueuedEntry)
      .then(response => response || null), // Ensure null for empty response
  
  getMyUnstartedSession: () => 
    api.get<ChargingSession | null>(endpoints.stationQueuing.myUnstartedSession)
      .then(response => response || null), // Ensure null for empty response
  
  enterQueue: (data: QueueEntryFormData) => 
    api.post(endpoints.stationQueuing.enterQueue, data),
  
  startChargingSession: (sessionId: string) => 
    api.post(endpoints.stationQueuing.startCharging, { sessionId }),

  getAvailableChargers: () => 
    api.get<ChargingStation[]>(endpoints.stationQueuing.availableChargers),
};