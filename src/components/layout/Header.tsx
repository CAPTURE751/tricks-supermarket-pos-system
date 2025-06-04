
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Clock } from 'lucide-react';
import { User as UserType } from '@/hooks/useAuth';

interface HeaderProps {
  user: UserType;
  onSignOut?: () => void;
}

export const Header = ({ user, onSignOut }: HeaderProps) => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Nairobi'
    }) + ' EAT';
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-KE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'Africa/Nairobi'
    });
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">JT</span>
        </div>
        <div>
          <h1 className="text-xl font-bold">Jeff Tricks Supermarket</h1>
          <p className="text-sm text-gray-300">Point of Sale System</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{getCurrentTime()}</span>
          </div>
          <div className="text-gray-300">{getCurrentDate()}</div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-gray-700">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-300">{user.role}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end">
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            {onSignOut && (
              <DropdownMenuItem 
                className="text-red-400 hover:bg-gray-700 hover:text-red-300"
                onClick={onSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
