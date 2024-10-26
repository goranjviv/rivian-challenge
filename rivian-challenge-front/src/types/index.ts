export type UserType = 'Employee' | 'CompanyAdmin';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  fullName: string;
  email: string;
  userType: UserType;
  travelDistanceKm: number;
}

export interface ChargingStation extends BaseEntity {
  name: string;
}

export interface ChargingSession extends BaseEntity {
  assignedStartsAt: string;
  assignedEndsAt: string;
  startedAt?: string;
  employee: User;
  chargingStation: ChargingStation;
}

export interface QueueEntry extends BaseEntity {
  preferredChargingTimeInHours: number;
  isPriority: boolean;
  createdAt: string;
}

export interface QueueEntryFormData {
  preferredChargingTimeInHours: number;
  isPriority: boolean;
}

// API Response Types
export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Props Types
export interface LayoutProps {
  children: React.ReactNode;
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Route Types
export type AdminRoutes = '/admin/dashboard' | '/admin/employees';
export type EmployeeRoutes = '/employee/dashboard' | '/employee/profile';

// Common Types
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string;
}

export interface EntityFormProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  initialData?: T;
  title: string;
}
