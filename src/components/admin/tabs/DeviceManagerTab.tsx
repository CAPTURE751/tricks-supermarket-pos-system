
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockDevices, mockBranches, mockUserSessions } from '../data/mockData';
import { Device, DeviceStatus } from '../types/admin-types';

interface DeviceManagerTabProps {
  user: User;
}

export const DeviceManagerTab = ({ user }: DeviceManagerTabProps) => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [deviceTab, setDeviceTab] = useState<string>('details');
  
  const [deviceForm, setDeviceForm] = useState<Device>({
    id: '',
    name: '',
    type: 'pos_terminal',
    serialNumber: '',
    branchId: '',
    branchName: '',
    assignedUsers: [],
    status: 'offline',
  });
  
  const selectedDevice = devices.find(d => d.id === selectedDeviceId);
  const deviceSessions = mockUserSessions.filter(s => s.deviceId === selectedDeviceId);
  
  const handleOpenDeviceDialog = (device?: Device) => {
    if (device) {
      setEditMode(true);
      setSelectedDeviceId(device.id);
      setDeviceForm({...device});
    } else {
      setEditMode(false);
      setSelectedDeviceId(null);
      setDeviceForm({
        id: `dev-${Date.now()}`,
        name: '',
        type: 'pos_terminal',
        serialNumber: '',
        branchId: '',
        branchName: '',
        assignedUsers: [],
        status: 'offline',
      });
    }
    
    setDeviceDialogOpen(true);
    setDeviceTab('details');
  };

  const handleSaveDevice = () => {
    if (!deviceForm.name || !deviceForm.serialNumber || !deviceForm.branchId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Set branch name based on branch ID
    const selectedBranch = mockBranches.find(b => b.id === deviceForm.branchId);
    const updatedDevice: Device = {
      ...deviceForm,
      branchName: selectedBranch?.name || '',
    };

    if (editMode) {
      setDevices(devices.map(d => d.id === updatedDevice.id ? updatedDevice : d));
      toast.success("Device updated successfully");
    } else {
      setDevices([...devices, updatedDevice]);
      toast.success("Device added successfully");
    }
    
    setDeviceDialogOpen(false);
  };

  const handleChangeDeviceStatus = (id: string, status: DeviceStatus) => {
    setDevices(devices.map(device => {
      if (device.id === id) {
        const updatedDevice = { 
          ...device, 
          status,
          lastOnline: status === 'online' ? new Date().toISOString() : device.lastOnline,
        };
        return updatedDevice;
      }
      return device;
    }));
    
    toast.success(`Device status changed to ${status}`);
  };

  const getDeviceStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'maintenance': return 'bg-amber-500';
      case 'locked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const terminateSession = (sessionId: string) => {
    // In a real app, this would terminate the session
    toast.success("Session terminated");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Device Management</CardTitle>
            <CardDescription className="text-gray-400">
              Manage all POS devices across branches
            </CardDescription>
          </div>
          <Button 
            onClick={() => handleOpenDeviceDialog()} 
            className="bg-green-500 hover:bg-green-600"
          >
            Register New Device
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-700/50">
                <TableHead className="text-gray-200">Device Name</TableHead>
                <TableHead className="text-gray-200">Type</TableHead>
                <TableHead className="text-gray-200">Branch</TableHead>
                <TableHead className="text-gray-200">Status</TableHead>
                <TableHead className="text-gray-200">Last Online</TableHead>
                <TableHead className="text-gray-200 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map(device => (
                <TableRow key={device.id} className="hover:bg-gray-700/50">
                  <TableCell>
                    <div className="font-medium text-white">{device.name}</div>
                    <div className="text-xs text-gray-400">{device.serialNumber}</div>
                  </TableCell>
                  <TableCell className="text-gray-300 capitalize">
                    {device.type.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="text-gray-300">{device.branchName}</TableCell>
                  <TableCell>
                    <Badge className={getDeviceStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {device.lastOnline ? new Date(device.lastOnline).toLocaleString() : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDeviceDialog(device)}
                        className="border-gray-600 hover:bg-gray-600 text-white text-xs"
                      >
                        Manage
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Device Dialog */}
      <Dialog open={deviceDialogOpen} onOpenChange={setDeviceDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editMode ? `Manage Device: ${selectedDevice?.name}` : "Register New Device"}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs
            defaultValue="details" 
            value={deviceTab}
            onValueChange={setDeviceTab}
          >
            <TabsList className="bg-gray-700 border-gray-600">
              <TabsTrigger value="details">Details</TabsTrigger>
              {editMode && <TabsTrigger value="sessions">Active Sessions</TabsTrigger>}
              {editMode && <TabsTrigger value="settings">Advanced Settings</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceName">Device Name*</Label>
                    <Input
                      id="deviceName"
                      value={deviceForm.name}
                      onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
                      placeholder="e.g. Main Register 1"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deviceType">Device Type*</Label>
                    <Select 
                      value={deviceForm.type} 
                      onValueChange={(value) => setDeviceForm({ 
                        ...deviceForm, 
                        type: value as 'pos_terminal' | 'tablet' | 'desktop' | 'mobile' 
                      })}
                    >
                      <SelectTrigger id="deviceType" className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="pos_terminal">POS Terminal</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number*</Label>
                    <Input
                      id="serialNumber"
                      value={deviceForm.serialNumber}
                      onChange={(e) => setDeviceForm({ ...deviceForm, serialNumber: e.target.value })}
                      placeholder="e.g. POS-2023-001"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch*</Label>
                    <Select 
                      value={deviceForm.branchId} 
                      onValueChange={(value) => setDeviceForm({ ...deviceForm, branchId: value })}
                    >
                      <SelectTrigger id="branch" className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {mockBranches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {editMode && (
                  <div className="space-y-2">
                    <Label htmlFor="status">Device Status</Label>
                    <Select 
                      value={deviceForm.status} 
                      onValueChange={(value) => setDeviceForm({ 
                        ...deviceForm, 
                        status: value as DeviceStatus 
                      })}
                    >
                      <SelectTrigger id="status" className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="locked">Locked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {editMode && (
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={deviceForm.notes || ''}
                      onChange={(e) => setDeviceForm({ ...deviceForm, notes: e.target.value })}
                      placeholder="Additional notes about this device"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="sessions" className="pt-4">
              {deviceSessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-700/50">
                      <TableHead className="text-gray-200">User</TableHead>
                      <TableHead className="text-gray-200">Role</TableHead>
                      <TableHead className="text-gray-200">Login Time</TableHead>
                      <TableHead className="text-gray-200">Last Active</TableHead>
                      <TableHead className="text-gray-200">IP Address</TableHead>
                      <TableHead className="text-gray-200 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deviceSessions.map(session => (
                      <TableRow key={session.id} className="hover:bg-gray-700/50">
                        <TableCell className="font-medium text-white">{session.userName}</TableCell>
                        <TableCell className="text-gray-300">{session.userRole}</TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(session.loginTime).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(session.lastActiveTime).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-300">{session.ipAddress}</TableCell>
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
            </TabsContent>
            
            <TabsContent value="settings" className="pt-4">
              <div className="space-y-4 bg-gray-700 p-4 rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="ipAddress">IP Address</Label>
                  <Input
                    id="ipAddress"
                    value={deviceForm.ipAddress || ''}
                    onChange={(e) => setDeviceForm({ ...deviceForm, ipAddress: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="e.g. 192.168.1.100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="osVersion">OS Version</Label>
                  <Input
                    id="osVersion"
                    value={deviceForm.osVersion || ''}
                    onChange={(e) => setDeviceForm({ ...deviceForm, osVersion: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="e.g. Windows 10 Pro"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appVersion">App Version</Label>
                  <Input
                    id="appVersion"
                    value={deviceForm.appVersion || ''}
                    onChange={(e) => setDeviceForm({ ...deviceForm, appVersion: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="e.g. v2.3.1"
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    className="border-amber-600 hover:bg-amber-600 text-white"
                  >
                    Remote Lock
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-blue-600 hover:bg-blue-600 text-white"
                  >
                    Force Update
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeviceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDevice} className="bg-green-500 hover:bg-green-600">
              {editMode ? "Update Device" : "Register Device"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
