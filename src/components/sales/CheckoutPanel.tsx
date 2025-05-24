
import { useState } from 'react';
import { CartItem, Customer } from './SalesModule';
import { User } from '@/hooks/useAuth';
import { CheckoutPopup } from './CheckoutPopup';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CheckoutPanelProps {
  items: CartItem[];
  user: User;
  customer: Customer | null;
  saleNote: string;
  onCheckoutComplete: () => void;
}

export const CheckoutPanel = ({ 
  items, 
  user, 
  customer, 
  saleNote, 
  onCheckoutComplete 
}: CheckoutPanelProps) => {
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatRate = 0.16; // 16% VAT
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const canCheckout = items.length > 0;

  const handleCheckout = () => {
    if (!canCheckout) return;
    setShowCheckoutPopup(true);
  };

  const handleCheckoutComplete = () => {
    setShowCheckoutPopup(false);
    onCheckoutComplete();
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-4">Checkout</h3>

          {items.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Add items to cart to checkout</p>
          ) : (
            <div className="space-y-4">
              {/* Quick Summary */}
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white">KSh {subtotal.toFixed(2)}</span>
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
                Proceed to Checkout - KSh {total.toFixed(2)}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CheckoutPopup
        isOpen={showCheckoutPopup}
        onClose={() => setShowCheckoutPopup(false)}
        items={items}
        user={user}
        customer={customer}
        saleNote={saleNote}
        onCheckoutComplete={handleCheckoutComplete}
      />
    </>
  );
};
