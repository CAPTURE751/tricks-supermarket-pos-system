
import { useState, useEffect } from 'react';
import { CartItem, Customer } from './SalesModule';
import { User } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Calculator, CreditCard, Smartphone, Banknote, Receipt } from 'lucide-react';

interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: User;
  customer: Customer | null;
  saleNote: string;
  onCheckoutComplete: () => void;
}

type PaymentMethod = 'cash' | 'mpesa' | 'card';

interface PaymentSplit {
  method: PaymentMethod;
  amount: number;
}

export const CheckoutPopup = ({ 
  isOpen, 
  onClose, 
  items, 
  user, 
  customer, 
  saleNote, 
  onCheckoutComplete 
}: CheckoutPopupProps) => {
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [activeInput, setActiveInput] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatRate = 0.16; // 16% VAT
  
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discount) / 100 
    : discount;
  
  const taxableAmount = subtotal - discountAmount;
  const vatAmount = taxableAmount * vatRate;
  const total = taxableAmount + vatAmount;

  const totalPaid = paymentSplits.reduce((sum, split) => sum + split.amount, 0);
  const remaining = Math.max(0, total - totalPaid);
  const change = Math.max(0, totalPaid - total);

  useEffect(() => {
    if (isOpen) {
      setPaymentSplits([]);
      setDiscount(0);
      setActiveInput('');
      setInputValue('');
    }
  }, [isOpen]);

  const addPaymentSplit = (method: PaymentMethod) => {
    const amount = remaining > 0 ? remaining : 0;
    setPaymentSplits([...paymentSplits, { method, amount }]);
  };

  const updatePaymentSplit = (index: number, amount: number) => {
    const updated = [...paymentSplits];
    updated[index].amount = Math.max(0, amount);
    setPaymentSplits(updated);
  };

  const removePaymentSplit = (index: number) => {
    setPaymentSplits(paymentSplits.filter((_, i) => i !== index));
  };

  const handleKeypadClick = (value: string) => {
    if (value === 'clear') {
      setInputValue('');
    } else if (value === 'backspace') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (value === '.') {
      if (!inputValue.includes('.')) {
        setInputValue(prev => prev + value);
      }
    } else {
      setInputValue(prev => prev + value);
    }
  };

  const applyInputValue = () => {
    const numValue = parseFloat(inputValue) || 0;
    
    if (activeInput === 'discount') {
      setDiscount(numValue);
    } else if (activeInput.startsWith('payment-')) {
      const index = parseInt(activeInput.split('-')[1]);
      updatePaymentSplit(index, numValue);
    }
    
    setActiveInput('');
    setInputValue('');
  };

  const canComplete = totalPaid >= total;

  const handleComplete = () => {
    if (canComplete) {
      onCheckoutComplete();
      onClose();
    }
  };

  const paymentMethods = [
    { id: 'cash' as PaymentMethod, label: 'Cash', icon: Banknote, color: 'bg-green-600' },
    { id: 'mpesa' as PaymentMethod, label: 'M-Pesa', icon: Smartphone, color: 'bg-green-700' },
    { id: 'card' as PaymentMethod, label: 'Card', icon: CreditCard, color: 'bg-blue-600' },
  ];

  const keypadButtons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    '.', '0', 'backspace',
    'clear', 'apply'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-gray-900 text-white border-gray-700 p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Side - Items & Summary */}
          <div className="flex-1 p-6 border-r border-gray-700">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-green-400">Checkout</DialogTitle>
            </DialogHeader>

            {/* Items List */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Items ({items.length})</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-400">
                          {item.quantity} × KSh {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          KSh {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>KSh {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Discount:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveInput('discount');
                        setInputValue(discount.toString());
                      }}
                      className="px-2 py-1 text-xs"
                    >
                      {discount} {discountType === 'percentage' ? '%' : 'KSh'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDiscountType(discountType === 'percentage' ? 'amount' : 'percentage')}
                      className="px-2 py-1 text-xs"
                    >
                      {discountType === 'percentage' ? '%' : 'KSh'}
                    </Button>
                    <span className="text-red-400">-KSh {discountAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span>VAT (16%):</span>
                  <span>KSh {vatAmount.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-400">KSh {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payments & Keypad */}
          <div className="w-96 p-6 flex flex-col">
            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {paymentMethods.map(method => (
                  <Button
                    key={method.id}
                    onClick={() => addPaymentSplit(method.id)}
                    className={`p-3 ${method.color} hover:opacity-80`}
                    disabled={remaining <= 0}
                  >
                    <method.icon className="w-4 h-4 mr-1" />
                    {method.label}
                  </Button>
                ))}
              </div>

              {/* Payment Splits */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {paymentSplits.map((split, index) => (
                  <div key={index} className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {paymentMethods.find(m => m.id === split.method)?.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveInput(`payment-${index}`);
                          setInputValue(split.amount.toString());
                        }}
                        className="px-2 py-1 text-xs"
                      >
                        KSh {split.amount.toFixed(2)}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePaymentSplit(index)}
                        className="px-2 py-1 text-xs text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Due:</span>
                  <span>KSh {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span className="text-green-400">KSh {totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Remaining:</span>
                  <span className={remaining > 0 ? 'text-orange-400' : 'text-green-400'}>
                    KSh {remaining.toFixed(2)}
                  </span>
                </div>
                {change > 0 && (
                  <div className="flex justify-between font-semibold">
                    <span>Change:</span>
                    <span className="text-yellow-400">KSh {change.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Numeric Keypad */}
            <div className="mb-6">
              <div className="mb-2">
                <Input
                  value={inputValue}
                  readOnly
                  placeholder="Enter amount"
                  className="bg-gray-800 text-white text-center text-lg font-mono"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {keypadButtons.map((btn) => (
                  <Button
                    key={btn}
                    onClick={() => {
                      if (btn === 'apply') {
                        applyInputValue();
                      } else {
                        handleKeypadClick(btn);
                      }
                    }}
                    variant="outline"
                    className={`h-12 text-lg font-semibold ${
                      btn === 'apply' ? 'bg-green-600 hover:bg-green-700 text-white col-span-3' :
                      btn === 'clear' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      btn === 'backspace' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                      'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                    disabled={!activeInput && btn === 'apply'}
                  >
                    {btn === 'backspace' ? '⌫' : btn === 'apply' ? '✓ Apply' : btn}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-auto">
              <Button
                onClick={handleComplete}
                disabled={!canComplete}
                className={`w-full py-4 text-lg font-bold ${
                  canComplete
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                <Receipt className="w-5 h-5 mr-2" />
                Confirm Payment
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="py-3 border-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {/* Print receipt logic */}}
                  className="py-3 border-gray-600 hover:bg-gray-700"
                  disabled={!canComplete}
                >
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
