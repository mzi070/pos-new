import { Trash2, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { useViewport } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/Button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

interface ResponsiveCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  subtotal: number;
  tax: number;
  total: number;
  onClose?: () => void;
  isEmpty?: boolean;
}

/**
 * Responsive shopping cart component
 * Mobile: Bottom sheet modal
 * Tablet: Slide-out drawer
 * Desktop: Sidebar panel
 */
export function ResponsiveCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  subtotal,
  tax,
  total,
  onClose,
  isEmpty,
}: ResponsiveCartProps) {
  const { isMobile, isTablet } = useViewport();

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6">
        <ShoppingCart size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Cart is Empty</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Add products to get started</p>
      </div>
    );
  }

  const cartContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Order Summary ({items.length})
        </h2>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemoveItem={onRemoveItem} />
        ))}
      </div>

      {/* Totals Section */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-3 sm:pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
          <span className="font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-slate-400">Tax:</span>
          <span className="font-medium text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base sm:text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-2 sm:pt-3">
          <span className="text-slate-900 dark:text-white">Total:</span>
          <span className="text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-4">
        <Button onClick={onCheckout} fullWidth size="lg" className="mb-2">
          Checkout
        </Button>
        {isMobile && (
          <Button onClick={onClose} variant="secondary" fullWidth size="md">
            Shopping
          </Button>
        )}
      </div>
    </div>
  );

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl max-h-[90vh] flex flex-col p-4">
          {cartContent}
        </div>
      </div>
    );
  }

  // Tablet: Slide-out Drawer
  if (isTablet) {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-xl z-40 flex flex-col p-4">
        {cartContent}
      </div>
    );
  }

  // Desktop: Sidebar Panel
  return (
    <div className="fixed top-0 right-0 bottom-0 w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-xl z-40 flex flex-col p-6">
      {cartContent}
    </div>
  );
}

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

/**
 * Cart item row component (responsive)
 */
function CartItemRow({ item, onUpdateQuantity, onRemoveItem }: CartItemRowProps) {
  return (
    <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
      {/* Image */}
      {item.image && (
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-md object-cover"
          />
        </div>
      )}

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
        {item.sku && <p className="text-xs text-slate-500 dark:text-slate-400">SKU: {item.sku}</p>}
        <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
          ${(item.price * item.quantity).toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center text-sm font-semibold text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0">
        <button
          onClick={() => onRemoveItem(item.id)}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * Cart drawer trigger button
 * Shows badge with item count
 */
export function CartButton({
  itemCount,
  onClick,
  className = '',
}: {
  itemCount: number;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition
        ${className}
      `}
      aria-label="Shopping cart"
    >
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}

/**
 * Mini cart preview (for desktop top bar)
 */
export function MiniCart({
  items,
  total,
  onClick,
}: {
  items: CartItem[];
  total: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
    >
      <ShoppingCart size={20} className="text-blue-600 dark:text-blue-400" />
      <div className="text-right">
        <p className="text-xs text-slate-600 dark:text-slate-400">{items.length} items</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">${total.toFixed(2)}</p>
      </div>
    </button>
  );
}
