/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { ICart, ICartService } from '@app/features/cart/models/Cart';

@Injectable({
  providedIn: 'root',
})
export class CartService implements ICartService {
  addItemToCart(productId: number, quantity: number): Promise<void> {
    throw new Error('Method not implemented.');
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
