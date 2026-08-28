import {
  selectCartGlobalState,
  selectCartItems,
  selectCartSubtotal,
  selectCartShipping,
  selectCartTax,
  selectCartTotal,
  selectCartItemCount,
  selectCartLoading,
  selectCartError,
  selectCartIsEmpty,
} from './cart.selectors';
import { ICartGlobalState, initialCartGlobalState } from './cart.state';

describe('Cart Selectors', () => {
  const mockProduct = {
    id: 'prod-id',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    image: 'image.jpg',
    category: 'category',
    stock: 10,
    rating: 4.5,
    createdAt: 1774041882,
    updatedAt: 1774041882,
  };

  const mockCartItem = {
    product: mockProduct,
    quantity: 2,
    subtotal: 200,
  };

  const mockState: { cartGlobal: ICartGlobalState } = {
    cartGlobal: {
      items: [mockCartItem],
      subtotal: 200,
      shipping: 10,
      tax: 21,
      total: 231,
      itemCount: 2,
      loading: 'idle',
      error: null,
    },
  };

  it('should select cart global state', () => {
    const result = selectCartGlobalState(mockState);
    expect(result).toEqual(mockState.cartGlobal);
  });

  it('should select cart items', () => {
    const result = selectCartItems(mockState);
    expect(result).toEqual([mockCartItem]);
    expect(result).toHaveLength(1);
  });

  it('should select cart subtotal', () => {
    const result = selectCartSubtotal(mockState);
    expect(result).toBe(200);
  });

  it('should select cart shipping', () => {
    const result = selectCartShipping(mockState);
    expect(result).toBe(10);
  });

  it('should select cart tax', () => {
    const result = selectCartTax(mockState);
    expect(result).toBe(21);
  });

  it('should select cart total', () => {
    const result = selectCartTotal(mockState);
    expect(result).toBe(231);
  });

  it('should select cart item count', () => {
    const result = selectCartItemCount(mockState);
    expect(result).toBe(2);
  });

  it('should select cart loading', () => {
    const result = selectCartLoading(mockState);
    expect(result).toBe('idle');
  });

  it('should select cart error', () => {
    const errorState = { cartGlobal: { ...mockState.cartGlobal, error: 'Test error' } };
    const result = selectCartError(errorState);
    expect(result).toBe('Test error');
  });

  it('should select cart is not empty when items exist', () => {
    const result = selectCartIsEmpty(mockState);
    expect(result).toBe(false);
  });

  it('should select cart is empty when no items', () => {
    const emptyState = {
      cartGlobal: { ...mockState.cartGlobal, items: [] },
    };
    const result = selectCartIsEmpty(emptyState);
    expect(result).toBe(true);
  });
});
