/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, signal, WritableSignal } from '@angular/core';
import { ICart, ICartService } from '@app/features/cart/models/Cart';
import { IProduct } from '@app/features/products/models/Product';

@Injectable({
  providedIn: 'root',
})
export class CartService implements ICartService {
  products: WritableSignal<IProduct[]> = signal([]);

  addItemToCart(product: IProduct): void {
    this.products.update((products) => [...products, product]);
  }

  removeItemFromCart(productId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  updateItemQuantity(productId: number, quantity: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  calculateCartTotal(): Promise<ICart> {
    throw new Error('Method not implemented.');
  }
}
