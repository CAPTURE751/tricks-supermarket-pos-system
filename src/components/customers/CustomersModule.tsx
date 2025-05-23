
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerList } from './tabs/CustomerList';
import { CustomerDetails } from './tabs/CustomerDetails';
import { CustomerLoyalty } from './tabs/CustomerLoyalty';
import { CustomerCommunication } from './tabs/CustomerCommunication';
import { CustomerCredit } from './tabs/CustomerCredit';
import { CustomerReports } from './tabs/CustomerReports';

interface CustomersModuleProps {
  user: User;
}

export const CustomersModule = ({ user }: CustomersModuleProps) => {
  const [activeTab, setActiveTab] = useState<string>('customers');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Customer Management</h2>
      </div>

      <Tabs 
        defaultValue="customers" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="customers" className="data-[state=active]:bg-green-500">
            Customers
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-green-500">
            Customer Details
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="data-[state=active]:bg-green-500">
            Loyalty & Rewards
          </TabsTrigger>
          <TabsTrigger value="communication" className="data-[state=active]:bg-green-500">
            Communication
          </TabsTrigger>
          <TabsTrigger value="credit" className="data-[state=active]:bg-green-500">
            Credit & Debt
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-green-500">
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers">
          <CustomerList user={user} onViewDetails={(id) => {
            // Set selected customer ID in a state and switch tab
            setActiveTab('details');
          }} />
        </TabsContent>
        
        <TabsContent value="details">
          <CustomerDetails user={user} />
        </TabsContent>
        
        <TabsContent value="loyalty">
          <CustomerLoyalty user={user} />
        </TabsContent>
        
        <TabsContent value="communication">
          <CustomerCommunication user={user} />
        </TabsContent>
        
        <TabsContent value="credit">
          <CustomerCredit user={user} />
        </TabsContent>
        
        <TabsContent value="reports">
          <CustomerReports user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
