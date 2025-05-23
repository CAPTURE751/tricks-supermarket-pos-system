
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
import { useAuth } from '@/hooks/useAuth';
import { mockBranches, mockDevices } from '../data/mockData';
import { Branch, BranchStatus } from '../types/admin-types';

interface BranchesTabProps {
  user: User;
}

export const BranchesTab = ({ user }: BranchesTabProps) => {
  const { users } = useAuth();
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [branchTab, setBranchTab] = useState<string>('details');
  
  const [branchForm, setBranchForm] = useState<Branch>({
    id: '',
    name: '',
    address: '',
    city: '',
    region: '',
    phone: '',
    email: '',
    manager: '',
    managerId: '',
    status: 'active',
    openingTime: '08:00',
    closingTime: '20:00',
    createdAt: '',
    updatedAt: '',
  });
  
  const selectedBranch = branches.find(b => b.id === selectedBranchId);
  const branchDevices = mockDevices.filter(d => d.branchId === selectedBranchId);
  const availableManagers = users.filter(u => u.role === 'Manager');

  const handleOpenBranchDialog = (branch?: Branch) => {
    if (branch) {
      setEditMode(true);
      setSelectedBranchId(branch.id);
      setBranchForm({...branch});
    } else {
      setEditMode(false);
      setSelectedBranchId(null);
      setBranchForm({
        id: `branch-${Date.now()}`,
        name: '',
        address: '',
        city: '',
        region: '',
        phone: '',
        email: '',
        manager: '',
        managerId: '',
        status: 'active',
        openingTime: '08:00',
        closingTime: '20:00',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setBranchDialogOpen(true);
    setBranchTab('details');
  };

  const handleSaveBranch = () => {
    if (!branchForm.name || !branchForm.address || !branchForm.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedBranch: Branch = {
      ...branchForm,
      updatedAt: new Date().toISOString(),
    };

    if (editMode) {
      setBranches(branches.map(b => b.id === updatedBranch.id ? updatedBranch : b));
      toast.success("Branch updated successfully");
    } else {
      setBranches([...branches, updatedBranch]);
      toast.success("Branch added successfully");
    }
    
    setBranchDialogOpen(false);
  };

  const getBadgeColorByStatus = (status: BranchStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'maintenance': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Branch Management</CardTitle>
          <Button 
            onClick={() => handleOpenBranchDialog()} 
            className="bg-green-500 hover:bg-green-600"
          >
            Add Branch
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-700/50">
                <TableHead className="text-gray-200">Branch Name</TableHead>
                <TableHead className="text-gray-200">Location</TableHead>
                <TableHead className="text-gray-200">Manager</TableHead>
                <TableHead className="text-gray-200">Status</TableHead>
                <TableHead className="text-gray-200 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map(branch => (
                <TableRow key={branch.id} className="hover:bg-gray-700/50">
                  <TableCell className="font-medium text-white">{branch.name}</TableCell>
                  <TableCell className="text-gray-300">
                    {branch.city}, {branch.region}
                  </TableCell>
                  <TableCell className="text-gray-300">{branch.manager}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeColorByStatus(branch.status)}>
                      {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenBranchDialog(branch)}
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
      
      {/* Branch Dialog */}
      <Dialog open={branchDialogOpen} onOpenChange={setBranchDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editMode ? `Manage Branch: ${selectedBranch?.name}` : "Add New Branch"}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs 
            defaultValue="details" 
            value={branchTab}
            onValueChange={setBranchTab}
          >
            <TabsList className="bg-gray-700 border-gray-600">
              <TabsTrigger value="details">Branch Details</TabsTrigger>
              {editMode && <TabsTrigger value="devices">Devices</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name*</Label>
                    <Input
                      id="branchName"
                      value={branchForm.name}
                      onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branchStatus">Status</Label>
                    <Select 
                      value={branchForm.status} 
                      onValueChange={(value) => setBranchForm({ ...branchForm, status: value as BranchStatus })}
                    >
                      <SelectTrigger id="branchStatus" className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branchAddress">Address*</Label>
                  <Input
                    id="branchAddress"
                    value={branchForm.address}
                    onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branchCity">City*</Label>
                    <Input
                      id="branchCity"
                      value={branchForm.city}
                      onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branchRegion">Region</Label>
                    <Input
                      id="branchRegion"
                      value={branchForm.region}
                      onChange={(e) => setBranchForm({ ...branchForm, region: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branchPhone">Phone*</Label>
                    <Input
                      id="branchPhone"
                      value={branchForm.phone}
                      onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branchEmail">Email</Label>
                    <Input
                      id="branchEmail"
                      value={branchForm.email || ''}
                      onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingTime">Opening Time</Label>
                    <Input
                      id="openingTime"
                      type="time"
                      value={branchForm.openingTime}
                      onChange={(e) => setBranchForm({ ...branchForm, openingTime: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="closingTime">Closing Time</Label>
                    <Input
                      id="closingTime"
                      type="time"
                      value={branchForm.closingTime}
                      onChange={(e) => setBranchForm({ ...branchForm, closingTime: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branchManager">Branch Manager</Label>
                  <Select 
                    value={branchForm.manager || ''} 
                    onValueChange={(value) => {
                      const selectedManager = availableManagers.find(m => m.name === value);
                      setBranchForm({ 
                        ...branchForm, 
                        manager: value,
                        managerId: selectedManager?.id
                      });
                    }}
                  >
                    <SelectTrigger id="branchManager" className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {availableManagers.map(manager => (
                        <SelectItem key={manager.id} value={manager.name}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="devices" className="pt-4">
              {branchDevices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-700/50">
                      <TableHead className="text-gray-200">Device Name</TableHead>
                      <TableHead className="text-gray-200">Type</TableHead>
                      <TableHead className="text-gray-200">Serial Number</TableHead>
                      <TableHead className="text-gray-200">Status</TableHead>
                      <TableHead className="text-gray-200">Last Online</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branchDevices.map(device => (
                      <TableRow key={device.id} className="hover:bg-gray-700/50">
                        <TableCell className="font-medium text-white">{device.name}</TableCell>
                        <TableCell className="text-gray-300 capitalize">
                          {device.type.replace('_', ' ')}
                        </TableCell>
                        <TableCell className="text-gray-300">{device.serialNumber}</TableCell>
                        <TableCell>
                          <Badge className={`${
                            device.status === 'online' ? 'bg-green-500' : 
                            device.status === 'offline' ? 'bg-gray-500' : 
                            device.status === 'maintenance' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}>
                            {device.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {device.lastOnline ? new Date(device.lastOnline).toLocaleString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="bg-gray-700 p-4 rounded text-gray-300 text-center">
                  No devices registered for this branch
                </div>
              )}
              
              <div className="mt-4">
                <Button variant="outline" className="border-gray-600 hover:bg-gray-600 text-white">
                  Add New Device
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setBranchDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBranch} className="bg-green-500 hover:bg-green-600">
              {editMode ? "Update Branch" : "Add Branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
