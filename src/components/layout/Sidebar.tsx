
import { User } from '@/hooks/useAuth';
import { ModuleType } from './POSLayout';

interface SidebarProps {
  user: User;
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

interface MenuItem {
  id: ModuleType;
  label: string;
  icon: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  { id: 'sales', label: 'Sales', icon: '💰', roles: ['Admin', 'Manager', 'Cashier', 'Guest'] },
  { id: 'inventory', label: 'Inventory', icon: '📦', roles: ['Admin', 'Manager', 'Stock Controller'] },
  { id: 'reports', label: 'Reports', icon: '📊', roles: ['Admin', 'Manager', 'Accountant'] },
  { id: 'customers', label: 'Customers', icon: '👥', roles: ['Admin', 'Manager', 'Cashier'] },
  { id: 'admin', label: 'Admin', icon: '⚙️', roles: ['Admin'] },
  { id: 'settings', label: 'Settings', icon: '🔧', roles: ['Admin', 'Manager'] },
];

export const Sidebar = ({ user, activeModule, onModuleChange }: SidebarProps) => {
  const accessibleItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-4">
        <h2 className="text-white font-semibold text-lg mb-4">Navigation</h2>
        
        <nav className="space-y-2">
          {accessibleItems.map(item => (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${activeModule === item.id 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Quick Help button removed */}
    </aside>
  );
};
