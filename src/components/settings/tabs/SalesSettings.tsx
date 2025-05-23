
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface SalesSettingsProps {
  user: User;
}

export const SalesSettings = ({ user }: SalesSettingsProps) => {
  const [settings, setSettings] = useState({
    // Payment Methods
    cashPayment: true,
    cardPayment: true,
    mpesaPayment: true,
    airtelMoneyPayment: false,
    splitPayment: true,
    
    // Discounts and Pricing
    allowDiscounts: true,
    maxDiscountPercent: '20',
    allowCustomPriceOverride: true,
    
    // Returns and Refunds
    allowReturns: true,
    returnWindowDays: '7',
    requireReceiptForReturn: true,
    
    // Loyalty
    enableLoyalty: true,
    pointsPerKES: '0.05', // 5 points per 100 KES
    redemptionRate: '0.25', // 0.25 KES per point
    
    // Limits
    minimumSaleAmount: '0',
    maximumSaleAmount: '100000',
  });
  
  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success("Sales settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cashPayment" 
                checked={settings.cashPayment}
                onCheckedChange={(checked) => handleChange('cashPayment', Boolean(checked))}
              />
              <Label htmlFor="cashPayment" className="text-gray-200">Cash</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cardPayment" 
                checked={settings.cardPayment}
                onCheckedChange={(checked) => handleChange('cardPayment', Boolean(checked))}
              />
              <Label htmlFor="cardPayment" className="text-gray-200">Card/Debit/Credit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mpesaPayment" 
                checked={settings.mpesaPayment}
                onCheckedChange={(checked) => handleChange('mpesaPayment', Boolean(checked))}
              />
              <Label htmlFor="mpesaPayment" className="text-gray-200">M-PESA</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="airtelMoneyPayment" 
                checked={settings.airtelMoneyPayment}
                onCheckedChange={(checked) => handleChange('airtelMoneyPayment', Boolean(checked))}
              />
              <Label htmlFor="airtelMoneyPayment" className="text-gray-200">Airtel Money</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="splitPayment" 
                checked={settings.splitPayment}
                onCheckedChange={(checked) => handleChange('splitPayment', Boolean(checked))}
              />
              <Label htmlFor="splitPayment" className="text-gray-200">Split Payments</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Discounts & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="allowDiscounts" 
              checked={settings.allowDiscounts}
              onCheckedChange={(checked) => handleChange('allowDiscounts', Boolean(checked))}
            />
            <Label htmlFor="allowDiscounts" className="text-gray-200">
              Allow Discounts on Sales
            </Label>
          </div>
          
          <div className="ml-6 space-y-2">
            <Label htmlFor="maxDiscountPercent" className="text-gray-200">
              Maximum Discount Percentage
            </Label>
            <Input 
              id="maxDiscountPercent" 
              type="number" 
              value={settings.maxDiscountPercent} 
              onChange={(e) => handleChange('maxDiscountPercent', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white w-full md:w-48" 
              disabled={!settings.allowDiscounts}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="allowCustomPriceOverride" 
              checked={settings.allowCustomPriceOverride}
              onCheckedChange={(checked) => handleChange('allowCustomPriceOverride', Boolean(checked))}
            />
            <Label htmlFor="allowCustomPriceOverride" className="text-gray-200">
              Allow Custom Price Overrides
            </Label>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Returns & Refunds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="allowReturns" 
              checked={settings.allowReturns}
              onCheckedChange={(checked) => handleChange('allowReturns', Boolean(checked))}
            />
            <Label htmlFor="allowReturns" className="text-gray-200">
              Enable Returns & Refunds
            </Label>
          </div>
          
          <div className="ml-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="returnWindowDays" className="text-gray-200">
                Return Window (Days)
              </Label>
              <Input 
                id="returnWindowDays" 
                type="number" 
                value={settings.returnWindowDays} 
                onChange={(e) => handleChange('returnWindowDays', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-full md:w-48" 
                disabled={!settings.allowReturns}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="requireReceiptForReturn" 
                checked={settings.requireReceiptForReturn}
                onCheckedChange={(checked) => handleChange('requireReceiptForReturn', Boolean(checked))}
                disabled={!settings.allowReturns}
              />
              <Label htmlFor="requireReceiptForReturn" className="text-gray-200">
                Require Receipt for Returns
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Loyalty & Rewards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="enableLoyalty" 
              checked={settings.enableLoyalty}
              onCheckedChange={(checked) => handleChange('enableLoyalty', Boolean(checked))}
            />
            <Label htmlFor="enableLoyalty" className="text-gray-200">
              Enable Loyalty Program
            </Label>
          </div>
          
          <div className="ml-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pointsPerKES" className="text-gray-200">
                Points Earned per KES
              </Label>
              <Input 
                id="pointsPerKES" 
                type="number" 
                step="0.01"
                value={settings.pointsPerKES} 
                onChange={(e) => handleChange('pointsPerKES', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-full md:w-48" 
                disabled={!settings.enableLoyalty}
              />
              <p className="text-gray-400 text-xs">
                Example: 0.05 means 5 points earned for every 100 KES spent
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="redemptionRate" className="text-gray-200">
                KES Value per Loyalty Point
              </Label>
              <Input 
                id="redemptionRate" 
                type="number" 
                step="0.01"
                value={settings.redemptionRate} 
                onChange={(e) => handleChange('redemptionRate', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-full md:w-48" 
                disabled={!settings.enableLoyalty}
              />
              <p className="text-gray-400 text-xs">
                Example: 0.25 means 1 point is worth 0.25 KES in discounts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Sale Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minimumSaleAmount" className="text-gray-200">
                Minimum Sale Amount (KES)
              </Label>
              <Input 
                id="minimumSaleAmount" 
                type="number" 
                value={settings.minimumSaleAmount} 
                onChange={(e) => handleChange('minimumSaleAmount', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maximumSaleAmount" className="text-gray-200">
                Maximum Sale Amount (KES)
              </Label>
              <Input 
                id="maximumSaleAmount" 
                type="number" 
                value={settings.maximumSaleAmount} 
                onChange={(e) => handleChange('maximumSaleAmount', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
          Save Sales Settings
        </Button>
      </div>
    </div>
  );
};
