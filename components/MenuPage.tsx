'use client';

import { useEffect, useState } from 'react';
import { MenuItem } from '@/types';
import { fetchMenu } from '@/lib/api';
import { MenuCard } from './MenuCard';
import { Cart } from './Cart';
import { useCart } from '@/hooks/useCart';

export function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = useCart((s) => s.totalItems)();

  useEffect(() => {
    fetchMenu()
      .then(setMenuItems)
      .catch(() => setError('Failed to load menu. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(menuItems.map((i) => i.category))).sort()];
  const filtered =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          What are you craving? 🍽️
        </h1>
        <p className="text-gray-500 mt-1">
          Fresh food, delivered fast. Browse our menu and order now.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 btn-primary flex items-center gap-2 shadow-lg rounded-full px-6 py-3 text-base"
        >
          <span>🛒</span>
          <span>View Cart</span>
          <span className="bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {totalItems}
          </span>
        </button>
      )}

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
