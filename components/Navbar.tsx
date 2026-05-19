'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const totalItems = useCart((s) => s.totalItems)();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    toast.info('Signed out', { icon: '👋', duration: 2000 });
    router.push('/login');
  };

  const active = (path: string) =>
    pathname === path ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600';

  return (
    <>
      {/* Top header */}
      <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🍕</span>
            <span className="text-xl font-bold text-orange-600">FoodDash</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-3">
            {isAuthenticated() ? (
              <>
                <Link href="/" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                  Menu
                </Link>
                <Link href="/my-orders" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                  My Orders
                </Link>
                <Link href="/checkout" className="relative flex items-center gap-2 btn-primary text-sm">
                  <span>Cart</span>
                  <span>🛒</span>
                  {totalItems > 0 && (
                    <span className="bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                  <span className="text-sm text-gray-700 font-medium">{user?.name.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium">
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-orange-600 font-medium transition-colors text-sm">
                  Sign in
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile: show cart badge in header */}
          <div className="flex sm:hidden items-center gap-3">
            {isAuthenticated() ? (
              <Link href="/checkout" className="relative p-2">
                <span className="text-2xl">🛒</span>
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            ) : (
              <Link href="/login" className="btn-primary text-sm">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      {isAuthenticated() && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] sm:hidden z-40 safe-area-pb">
          <div className="flex items-center justify-around h-16 px-2">
            <Link href="/" className={`flex flex-col items-center gap-0.5 transition-colors ${active('/')}`}>
              <span className="text-2xl">🏠</span>
              <span className="text-xs font-medium">Menu</span>
            </Link>

            <Link href="/my-orders" className={`flex flex-col items-center gap-0.5 transition-colors ${active('/my-orders')}`}>
              <span className="text-2xl">📋</span>
              <span className="text-xs font-medium">My Orders</span>
            </Link>

            <Link href="/checkout" className={`flex flex-col items-center gap-0.5 transition-colors relative ${active('/checkout')}`}>
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="text-xs font-medium">Cart</span>
            </Link>

            <button onClick={handleLogout} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-red-500 transition-colors">
              <span className="text-2xl">👤</span>
              <span className="text-xs font-medium">Sign out</span>
            </button>
          </div>
        </nav>
      )}

      {/* Show register link in bottom area if not authenticated */}
      {!isAuthenticated() && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 sm:hidden z-40">
          <div className="flex items-center justify-around h-16 px-2">
            <Link href="/login" className={`flex flex-col items-center gap-0.5 transition-colors ${active('/login')}`}>
              <span className="text-2xl">🔑</span>
              <span className="text-xs font-medium">Sign in</span>
            </Link>
            <Link href="/register" className={`flex flex-col items-center gap-0.5 transition-colors ${active('/register')}`}>
              <span className="text-2xl">👤</span>
              <span className="text-xs font-medium">Register</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
