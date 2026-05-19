'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { createOrder } from '@/lib/api';
import { CartItem } from './CartItem';

interface FormErrors {
  customerName?: string;
  address?: string;
  phone?: string;
}

export function CheckoutPage() {
  const router = useRouter();
  const { token, user, isAuthenticated } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const total = totalPrice();

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, [isAuthenticated, router]);

  const [form, setForm] = useState({
    customerName: user?.name ?? '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone.trim()))
      newErrors.phone = 'Enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      setApiError('Your cart is empty. Add items before checking out.');
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      const order = await createOrder({
        ...form,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
        })),
      }, token!);
      clearCart();
      toast.success('Order placed! Tracking your delivery...', { icon: '🎉', duration: 3000 });
      router.push(`/order/${order.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setApiError(msg);
      toast.error(msg, { duration: 4000 });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
        <span className="text-6xl">🛒</span>
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <p>Go back and add some delicious items!</p>
        <button onClick={() => router.push('/')} className="btn-primary mt-2">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Details Form */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-5 text-gray-800">
            Delivery Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customerName: e.target.value }))
                }
                className={`input-field ${errors.customerName ? 'border-red-400 focus:ring-red-300' : ''}`}
                placeholder="John Doe"
                data-testid="input-name"
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1" data-testid="error-name">
                  {errors.customerName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                className={`input-field resize-none h-24 ${errors.address ? 'border-red-400 focus:ring-red-300' : ''}`}
                placeholder="123 Main Street, City, State"
                data-testid="input-address"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1" data-testid="error-address">
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className={`input-field ${errors.phone ? 'border-red-400 focus:ring-red-300' : ''}`}
                placeholder="+1 555-0000"
                data-testid="input-phone"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1" data-testid="error-phone">
                  {errors.phone}
                </p>
              )}
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full mt-2 text-base"
              data-testid="submit-order"
            >
              {submitting ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-5 text-gray-800">Order Summary</h2>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <CartItem key={item.menuItem.id} item={item} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Subtotal</span>
            <span className="font-bold text-orange-600 text-lg">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-500">Delivery</span>
            <span className="text-sm text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-orange-600 text-xl">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
