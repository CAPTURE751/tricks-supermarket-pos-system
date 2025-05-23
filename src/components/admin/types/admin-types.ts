
import { User } from '@/hooks/useAuth';

export type BranchStatus = 'active' | 'inactive' | 'maintenance';
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'locked';
export type AuditActionType = 
  | 'login' 
  | 'logout' 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'view' 
  | 'export' 
  | 'permission_change'
  | 'cash_operation'
  | 'refund'
  | 'discount'
  | 'system';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email?: string;
  manager: string;
  managerId?: string;
  status: BranchStatus;
  openingTime: string;
  closingTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'pos_terminal' | 'tablet' | 'desktop' | 'mobile';
  serialNumber: string;
  branchId: string;
  branchName: string;
  assignedUsers: string[];
  status: DeviceStatus;
  ipAddress?: string;
  lastOnline?: string;
  osVersion?: string;
  appVersion?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditActionType;
  module: string;
  details: string;
  ipAddress: string;
  deviceId?: string;
  deviceName?: string;
  branchId?: string;
  branchName?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  deviceId: string;
  deviceName: string;
  branchId: string;
  branchName: string;
  loginTime: string;
  lastActiveTime: string;
  ipAddress: string;
  isActive: boolean;
}

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
}

export interface AdminMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface LicenseInfo {
  id: string;
  plan: 'basic' | 'standard' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'trial' | 'pending_renewal';
  registeredTo: string;
  maxUsers: number;
  currentUsers: number;
  maxBranches: number;
  currentBranches: number;
  expiryDate: string;
  startDate: string;
  lastRenewal: string;
  autoRenew: boolean;
  features: {
    name: string;
    included: boolean;
  }[];
}
