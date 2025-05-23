
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface TaxSettingsProps {
  user: User;
}

interface TaxRate {
  id: string;
  name: string;
  rate: string;
  isDefault: boolean;
}

export const TaxSettings = ({ user }: TaxSettingsProps) => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([
    { id: '1', name: 'Standard VAT', rate: '16', isDefault: true },
    { id: '2', name: 'Reduced Rate', rate: '8', isDefault: false },
    { id: '3', name: 'Zero Rate', rate: '0', isDefault: false }
  ]);
  
  const [newTaxRate, setNewTaxRate] = useState<TaxRate>({
    id: '', name: '', rate: '', isDefault: false
  });
  
  const [showAddTax, setShowAddTax] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    priceDisplay: 'tax-exclusive',
    accountingMethod: 'accrual',
    taxNumber: 'KE123456789T',
    taxAuthority: 'KRA'
  });
  
  const [accountingCodes, setAccountingCodes] = useState({
    salesAccount: '4000',
    purchaseAccount: '5000',
    taxPayableAccount: '2200',
    inventoryAccount: '1400'
  });
  
  const handleTaxRateChange = (id: string, field: keyof TaxRate, value: string | boolean) => {
    setTaxRates(prevRates => prevRates.map(rate => 
      rate.id === id ? { ...rate, [field]: value } : rate
    ));
  };
  
  const handleAddTaxRate = () => {
    if (!newTaxRate.name || !newTaxRate.rate) {
      toast.error("Tax name and rate are required");
      return;
    }
    
    const newId = (Math.max(...taxRates.map(r => parseInt(r.id))) + 1).toString();
    
    // If new rate is set as default, remove default from others
    let updatedRates = [...taxRates];
    if (newTaxRate.isDefault) {
      updatedRates = updatedRates.map(r => ({ ...r, isDefault: false }));
    }
    
    setTaxRates([...updatedRates, { ...newTaxRate, id: newId }]);
    setNewTaxRate({ id: '', name: '', rate: '', isDefault: false });
    setShowAddTax(false);
    toast.success("Tax rate added successfully");
  };
  
  const handleDeleteTaxRate = (id: string) => {
    // Don't allow deleting the default tax rate
    const rateToDelete = taxRates.find(r => r.id === id);
    if (rateToDelete?.isDefault) {
      toast.error("Cannot delete default tax rate");
      return;
    }
    
    setTaxRates(prevRates => prevRates.filter(rate => rate.id !== id));
    toast.success("Tax rate deleted");
  };
  
  const handleSetDefaultTaxRate = (id: string) => {
    setTaxRates(prevRates => prevRates.map(rate => ({
      ...rate,
      isDefault: rate.id === id
    })));
  };
  
  const handleGeneralSettingChange = <K extends keyof typeof generalSettings>(
    field: K, 
    value: typeof generalSettings[K]
  ) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAccountingCodeChange = <K extends keyof typeof accountingCodes>(
    field: K, 
    value: typeof accountingCodes[K]
  ) => {
    setAccountingCodes(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = () => {
    toast.success("Tax and accounting settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Tax Rates</CardTitle>
          <Button 
            onClick={() => setShowAddTax(true)} 
            className="bg-green-500 hover:bg-green-600"
          >
            Add Tax Rate
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taxRates.map(rate => (
              <div key={rate.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <RadioGroup 
                    value={rate.isDefault ? rate.id : undefined} 
                    onValueChange={() => handleSetDefaultTaxRate(rate.id)}
                    className="flex items-center space-x-1"
                  >
                    <RadioGroupItem value={rate.id} id={`default-${rate.id}`} />
                    <Label htmlFor={`default-${rate.id}`} className="text-gray-200 text-xs">
                      Default
                    </Label>
                  </RadioGroup>
                </div>
                
                <div className="flex-grow ml-4">
                  <div className="text-white font-semibold">{rate.name}</div>
                  <div className="text-gray-300 text-sm">{rate.rate}%</div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-gray-600 hover:bg-gray-600 text-white"
                    disabled={rate.isDefault}
                    onClick={() => handleDeleteTaxRate(rate.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Tax Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="priceDisplay" className="text-gray-200">Price Display</Label>
              <div className="space-y-2 ml-1">
                <div className="flex items-center space-x-2">
                  <RadioGroup 
                    value={generalSettings.priceDisplay} 
                    onValueChange={(value) => handleGeneralSettingChange('priceDisplay', value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tax-inclusive" id="tax-inclusive" />
                      <Label htmlFor="tax-inclusive" className="text-gray-200">
                        Tax-Inclusive (taxes included in displayed prices)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tax-exclusive" id="tax-exclusive" />
                      <Label htmlFor="tax-exclusive" className="text-gray-200">
                        Tax-Exclusive (taxes added at checkout)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="taxNumber" className="text-gray-200">Tax Registration Number</Label>
                <Input 
                  id="taxNumber" 
                  value={generalSettings.taxNumber}
                  onChange={(e) => handleGeneralSettingChange('taxNumber', e.target.value)} 
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxAuthority" className="text-gray-200">Tax Authority</Label>
                <Input 
                  id="taxAuthority" 
                  value={generalSettings.taxAuthority}
                  onChange={(e) => handleGeneralSettingChange('taxAuthority', e.target.value)} 
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Accounting Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Accounting Method</Label>
            <RadioGroup 
              value={generalSettings.accountingMethod} 
              onValueChange={(value) => handleGeneralSettingChange('accountingMethod', value)}
              className="flex flex-col space-y-1 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="text-gray-200">
                  Cash Basis (record transactions when money changes hands)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accrual" id="accrual" />
                <Label htmlFor="accrual" className="text-gray-200">
                  Accrual Basis (record transactions when they occur)
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="pt-4">
            <h3 className="text-white font-semibold mb-3">Accounting Code Mapping</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salesAccount" className="text-gray-200">Sales Account Code</Label>
                <Input 
                  id="salesAccount" 
                  value={accountingCodes.salesAccount}
                  onChange={(e) => handleAccountingCodeChange('salesAccount', e.target.value)} 
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchaseAccount" className="text-gray-200">Purchase Account Code</Label>
                <Input 
                  id="purchaseAccount" 
                  value={accountingCodes.purchaseAccount}
                  onChange={(e) => handleAccountingCodeChange('purchaseAccount', e.target.value)} 
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxPayableAccount" className="text-gray-200">Tax Payable Account Code</Label>
                <Input 
                  id="taxPayableAccount" 
                  value={accountingCodes.taxPayableAccount}
                  onChange={(e) => handleAccountingCodeChange('taxPayableAccount', e.target.value)} 
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inventoryAccount" className="text-gray-200">Inventory Account Code</Label>
                <Input 
                  id="inventoryAccount" 
                  value={accountingCodes.inventoryAccount}
                  onChange={(e) => handleAccountingCodeChange('inventoryAccount', e.target.value)} 
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Tax Rate Modal */}
      {showAddTax && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-white text-xl font-bold mb-4">Add New Tax Rate</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxName" className="text-gray-200">Tax Name</Label>
                <Input
                  id="taxName"
                  value={newTaxRate.name}
                  onChange={(e) => setNewTaxRate({ ...newTaxRate, name: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., Reduced VAT"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-gray-200">Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={newTaxRate.rate}
                  onChange={(e) => setNewTaxRate({ ...newTaxRate, rate: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., 5"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isDefault" 
                  checked={newTaxRate.isDefault}
                  onCheckedChange={(checked) => setNewTaxRate({ ...newTaxRate, isDefault: Boolean(checked) })}
                />
                <Label htmlFor="isDefault" className="text-gray-200">
                  Set as Default Tax Rate
                </Label>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <Button
                onClick={handleAddTaxRate}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Add Tax Rate
              </Button>
              <Button
                onClick={() => setShowAddTax(false)}
                className="flex-1"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
          Save Tax & Accounting Settings
        </Button>
      </div>
    </div>
  );
};
