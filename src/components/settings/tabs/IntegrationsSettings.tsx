
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface IntegrationsSettingsProps {
  user: User;
}

interface Integration {
  id: string;
  name: string;
  type: string;
  isConnected: boolean;
  description: string;
  configFields: ConfigField[];
  logo: string;
}

interface ConfigField {
  id: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'checkbox';
  value: string | boolean;
  options?: string[];
  placeholder?: string;
  isSecret?: boolean;
}

export const IntegrationsSettings = ({ user }: IntegrationsSettingsProps) => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'mpesa',
      name: 'M-PESA API',
      type: 'payment',
      isConnected: false,
      description: 'Connect M-PESA to accept mobile payments directly',
      logo: '🇰🇪',
      configFields: [
        { id: 'consumer_key', label: 'Consumer Key', type: 'password', value: '', isSecret: true },
        { id: 'consumer_secret', label: 'Consumer Secret', type: 'password', value: '', isSecret: true },
        { id: 'environment', label: 'Environment', type: 'select', value: 'sandbox', options: ['sandbox', 'production'] },
        { id: 'shortcode', label: 'Business Shortcode', type: 'text', value: '' }
      ]
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      type: 'accounting',
      isConnected: false,
      description: 'Sync sales data to QuickBooks for accounting',
      logo: '📊',
      configFields: [
        { id: 'client_id', label: 'Client ID', type: 'text', value: '' },
        { id: 'client_secret', label: 'Client Secret', type: 'password', value: '', isSecret: true },
        { id: 'sync_sales', label: 'Auto-sync Sales', type: 'checkbox', value: true },
        { id: 'sync_inventory', label: 'Auto-sync Inventory', type: 'checkbox', value: false }
      ]
    },
    {
      id: 'zapier',
      name: 'Zapier',
      type: 'automation',
      isConnected: false,
      description: 'Connect to thousands of apps through Zapier',
      logo: '⚡',
      configFields: [
        { id: 'webhook_url', label: 'Webhook URL', type: 'text', value: '', placeholder: 'https://hooks.zapier.com/...' },
        { id: 'trigger_on_sale', label: 'Trigger on Sale', type: 'checkbox', value: true },
        { id: 'trigger_on_inventory', label: 'Trigger on Low Stock', type: 'checkbox', value: false }
      ]
    },
    {
      id: 'barcode_scanner',
      name: 'Barcode Scanner',
      type: 'hardware',
      isConnected: false,
      description: 'Configure barcode scanner settings',
      logo: '📱',
      configFields: [
        { id: 'scanner_type', label: 'Scanner Type', type: 'select', value: 'usb', options: ['usb', 'bluetooth', 'camera'] },
        { id: 'auto_submit', label: 'Auto-Submit on Scan', type: 'checkbox', value: true },
        { id: 'beep_on_scan', label: 'Sound on Successful Scan', type: 'checkbox', value: true }
      ]
    }
  ]);
  
  const [activeIntegration, setActiveIntegration] = useState<Integration | null>(null);
  const [backupSettings, setBackupSettings] = useState({
    backupFrequency: 'daily',
    backupLocation: 'cloud',
    autoBackup: true,
    lastBackup: 'Never'
  });
  
  const handleConfigFieldChange = (integrationId: string, fieldId: string, value: string | boolean) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId
        ? {
            ...integration,
            configFields: integration.configFields.map(field =>
              field.id === fieldId ? { ...field, value } : field
            )
          }
        : integration
    ));
  };
  
  const handleSetupIntegration = (integration: Integration) => {
    setActiveIntegration(integration);
  };
  
  const handleConnect = () => {
    // In a real app, this would handle API connection/authentication
    if (!activeIntegration) return;
    
    // Check if required fields are filled
    const requiredFieldMissing = activeIntegration.configFields.some(field => 
      field.type !== 'checkbox' && field.value === ''
    );
    
    if (requiredFieldMissing) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIntegrations(prev => prev.map(integration => 
      integration.id === activeIntegration.id
        ? { ...integration, isConnected: true }
        : integration
    ));
    
    setActiveIntegration(null);
    toast.success(`Successfully connected to ${activeIntegration.name}`);
  };
  
  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId
        ? { ...integration, isConnected: false }
        : integration
    ));
    
    toast.success("Integration disconnected");
  };
  
  const handleBackupSettingChange = (setting: string, value: string | boolean) => {
    setBackupSettings(prev => ({ ...prev, [setting]: value }));
  };
  
  const handleSaveBackupSettings = () => {
    toast.success("Backup settings saved successfully");
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Payment Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations
              .filter(integration => integration.type === 'payment')
              .map(integration => (
                <div key={integration.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.logo}</span>
                      <div>
                        <h3 className="text-white font-semibold">{integration.name}</h3>
                        <p className="text-gray-300 text-sm">{integration.description}</p>
                      </div>
                    </div>
                    {integration.isConnected ? (
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Connected</span>
                        <Button 
                          variant="outline" 
                          className="border-gray-600 hover:bg-gray-600 text-white text-xs h-7"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleSetupIntegration(integration)} 
                        className="bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                      >
                        Set Up
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Accounting Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations
              .filter(integration => integration.type === 'accounting')
              .map(integration => (
                <div key={integration.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.logo}</span>
                      <div>
                        <h3 className="text-white font-semibold">{integration.name}</h3>
                        <p className="text-gray-300 text-sm">{integration.description}</p>
                      </div>
                    </div>
                    {integration.isConnected ? (
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Connected</span>
                        <Button 
                          variant="outline" 
                          className="border-gray-600 hover:bg-gray-600 text-white text-xs h-7"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleSetupIntegration(integration)} 
                        className="bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                      >
                        Set Up
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Automation & Others</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations
              .filter(integration => !['payment', 'accounting', 'hardware'].includes(integration.type))
              .map(integration => (
                <div key={integration.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.logo}</span>
                      <div>
                        <h3 className="text-white font-semibold">{integration.name}</h3>
                        <p className="text-gray-300 text-sm">{integration.description}</p>
                      </div>
                    </div>
                    {integration.isConnected ? (
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Connected</span>
                        <Button 
                          variant="outline" 
                          className="border-gray-600 hover:bg-gray-600 text-white text-xs h-7"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleSetupIntegration(integration)} 
                        className="bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                      >
                        Set Up
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Hardware Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations
              .filter(integration => integration.type === 'hardware')
              .map(integration => (
                <div key={integration.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.logo}</span>
                      <div>
                        <h3 className="text-white font-semibold">{integration.name}</h3>
                        <p className="text-gray-300 text-sm">{integration.description}</p>
                      </div>
                    </div>
                    {integration.isConnected ? (
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Connected</span>
                        <Button 
                          variant="outline" 
                          className="border-gray-600 hover:bg-gray-600 text-white text-xs h-7"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleSetupIntegration(integration)} 
                        className="bg-green-500 hover:bg-green-600 text-white text-xs h-7"
                      >
                        Set Up
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Backup & Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency" className="text-gray-200">Backup Frequency</Label>
                <Select 
                  value={backupSettings.backupFrequency} 
                  onValueChange={(value) => handleBackupSettingChange('backupFrequency', value)}
                >
                  <SelectTrigger id="backupFrequency" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backupLocation" className="text-gray-200">Backup Location</Label>
                <Select 
                  value={backupSettings.backupLocation} 
                  onValueChange={(value) => handleBackupSettingChange('backupLocation', value)}
                >
                  <SelectTrigger id="backupLocation" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="both">Both Cloud & Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox 
                  id="autoBackup" 
                  checked={backupSettings.autoBackup}
                  onCheckedChange={(checked) => handleBackupSettingChange('autoBackup', Boolean(checked))}
                />
                <Label htmlFor="autoBackup" className="text-gray-200">Enable Automatic Backups</Label>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Backup Status</h3>
                <p className="text-gray-300">Last backup: {backupSettings.lastBackup}</p>
                
                <div className="space-x-2 mt-4">
                  <Button className="bg-green-500 hover:bg-green-600">
                    Backup Now
                  </Button>
                  <Button variant="outline" className="border-gray-600 hover:bg-gray-600 text-white">
                    Restore Backup
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSaveBackupSettings} className="bg-green-500 hover:bg-green-600">
              Save Backup Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Integration Setup Modal */}
      {activeIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 max-w-full">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{activeIntegration.logo}</span>
              <div>
                <h3 className="text-white text-xl font-bold">{activeIntegration.name} Setup</h3>
                <p className="text-gray-300 text-sm">{activeIntegration.description}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {activeIntegration.configFields.map(field => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-gray-200">{field.label}</Label>
                  
                  {field.type === 'checkbox' ? (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={field.id} 
                        checked={field.value as boolean}
                        onCheckedChange={(checked) => handleConfigFieldChange(
                          activeIntegration.id,
                          field.id,
                          Boolean(checked)
                        )}
                      />
                      <Label htmlFor={field.id} className="text-gray-200">{field.label}</Label>
                    </div>
                  ) : field.type === 'select' ? (
                    <Select 
                      value={field.value as string} 
                      onValueChange={(value) => handleConfigFieldChange(
                        activeIntegration.id,
                        field.id,
                        value
                      )}
                    >
                      <SelectTrigger id={field.id} className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {field.options?.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      id={field.id} 
                      type={field.type}
                      value={field.value as string} 
                      onChange={(e) => handleConfigFieldChange(
                        activeIntegration.id,
                        field.id,
                        e.target.value
                      )}
                      className="bg-gray-700 border-gray-600 text-white" 
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-4 mt-6">
              <Button
                onClick={handleConnect}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Connect
              </Button>
              <Button
                onClick={() => setActiveIntegration(null)}
                className="flex-1"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
