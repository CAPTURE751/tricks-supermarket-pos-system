
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User } from '@/hooks/useAuth';
import { GeneralSettings } from './tabs/GeneralSettings';
import { UsersRolesSettings } from './tabs/UsersRolesSettings';
import { ReceiptSettings } from './tabs/ReceiptSettings';
import { SalesSettings } from './tabs/SalesSettings';
import { TaxSettings } from './tabs/TaxSettings';
import { InventorySettings } from './tabs/InventorySettings';
import { IntegrationsSettings } from './tabs/IntegrationsSettings';
import { AdvancedSettings } from './tabs/AdvancedSettings';

interface SettingsModuleProps {
  user: User;
}

type TabType = 
  | 'general'
  | 'users'
  | 'receipt'
  | 'sales'
  | 'tax'
  | 'inventory'
  | 'integrations'
  | 'advanced';

export const SettingsModule = ({ user }: SettingsModuleProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  if (user.role !== 'Admin' && user.role !== 'Manager') {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-white text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-red-400">You don't have permission to access Settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <Tabs 
        defaultValue="general" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)} 
        className="w-full"
      >
        <TabsList className="bg-gray-800 border border-gray-700 p-1 w-full overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="general" className="text-sm">General</TabsTrigger>
          <TabsTrigger value="users" className="text-sm">Users & Roles</TabsTrigger>
          <TabsTrigger value="receipt" className="text-sm">Receipt</TabsTrigger>
          <TabsTrigger value="sales" className="text-sm">Sales</TabsTrigger>
          <TabsTrigger value="tax" className="text-sm">Tax & Accounting</TabsTrigger>
          <TabsTrigger value="inventory" className="text-sm">Inventory</TabsTrigger>
          <TabsTrigger value="integrations" className="text-sm">Integrations</TabsTrigger>
          <TabsTrigger value="advanced" className="text-sm">Advanced</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general">
            <GeneralSettings user={user} />
          </TabsContent>
          <TabsContent value="users">
            <UsersRolesSettings user={user} />
          </TabsContent>
          <TabsContent value="receipt">
            <ReceiptSettings user={user} />
          </TabsContent>
          <TabsContent value="sales">
            <SalesSettings user={user} />
          </TabsContent>
          <TabsContent value="tax">
            <TaxSettings user={user} />
          </TabsContent>
          <TabsContent value="inventory">
            <InventorySettings user={user} />
          </TabsContent>
          <TabsContent value="integrations">
            <IntegrationsSettings user={user} />
          </TabsContent>
          <TabsContent value="advanced">
            <AdvancedSettings user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
