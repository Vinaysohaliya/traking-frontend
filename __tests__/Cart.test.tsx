import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Cart } from '@/components/Cart';
import { CartItem as CartItemType } from '@/types';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockClearCart = vi.fn();
const mockItems: CartItemType[] = [
  {
    menuItem: {
      id: 'id-1',
      name: 'Margherita Pizza',
      description: 'Classic pizza',
      price: 12.99,
      image: 'https://example.com/pizza.jpg',
      category: 'Pizza',
    },
    quantity: 2,
  },
  {
    menuItem: {
      id: 'id-2',
      name: 'Classic Cheeseburger',
      description: 'Juicy burger',
      price: 10.99,
      image: 'https://example.com/burger.jpg',
      category: 'Burgers',
    },
    quantity: 1,
  },
];

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: mockItems,
    totalPrice: () =>
      mockItems.reduce((s, i) => s + i.menuItem.price * i.quantity, 0),
    clearCart: mockClearCart,
    updateQuantity: vi.fn(),
    removeItem: vi.fn(),
  }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: () => true,
    token: 'mock-token',
    user: { id: 'u1', email: 'test@test.com', name: 'Test' },
  }),
}));

describe('Cart', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
    mockClearCart.mockClear();
    mockPush.mockClear();
  });

  it('renders cart items when open', () => {
    render(<Cart isOpen={true} onClose={onClose} />);
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('Classic Cheeseburger')).toBeInTheDocument();
  });

  it('shows correct total price', () => {
    render(<Cart isOpen={true} onClose={onClose} />);
    // 12.99 * 2 + 10.99 * 1 = 36.97
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$36.97');
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<Cart isOpen={true} onClose={onClose} />);
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    render(<Cart isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close cart'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('navigates to checkout when "Proceed to Checkout" is clicked', () => {
    render(<Cart isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Proceed to Checkout'));
    expect(mockPush).toHaveBeenCalledWith('/checkout');
  });

  it('calls clearCart when "Clear Cart" is clicked', () => {
    render(<Cart isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Clear Cart'));
    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });

  it('is not visible when closed', () => {
    render(<Cart isOpen={false} onClose={onClose} />);
    const drawer = screen.getByTestId('cart-drawer');
    expect(drawer.className).toContain('translate-x-full');
  });
});
