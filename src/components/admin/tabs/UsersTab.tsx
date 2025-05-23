
import { useState } from 'react';
import { User, useAuth } from '@/hooks/useAuth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockUserSessions } from "../data/mockData";

interface UsersTabProps {
  user: User;
}

export const UsersTab = ({ user }: UsersTabProps) => {
  const { users, addUser, deleteUser } = useAuth();
  const [showAddUser, setShowAddUser] = useState(false);
  const [showResetPin, setShowResetPin] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Cashier' as User['role'],
    branch: 'Main Branch',
    pin: ''
  });
  
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  const selectedUser = users.find(u => u.id === selectedUserId);
  const userSessions = mockUserSessions.filter(session => session.userId === selectedUserId);
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.pin) {
      toast.error("Name and PIN are required");
      return;
    }
    
    if (newUser.pin.length !== 4 || isNaN(Number(newUser.pin))) {
      toast.error("PIN must be a 4-digit number");
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
  
  const handleResetPin = () => {
    if (!newPin || !confirmPin) {
      toast.error("Both fields are required");
      return;
    }
    
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      toast.error("PIN must be a 4-digit number");
      return;
    }
    
    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    
    // In a real app, this would update the PIN in the database
    toast.success("PIN reset successfully");
    setShowResetPin(false);
    setNewPin('');
    setConfirmPin('');
  };
  
  const openUserDetails = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserDetails(true);
  };
  
  const openResetPin = (userId: string) => {
    setSelectedUserId(userId);
    setShowResetPin(true);
  };

  const terminateSession = (sessionId: string) => {
    // In a real app, this would terminate the session in the database
    toast.success("Session terminated");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">User Management</CardTitle>
          <Button onClick={() => setShowAddUser(true)} className="bg-green-500 hover:bg-green-600">
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-700/50">
                <TableHead className="text-gray-200">Name</TableHead>
                <TableHead className="text-gray-200">Role</TableHead>
                <TableHead className="text-gray-200">Branch</TableHead>
                <TableHead className="text-gray-200">Status</TableHead>
                <TableHead className="text-gray-200 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => {
                const isActive = mockUserSessions.some(s => s.userId === u.id && s.isActive);
                
                return (
                  <TableRow key={u.id} className="hover:bg-gray-700/50">
                    <TableCell className="font-medium text-white">{u.name}</TableCell>
                    <TableCell className="text-gray-300">{u.role}</TableCell>
                    <TableCell className="text-gray-300">{u.branch}</TableCell>
                    <TableCell>
                      <Badge className={`${isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                        {isActive ? 'Online' : 'Offline'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openUserDetails(u.id)}
                          className="border-gray-600 hover:bg-gray-600 text-white text-xs"
                        >
                          Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openResetPin(u.id)}
                          className="border-amber-600 hover:bg-amber-600 text-white text-xs"
                        >
                          Reset PIN
                        </Button>
                        {u.id !== user.id && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              deleteUser(u.id);
                              toast.success("User deleted");
                            }}
                            className="text-xs"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New User</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <Input
                id="userName"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
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
              <Label htmlFor="userBranch">Branch</Label>
              <Select 
                value={newUser.branch} 
                onValueChange={(value) => setNewUser({ ...newUser, branch: value })}
              >
                <SelectTrigger id="userBranch" className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="Main Branch">Main Branch</SelectItem>
                  <SelectItem value="Downtown Shop">Downtown Shop</SelectItem>
                  <SelectItem value="Westside Mall">Westside Mall</SelectItem>
                  <SelectItem value="Airport Shop">Airport Shop</SelectItem>
                  <SelectItem value="East End">East End</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userPin">PIN (4 digits)</Label>
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
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
            <Button onClick={handleAddUser} className="bg-green-500 hover:bg-green-600">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset PIN Dialog */}
      <Dialog open={showResetPin} onOpenChange={setShowResetPin}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Reset User PIN</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedUser && (
              <p className="text-gray-300">Resetting PIN for: <span className="font-semibold text-white">{selectedUser.name}</span></p>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="newPin">New PIN (4 digits)</Label>
              <Input
                id="newPin"
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                maxLength={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                maxLength={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPin(false)}>Cancel</Button>
            <Button onClick={handleResetPin} className="bg-green-500 hover:bg-green-600">
              Reset PIN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">User Details</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <div className="bg-gray-700 p-2 rounded-md text-white">{selectedUser.name}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="bg-gray-700 p-2 rounded-md text-white">{selectedUser.role}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <div className="bg-gray-700 p-2 rounded-md text-white">{selectedUser.branch}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>Last Active</Label>
                  <div className="bg-gray-700 p-2 rounded-md text-white">
                    {selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleString() : 'Never logged in'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Account Status</Label>
                  <Switch defaultChecked />
                </div>
                <div className="text-sm text-gray-400">
                  Toggle to enable/disable user account access
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label>Active Sessions</Label>
                {userSessions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-700/50">
                        <TableHead className="text-gray-200">Device</TableHead>
                        <TableHead className="text-gray-200">Branch</TableHead>
                        <TableHead className="text-gray-200">Login Time</TableHead>
                        <TableHead className="text-gray-200">Last Active</TableHead>
                        <TableHead className="text-gray-200 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userSessions.map(session => (
                        <TableRow key={session.id} className="hover:bg-gray-700/50">
                          <TableCell className="text-white">{session.deviceName}</TableCell>
                          <TableCell className="text-gray-300">{session.branchName}</TableCell>
                          <TableCell className="text-gray-300">{new Date(session.loginTime).toLocaleString()}</TableCell>
                          <TableCell className="text-gray-300">{new Date(session.lastActiveTime).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => terminateSession(session.id)}
                            >
                              Terminate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="bg-gray-700 p-4 rounded-md text-gray-300 text-center">
                    No active sessions
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
