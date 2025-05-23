
import { CartItem } from './SalesModule';

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateItem: (id: string, quantity: number) => void;
  onClear: () => void;
}

export const ShoppingCart = ({ items, onUpdateItem, onClear }: ShoppingCartProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-bold">
          Shopping Cart ({totalItems} items)
        </h3>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="bg-gray-700 p-3 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-semibold text-sm flex-1">
                {item.name}
              </h4>
              <button
                onClick={() => onUpdateItem(item.id, 0)}
                className="text-red-400 hover:text-red-300 ml-2"
              >
                ✕
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateItem(item.id, item.quantity - 1)}
                  className="bg-gray-600 hover:bg-gray-500 text-white w-8 h-8 rounded-lg flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-white font-semibold w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateItem(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white w-8 h-8 rounded-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-gray-400 text-xs">KSh {item.price} each</p>
                <p className="text-green-400 font-bold">
                  KSh {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            {item.quantity >= item.stock && (
              <p className="text-yellow-400 text-xs mt-1">Max stock reached</p>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">Cart is empty</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex justify-between text-white font-bold text-lg">
            <span>Subtotal:</span>
            <span>KSh {subtotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
