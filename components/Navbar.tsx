'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const router = useRouter();
  const totalItems = useCart((s) => s.totalItems)();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    toast.info('Signed out', { icon: '👋', duration: 2000 });
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🍕</span>
          <span className="text-xl font-bold text-orange-600">FoodDash</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated() ? (
            <>
              <Link
                href="/"
                className="text-gray-600 hover:text-orange-600 font-medium transition-colors hidden sm:block"
              >
                Menu
              </Link>

              <Link
                href="/my-orders"
                className="text-gray-600 hover:text-orange-600 font-medium transition-colors hidden sm:block"
              >
                My Orders
              </Link>

              <Link
                href="/checkout"
                className="relative flex items-center gap-2 btn-primary text-sm"
              >
                <span className="hidden sm:inline">Cart</span>
                <span>🛒</span>
                {totalItems > 0 && (
                  <span className="bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                <span className="text-sm text-gray-700 font-medium hidden sm:block">
                  {user?.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-orange-600 font-medium transition-colors text-sm"
              >
                Sign in
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
