
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionsTab } from './tabs/SessionsTab';
import { CashMovementsTab } from './tabs/CashMovementsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { TreasuryDashboardTab } from './tabs/TreasuryDashboardTab';
import { User } from '@/hooks/useAuth';
import { useCashManagement } from './hooks/useCashManagement';

interface CashManagementModuleProps {
  user: User;
}

export const CashManagementModule = ({ user }: CashManagementModuleProps) => {
  const [activeTab, setActiveTab] = useState("sessions");
  const cashManagement = useCashManagement(user);
  
  useEffect(() => {
    cashManagement.fetchOpenSessions();
    cashManagement.fetchClosedSessions();
  }, []);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 p-1">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="cash-movements">Cash In/Out</TabsTrigger>
          <TabsTrigger value="treasury">Treasury Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions">
          <SessionsTab 
            user={user} 
            sessions={cashManagement.openSessions}
            closedSessions={cashManagement.closedSessions}
            isLoading={cashManagement.isLoading}
            onOpenSession={cashManagement.openSession}
            onCloseSession={cashManagement.closeSession}
          />
        </TabsContent>
        
        <TabsContent value="cash-movements">
          <CashMovementsTab 
            user={user} 
            sessions={cashManagement.openSessions}
            isLoading={cashManagement.isLoading}
            onAddCashMovement={cashManagement.addCashMovement}
          />
        </TabsContent>
        
        <TabsContent value="treasury">
          <TreasuryDashboardTab 
            user={user} 
            sessions={cashManagement.openSessions}
          />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportsTab 
            user={user} 
            sessions={[...cashManagement.openSessions, ...cashManagement.closedSessions]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
