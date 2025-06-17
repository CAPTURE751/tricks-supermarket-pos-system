
import { useState } from 'react';
import { useAuth } from '@/components/auth/AdminOnlyAuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export const UserManagement = () => {
  const { createUser, profile } = useAuth();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'Cashier' as const,
    branch_id: '',
    pin: ''
  });

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      toast.error('Email, password, and name are required');
      return;
    }

    if (newUser.pin && (newUser.pin.length !== 4 || isNaN(Number(newUser.pin)))) {
      toast.error('PIN must be a 4-digit number');
      return;
    }

    setIsCreating(true);
    
    const { error } = await createUser({
      email: newUser.email,
      password: newUser.password,
      name: newUser.name,
      role: newUser.role,
      branch_id: newUser.branch_id || undefined,
      pin: newUser.pin || undefined
    });

    if (!error) {
      setNewUser({
        email: '',
        password: '',
        name: '',
        role: 'Cashier',
        branch_id: '',
        pin: ''
      });
      setShowCreateUser(false);
    }

    setIsCreating(false);
  };

  // Only admins can see this component
  if (profile?.role !== 'Admin') {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <p className="text-red-400">Access denied. Only administrators can manage users.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">User Management</CardTitle>
          <Button 
            onClick={() => setShowCreateUser(true)} 
            className="bg-green-500 hover:bg-green-600"
          >
            Create User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Secure User Creation</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Only administrators can create new users</li>
                <li>• Users cannot self-register</li>
                <li>• Each user is assigned a role that determines their access level</li>
                <li>• Cashiers can only access the POS sales module</li>
                <li>• Managers have broader access to multiple modules</li>
                <li>• Admins have full system access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create New User</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <Input
                id="userName"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPassword">Password</Label>
              <Input
                id="userPassword"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter secure password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser({ ...newUser, role: value as any })}
              >
                <SelectTrigger id="userRole" className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="Cashier">Cashier (Sales Only)</SelectItem>
                  <SelectItem value="Manager">Manager (Most Modules)</SelectItem>
                  <SelectItem value="Accountant">Accountant (Reports & Cash)</SelectItem>
                  <SelectItem value="Stock Controller">Stock Controller (Inventory)</SelectItem>
                  <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userPin">PIN (4 digits, optional)</Label>
              <Input
                id="userPin"
                type="password"
                value={newUser.pin}
                onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter 4-digit PIN (optional)"
                maxLength={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUser(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateUser} 
              className="bg-green-500 hover:bg-green-600"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
