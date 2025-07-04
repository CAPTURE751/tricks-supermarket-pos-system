import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CartItem, Customer } from './SalesModule';
import { User } from '@/hooks/useAuth';
import { useSales } from '@/hooks/useSales';
import { Calculator, CreditCard, Smartphone, DollarSign, Percent } from 'lucide-react';

interface CheckoutPanelProps {
  items: CartItem[];
  user: User;
  customer: Customer | null;
  saleNote: string;
  onCheckoutComplete: () => void;
}

export const CheckoutPanel = ({ items, user, customer, saleNote, onCheckoutComplete }: CheckoutPanelProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');
  const [discountValue, setDiscountValue] = useState<string>('0');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { completeSale } = useSales();

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const discountAmount = discountType === 'amount' 
    ? Math.min(parseFloat(discountValue) || 0, subtotal)
    : subtotal * ((parseFloat(discountValue) || 0) / 100);
  
  const discountPercentage = discountType === 'percentage' 
    ? parseFloat(discountValue) || 0 
    : (discountAmount / subtotal) * 100;

  const afterDiscount = subtotal - discountAmount;
  
  // Calculate tax (16% on taxable items like beverages)
  const taxAmount = items.reduce((sum, item) => {
    const itemTotal = (item.price * item.quantity);
    const itemAfterDiscount = itemTotal - (itemTotal * (discountAmount / subtotal));
    // Apply 16% tax if the product category suggests it's taxable
    const taxRate = item.category === 'Beverages' || item.category === 'Electronics' ? 0.16 : 0;
    return sum + (itemAfterDiscount * taxRate);
  }, 0);
  
  const total = afterDiscount + taxAmount;
  const received = parseFloat(amountReceived) || 0;
  const change = Math.max(0, received - total);

  const handleCheckout = async () => {
    if (items.length === 0) {
      return;
    }

    if (paymentMethod === 'cash' && received < total) {
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Completing sale with payment method:', paymentMethod);

      // Complete the sale using the updated completeSale function
      await completeSale(paymentMethod);

      // Reset form and clear cart
      setAmountReceived('');
      setDiscountValue('0');
      setReferenceNumber('');
      onCheckoutComplete();
      
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash': return <DollarSign className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'mpesa': return <Smartphone className="h-4 w-4" />;
      case 'airtel': return <Smartphone className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <Calculator className="mx-auto mb-2 h-12 w-12 text-gray-400" />
            <p className="text-gray-400">Add items to cart to checkout</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Checkout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Discount Section */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Discount
          </Label>
          <div className="flex gap-2">
            <Select value={discountType} onValueChange={(value: 'amount' | 'percentage') => setDiscountType(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amount">KSh</SelectItem>
                <SelectItem value="percentage">%</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">
                <div className="flex items-center gap-2">
                  {getPaymentIcon('cash')}
                  Cash
                </div>
              </SelectItem>
              <SelectItem value="card">
                <div className="flex items-center gap-2">
                  {getPaymentIcon('card')}
                  Card
                </div>
              </SelectItem>
              <SelectItem value="mpesa">
                <div className="flex items-center gap-2">
                  {getPaymentIcon('mpesa')}
                  M-Pesa
                </div>
              </SelectItem>
              <SelectItem value="airtel">
                <div className="flex items-center gap-2">
                  {getPaymentIcon('airtel')}
                  Airtel Money
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reference Number for digital payments */}
        {(paymentMethod === 'mpesa' || paymentMethod === 'airtel' || paymentMethod === 'card') && (
          <div className="space-y-2">
            <Label>Reference Number</Label>
            <Input
              placeholder="Enter transaction reference"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>
        )}

        {/* Amount Received for cash payments */}
        {paymentMethod === 'cash' && (
          <div className="space-y-2">
            <Label>Amount Received</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
            />
          </div>
        )}

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>KSh {subtotal.toFixed(2)}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountPercentage.toFixed(1)}%):</span>
              <span>-KSh {discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          {taxAmount > 0 && (
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>KSh {taxAmount.toFixed(2)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>KSh {total.toFixed(2)}</span>
          </div>

          {paymentMethod === 'cash' && received > 0 && (
            <>
              <div className="flex justify-between">
                <span>Received:</span>
                <span>KSh {received.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Change:</span>
                <span>KSh {change.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        <Button 
          onClick={handleCheckout}
          disabled={
            isProcessing || 
            (paymentMethod === 'cash' && received < total) ||
            ((paymentMethod === 'mpesa' || paymentMethod === 'airtel' || paymentMethod === 'card') && !referenceNumber.trim())
          }
          className="w-full"
          size="lg"
        >
          {isProcessing ? 'Processing...' : `Complete Sale - KSh ${total.toFixed(2)}`}
        </Button>
      </CardContent>
    </Card>
  );
};
