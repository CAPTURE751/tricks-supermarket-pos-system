
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface InventorySettingsProps {
  user: User;
}

export const InventorySettings = ({ user }: InventorySettingsProps) => {
  const [settings, setSettings] = useState({
    // Tracking options
    enableBatchTracking: true,
    enableExpiryTracking: true,
    enableSerialNumberTracking: false,
    
    // Stock thresholds and alerts
    defaultMinStockLevel: '10',
    defaultMaxStockLevel: '100',
    lowStockAlertThreshold: '20',
    enableStockAlerts: true,
    
    // Stock control
    autoDeductStock: true,
    allowNegativeStock: false,
    costingMethod: 'FIFO',
    
    // Multi-location
    enableMultiLocation: true,
    defaultLocation: 'Main Store',
    requireLocationForTransactions: true,
    
    // Units
    enableMultipleUnits: true,
    defaultUnit: 'Each',
  });
  
  const [branches, setBranches] = useState([
    { id: '1', name: 'Main Store', isDefault: true },
    { id: '2', name: 'Warehouse', isDefault: false },
    { id: '3', name: 'Branch 2', isDefault: false }
  ]);
  
  const [units, setUnits] = useState([
    { id: '1', name: 'Each', abbreviation: 'ea' },
    { id: '2', name: 'Carton', abbreviation: 'ctn' },
    { id: '3', name: 'Dozen', abbreviation: 'dz' },
    { id: '4', name: 'Box', abbreviation: 'box' },
  ]);
  
  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success("Inventory settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Inventory Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enableBatchTracking" 
                checked={settings.enableBatchTracking}
                onCheckedChange={(checked) => handleChange('enableBatchTracking', Boolean(checked))}
              />
              <Label htmlFor="enableBatchTracking" className="text-gray-200">Enable Batch Tracking</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enableExpiryTracking" 
                checked={settings.enableExpiryTracking}
                onCheckedChange={(checked) => handleChange('enableExpiryTracking', Boolean(checked))}
              />
              <Label htmlFor="enableExpiryTracking" className="text-gray-200">Enable Expiry Date Tracking</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enableSerialNumberTracking" 
                checked={settings.enableSerialNumberTracking}
                onCheckedChange={(checked) => handleChange('enableSerialNumberTracking', Boolean(checked))}
              />
              <Label htmlFor="enableSerialNumberTracking" className="text-gray-200">Enable Serial Number Tracking</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Stock Thresholds & Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultMinStockLevel" className="text-gray-200">Default Minimum Stock Level</Label>
              <Input 
                id="defaultMinStockLevel" 
                type="number" 
                value={settings.defaultMinStockLevel} 
                onChange={(e) => handleChange('defaultMinStockLevel', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultMaxStockLevel" className="text-gray-200">Default Maximum Stock Level</Label>
              <Input 
                id="defaultMaxStockLevel" 
                type="number" 
                value={settings.defaultMaxStockLevel} 
                onChange={(e) => handleChange('defaultMaxStockLevel', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lowStockAlertThreshold" className="text-gray-200">Low Stock Alert Threshold (%)</Label>
              <Input 
                id="lowStockAlertThreshold" 
                type="number" 
                value={settings.lowStockAlertThreshold} 
                onChange={(e) => handleChange('lowStockAlertThreshold', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
              />
              <p className="text-gray-400 text-xs">
                Percentage of minimum stock level that triggers low stock alert
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="enableStockAlerts" 
              checked={settings.enableStockAlerts}
              onCheckedChange={(checked) => handleChange('enableStockAlerts', Boolean(checked))}
            />
            <Label htmlFor="enableStockAlerts" className="text-gray-200">Enable Low Stock Alerts</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Stock Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="autoDeductStock" 
                checked={settings.autoDeductStock}
                onCheckedChange={(checked) => handleChange('autoDeductStock', Boolean(checked))}
              />
              <Label htmlFor="autoDeductStock" className="text-gray-200">Automatically Deduct Stock on Sale</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allowNegativeStock" 
                checked={settings.allowNegativeStock}
                onCheckedChange={(checked) => handleChange('allowNegativeStock', Boolean(checked))}
              />
              <Label htmlFor="allowNegativeStock" className="text-gray-200">Allow Negative Stock</Label>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="costingMethod" className="text-gray-200">Inventory Costing Method</Label>
            <Select 
              value={settings.costingMethod} 
              onValueChange={(value) => handleChange('costingMethod', value)}
            >
              <SelectTrigger id="costingMethod" className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="FIFO">FIFO (First In, First Out)</SelectItem>
                <SelectItem value="LIFO">LIFO (Last In, First Out)</SelectItem>
                <SelectItem value="Average">Weighted Average</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Locations & Branches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enableMultiLocation" 
                checked={settings.enableMultiLocation}
                onCheckedChange={(checked) => handleChange('enableMultiLocation', Boolean(checked))}
              />
              <Label htmlFor="enableMultiLocation" className="text-gray-200">Enable Multi-Location Inventory</Label>
            </div>
            
            <div className="flex items-center space-x-2 ml-6">
              <Checkbox 
                id="requireLocationForTransactions" 
                checked={settings.requireLocationForTransactions}
                onCheckedChange={(checked) => handleChange('requireLocationForTransactions', Boolean(checked))}
                disabled={!settings.enableMultiLocation}
              />
              <Label htmlFor="requireLocationForTransactions" className="text-gray-200">
                Require Location for All Transactions
              </Label>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="defaultLocation" className="text-gray-200">Default Location</Label>
            <Select 
              value={settings.defaultLocation} 
              onValueChange={(value) => handleChange('defaultLocation', value)}
              disabled={!settings.enableMultiLocation}
            >
              <SelectTrigger id="defaultLocation" className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2">
            <h3 className="text-white font-semibold mb-2">Configured Locations</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {branches.map(branch => (
                <div key={branch.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-white">{branch.name}</span>
                    {branch.isDefault && (
                      <span className="bg-gray-600 text-gray-200 text-xs px-2 py-0.5 rounded">Default</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Units of Measurement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="enableMultipleUnits" 
              checked={settings.enableMultipleUnits}
              onCheckedChange={(checked) => handleChange('enableMultipleUnits', Boolean(checked))}
            />
            <Label htmlFor="enableMultipleUnits" className="text-gray-200">Enable Multiple Units per Product</Label>
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="defaultUnit" className="text-gray-200">Default Unit</Label>
            <Select 
              value={settings.defaultUnit} 
              onValueChange={(value) => handleChange('defaultUnit', value)}
            >
              <SelectTrigger id="defaultUnit" className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {units.map(unit => (
                  <SelectItem key={unit.id} value={unit.name}>{unit.name} ({unit.abbreviation})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2">
            <h3 className="text-white font-semibold mb-2">Configured Units</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {units.map(unit => (
                <div key={unit.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-white">{unit.name}</span>
                    <span className="text-gray-400 text-sm">({unit.abbreviation})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
          Save Inventory Settings
        </Button>
      </div>
    </div>
  );
};
