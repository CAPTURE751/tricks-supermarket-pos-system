
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
  gradient: string;
}

const menuItems: MenuItem[] = [
  { 
    id: 'sales', 
    label: 'Sales', 
    icon: '💰', 
    roles: ['Admin', 'Manager', 'Cashier', 'Guest'],
    gradient: 'from-bright-green to-green-600'
  },
  { 
    id: 'inventory', 
    label: 'Inventory', 
    icon: '📦', 
    roles: ['Admin', 'Manager', 'Stock Controller'],
    gradient: 'from-bright-blue to-blue-600'
  },
  { 
    id: 'cash', 
    label: 'Cash', 
    icon: '💵', 
    roles: ['Admin', 'Manager', 'Cashier'],
    gradient: 'from-bright-amber to-orange-600'
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: '📊', 
    roles: ['Admin', 'Manager', 'Accountant'],
    gradient: 'from-highlight-blue to-blue-500'
  },
  { 
    id: 'customers', 
    label: 'Customers', 
    icon: '👥', 
    roles: ['Admin', 'Manager', 'Cashier'],
    gradient: 'from-highlight-orange to-orange-500'
  },
  { 
    id: 'admin', 
    label: 'Admin', 
    icon: '⚙️', 
    roles: ['Admin'],
    gradient: 'from-purple-500 to-purple-600'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: '🔧', 
    roles: ['Admin', 'Manager'],
    gradient: 'from-gray-500 to-gray-600'
  },
];

export const Sidebar = ({ user, activeModule, onModuleChange }: SidebarProps) => {
  const accessibleItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-72 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-text-gray font-bold text-lg mb-6">Navigation</h2>
        
        <nav className="space-y-3">
          {accessibleItems.map(item => (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`
                w-full flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-200 group touch-button
                ${activeModule === item.id 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-modern transform scale-[1.02]` 
                  : 'text-text-gray hover:bg-gray-50 hover:shadow-sm border border-gray-200'
                }
              `}
            >
              <span className={`text-2xl transition-transform duration-200 ${
                activeModule === item.id ? '' : 'group-hover:scale-110'
              }`}>
                {item.icon}
              </span>
              <span className="font-semibold text-base">{item.label}</span>
              {activeModule === item.id && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
