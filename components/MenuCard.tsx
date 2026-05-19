'use client';

import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { MenuItem } from '@/types';
import { useCart } from '@/hooks/useCart';

interface MenuCardProps {
  item: MenuItem;
}

function FoodPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50 text-orange-300">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-xs mt-1 text-orange-400 font-medium">No image</span>
    </div>
  );
}

export function MenuCard({ item }: MenuCardProps) {
  const { addItem, items } = useCart();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const [imgError, setImgError] = useState(false);
  const hasImage = !imgError && item.image && item.image.trim() !== '';

  return (
    <div className="card flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="relative w-full h-48 bg-orange-50 overflow-hidden">
        {hasImage ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <FoodPlaceholder />
        )}
        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {item.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-1 flex-1 line-clamp-2">
          {item.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-orange-600 font-bold text-xl">
              ${item.price.toFixed(2)}
            </span>
            {cartItem && (
              <span className="text-xs text-orange-500 font-medium">
                {cartItem.quantity} in cart
              </span>
            )}
          </div>

          <button
            onClick={() => {
              addItem(item);
              toast.success(`${item.name} added to cart`, {
                duration: 2000,
                icon: '🛒',
              });
            }}
            className="btn-primary text-sm py-2 px-4 shrink-0"
            data-testid={`add-to-cart-${item.id}`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
