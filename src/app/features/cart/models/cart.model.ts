import { IProduct } from '@app/features/products/models/product.model';
import { LoadingState } from '@app/shared';

/**
 * Item do carrinho
 */
export interface ICartItem {
  product: IProduct;
  quantity: number;
  subtotal: number; // price * quantity
}

/**
 * Carrinho de compras
 */
export interface ICart {
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

/**
 * DTO para adicionar item ao carrinho
 */
export interface IAddToCartDto {
  productId: string;
  quantity: number;
}

/**
 * DTO para atualizar quantidade
 */
export interface IUpdateCartItemDto {
  productId: string;
  quantity: number;
}

/**
 * Interface da store de carrinho
 */
export interface ICartStoreState {
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  loading: LoadingState;
  error: string | null;
}
