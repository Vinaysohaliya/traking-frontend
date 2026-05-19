'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order, ORDER_STATUS_LABELS, OrderStatus } from '@/types';
import { fetchMyOrders } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const STATUS_COLORS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: 'bg-blue-50 text-blue-700',
  PREPARING:      'bg-yellow-50 text-yellow-700',
  OUT_FOR_DELIVERY: 'bg-orange-50 text-orange-700',
  DELIVERED:      'bg-green-50 text-green-700',
};

const STATUS_DOTS: Record<OrderStatus, string> = {
  ORDER_RECEIVED:   'bg-blue-400',
  PREPARING:        'bg-yellow-400',
  OUT_FOR_DELIVERY: 'bg-orange-400',
  DELIVERED:        'bg-green-400',
};

export function MyOrdersPage() {
  const router = useRouter();
  const { token, user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchMyOrders(token!)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">All orders placed by {user?.name}</p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-16 text-center text-gray-400">
          <span className="text-6xl block mb-4">🍽️</span>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
          <p className="mb-6">You haven&apos;t placed any orders. Start exploring the menu!</p>
          <Link href="/" className="btn-primary inline-block">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow cursor-pointer block"
            >
              {/* Order ID + date */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${STATUS_COLORS[order.status]}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[order.status]}`} />
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>

                <p className="text-sm text-gray-600 mt-1 truncate">
                  {order.items.map((i) => `${i.menuItem.name} ×${i.quantity}`).join(', ')}
                </p>
              </div>

              {/* Total + arrow */}
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <span className="font-bold text-orange-600 text-lg">
                  ${order.total.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
              </div>

              <span className="text-gray-300 text-xl hidden sm:block">›</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
