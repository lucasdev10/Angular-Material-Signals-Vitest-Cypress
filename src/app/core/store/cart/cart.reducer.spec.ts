import * as CartActions from './cart.actions';
import { cartGlobalReducer } from './cart.reducer';
import { initialCartGlobalState } from './cart.state';

describe('CartGlobalReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = cartGlobalReducer(initialCartGlobalState, action as any);

      expect(state).toEqual(initialCartGlobalState);
    });
  });

  describe('AddItem', () => {
    it('should set loading to pending on add item', () => {
      const product = {
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
      const action = CartActions.cartAddItem({ product, quantity: 1 });
      const state = cartGlobalReducer(initialCartGlobalState, action);

      expect(state.loading).toBe('pending');
    });

    it('should add item to cart on success', () => {
      const cartItem = {
        product: {
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
        },
        quantity: 1,
        subtotal: 100,
      };
      const action = CartActions.cartAddItemSuccess({
        items: [cartItem],
        subtotal: 100,
        shipping: 10,
        tax: 11,
        total: 121,
        itemCount: 1,
      });
      const state = cartGlobalReducer(initialCartGlobalState, action);

      expect(state.loading).toBe('success');
      expect(state.items).toHaveLength(1);
      expect(state.itemCount).toBe(1);
      expect(state.subtotal).toBe(100);
      expect(state.total).toBe(121);
      expect(state.error).toBe(null);
    });

    it('should set error on add item failure', () => {
      const error = 'Product not found';
      const action = CartActions.cartAddItemFailure({ error });
      const state = cartGlobalReducer(initialCartGlobalState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('RemoveItem', () => {
    it('should set loading to pending on remove item', () => {
      const action = CartActions.cartRemoveItem({ productId: 'prod-id' });
      const state = cartGlobalReducer(initialCartGlobalState, action);

      expect(state.loading).toBe('pending');
    });

    it('should remove item from cart on success', () => {
      const cartWithItem = {
        ...initialCartGlobalState,
        items: [
          {
            product: {
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
            },
            quantity: 1,
            subtotal: 100,
          },
        ],
        itemCount: 1,
        subtotal: 100,
        total: 121,
      };
      const action = CartActions.cartRemoveItemSuccess({
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      });
      const state = cartGlobalReducer(cartWithItem, action);

      expect(state.loading).toBe('success');
      expect(state.items).toHaveLength(0);
      expect(state.itemCount).toBe(0);
      expect(state.subtotal).toBe(0);
    });
  });

  describe('UpdateItem', () => {
    it('should set loading to pending on update item', () => {
      const action = CartActions.cartUpdateItem({ productId: 'prod-id', quantity: 5 });
      const state = cartGlobalReducer(initialCartGlobalState, action);

      expect(state.loading).toBe('pending');
    });

    it('should update item quantity on success', () => {
      const updatedItem = {
        product: {
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
        },
        quantity: 5,
        subtotal: 500,
      };
      const action = CartActions.cartUpdateItemSuccess({
        items: [updatedItem],
        subtotal: 500,
        shipping: 10,
        tax: 51,
        total: 561,
        itemCount: 5,
      });
      const state = cartGlobalReducer(initialCartGlobalState, action);

      expect(state.loading).toBe('success');
      expect(state.items[0].quantity).toBe(5);
      expect(state.itemCount).toBe(5);
      expect(state.subtotal).toBe(500);
    });
  });

  describe('ClearCart', () => {
    it('should set loading to pending on clear', () => {
      const action = CartActions.cartClear();
      const state = cartGlobalReducer(initialCartGlobalState, action);

      expect(state.loading).toBe('pending');
    });

    it('should clear all cart items on success', () => {
      const cartWithItems = {
        ...initialCartGlobalState,
        items: [
          {
            product: {
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
            },
            quantity: 1,
            subtotal: 100,
          },
        ],
        itemCount: 1,
        subtotal: 100,
        total: 121,
      };
      const action = CartActions.cartClearSuccess();
      const state = cartGlobalReducer(cartWithItems, action);

      expect(state.loading).toBe('idle');
      expect(state.items).toHaveLength(0);
      expect(state.itemCount).toBe(0);
      expect(state.subtotal).toBe(0);
      expect(state.total).toBe(0);
    });
  });

  describe('LoadFromStorage', () => {
    it('should load cart state from storage', () => {
      const cartItem = {
        product: {
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
        },
        quantity: 2,
        subtotal: 200,
      };
      const action = CartActions.cartLoadFromStorageSuccess({
        items: [cartItem],
        subtotal: 200,
        shipping: 10,
        tax: 21,
        total: 231,
        itemCount: 2,
      });
      const state = cartGlobalReducer(initialCartGlobalState, action);

      expect(state.loading).toBe('idle');
      expect(state.items).toHaveLength(1);
      expect(state.itemCount).toBe(2);
      expect(state.total).toBe(231);
    });
  });

  describe('ClearError', () => {
    it('should clear error message', () => {
      const stateWithError = {
        ...initialCartGlobalState,
        error: 'Cart operation failed',
        loading: 'error' as const,
      };
      const action = CartActions.cartClearError();
      const state = cartGlobalReducer(stateWithError, action);

      expect(state.error).toBe(null);
    });
  });
});
