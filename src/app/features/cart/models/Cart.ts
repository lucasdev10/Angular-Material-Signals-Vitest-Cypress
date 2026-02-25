import { IProduct } from '@app/features/products/models/Product';

export interface ICartService {
  addItemToCart(product: IProduct): void;
  removeItemFromCart(productId: string): void;
  updateItemQuantity(productId: string, quantity: number): void;
}

export interface ICart {
  items: ICartItem[];
  total: number;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  price: number;
}
