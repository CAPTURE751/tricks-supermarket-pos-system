
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockRoles, mockPermissions } from '../data/mockData';
import { CustomRole, Permission } from '../types/admin-types';

interface RolesPermissionsTabProps {
  user: User;
}

export const RolesPermissionsTab = ({ user }: RolesPermissionsTabProps) => {
  const [roles, setRoles] = useState<CustomRole[]>(mockRoles);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    id: '',
    name: '',
    description: '',
    permissions: [] as string[], // permission IDs
  });
  
  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const handleOpenRoleDialog = (role?: CustomRole) => {
    if (role) {
      setEditMode(true);
      setSelectedRoleId(role.id);
      setRoleFormData({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions.map(p => p.id),
      });
    } else {
      setEditMode(false);
      setSelectedRoleId(null);
      setRoleFormData({
        id: `role-${Date.now()}`,
        name: '',
        description: '',
        permissions: [],
      });
    }
    setRoleDialogOpen(true);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setRoleFormData({
        ...roleFormData,
        permissions: [...roleFormData.permissions, permissionId],
      });
    } else {
      setRoleFormData({
        ...roleFormData,
        permissions: roleFormData.permissions.filter(id => id !== permissionId),
      });
    }
  };

  const handleSaveRole = () => {
    if (!roleFormData.name) {
      toast.error("Role name is required");
      return;
    }

    const rolePermissions = mockPermissions.filter(p => roleFormData.permissions.includes(p.id));
    
    const newRole: CustomRole = {
      id: roleFormData.id,
      name: roleFormData.name,
      description: roleFormData.description,
      permissions: rolePermissions,
      createdAt: editMode ? selectedRole!.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userCount: editMode ? selectedRole!.userCount : 0,
    };

    if (editMode) {
      setRoles(roles.map(r => r.id === newRole.id ? newRole : r));
      toast.success("Role updated successfully");
    } else {
      setRoles([...roles, newRole]);
      toast.success("Role created successfully");
    }
    
    setRoleDialogOpen(false);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(r => r.id !== roleId));
    toast.success("Role deleted successfully");
  };

  const groupedPermissions = mockPermissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Roles & Permissions</CardTitle>
          <Button 
            onClick={() => handleOpenRoleDialog()} 
            className="bg-green-500 hover:bg-green-600"
          >
            Create Role
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-700/50">
                <TableHead className="text-gray-200">Role Name</TableHead>
                <TableHead className="text-gray-200">Description</TableHead>
                <TableHead className="text-gray-200 text-center">Users</TableHead>
                <TableHead className="text-gray-200 text-center">Permissions</TableHead>
                <TableHead className="text-gray-200 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.id} className="hover:bg-gray-700/50">
                  <TableCell className="font-medium text-white">{role.name}</TableCell>
                  <TableCell className="text-gray-300">{role.description}</TableCell>
                  <TableCell className="text-center text-gray-300">{role.userCount}</TableCell>
                  <TableCell className="text-center text-gray-300">{role.permissions.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenRoleDialog(role)}
                        className="border-gray-600 hover:bg-gray-600 text-white text-xs"
                      >
                        Edit
                      </Button>
                      {role.userCount === 0 && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-xs"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editMode ? `Edit Role: ${selectedRole?.name}` : "Create New Role"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={roleFormData.name}
                  onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Textarea
                  id="roleDescription"
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white resize-none"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Permissions</Label>
              
              {Object.entries(groupedPermissions).map(([module, permissions]) => (
                <Card key={module} className="bg-gray-700 border-gray-600">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base text-white capitalize">{module}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={permission.id}
                            checked={roleFormData.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                          />
                          <Label 
                            htmlFor={permission.id} 
                            className="text-gray-200 text-sm cursor-pointer"
                          >
                            {permission.description}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRole} className="bg-green-500 hover:bg-green-600">
              {editMode ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
