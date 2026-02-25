import { IProduct } from '@app/features/products/models/Product';

export interface ICartService {
  addItemToCart(product: IProduct): void;
  removeItemFromCart(productId: number): Promise<void>;
  updateItemQuantity(productId: number, quantity: number): Promise<void>;
  calculateCartTotal(): Promise<ICart>;
}

export interface ICart {
  items: ICartItem[];
  total: number;
}

export interface ICartItem {
  productId: number;
  quantity: number;
  price: number;
}
