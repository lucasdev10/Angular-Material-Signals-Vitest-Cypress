import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '@app/core/storage/storage';
import { IProduct } from '@app/features/products/models/product.model';
import { ICart, ICartItem } from '../models/cart.model';

/**
 * Store do carrinho usando Signals
 * Gerencia estado do carrinho com persistência em localStorage
 */
@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly storageService = inject(StorageService<ICart>);
  private readonly STORAGE_KEY = 'cart';

  // Taxas e configurações
  private readonly TAX_RATE = 0.1; // 10%
  private readonly SHIPPING_THRESHOLD = 100; // Frete grátis acima de $100
  private readonly SHIPPING_COST = 10;

  // Estado privado
  private readonly state = signal<ICart>(this.loadFromStorage());

  // Selectores públicos
  readonly items = computed(() => this.state().items);
  readonly subtotal = computed(() => this.state().subtotal);
  readonly shipping = computed(() => this.state().shipping);
  readonly tax = computed(() => this.state().tax);
  readonly total = computed(() => this.state().total);
  readonly itemCount = computed(() => this.state().itemCount);
  readonly isEmpty = computed(() => this.items().length === 0);
  readonly hasItems = computed(() => this.items().length > 0);
  readonly hasFreeShipping = computed(() => this.subtotal() >= this.SHIPPING_THRESHOLD);

  constructor() {
    // Persiste no localStorage quando o estado muda
    effect(() => {
      const cart = this.state();
      this.storageService.set(this.STORAGE_KEY, cart);
    });
  }

  /**
   * Actions
   */

  addItem(product: IProduct, quantity = 1): void {
    const currentItems = this.items();
    const existingItemIndex = currentItems.findIndex((item) => item.product.id === product.id);

    let updatedItems: ICartItem[];

    if (existingItemIndex !== -1) {
      // Atualiza quantidade do item existente
      updatedItems = currentItems.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: item.quantity + quantity,
              subtotal: (item.quantity + quantity) * product.price,
            }
          : item,
      );
    } else {
      // Adiciona novo item
      const newItem: ICartItem = {
        product,
        quantity,
        subtotal: product.price * quantity,
      };
      updatedItems = [...currentItems, newItem];
    }

    this.updateCart(updatedItems);
  }

  removeItem(productId: string): void {
    const updatedItems = this.items().filter((item) => item.product.id !== productId);
    this.updateCart(updatedItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const updatedItems = this.items().map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity,
            subtotal: item.product.price * quantity,
          }
        : item,
    );

    this.updateCart(updatedItems);
  }

  incrementQuantity(productId: string): void {
    const item = this.items().find((i) => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: string): void {
    const item = this.items().find((i) => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  clear(): void {
    this.updateCart([]);
  }

  /**
   * Helpers privados
   */

  private updateCart(items: ICartItem[]): void {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shipping = subtotal >= this.SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
    const tax = subtotal * this.TAX_RATE;
    const total = subtotal + shipping + tax;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    this.state.set({
      items,
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
    });
  }

  private loadFromStorage(): ICart {
    try {
      const stored = this.storageService.get(this.STORAGE_KEY);
      return (
        stored || {
          items: [],
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          itemCount: 0,
        }
      );
    } catch {
      return {
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      };
    }
  }

  /**
   * Query helpers
   */

  getItemByProductId(productId: string): ICartItem | undefined {
    return this.items().find((item) => item.product.id === productId);
  }

  hasProduct(productId: string): boolean {
    return this.items().some((item) => item.product.id === productId);
  }

  getProductQuantity(productId: string): number {
    const item = this.getItemByProductId(productId);
    return item?.quantity || 0;
  }
}
