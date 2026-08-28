import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { initialCartGlobalState } from './cart.state';

export const cartGlobalReducer = createReducer(
  initialCartGlobalState,
  on(CartActions.cartAddItem, (state) => ({
    ...state,
    loading: 'pending' as const,
  })),
  on(
    CartActions.cartAddItemSuccess,
    (state, { items, subtotal, shipping, tax, total, itemCount }) => ({
      ...state,
      items,
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
      loading: 'success' as const,
      error: null,
    }),
  ),
  on(CartActions.cartAddItemFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),
  on(CartActions.cartRemoveItem, (state) => ({
    ...state,
    loading: 'pending' as const,
  })),
  on(
    CartActions.cartRemoveItemSuccess,
    (state, { items, subtotal, shipping, tax, total, itemCount }) => ({
      ...state,
      items,
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
      loading: 'success' as const,
      error: null,
    }),
  ),
  on(CartActions.cartRemoveItemFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),
  on(CartActions.cartUpdateItem, (state) => ({
    ...state,
    loading: 'pending' as const,
  })),
  on(
    CartActions.cartUpdateItemSuccess,
    (state, { items, subtotal, shipping, tax, total, itemCount }) => ({
      ...state,
      items,
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
      loading: 'success' as const,
      error: null,
    }),
  ),
  on(CartActions.cartUpdateItemFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),
  on(CartActions.cartClear, (state) => ({
    ...state,
    loading: 'pending' as const,
  })),
  on(CartActions.cartClearSuccess, (state) => ({
    ...state,
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    itemCount: 0,
    loading: 'idle' as const,
    error: null,
  })),
  on(
    CartActions.cartLoadFromStorageSuccess,
    (state, { items, subtotal, shipping, tax, total, itemCount }) => ({
      ...state,
      items,
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
      loading: 'idle' as const,
    }),
  ),
  on(CartActions.cartClearError, (state) => ({
    ...state,
    error: null,
  })),
);
