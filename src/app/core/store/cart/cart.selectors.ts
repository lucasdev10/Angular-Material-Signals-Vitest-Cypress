import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICartGlobalState } from './cart.state';

export const selectCartGlobalState = createFeatureSelector<ICartGlobalState>('cartGlobal');

export const selectCartItems = createSelector(selectCartGlobalState, (state) => state.items);

export const selectCartSubtotal = createSelector(selectCartGlobalState, (state) => state.subtotal);

export const selectCartShipping = createSelector(selectCartGlobalState, (state) => state.shipping);

export const selectCartTax = createSelector(selectCartGlobalState, (state) => state.tax);

export const selectCartTotal = createSelector(selectCartGlobalState, (state) => state.total);

export const selectCartItemCount = createSelector(
  selectCartGlobalState,
  (state) => state.itemCount,
);

export const selectCartLoading = createSelector(selectCartGlobalState, (state) => state.loading);

export const selectCartError = createSelector(selectCartGlobalState, (state) => state.error);

export const selectCartIsEmpty = createSelector(selectCartItems, (items) => items.length === 0);
