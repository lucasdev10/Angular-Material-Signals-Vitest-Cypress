import { Injectable, signal, WritableSignal } from '@angular/core';
import { ICart, ICartService } from '@app/features/cart/models/Cart';
import { IProduct } from '@app/features/products/models/Product';

@Injectable({
  providedIn: 'root',
})
export class CartService implements ICartService {
  cartData: WritableSignal<ICart | null> = signal(null);

  addItemToCart(product: IProduct): void {
    this.cartData.update((cart) => {
      if (cart === null) {
        return {
          items: [{ product, quantity: 1, price: product.price }],
          total: product.price,
        };
      }
      const existingItemIndex = cart.items.findIndex((item) => item.product.id === product.id);

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += 1;
        cart.items[existingItemIndex].price += product.price;
      } else {
        cart.items.push({ product, quantity: 1, price: product.price });
      }

      const total = cart.items.reduce((sum, item) => sum + item.price, 0);
      return { ...cart, total };
    });
  }

  removeItemFromCart(productId: string): void {
    this.cartData.update((cart) => {
      if (cart === null) return null;

      const updatedItems = cart.items.filter((item) => item.product.id !== productId);
      const total = updatedItems.reduce((sum, item) => sum + item.price, 0);

      return updatedItems.length > 0 ? { items: updatedItems, total } : null;
    });
  }

  updateItemQuantity(productId: string, quantity: number): void {
    this.cartData.update((cart) => {
      if (cart === null) return null;

      const itemIndex = cart.items.findIndex((item) => item.product.id === productId);
      if (itemIndex === -1) return cart;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const updatedItems = cart.items.filter((item) => item.product.id !== productId);
        const total = updatedItems.reduce((sum, item) => sum + item.price, 0);
        return updatedItems.length > 0 ? { items: updatedItems, total } : null;
      }

      const item = cart.items[itemIndex];
      const unitPrice = item.product.price;
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = unitPrice * quantity;

      const total = cart.items.reduce((sum, item) => sum + item.price, 0);
      return { ...cart, total };
    });
  }
}
