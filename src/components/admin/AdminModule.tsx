
import { useState } from 'react';
import { User, useAuth } from '@/hooks/useAuth';

interface AdminModuleProps {
  user: User;
}

export const AdminModule = ({ user }: AdminModuleProps) => {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Cashier' as User['role'],
    branch: 'Main Branch',
    pin: ''
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.pin) return;
    
    const userToAdd: User = {
      id: Date.now().toString(),
      name: newUser.name,
      role: newUser.role,
      branch: newUser.branch,
      pin: newUser.pin
    };
    
    addUser(userToAdd);
    setNewUser({ name: '', role: 'Cashier', branch: 'Main Branch', pin: '' });
    setShowAddUser(false);
  };

  if (user.role !== 'Admin') {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-white text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-red-400">You don't have permission to access this module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-2xl font-bold">User Management</h2>
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add User
          </button>
        </div>

        {/* User List */}
        <div className="space-y-4">
          {users.map(u => (
            <div key={u.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">{u.name}</h3>
                <p className="text-gray-300 text-sm">{u.role} • {u.branch}</p>
                {u.lastActive && (
                  <p className="text-gray-400 text-xs">
                    Last active: {new Date(u.lastActive).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => deleteUser(u.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-white text-xl font-bold mb-4">Add New User</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
              />
              
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
              >
                <option value="Cashier">Cashier</option>
                <option value="Manager">Manager</option>
                <option value="Accountant">Accountant</option>
                <option value="Stock Controller">Stock Controller</option>
                <option value="Guest">Guest</option>
                <option value="Admin">Admin</option>
              </select>
              
              <input
                type="text"
                placeholder="Branch"
                value={newUser.branch}
                onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
              />
              
              <input
                type="password"
                placeholder="PIN (4 digits)"
                value={newUser.pin}
                onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                maxLength={4}
              />
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
              >
                Add User
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
