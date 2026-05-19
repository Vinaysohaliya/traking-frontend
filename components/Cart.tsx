'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { CartItem } from './CartItem';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const total = totalPrice();

  const handleCheckout = () => {
    onClose();
    if (!isAuthenticated()) {
      toast.info('Please sign in to checkout', { icon: '🔒' });
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="cart-drawer"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <span className="text-5xl">🛒</span>
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-center">
                Add some delicious items from the menu!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <CartItem key={item.menuItem.id} item={item} />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-600" data-testid="cart-total">
                ${total.toFixed(2)}
              </span>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full">
              Proceed to Checkout
            </button>
            <button
              onClick={() => {
                clearCart();
                toast.info('Cart cleared', { icon: '🗑️', duration: 2000 });
              }}
              className="btn-secondary w-full text-sm"
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
