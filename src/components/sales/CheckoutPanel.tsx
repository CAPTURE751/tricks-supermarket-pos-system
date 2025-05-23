
import { useState } from 'react';
import { CartItem } from './SalesModule';
import { User } from '@/hooks/useAuth';
import { ReceiptPreview } from './ReceiptPreview';

interface CheckoutPanelProps {
  items: CartItem[];
  user: User;
  onCheckoutComplete: () => void;
}

type PaymentMethod = 'cash' | 'mpesa' | 'card' | 'airtel' | 'voucher';

export const CheckoutPanel = ({ items, user, onCheckoutComplete }: CheckoutPanelProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [discount, setDiscount] = useState<number>(0);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatRate = 0.16; // 16% VAT
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const vatAmount = taxableAmount * vatRate;
  const total = taxableAmount + vatAmount;
  const change = Math.max(0, amountReceived - total);

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
        onComplete={handleCompleteTransaction}
        onBack={() => setShowReceipt(false)}
      />
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white text-lg font-bold mb-4">Checkout</h3>

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
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-16 bg-gray-600 text-white px-2 py-1 rounded text-center"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-300">%</span>
                  <span className="text-red-400">-KSh {discountAmount.toFixed(2)}</span>
                </div>
              </div>
              
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
            <div className="grid grid-cols-2 gap-2">
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
              <input
                type="number"
                value={amountReceived || ''}
                onChange={(e) => setAmountReceived(Number(e.target.value))}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none text-lg"
                placeholder="0.00"
                step="0.01"
              />
              {change > 0 && (
                <p className="text-yellow-400 mt-2 font-semibold">
                  Change: KSh {change.toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={!canCheckout}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
              canCheckout
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {paymentMethod === 'cash' 
              ? `Complete Sale - KSh ${total.toFixed(2)}`
              : `Process ${paymentMethods.find(m => m.id === paymentMethod)?.label} Payment`
            }
          </button>
        </div>
      )}
    </div>
  );
};
