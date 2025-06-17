
import { useState } from 'react';
import { useAuth } from '@/components/auth/AdminOnlyAuthProvider';
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

export type ModuleType = 'sales' | 'inventory' | 'purchases' | 'reports' | 'customers' | 'cash' | 'admin' | 'settings';

export const RoleBasedPOSLayout = () => {
  const { profile, signOut, canAccess } = useAuth();
  
  // Default module based on role
  const getDefaultModule = (): ModuleType => {
    if (!profile) return 'sales';
    
    switch (profile.role) {
      case 'Cashier':
        return 'sales';
      case 'Manager':
        return 'sales';
      case 'Admin':
        return 'sales';
      case 'Accountant':
        return 'reports';
      case 'Stock Controller':
        return 'inventory';
      default:
        return 'sales';
    }
  };

  const [activeModule, setActiveModule] = useState<ModuleType>(getDefaultModule());

  if (!profile) {
    return null; // This will trigger the auth screen
  }

  // Transform profile to match the expected User interface for compatibility
  const user = {
    id: profile.id,
    name: profile.name,
    role: profile.role,
    branch: profile.branch_id || 'Main Branch',
    pin: profile.pin || '1234',
    profileImage: undefined,
    lastActive: new Date().toISOString()
  };

  // Check if user can access the current module
  const handleModuleChange = (module: ModuleType) => {
    if (canAccess(module)) {
      setActiveModule(module);
    }
  };

  // Redirect based on role restrictions
  const renderModule = () => {
    // For Cashiers, force them to stay on sales only
    if (profile.role === 'Cashier' && activeModule !== 'sales') {
      setActiveModule('sales');
      return <SalesModule user={user} />;
    }

    // Check access for other roles
    if (!canAccess(activeModule)) {
      // Redirect to default accessible module
      const defaultModule = getDefaultModule();
      setActiveModule(defaultModule);
      
      switch (defaultModule) {
        case 'sales':
          return <SalesModule user={user} />;
        case 'inventory':
          return <InventoryModule user={user} />;
        case 'reports':
          return <ReportsModule user={user} />;
        default:
          return <SalesModule user={user} />;
      }
    }

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
      <Header user={user} onSignOut={signOut} />
      
      <div className="flex flex-1">
        <Sidebar 
          user={user} 
          activeModule={activeModule} 
          onModuleChange={handleModuleChange} 
        />
        
        <main className="flex-1 p-4 overflow-auto">
          {/* Role-based access notice */}
          {profile.role === 'Cashier' && (
            <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
              <p className="text-sm font-medium">
                Cashier Access: You have access to the Sales module only.
              </p>
            </div>
          )}
          
          {renderModule()}
        </main>
      </div>
    </div>
  );
};
