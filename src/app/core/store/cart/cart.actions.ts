import { createAction, props } from '@ngrx/store';
import { ICartItem } from '@app/features/cart/models/cart.model';
import { IProduct } from '@app/features/products/models/product.model';

// Add item to cart
export const cartAddItem = createAction(
  '[Cart] Add Item',
  props<{ product: IProduct; quantity: number }>(),
);

export const cartAddItemSuccess = createAction(
  '[Cart] Add Item Success',
  props<{
    items: ICartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
  }>(),
);

export const cartAddItemFailure = createAction(
  '[Cart] Add Item Failure',
  props<{ error: string }>(),
);

// Remove item from cart
export const cartRemoveItem = createAction('[Cart] Remove Item', props<{ productId: string }>());

export const cartRemoveItemSuccess = createAction(
  '[Cart] Remove Item Success',
  props<{
    items: ICartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
  }>(),
);

export const cartRemoveItemFailure = createAction(
  '[Cart] Remove Item Failure',
  props<{ error: string }>(),
);

// Update cart item quantity
export const cartUpdateItem = createAction(
  '[Cart] Update Item',
  props<{ productId: string; quantity: number }>(),
);

export const cartUpdateItemSuccess = createAction(
  '[Cart] Update Item Success',
  props<{
    items: ICartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
  }>(),
);

export const cartUpdateItemFailure = createAction(
  '[Cart] Update Item Failure',
  props<{ error: string }>(),
);

// Clear cart
export const cartClear = createAction('[Cart] Clear');

export const cartClearSuccess = createAction('[Cart] Clear Success');

// Load cart from storage
export const cartLoadFromStorage = createAction('[Cart] Load From Storage');

export const cartLoadFromStorageSuccess = createAction(
  '[Cart] Load From Storage Success',
  props<{
    items: ICartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
  }>(),
);

// Clear cart error
export const cartClearError = createAction('[Cart] Clear Error');
