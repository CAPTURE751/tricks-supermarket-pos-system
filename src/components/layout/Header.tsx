
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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-modern">
            <span className="text-white font-bold text-xl">JT</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-gray">Jeff Tricks Supermarket</h1>
            <p className="text-sm text-gray-600 font-medium">Point of Sale System</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right text-sm bg-gray-50 px-4 py-2 rounded-xl border">
            <div className="flex items-center space-x-2 text-text-gray">
              <Clock className="h-4 w-4 text-highlight-blue" />
              <span className="font-mono font-semibold">{getCurrentTime()}</span>
            </div>
            <div className="text-gray-600 font-medium">{getCurrentDate()}</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-3 text-text-gray hover:bg-gray-50 rounded-xl px-4 py-3 h-auto shadow-sm border border-gray-200"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-highlight-blue to-bright-blue flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{user.name}</div>
                  <div className="text-xs text-gray-600 font-medium">{user.role}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border-gray-200 shadow-modern-lg rounded-xl" align="end">
              <DropdownMenuItem className="text-text-gray hover:bg-gray-50 rounded-lg mx-1 my-1">
                <User className="mr-3 h-4 w-4 text-highlight-blue" />
                <span className="font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-text-gray hover:bg-gray-50 rounded-lg mx-1 my-1">
                <Settings className="mr-3 h-4 w-4 text-highlight-orange" />
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 mx-2" />
              {onSignOut && (
                <DropdownMenuItem 
                  className="text-red-600 hover:bg-red-50 rounded-lg mx-1 my-1 font-medium"
                  onClick={onSignOut}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
