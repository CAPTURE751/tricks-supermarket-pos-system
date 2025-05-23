
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface GeneralSettingsProps {
  user: User;
}

export const GeneralSettings = ({ user }: GeneralSettingsProps) => {
  const [settings, setSettings] = useState({
    businessName: 'Jeff Tricks Supermarket',
    businessPhone: '+254700123456',
    businessEmail: 'contact@jefftricks.com',
    businessAddress: 'Nairobi, Kenya',
    currency: 'KES',
    language: 'en',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    defaultTaxRate: '16',
    offlineMode: true
  });
  
  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success("General settings saved successfully");
  };

  const currencies = [
    { code: 'KES', label: 'Kenyan Shilling (KES)' },
    { code: 'USD', label: 'US Dollar (USD)' },
    { code: 'EUR', label: 'Euro (EUR)' },
    { code: 'GBP', label: 'British Pound (GBP)' },
    { code: 'TZS', label: 'Tanzanian Shilling (TZS)' },
    { code: 'UGX', label: 'Ugandan Shilling (UGX)' },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'sw', label: 'Swahili' },
    { code: 'fr', label: 'French' },
  ];
  
  const timezones = [
    { code: 'Africa/Nairobi', label: 'East Africa Time (EAT)' },
    { code: 'UTC', label: 'Universal Coordinated Time (UTC)' },
    { code: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-gray-200">Business Name</Label>
              <Input 
                id="businessName" 
                value={settings.businessName} 
                onChange={(e) => handleChange('businessName', e.target.value)} 
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessLogo" className="text-gray-200">Business Logo</Label>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">JT</span>
                </div>
                <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
                  Upload Logo
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessPhone" className="text-gray-200">Phone</Label>
              <Input 
                id="businessPhone" 
                value={settings.businessPhone} 
                onChange={(e) => handleChange('businessPhone', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessEmail" className="text-gray-200">Email</Label>
              <Input 
                id="businessEmail" 
                type="email" 
                value={settings.businessEmail} 
                onChange={(e) => handleChange('businessEmail', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="businessAddress" className="text-gray-200">Address</Label>
              <Input 
                id="businessAddress" 
                value={settings.businessAddress} 
                onChange={(e) => handleChange('businessAddress', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Regional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-gray-200">Currency</Label>
              <Select 
                value={settings.currency} 
                onValueChange={(value) => handleChange('currency', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {currencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language" className="text-gray-200">Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => handleChange('language', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {languages.map(language => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-gray-200">Time Zone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => handleChange('timezone', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {timezones.map(timezone => (
                    <SelectItem key={timezone.code} value={timezone.code}>
                      {timezone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat" className="text-gray-200">Date Format</Label>
              <Select 
                value={settings.dateFormat} 
                onValueChange={(value) => handleChange('dateFormat', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultTax" className="text-gray-200">Default Tax Rate (%)</Label>
              <Input 
                id="defaultTax" 
                type="number" 
                value={settings.defaultTaxRate} 
                onChange={(e) => handleChange('defaultTaxRate', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div className="space-y-2 flex items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="offlineMode"
                  checked={settings.offlineMode}
                  onChange={(e) => handleChange('offlineMode', e.target.checked)}
                  className="mr-2 rounded text-green-500 focus:ring-green-500"
                />
                <Label htmlFor="offlineMode" className="text-gray-200">Enable Offline Mode</Label>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
