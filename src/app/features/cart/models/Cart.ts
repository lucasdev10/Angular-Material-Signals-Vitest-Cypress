export interface ICartService {
  addItemToCart(productId: number, quantity: number): Promise<void>;
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
