import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutPage } from '@/components/CheckoutPage';
import { CartItem as CartItemType } from '@/types';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockCreateOrder = vi.fn();
vi.mock('@/lib/api', () => ({
  createOrder: (...args: unknown[]) => mockCreateOrder(...args),
}));

const mockClearCart = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockRemoveItem = vi.fn();

const mockItems: CartItemType[] = [
  {
    menuItem: {
      id: 'menu-1',
      name: 'Margherita Pizza',
      description: 'Classic',
      price: 12.99,
      image: '',
      category: 'Pizza',
    },
    quantity: 1,
  },
];

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: mockItems,
    totalPrice: () => 12.99,
    clearCart: mockClearCart,
    updateQuantity: mockUpdateQuantity,
    removeItem: mockRemoveItem,
  }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: () => true,
    token: 'mock-token',
    user: { id: 'u1', email: 'test@test.com', name: 'Test User' },
  }),
}));

describe('CheckoutPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockCreateOrder.mockClear();
    mockClearCart.mockClear();
  });

  it('renders delivery details form', () => {
    render(<CheckoutPage />);
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-address')).toBeInTheDocument();
    expect(screen.getByTestId('input-phone')).toBeInTheDocument();
  });

  it('shows validation error when name is empty on submit', async () => {
    render(<CheckoutPage />);
    // Clear the pre-filled name
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-order'));
    await waitFor(() => {
      expect(screen.getByTestId('error-name')).toHaveTextContent(
        'Name is required',
      );
    });
  });

  it('shows validation error when address is empty on submit', async () => {
    render(<CheckoutPage />);
    fireEvent.change(screen.getByTestId('input-name'), {
      target: { value: 'John' },
    });
    fireEvent.click(screen.getByTestId('submit-order'));
    await waitFor(() => {
      expect(screen.getByTestId('error-address')).toHaveTextContent(
        'Address is required',
      );
    });
  });

  it('shows validation error when phone is empty on submit', async () => {
    render(<CheckoutPage />);
    fireEvent.change(screen.getByTestId('input-name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByTestId('input-address'), {
      target: { value: '123 Main St' },
    });
    fireEvent.click(screen.getByTestId('submit-order'));
    await waitFor(() => {
      expect(screen.getByTestId('error-phone')).toHaveTextContent(
        'Phone is required',
      );
    });
  });

  it('submits order with valid inputs and redirects', async () => {
    mockCreateOrder.mockResolvedValue({ id: 'new-order-id' });
    render(<CheckoutPage />);

    fireEvent.change(screen.getByTestId('input-name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('input-address'), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByTestId('input-phone'), {
      target: { value: '555-1234' },
    });

    fireEvent.click(screen.getByTestId('submit-order'));

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledWith(
        {
          customerName: 'John Doe',
          address: '123 Main St',
          phone: '555-1234',
          items: [{ menuItemId: 'menu-1', quantity: 1 }],
        },
        'mock-token',
      );
      expect(mockClearCart).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/order/new-order-id');
    });
  });

  it('shows api error when order creation fails', async () => {
    mockCreateOrder.mockRejectedValue(new Error('Server error'));
    render(<CheckoutPage />);

    fireEvent.change(screen.getByTestId('input-name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByTestId('input-address'), {
      target: { value: '123 St' },
    });
    fireEvent.change(screen.getByTestId('input-phone'), {
      target: { value: '555-9999' },
    });

    fireEvent.click(screen.getByTestId('submit-order'));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });
});
