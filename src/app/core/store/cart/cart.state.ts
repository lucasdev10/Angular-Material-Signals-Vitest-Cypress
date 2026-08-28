import { ICartItem } from '@app/features/cart/models/cart.model';

/**
 * Global Cart State - Shared across all MFEs
 * This state represents the shopping cart shared at the Shell App level
 */
export interface ICartGlobalState {
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  loading: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
}

export const initialCartGlobalState: ICartGlobalState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
  loading: 'idle',
  error: null,
};
