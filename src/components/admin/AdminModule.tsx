
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UsersTab } from './tabs/UsersTab';
import { RolesPermissionsTab } from './tabs/RolesPermissionsTab';
import { BranchesTab } from './tabs/BranchesTab';
import { AuditLogsTab } from './tabs/AuditLogsTab';
import { DeviceManagerTab } from './tabs/DeviceManagerTab';
import { ReportsTab } from './tabs/ReportsTab';
import { LicenseTab } from './tabs/LicenseTab';
import { Dashboard } from './Dashboard';

interface AdminModuleProps {
  user: User;
}

type TabType = 'dashboard' | 'users' | 'roles' | 'branches' | 'audit' | 'devices' | 'reports' | 'license';

export const AdminModule = ({ user }: AdminModuleProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  if (user.role !== 'Admin') {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-white text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-red-400">You don't have permission to access this module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
      </div>

      <Tabs 
        defaultValue="dashboard" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)} 
        className="w-full"
      >
        <TabsList className="bg-gray-800 border border-gray-700 p-1 w-full overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="dashboard" className="text-sm">Dashboard</TabsTrigger>
          <TabsTrigger value="users" className="text-sm">User Management</TabsTrigger>
          <TabsTrigger value="roles" className="text-sm">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="branches" className="text-sm">Branches</TabsTrigger>
          <TabsTrigger value="audit" className="text-sm">Audit Logs</TabsTrigger>
          <TabsTrigger value="devices" className="text-sm">Devices</TabsTrigger>
          <TabsTrigger value="reports" className="text-sm">Reports</TabsTrigger>
          <TabsTrigger value="license" className="text-sm">License</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard">
            <Dashboard user={user} />
          </TabsContent>
          <TabsContent value="users">
            <UsersTab user={user} />
          </TabsContent>
          <TabsContent value="roles">
            <RolesPermissionsTab user={user} />
          </TabsContent>
          <TabsContent value="branches">
            <BranchesTab user={user} />
          </TabsContent>
          <TabsContent value="audit">
            <AuditLogsTab user={user} />
          </TabsContent>
          <TabsContent value="devices">
            <DeviceManagerTab user={user} />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsTab user={user} />
          </TabsContent>
          <TabsContent value="license">
            <LicenseTab user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
