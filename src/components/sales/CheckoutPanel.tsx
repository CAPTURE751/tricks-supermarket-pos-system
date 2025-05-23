
import { useState } from 'react';
import { CartItem, Customer } from './SalesModule';
import { User } from '@/hooks/useAuth';
import { ReceiptPreview } from './ReceiptPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface CheckoutPanelProps {
  items: CartItem[];
  user: User;
  customer: Customer | null;
  saleNote: string;
  onCheckoutComplete: () => void;
}

type PaymentMethod = 'cash' | 'mpesa' | 'card' | 'airtel' | 'voucher';

export const CheckoutPanel = ({ 
  items, 
  user, 
  customer, 
  saleNote, 
  onCheckoutComplete 
}: CheckoutPanelProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatRate = 0.16; // 16% VAT
  
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discount) / 100 
    : discount;
  
  const taxableAmount = subtotal - discountAmount;
  const vatAmount = taxableAmount * vatRate;
  const total = taxableAmount + vatAmount;
  const change = Math.max(0, amountReceived - total);
  
  // If customer has loyalty points, calculate potential discount
  const loyaltyDiscount = customer?.loyaltyPoints 
    ? Math.min(customer.loyaltyPoints / 10, total * 0.2) // Example: 10 points = 1 KSh, max 20% discount
    : 0;

  const canCheckout = items.length > 0 && (
    paymentMethod !== 'cash' || amountReceived >= total
  );

  const handleCheckout = () => {
    if (!canCheckout) return;
    
    // Generate receipt
    setShowReceipt(true);
  };

  const handleCompleteTransaction = () => {
    setShowReceipt(false);
    setAmountReceived(0);
    setDiscount(0);
    onCheckoutComplete();
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: '💵' },
    { id: 'mpesa', label: 'M-Pesa', icon: '📱' },
    { id: 'card', label: 'Card', icon: '💳' },
    { id: 'airtel', label: 'Airtel Money', icon: '📲' },
    { id: 'voucher', label: 'Voucher', icon: '🎫' },
  ];

  if (showReceipt) {
    return (
      <ReceiptPreview
        items={items}
        user={user}
        paymentMethod={paymentMethod}
        subtotal={subtotal}
        discount={discountAmount}
        vat={vatAmount}
        total={total}
        amountReceived={amountReceived}
        change={change}
        customer={customer}
        saleNote={saleNote}
        onComplete={handleCompleteTransaction}
        onBack={() => setShowReceipt(false)}
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-4">Checkout</h3>

        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Add items to cart to checkout</p>
        ) : (
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="text-white">KSh {subtotal.toFixed(2)}</span>
                </div>
                
                {/* Discount */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Discount:</span>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                      className="w-20 bg-gray-600 text-white px-2 py-1 rounded text-center"
                      placeholder="0"
                      min="0"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDiscountType(discountType === 'percentage' ? 'amount' : 'percentage')}
                      className="px-2"
                    >
                      {discountType === 'percentage' ? '%' : 'KSh'}
                    </Button>
                    <span className="text-red-400">
                      -KSh {discountAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Loyalty Points Discount */}
                {customer?.loyaltyPoints && loyaltyDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">
                      Available Loyalty Discount:
                      <Button 
                        variant="link" 
                        size="sm"
                        className="ml-1 text-green-400 p-0 h-auto"
                        onClick={() => {
                          setDiscountType('amount');
                          setDiscount(loyaltyDiscount);
                        }}
                      >
                        Apply
                      </Button>
                    </span>
                    <span className="text-green-400">
                      KSh {loyaltyDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-300">VAT (16%):</span>
                  <span className="text-white">KSh {vatAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
                  <span className="text-white">Total:</span>
                  <span className="text-green-400">KSh {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-white font-semibold mb-2 block">Payment Method</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === method.id
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">{method.icon}</div>
                      <div className="text-white text-sm">{method.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Payment */}
            {paymentMethod === 'cash' && (
              <div>
                <label className="text-white font-semibold mb-2 block">Amount Received</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={amountReceived || ''}
                    onChange={(e) => setAmountReceived(Number(e.target.value))}
                    className="flex-1 text-lg"
                    placeholder="0.00"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setAmountReceived(Math.ceil(total / 50) * 50)}
                  >
                    Next 50
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setAmountReceived(Math.ceil(total / 100) * 100)}
                  >
                    Next 100
                  </Button>
                </div>
                
                {change > 0 && (
                  <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-400 font-semibold text-center">
                    Change: KSh {change.toFixed(2)}
                  </div>
                )}
              </div>
            )}

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={!canCheckout}
              className={`w-full py-6 text-lg font-bold ${
                canCheckout
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              variant={canCheckout ? "default" : "ghost"}
            >
              {paymentMethod === 'cash' 
                ? `Complete Sale - KSh ${total.toFixed(2)}`
                : `Process ${paymentMethods.find(m => m.id === paymentMethod)?.label} Payment`
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
