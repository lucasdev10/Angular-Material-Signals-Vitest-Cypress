export interface ICart {
  items: ICartItem[];
  total: number;
}

export interface ICartItem {
  productId: number;
  quantity: number;
  price: number;
}
