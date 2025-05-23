
import { CartItem } from './SalesModule';
import { User } from '@/hooks/useAuth';

interface ReceiptPreviewProps {
  items: CartItem[];
  user: User;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  amountReceived: number;
  change: number;
  onComplete: () => void;
  onBack: () => void;
}

export const ReceiptPreview = ({
  items,
  user,
  paymentMethod,
  subtotal,
  discount,
  vat,
  total,
  amountReceived,
  change,
  onComplete,
  onBack
}: ReceiptPreviewProps) => {
  const receiptId = `R${Date.now().toString().slice(-6)}`;
  const currentTime = new Date();
  
  const formatDateTime = () => {
    return currentTime.toLocaleString('en-KE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Africa/Nairobi'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-bold">Receipt Preview</h3>
        <div className="flex space-x-2">
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Back
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Print
          </button>
        </div>
      </div>

      {/* Receipt Content */}
      <div className="bg-white text-black p-6 rounded-lg font-mono text-sm print:shadow-none">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <span className="text-white font-bold text-xl">JT</span>
          </div>
          <h2 className="font-bold text-lg">JEFF TRICKS SUPERMARKET</h2>
          <p>Point of Sale System</p>
          <p>Nairobi, Kenya</p>
          <p>Tel: +254700123456</p>
          <div className="border-t border-b border-black py-2 my-2">
            <p>Receipt #{receiptId}</p>
            <p>{formatDateTime()}</p>
            <p>Cashier: {user.name}</p>
            <p>Branch: {user.branch}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4">
          <div className="border-b border-black pb-2 mb-2">
            <div className="flex justify-between font-bold">
              <span>ITEM</span>
              <span>QTY</span>
              <span>PRICE</span>
              <span>TOTAL</span>
            </div>
          </div>
          
          {items.map(item => (
            <div key={item.id} className="mb-1">
              <div className="flex justify-between">
                <span className="flex-1 truncate">{item.name}</span>
                <span className="w-8 text-center">{item.quantity}</span>
                <span className="w-16 text-right">{item.price.toFixed(2)}</span>
                <span className="w-16 text-right">{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-black pt-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>KSh {subtotal.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-KSh {discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>VAT (16%):</span>
            <span>KSh {vat.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg border-t border-black pt-1">
            <span>TOTAL:</span>
            <span>KSh {total.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mt-2">
            <span>Payment ({paymentMethod}):</span>
            <span>KSh {paymentMethod === 'cash' ? amountReceived.toFixed(2) : total.toFixed(2)}</span>
          </div>
          
          {paymentMethod === 'cash' && change > 0 && (
            <div className="flex justify-between">
              <span>Change:</span>
              <span>KSh {change.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 pt-4 border-t border-black">
          <p className="font-bold">Thank You from Jeff Tricks!</p>
          <p>Hotline: +254700123456</p>
          <p className="text-xs mt-2">This is your official receipt</p>
          <p className="text-xs">VAT Reg: 123456789</p>
          
          {/* QR Code Placeholder */}
          <div className="mt-3 mx-auto w-16 h-16 border border-black flex items-center justify-center">
            <span className="text-xs">QR</span>
          </div>
          <p className="text-xs">Scan for loyalty points</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={onComplete}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition-colors"
        >
          Complete Transaction
        </button>
      </div>
    </div>
  );
};
