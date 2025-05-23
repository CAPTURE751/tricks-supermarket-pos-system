
import { User } from '@/hooks/useAuth';

interface UserTileProps {
  user: User;
  isSelected: boolean;
  onClick: () => void;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Admin': return 'border-yellow-500 bg-yellow-500/10';
    case 'Manager': return 'border-blue-500 bg-blue-500/10';
    case 'Cashier': return 'border-green-500 bg-green-500/10';
    case 'Accountant': return 'border-purple-500 bg-purple-500/10';
    case 'Stock Controller': return 'border-orange-500 bg-orange-500/10';
    case 'Guest': return 'border-gray-500 bg-gray-500/10';
    default: return 'border-gray-600 bg-gray-600/10';
  }
};

export const UserTile = ({ user, isSelected, onClick }: UserTileProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-6 rounded-lg border-2 transition-all duration-200 hover:scale-105
        ${isSelected 
          ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/25' 
          : `${getRoleColor(user.role)} hover:bg-gray-700/50`
        }
      `}
    >
      <div className="flex flex-col items-center space-y-3">
        {/* Profile Image or Initials */}
        <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-xl">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        
        {/* User Info */}
        <div className="text-center">
          <h3 className="text-white font-semibold text-lg">{user.name}</h3>
          <p className="text-gray-300 text-sm">{user.role}</p>
          <p className="text-gray-400 text-xs">{user.branch}</p>
          {user.lastActive && (
            <p className="text-gray-500 text-xs mt-1">
              Last: {new Date(user.lastActive).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};
