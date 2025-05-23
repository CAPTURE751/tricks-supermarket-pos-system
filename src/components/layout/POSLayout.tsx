
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SalesModule } from '@/components/sales/SalesModule';
import { InventoryModule } from '@/components/inventory/InventoryModule';
import { ReportsModule } from '@/components/reports/ReportsModule';
import { AdminModule } from '@/components/admin/AdminModule';

interface POSLayoutProps {
  user: User;
}

export type ModuleType = 'sales' | 'inventory' | 'reports' | 'customers' | 'admin' | 'settings';

export const POSLayout = ({ user }: POSLayoutProps) => {
  const [activeModule, setActiveModule] = useState<ModuleType>('sales');

  const renderModule = () => {
    switch (activeModule) {
      case 'sales':
        return <SalesModule user={user} />;
      case 'inventory':
        return <InventoryModule user={user} />;
      case 'reports':
        return <ReportsModule user={user} />;
      case 'admin':
        return <AdminModule user={user} />;
      default:
        return <SalesModule user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header user={user} />
      
      <div className="flex flex-1">
        <Sidebar 
          user={user} 
          activeModule={activeModule} 
          onModuleChange={setActiveModule} 
        />
        
        <main className="flex-1 p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};
