
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SalesModule } from '@/components/sales/SalesModule';
import { InventoryModule } from '@/components/inventory/InventoryModule';
import { PurchasesModule } from '@/components/purchases/PurchasesModule';
import { ReportsModule } from '@/components/reports/ReportsModule';
import { CustomersModule } from '@/components/customers/CustomersModule';
import { AdminModule } from '@/components/admin/AdminModule';
import { SettingsModule } from '@/components/settings/SettingsModule';
import { CashManagementModule } from '@/components/cash/CashManagementModule';

interface POSLayoutProps {
  user: User;
}

export type ModuleType = 'sales' | 'inventory' | 'purchases' | 'reports' | 'customers' | 'cash' | 'admin' | 'settings';

export const POSLayout = ({ user }: POSLayoutProps) => {
  const [activeModule, setActiveModule] = useState<ModuleType>('sales');

  const renderModule = () => {
    switch (activeModule) {
      case 'sales':
        return <SalesModule user={user} />;
      case 'inventory':
        return <InventoryModule user={user} />;
      case 'purchases':
        return <PurchasesModule user={user} />;
      case 'reports':
        return <ReportsModule user={user} />;
      case 'customers':
        return <CustomersModule user={user} />;
      case 'cash':
        return <CashManagementModule user={user} />;
      case 'admin':
        return <AdminModule user={user} />;
      case 'settings':
        return <SettingsModule user={user} />;
      default:
        return <SalesModule user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={user} />
      
      <div className="flex flex-1">
        <Sidebar 
          user={user} 
          activeModule={activeModule} 
          onModuleChange={setActiveModule} 
        />
        
        <main className="flex-1 p-4 overflow-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

