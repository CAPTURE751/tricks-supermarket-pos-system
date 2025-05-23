
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface AdvancedSettingsProps {
  user: User;
}

export const AdvancedSettings = ({ user }: AdvancedSettingsProps) => {
  const [systemInfo, setSystemInfo] = useState({
    version: '1.5.2',
    lastUpdated: '2024-05-18',
    updateAvailable: true,
    dbSize: '45.2 MB'
  });
  
  const [settings, setSettings] = useState({
    enableLogs: true,
    logRetention: '30',
    enableDevelopersMode: false,
    autoCleanupLogs: true,
    showDevTools: false,
    dailySalesTarget: '50000',
    enableNotifications: true,
    notifyOnStockLow: true,
    notifyOnHighSales: true,
    notifyOnRefunds: true,
    emailAlerts: '',
    smsAlerts: '',
  });
  
  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    toast.success("Advanced settings saved successfully");
  };
  
  const handleSystemUpdate = () => {
    toast.success("System update initiated");
    // In a real app, this would trigger the update process
  };
  
  const handleExportData = () => {
    toast.success("Data export started");
    // In a real app, this would export data
  };
  
  const handleDatabaseOptimize = () => {
    toast.success("Database optimization started");
    // In a real app, this would optimize the database
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">System Information</CardTitle>
          {systemInfo.updateAvailable && (
            <Button 
              onClick={handleSystemUpdate}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Update Available
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Version</p>
              <p className="text-white">{systemInfo.version}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Updated</p>
              <p className="text-white">{systemInfo.lastUpdated}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Database Size</p>
              <p className="text-white">{systemInfo.dbSize}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button 
              onClick={handleDatabaseOptimize}
              variant="outline" 
              className="border-gray-600 hover:bg-gray-700 text-white"
            >
              Optimize Database
            </Button>
            <Button 
              onClick={handleExportData}
              variant="outline" 
              className="border-gray-600 hover:bg-gray-700 text-white"
            >
              Export All Data
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Logging & Development</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="enableLogs" 
              checked={settings.enableLogs}
              onCheckedChange={(checked) => handleChange('enableLogs', Boolean(checked))}
            />
            <Label htmlFor="enableLogs" className="text-gray-200">Enable Activity Logs</Label>
          </div>
          
          <div className="ml-6 space-y-2">
            <Label htmlFor="logRetention" className="text-gray-200">Log Retention (days)</Label>
            <Input 
              id="logRetention" 
              type="number" 
              value={settings.logRetention} 
              onChange={(e) => handleChange('logRetention', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white w-full md:w-48" 
              disabled={!settings.enableLogs}
            />
          </div>
          
          <div className="ml-6 flex items-center space-x-2">
            <Checkbox 
              id="autoCleanupLogs" 
              checked={settings.autoCleanupLogs}
              onCheckedChange={(checked) => handleChange('autoCleanupLogs', Boolean(checked))}
              disabled={!settings.enableLogs}
            />
            <Label htmlFor="autoCleanupLogs" className="text-gray-200">Automatically Clean Up Old Logs</Label>
          </div>
          
          <div className="pt-3 flex items-center space-x-2">
            <Checkbox 
              id="enableDevelopersMode" 
              checked={settings.enableDevelopersMode}
              onCheckedChange={(checked) => handleChange('enableDevelopersMode', Boolean(checked))}
            />
            <Label htmlFor="enableDevelopersMode" className="text-gray-200">Enable Developer Mode</Label>
          </div>
          
          <div className="ml-6 flex items-center space-x-2">
            <Checkbox 
              id="showDevTools" 
              checked={settings.showDevTools}
              onCheckedChange={(checked) => handleChange('showDevTools', Boolean(checked))}
              disabled={!settings.enableDevelopersMode}
            />
            <Label htmlFor="showDevTools" className="text-gray-200">Show Developer Tools</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dailySalesTarget" className="text-gray-200">Daily Sales Target (KES)</Label>
            <Input 
              id="dailySalesTarget" 
              type="number" 
              value={settings.dailySalesTarget} 
              onChange={(e) => handleChange('dailySalesTarget', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white w-full md:w-48" 
            />
          </div>
          
          <div className="pt-2">
            <p className="text-gray-200 mb-2">Dashboard Modules Visibility</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="showSales" defaultChecked />
                <Label htmlFor="showSales" className="text-gray-200">Sales Overview</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="showInventory" defaultChecked />
                <Label htmlFor="showInventory" className="text-gray-200">Inventory Status</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="showCustomers" defaultChecked />
                <Label htmlFor="showCustomers" className="text-gray-200">Customer Stats</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="showPurchases" defaultChecked />
                <Label htmlFor="showPurchases" className="text-gray-200">Recent Purchases</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="showAlerts" defaultChecked />
                <Label htmlFor="showAlerts" className="text-gray-200">System Alerts</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="enableNotifications" 
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => handleChange('enableNotifications', Boolean(checked))}
            />
            <Label htmlFor="enableNotifications" className="text-gray-200">Enable System Notifications</Label>
          </div>
          
          <div className="ml-6 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="notifyOnStockLow" 
                checked={settings.notifyOnStockLow}
                onCheckedChange={(checked) => handleChange('notifyOnStockLow', Boolean(checked))}
                disabled={!settings.enableNotifications}
              />
              <Label htmlFor="notifyOnStockLow" className="text-gray-200">Notify on Low Stock</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="notifyOnHighSales" 
                checked={settings.notifyOnHighSales}
                onCheckedChange={(checked) => handleChange('notifyOnHighSales', Boolean(checked))}
                disabled={!settings.enableNotifications}
              />
              <Label htmlFor="notifyOnHighSales" className="text-gray-200">Notify on High Sales</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="notifyOnRefunds" 
                checked={settings.notifyOnRefunds}
                onCheckedChange={(checked) => handleChange('notifyOnRefunds', Boolean(checked))}
                disabled={!settings.enableNotifications}
              />
              <Label htmlFor="notifyOnRefunds" className="text-gray-200">Notify on Refunds</Label>
            </div>
          </div>
          
          <div className="space-y-4 pt-3">
            <div className="space-y-2">
              <Label htmlFor="emailAlerts" className="text-gray-200">Email for Alerts</Label>
              <Input 
                id="emailAlerts" 
                type="email" 
                value={settings.emailAlerts} 
                onChange={(e) => handleChange('emailAlerts', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
                placeholder="example@business.com"
                disabled={!settings.enableNotifications}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smsAlerts" className="text-gray-200">Phone for SMS Alerts</Label>
              <Input 
                id="smsAlerts" 
                value={settings.smsAlerts} 
                onChange={(e) => handleChange('smsAlerts', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
                placeholder="+254700123456"
                disabled={!settings.enableNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
          Save Advanced Settings
        </Button>
      </div>
    </div>
  );
};
