
import { useState } from 'react';
import { UserTile } from './UserTile';
import { PINKeypad } from './PINKeypad';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/hooks/useAuth';

export const LoginScreen = () => {
  const { users, login } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState('');

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setPin('');
    setError('');
  };

  const handlePinEntry = (digit: string) => {
    if (locked) return;
    
    if (digit === 'clear') {
      setPin('');
      setError('');
      return;
    }
    
    if (digit === 'enter') {
      if (selectedUser && pin === selectedUser.pin) {
        login(selectedUser);
        setPin('');
        setAttempts(0);
      } else {
        setAttempts(prev => prev + 1);
        setError('Invalid PIN. Please try again.');
        setPin('');
        
        if (attempts >= 2) {
          setLocked(true);
          setError('Account locked after 3 failed attempts. Contact admin.');
        }
      }
      return;
    }
    
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Africa/Nairobi'
    }) + ' EAT';
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Africa/Nairobi'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">JT</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Jeff Tricks Supermarket</h1>
            <p className="text-gray-300 text-sm">Point of Sale System</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-mono text-lg">{getCurrentTime()}</div>
          <div className="text-gray-300 text-sm">{getCurrentDate()}</div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* User Selection */}
        <div className="flex-1 p-8">
          <h2 className="text-white text-2xl font-bold mb-6">Select User</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {users.map(user => (
              <UserTile
                key={user.id}
                user={user}
                isSelected={selectedUser?.id === user.id}
                onClick={() => handleUserSelect(user)}
              />
            ))}
          </div>
          
          {selectedUser && (
            <div className="mt-8 bg-gray-800 p-6 rounded-lg">
              <h3 className="text-white text-lg font-semibold mb-2">
                Welcome, {selectedUser.name}
              </h3>
              <p className="text-gray-300">
                Role: {selectedUser.role} | Branch: {selectedUser.branch}
              </p>
            </div>
          )}
        </div>

        {/* PIN Entry */}
        {selectedUser && (
          <div className="w-96 bg-gray-800 p-8 border-l border-gray-700">
            <h3 className="text-white text-xl font-bold mb-6">Enter PIN</h3>
            
            <div className="mb-6">
              <div className="flex justify-center space-x-2 mb-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 ${
                      i < pin.length ? 'bg-green-500 border-green-500' : 'border-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              {error && (
                <p className="text-red-400 text-sm text-center mb-4">{error}</p>
              )}
            </div>

            <PINKeypad onKeyPress={handlePinEntry} disabled={locked} />
            
            <div className="mt-6 space-y-2">
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-lg font-semibold transition-colors">
                Forgot PIN?
              </button>
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Back to Users
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-4 text-center border-t border-gray-700">
        <p className="text-gray-400">Jeff Tricks Supermarket, Nairobi | Hotline: +254700123456</p>
      </div>
    </div>
  );
};
