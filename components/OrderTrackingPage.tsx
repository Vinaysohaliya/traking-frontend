'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/types';
import { fetchOrder } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useOrderSSE } from '@/hooks/useOrderSSE';
import { OrderStatusStepper } from './OrderStatusStepper';

const STATUS_TOAST_CONFIG: Record<OrderStatus, { icon: string; message: string }> = {
  ORDER_RECEIVED: { icon: '📋', message: 'Order received — we got it!' },
  PREPARING:      { icon: '👨‍🍳', message: 'Your food is being prepared...' },
  OUT_FOR_DELIVERY: { icon: '🛵', message: 'Out for delivery — almost there!' },
  DELIVERED:      { icon: '✅', message: 'Delivered! Enjoy your meal 🎉' },
};

interface OrderTrackingPageProps {
  orderId: string;
}

export function OrderTrackingPage({ orderId }: OrderTrackingPageProps) {
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevStatusRef = useRef<OrderStatus | null>(null);

  const { status: liveStatus, done } = useOrderSSE(orderId, token);
  const displayStatus: OrderStatus = liveStatus ?? order?.status ?? 'ORDER_RECEIVED';

  // Show toast whenever status changes via SSE
  useEffect(() => {
    if (!liveStatus) return;
    if (liveStatus === prevStatusRef.current) return;
    prevStatusRef.current = liveStatus;

    const { icon, message } = STATUS_TOAST_CONFIG[liveStatus];
    if (liveStatus === 'DELIVERED') {
      toast.success(message, { icon, duration: 5000 });
    } else {
      toast(message, { icon, duration: 3500 });
    }
  }, [liveStatus]);

  useEffect(() => {
    if (!token) return;
    fetchOrder(orderId, token)
      .then(setOrder)
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false));
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center py-24 gap-4 text-gray-500">
        <span className="text-5xl">😕</span>
        <h2 className="text-2xl font-bold text-gray-700">Order not found</h2>
        <Link href="/" className="btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">
          {displayStatus === 'DELIVERED' ? '🎉' : '🍽️'}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {displayStatus === 'DELIVERED' ? 'Enjoy your meal!' : 'Your order is on its way!'}
        </h1>
        <p className="text-gray-500 mt-1">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Status Card */}
      <div className="card p-8 mb-6">
        <div className="text-center mb-6 flex flex-col items-center gap-2">
          <span className="inline-block bg-orange-50 text-orange-700 font-bold px-4 py-2 rounded-full text-lg">
            {ORDER_STATUS_LABELS[displayStatus]}
          </span>
          {done ? (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
              Live updates complete
            </span>
          ) : (
            <span className="text-xs text-orange-500 font-medium bg-orange-50 px-3 py-1 rounded-full animate-pulse">
              Live updates active...
            </span>
          )}
        </div>
        <OrderStatusStepper status={displayStatus} />
      </div>

      {/* Order Details */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Order Details</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.menuItem.name} × {item.quantity}
              </span>
              <span className="font-medium text-gray-900">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-orange-600">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Delivery Info</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">Name:</span> {order.customerName}
          </p>
          <p>
            <span className="font-medium">Address:</span> {order.address}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {order.phone}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/" className="btn-primary flex-1 text-center">
          Order Again
        </Link>
      </div>
    </div>
  );
}
