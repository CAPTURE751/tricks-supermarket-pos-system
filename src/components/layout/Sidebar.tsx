
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  Package, 
  TruckIcon, 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings, 
  UserCog
} from 'lucide-react';
import { useAuth } from '@/components/auth/AdminOnlyAuthProvider';
import { ModuleType } from './POSLayout';

interface SidebarProps {
  user: any;
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

export const Sidebar = ({ user, activeModule, onModuleChange }: SidebarProps) => {
  const { canAccess } = useAuth();

  const menuItems = [
    {
      id: 'sales' as ModuleType,
      label: 'Sales',
      icon: ShoppingCart,
      permission: 'sales'
    },
    {
      id: 'inventory' as ModuleType,
      label: 'Inventory',
      icon: Package,
      permission: 'inventory'
    },
    {
      id: 'purchases' as ModuleType,
      label: 'Purchases',
      icon: TruckIcon,
      permission: 'purchases'
    },
    {
      id: 'reports' as ModuleType,
      label: 'Reports',
      icon: BarChart3,
      permission: 'reports'
    },
    {
      id: 'customers' as ModuleType,
      label: 'Customers',
      icon: Users,
      permission: 'customers'
    },
    {
      id: 'cash' as ModuleType,
      label: 'Cash Management',
      icon: CreditCard,
      permission: 'cash'
    },
    {
      id: 'admin' as ModuleType,
      label: 'Administration',
      icon: UserCog,
      permission: 'admin'
    },
    {
      id: 'settings' as ModuleType,
      label: 'Settings',
      icon: Settings,
      permission: 'settings'
    }
  ];

  const visibleMenuItems = menuItems.filter(item => canAccess(item.permission));

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeModule === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeModule === item.id && "bg-gray-700 text-white"
                )}
                onClick={() => onModuleChange(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
