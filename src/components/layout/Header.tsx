
import { useState, useEffect } from 'react';
import { User } from '@/hooks/useAuth';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  user: User;
}

export const Header = ({ user }: HeaderProps) => {
  const { logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Africa/Nairobi'
    }) + ' EAT';
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-KE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Africa/Nairobi'
    });
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">JT</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Jeff Tricks Supermarket</h1>
            <p className="text-gray-300 text-sm">Point of Sale System</p>
          </div>
        </div>

        {/* Center Info */}
        <div className="text-center">
          <div className="text-white font-mono text-lg">{formatTime()}</div>
          <div className="text-gray-300 text-sm">{formatDate()}</div>
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-white font-semibold">{user.name}</div>
            <div className="text-gray-300 text-sm">{user.role} • {user.branch}</div>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-white font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
