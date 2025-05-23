
import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Cashier' | 'Accountant' | 'Stock Controller' | 'Guest';
  branch: string;
  pin: string;
  profileImage?: string;
  lastActive?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUsers: User[] = [
  { id: '1', name: 'Jeff Tricks', role: 'Admin', branch: 'Main Branch', pin: '1234', profileImage: undefined },
  { id: '2', name: 'Jane Doe', role: 'Manager', branch: 'Main Branch', pin: '5678', profileImage: undefined },
  { id: '3', name: 'John Smith', role: 'Cashier', branch: 'Main Branch', pin: '9012', profileImage: undefined },
  { id: '4', name: 'Mary Johnson', role: 'Accountant', branch: 'Branch 2', pin: '3456', profileImage: undefined },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Update last active time
    setUsers(prev => prev.map(u => 
      u.id === userData.id 
        ? { ...u, lastActive: new Date().toISOString() }
        : u
    ));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      users,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
