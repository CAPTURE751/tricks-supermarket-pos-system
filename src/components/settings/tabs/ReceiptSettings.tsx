
import { useState } from 'react';
import { User } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ReceiptSettingsProps {
  user: User;
}

export const ReceiptSettings = ({ user }: ReceiptSettingsProps) => {
  const [settings, setSettings] = useState({
    headerText: 'Jeff Tricks Supermarket',
    footerText: 'Thank you for shopping with us!',
    receiptWidth: '80',
    showLogo: true,
    showBarcode: true,
    showCashierName: true,
    showTaxDetails: true,
    showDiscountDetails: true,
    autoPrint: true,
    printCopies: '1',
    defaultPrinter: 'Default Printer',
    additionalNotes: 'Items can be returned within 7 days with receipt.',
  });
  
  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success("Receipt settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Receipt Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headerText" className="text-gray-200">Header Text</Label>
                <Input 
                  id="headerText" 
                  value={settings.headerText} 
                  onChange={(e) => handleChange('headerText', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footerText" className="text-gray-200">Footer Text</Label>
                <Input 
                  id="footerText" 
                  value={settings.footerText} 
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalNotes" className="text-gray-200">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={settings.additionalNotes}
                  onChange={(e) => handleChange('additionalNotes', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white resize-none h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receiptWidth" className="text-gray-200">Receipt Width (mm)</Label>
                <Select 
                  value={settings.receiptWidth} 
                  onValueChange={(value) => handleChange('receiptWidth', value)}
                >
                  <SelectTrigger id="receiptWidth" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="58">58mm</SelectItem>
                    <SelectItem value="80">80mm</SelectItem>
                    <SelectItem value="A4">A4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold mb-2">Receipt Preview</h3>
                <div className="bg-white p-4 rounded text-black font-mono text-xs leading-relaxed">
                  <div className="text-center border-b border-dashed border-gray-400 pb-2">
                    <div className="font-bold text-sm mb-1">{settings.headerText}</div>
                    <div>Nairobi, Kenya</div>
                    <div>Tel: +254700123456</div>
                    <div className="mt-1">
                      {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="my-2 border-b border-dashed border-gray-400 pb-2">
                    <div className="flex justify-between">
                      <span>Receipt #: 0001234</span>
                      {settings.showCashierName && <span>Cashier: Jeff</span>}
                    </div>
                  </div>

                  <div className="my-2">
                    <div className="flex justify-between font-bold">
                      <span>Item</span>
                      <span>Total</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Milk 500ml x 2</span>
                      <span>120.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bread x 1</span>
                      <span>55.00</span>
                    </div>
                    {settings.showDiscountDetails && (
                      <div className="flex justify-between text-gray-600 italic">
                        <span>Discount</span>
                        <span>-10.00</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-dashed border-gray-400 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>165.00</span>
                    </div>
                    {settings.showTaxDetails && (
                      <div className="flex justify-between">
                        <span>VAT (16%)</span>
                        <span>26.40</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold mt-1">
                      <span>TOTAL</span>
                      <span>191.40</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Cash</span>
                      <span>200.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Change</span>
                      <span>8.60</span>
                    </div>
                  </div>

                  <div className="text-center mt-4 text-xs">
                    <div>{settings.footerText}</div>
                    <div className="mt-1">{settings.additionalNotes}</div>
                    {settings.showBarcode && (
                      <div className="mt-2 flex justify-center">
                        <div className="bg-gray-800 text-white px-2 py-1 text-xs">
                          [Barcode: 000001234]
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Receipt Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showLogo" 
                checked={settings.showLogo}
                onCheckedChange={(checked) => handleChange('showLogo', Boolean(checked))}
              />
              <Label htmlFor="showLogo" className="text-gray-200">Show Logo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showBarcode" 
                checked={settings.showBarcode}
                onCheckedChange={(checked) => handleChange('showBarcode', Boolean(checked))}
              />
              <Label htmlFor="showBarcode" className="text-gray-200">Show Barcode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showCashierName" 
                checked={settings.showCashierName}
                onCheckedChange={(checked) => handleChange('showCashierName', Boolean(checked))}
              />
              <Label htmlFor="showCashierName" className="text-gray-200">Show Cashier Name</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showTaxDetails" 
                checked={settings.showTaxDetails}
                onCheckedChange={(checked) => handleChange('showTaxDetails', Boolean(checked))}
              />
              <Label htmlFor="showTaxDetails" className="text-gray-200">Show Tax Details</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showDiscountDetails" 
                checked={settings.showDiscountDetails}
                onCheckedChange={(checked) => handleChange('showDiscountDetails', Boolean(checked))}
              />
              <Label htmlFor="showDiscountDetails" className="text-gray-200">Show Discount Details</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Printing Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="autoPrint" 
                  checked={settings.autoPrint}
                  onCheckedChange={(checked) => handleChange('autoPrint', Boolean(checked))}
                />
                <Label htmlFor="autoPrint" className="text-gray-200">Auto-print receipt after sale</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="printCopies" className="text-gray-200">Receipt Copies</Label>
                <Select 
                  value={settings.printCopies} 
                  onValueChange={(value) => handleChange('printCopies', value)}
                >
                  <SelectTrigger id="printCopies" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select copies" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="1">1 copy</SelectItem>
                    <SelectItem value="2">2 copies</SelectItem>
                    <SelectItem value="3">3 copies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultPrinter" className="text-gray-200">Default Printer</Label>
                <Select 
                  value={settings.defaultPrinter} 
                  onValueChange={(value) => handleChange('defaultPrinter', value)}
                >
                  <SelectTrigger id="defaultPrinter" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select printer" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="Default Printer">Default Printer</SelectItem>
                    <SelectItem value="Receipt Printer">Receipt Printer</SelectItem>
                    <SelectItem value="Office Printer">Office Printer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
              Save Receipt Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
