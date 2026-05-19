'use client';

import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div
      className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
      data-testid="cart-item"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">
          {item.menuItem.name}
        </p>
        <p className="text-orange-600 text-sm font-semibold">
          ${(item.menuItem.price * item.quantity).toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold transition-colors"
          aria-label="Decrease quantity"
          data-testid="decrease-qty"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold text-gray-800">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold transition-colors"
          aria-label="Increase quantity"
          data-testid="increase-qty"
        >
          +
        </button>
      </div>

      <button
        onClick={() => removeItem(item.menuItem.id)}
        className="text-gray-400 hover:text-red-500 transition-colors text-sm ml-1"
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}
