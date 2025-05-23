
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchasesSearch } from './components/PurchasesSearch';
import { PurchaseOrders } from './tabs/PurchaseOrders';
import { GoodsReceiving } from './tabs/GoodsReceiving';
import { SupplierReturns } from './tabs/SupplierReturns';
import { PaymentTracking } from './tabs/PaymentTracking';
import { PurchaseReports } from './tabs/PurchaseReports';
import { toast } from "sonner";

interface PurchasesModuleProps {
  user: User;
}

export const PurchasesModule = ({ user }: PurchasesModuleProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      toast.info(`Searching for "${query}"`);
    }
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    toast.info(`Filtered to show ${status} purchase orders`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Purchases Management</h2>
          <p className="text-muted-foreground">Manage purchase orders, goods receiving, and supplier returns</p>
        </div>
        <div className="text-sm text-muted-foreground">
          User: {user.name} ({user.role})
        </div>
      </div>

      <PurchasesSearch 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
      />
      
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="receiving">Goods Receiving</TabsTrigger>
          <TabsTrigger value="returns">Supplier Returns</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <PurchaseOrders searchQuery={searchQuery} filterStatus={filterStatus} user={user} />
        </TabsContent>
        
        <TabsContent value="receiving">
          <GoodsReceiving user={user} searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="returns">
          <SupplierReturns user={user} searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentTracking user={user} searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="reports">
          <PurchaseReports user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
