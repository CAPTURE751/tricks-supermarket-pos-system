
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SessionsTab } from './tabs/SessionsTab';
import { CashMovementsTab } from './tabs/CashMovementsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { TreasuryDashboardTab } from './tabs/TreasuryDashboardTab';
import { CashSession } from './types/cash-types';
import { mockSessions, mockTransactions } from './data/mockData';

interface CashManagementModuleProps {
  user: User;
}

type TabType = 'sessions' | 'movements' | 'reports' | 'treasury';

export const CashManagementModule = ({ user }: CashManagementModuleProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('sessions');
  const [sessions, setSessions] = useState<CashSession[]>(mockSessions);

  // Check if user has permissions to access this module
  const hasAccess = ['Admin', 'Manager', 'Cashier'].includes(user.role);

  if (!hasAccess) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-white text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-red-400">You don't have permission to access Cash Management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Cash Management</h1>
      </div>

      <Tabs 
        defaultValue="sessions" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)} 
        className="w-full"
      >
        <TabsList className="bg-gray-800 border border-gray-700 p-1 w-full overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="sessions" className="text-sm">Sessions</TabsTrigger>
          <TabsTrigger value="movements" className="text-sm">Cash In/Out</TabsTrigger>
          <TabsTrigger value="reports" className="text-sm">Reports</TabsTrigger>
          <TabsTrigger value="treasury" className="text-sm">Treasury Dashboard</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="sessions">
            <SessionsTab user={user} sessions={sessions} setSessions={setSessions} />
          </TabsContent>
          
          <TabsContent value="movements">
            <CashMovementsTab user={user} sessions={sessions} setSessions={setSessions} />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsTab user={user} sessions={sessions} />
          </TabsContent>
          
          <TabsContent value="treasury">
            <TreasuryDashboardTab user={user} sessions={sessions} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
