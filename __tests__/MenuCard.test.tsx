import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuCard } from '@/components/MenuCard';
import { MenuItem } from '@/types';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Mock the cart hook
const mockAddItem = vi.fn();
vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    items: [],
  }),
}));

const mockMenuItem: MenuItem = {
  id: 'test-id-1',
  name: 'Margherita Pizza',
  description: 'Classic pizza with tomato sauce and fresh mozzarella',
  price: 12.99,
  image: 'https://images.unsplash.com/photo-test',
  category: 'Pizza',
};

describe('MenuCard', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
  });

  it('renders item name', () => {
    render(<MenuCard item={mockMenuItem} />);
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
  });

  it('renders item description', () => {
    render(<MenuCard item={mockMenuItem} />);
    expect(
      screen.getByText('Classic pizza with tomato sauce and fresh mozzarella'),
    ).toBeInTheDocument();
  });

  it('renders item price formatted as currency', () => {
    render(<MenuCard item={mockMenuItem} />);
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<MenuCard item={mockMenuItem} />);
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('renders an "Add to Cart" button', () => {
    render(<MenuCard item={mockMenuItem} />);
    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  it('calls addItem when "Add to Cart" is clicked', () => {
    render(<MenuCard item={mockMenuItem} />);
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(mockAddItem).toHaveBeenCalledWith(mockMenuItem);
    expect(mockAddItem).toHaveBeenCalledTimes(1);
  });

  it('renders item image with correct alt text', () => {
    render(<MenuCard item={mockMenuItem} />);
    const img = screen.getByAltText('Margherita Pizza');
    expect(img).toBeInTheDocument();
  });
});
