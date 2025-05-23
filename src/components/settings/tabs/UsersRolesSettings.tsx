
import { useEffect, useState } from 'react';
import { User, useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface UsersRolesSettingsProps {
  user: User;
}

const permissions = [
  { id: 'sales_view', label: 'View Sales', module: 'sales' },
  { id: 'sales_create', label: 'Create Sales', module: 'sales' },
  { id: 'sales_discount', label: 'Apply Discounts', module: 'sales' },
  { id: 'sales_refund', label: 'Process Refunds', module: 'sales' },
  { id: 'inventory_view', label: 'View Inventory', module: 'inventory' },
  { id: 'inventory_edit', label: 'Edit Inventory', module: 'inventory' },
  { id: 'reports_view', label: 'View Reports', module: 'reports' },
  { id: 'customers_view', label: 'View Customers', module: 'customers' },
  { id: 'customers_edit', label: 'Edit Customers', module: 'customers' },
  { id: 'settings_view', label: 'View Settings', module: 'settings' },
  { id: 'settings_edit', label: 'Edit Settings', module: 'settings' },
  { id: 'users_manage', label: 'Manage Users', module: 'settings' },
];

export const UsersRolesSettings = ({ user }: UsersRolesSettingsProps) => {
  const { users, addUser, deleteUser } = useAuth();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Cashier' as User['role'],
    branch: 'Main Branch',
    pin: ''
  });
  
  const [selectedRole, setSelectedRole] = useState('Cashier');
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch role permissions from backend
    // Here we're simulating predefined permissions
    if (selectedRole === 'Cashier') {
      setRolePermissions(['sales_view', 'sales_create', 'customers_view']);
    } else if (selectedRole === 'Manager') {
      setRolePermissions([
        'sales_view', 'sales_create', 'sales_discount', 'sales_refund',
        'inventory_view', 'customers_view', 'customers_edit', 'reports_view',
        'settings_view'
      ]);
    } else if (selectedRole === 'Admin') {
      setRolePermissions(permissions.map(p => p.id));
    }
  }, [selectedRole]);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.pin) {
      toast.error("Name and PIN are required");
      return;
    }
    
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
    toast.success("User added successfully");
  };
  
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setRolePermissions(prev => [...prev, permissionId]);
    } else {
      setRolePermissions(prev => prev.filter(id => id !== permissionId));
    }
  };
  
  const handleSaveRolePermissions = () => {
    // In a real app, this would save to backend
    toast.success(`Permissions for ${selectedRole} role updated`);
  };

  const handleSaveSessionSettings = () => {
    toast.success("Session settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-gray-700 border border-gray-600">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="sessions">Login & Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="pt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Users</CardTitle>
              <Button 
                onClick={() => setShowAddUser(true)} 
                className="bg-green-500 hover:bg-green-600"
              >
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
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
                      <Button 
                        variant="outline" 
                        className="border-gray-600 hover:bg-gray-600 text-white"
                      >
                        Edit
                      </Button>
                      {u.id !== user.id && (
                        <Button 
                          onClick={() => {
                            deleteUser(u.id);
                            toast.success("User deleted");
                          }}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Add User Modal */}
          {showAddUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg w-96">
                <h3 className="text-white text-xl font-bold mb-4">Add New User</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName" className="text-gray-200">Name</Label>
                    <Input
                      id="userName"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userRole" className="text-gray-200">Role</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value) => setNewUser({ ...newUser, role: value as User['role'] })}
                    >
                      <SelectTrigger id="userRole" className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="Cashier">Cashier</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Accountant">Accountant</SelectItem>
                        <SelectItem value="Stock Controller">Stock Controller</SelectItem>
                        <SelectItem value="Guest">Guest</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userBranch" className="text-gray-200">Branch</Label>
                    <Input
                      id="userBranch"
                      value={newUser.branch}
                      onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userPin" className="text-gray-200">PIN (4 digits)</Label>
                    <Input
                      id="userPin"
                      type="password"
                      value={newUser.pin}
                      onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      maxLength={4}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <Button
                    onClick={handleAddUser}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    Add User
                  </Button>
                  <Button
                    onClick={() => setShowAddUser(false)}
                    className="flex-1"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="roles" className="pt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4 items-center">
                  <Label htmlFor="roleSelect" className="text-gray-200 w-24">Select Role:</Label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={setSelectedRole}
                  >
                    <SelectTrigger id="roleSelect" className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="Cashier">Cashier</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                      <SelectItem value="Stock Controller">Stock Controller</SelectItem>
                      <SelectItem value="Guest">Guest</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">Permissions for {selectedRole}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={permission.id}
                          checked={rolePermissions.includes(permission.id)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={permission.id} className="text-gray-200">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={handleSaveRolePermissions}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Save Permissions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions" className="pt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Login & Session Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className="text-gray-200">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number" 
                      defaultValue="30"
                      className="bg-gray-700 border-gray-600 text-white" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts" className="text-gray-200">Max Login Attempts</Label>
                    <Input 
                      id="maxLoginAttempts" 
                      type="number" 
                      defaultValue="3"
                      className="bg-gray-700 border-gray-600 text-white" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">Login Methods</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="loginPin" defaultChecked />
                    <Label htmlFor="loginPin" className="text-gray-200">PIN Login</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="loginPassword" />
                    <Label htmlFor="loginPassword" className="text-gray-200">Username/Password</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="loginFingerprint" />
                    <Label htmlFor="loginFingerprint" className="text-gray-200">Fingerprint (if supported by device)</Label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">Password Reset</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="resetAdmin" defaultChecked />
                    <Label htmlFor="resetAdmin" className="text-gray-200">Require admin approval</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="resetSecurityQuestion" />
                    <Label htmlFor="resetSecurityQuestion" className="text-gray-200">Enable security question recovery</Label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleSaveSessionSettings}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Save Session Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
