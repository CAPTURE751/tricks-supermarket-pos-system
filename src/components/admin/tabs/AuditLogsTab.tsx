
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockAuditLogs } from '../data/mockData';
import { AuditActionType } from '../types/admin-types';

interface AuditLogsTabProps {
  user: User;
}

export const AuditLogsTab = ({ user }: AuditLogsTabProps) => {
  const [filters, setFilters] = useState({
    user: 'all',
    action: 'all',
    module: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
  });
  
  const uniqueUsers = Array.from(new Set(mockAuditLogs.map(log => log.userName)));
  const uniqueModules = Array.from(new Set(mockAuditLogs.map(log => log.module)));
  const actionTypes: AuditActionType[] = [
    'login', 'logout', 'create', 'update', 'delete', 
    'view', 'export', 'permission_change', 'cash_operation', 
    'refund', 'discount', 'system'
  ];
  
  const formatActionType = (action: string): string => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const getActionColor = (action: AuditActionType): string => {
    switch (action) {
      case 'login':
      case 'logout':
        return 'text-blue-400';
      case 'create':
        return 'text-green-400';
      case 'update':
        return 'text-amber-400';
      case 'delete':
        return 'text-red-400';
      case 'permission_change':
        return 'text-purple-400';
      case 'refund':
      case 'discount':
        return 'text-pink-400';
      default:
        return 'text-gray-300';
    }
  };
  
  const filteredLogs = mockAuditLogs.filter(log => {
    // Apply user filter
    if (filters.user !== 'all' && log.userName !== filters.user) {
      return false;
    }
    
    // Apply action filter
    if (filters.action !== 'all' && log.action !== filters.action) {
      return false;
    }
    
    // Apply module filter
    if (filters.module !== 'all' && log.module !== filters.module) {
      return false;
    }
    
    // Apply date range filter
    if (filters.dateFrom) {
      const logDate = new Date(log.timestamp);
      const fromDate = new Date(filters.dateFrom);
      if (logDate < fromDate) {
        return false;
      }
    }
    
    if (filters.dateTo) {
      const logDate = new Date(log.timestamp);
      const toDate = new Date(filters.dateTo);
      // Set to end of day
      toDate.setHours(23, 59, 59, 999);
      if (logDate > toDate) {
        return false;
      }
    }
    
    // Apply search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      return (
        log.userName.toLowerCase().includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm) ||
        log.branchName?.toLowerCase().includes(searchTerm) ||
        log.deviceName?.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });
  
  const handleExport = (format: 'pdf' | 'csv') => {
    // In a real application, this would generate and download a report
    const formatName = format.toUpperCase();
    console.log(`Exporting audit logs to ${formatName}`);
  };

  const handleResetFilters = () => {
    setFilters({
      user: 'all',
      action: 'all',
      module: 'all',
      dateFrom: '',
      dateTo: '',
      searchTerm: '',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Audit Logs</CardTitle>
          <CardDescription className="text-gray-400">
            Monitor all system activity with advanced filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Filter Controls */}
            <div className="bg-gray-700 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userFilter" className="text-gray-300 text-sm">User</Label>
                  <Select 
                    value={filters.user} 
                    onValueChange={(value) => setFilters({...filters, user: value})}
                  >
                    <SelectTrigger id="userFilter" className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.map(user => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="actionFilter" className="text-gray-300 text-sm">Action</Label>
                  <Select 
                    value={filters.action} 
                    onValueChange={(value) => setFilters({...filters, action: value as AuditActionType | 'all'})}
                  >
                    <SelectTrigger id="actionFilter" className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all">All Actions</SelectItem>
                      {actionTypes.map(action => (
                        <SelectItem key={action} value={action}>
                          {formatActionType(action)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="moduleFilter" className="text-gray-300 text-sm">Module</Label>
                  <Select 
                    value={filters.module} 
                    onValueChange={(value) => setFilters({...filters, module: value})}
                  >
                    <SelectTrigger id="moduleFilter" className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all">All Modules</SelectItem>
                      {uniqueModules.map(module => (
                        <SelectItem key={module} value={module} className="capitalize">
                          {module}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="searchTerm" className="text-gray-300 text-sm">Search</Label>
                  <Input
                    id="searchTerm"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                    placeholder="Search logs..."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom" className="text-gray-300 text-sm">Date From</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateTo" className="text-gray-300 text-sm">Date To</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                  className="border-gray-600 hover:bg-gray-600 text-white"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Logs Table */}
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <Table>
                <TableHeader className="bg-gray-700">
                  <TableRow className="hover:bg-gray-700">
                    <TableHead className="text-gray-200">Time</TableHead>
                    <TableHead className="text-gray-200">User</TableHead>
                    <TableHead className="text-gray-200">Action</TableHead>
                    <TableHead className="text-gray-200">Details</TableHead>
                    <TableHead className="text-gray-200">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-gray-800">
                  {filteredLogs.map(log => (
                    <TableRow key={log.id} className="hover:bg-gray-700/50 border-gray-700">
                      <TableCell className="text-gray-300 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{log.userName}</div>
                          <div className="text-xs text-gray-400">{log.userRole}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`${getActionColor(log.action)}`}>
                          <div className="font-medium">{formatActionType(log.action)}</div>
                          <div className="text-xs capitalize">{log.module}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {log.details}
                      </TableCell>
                      <TableCell>
                        {log.branchName && (
                          <div>
                            <div className="text-white">{log.branchName}</div>
                            <div className="text-xs text-gray-400">
                              {log.deviceName || 'Unknown device'}
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-700 bg-gray-800">
          <div className="text-gray-400 text-sm">
            Showing {filteredLogs.length} of {mockAuditLogs.length} logs
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleExport('csv')} 
              className="border-gray-600 hover:bg-gray-600 text-white"
            >
              Export CSV
            </Button>
            <Button 
              onClick={() => handleExport('pdf')} 
              className="bg-green-500 hover:bg-green-600"
            >
              Export PDF
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
