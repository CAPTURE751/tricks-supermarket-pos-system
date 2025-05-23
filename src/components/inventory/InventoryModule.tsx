
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductManagement } from './tabs/ProductManagement';
import { StockLevels } from './tabs/StockLevels';
import { InventoryAdjustment } from './tabs/InventoryAdjustment';
import { PurchaseOrders } from './tabs/PurchaseOrders';
import { SupplierManagement } from './tabs/SupplierManagement';
import { InventoryReports } from './tabs/InventoryReports';
import { StockTransfer } from './tabs/StockTransfer';
import { InventorySearch } from './components/InventorySearch';
import { toast } from "sonner";

interface InventoryModuleProps {
  user: User;
}

export const InventoryModule = ({ user }: InventoryModuleProps) => {
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
    toast.info(`Filtered to show ${status} items`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Manage your stock and products</p>
        </div>
        <div className="text-sm text-muted-foreground">
          User: {user.name} ({user.role})
        </div>
      </div>

      <InventorySearch 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
      />
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductManagement searchQuery={searchQuery} filterStatus={filterStatus} />
        </TabsContent>
        
        <TabsContent value="stock">
          <StockLevels searchQuery={searchQuery} filterStatus={filterStatus} />
        </TabsContent>
        
        <TabsContent value="adjustments">
          <InventoryAdjustment user={user} />
        </TabsContent>
        
        <TabsContent value="purchases">
          <PurchaseOrders user={user} />
        </TabsContent>
        
        <TabsContent value="suppliers">
          <SupplierManagement />
        </TabsContent>
        
        <TabsContent value="reports">
          <InventoryReports />
        </TabsContent>
        
        <TabsContent value="transfers">
          <StockTransfer user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
