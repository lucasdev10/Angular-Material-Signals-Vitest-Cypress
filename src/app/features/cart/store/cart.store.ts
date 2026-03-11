import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '@app/core/storage/storage';
import { CartDomainService } from '@app/domain/cart/cart-domain.service';
import { IProduct } from '@app/features/products/models/product.model';
import { APP_CONFIG } from '@app/shared/config/app.config';
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
  private readonly cartDomainService = inject(CartDomainService);
  private readonly STORAGE_KEY = APP_CONFIG.storage.CART_KEY;

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
  readonly hasFreeShipping = computed(() =>
    this.cartDomainService.qualifiesForFreeShipping(this.subtotal()),
  );
  readonly amountForFreeShipping = computed(() =>
    this.cartDomainService.amountNeededForFreeShipping(this.subtotal()),
  );

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
    // Usar domain service para validar se pode adicionar o produto
    const validationResult = this.cartDomainService.canAddProductToCart(
      product.id,
      quantity,
      this.items(),
      product.stock,
    );

    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join('; '));
    }

    const currentItems = this.items();
    const existingItemIndex = currentItems.findIndex((item) => item.product.id === product.id);

    let updatedItems: ICartItem[];

    if (existingItemIndex !== -1) {
      const existingItem = currentItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      // Atualiza quantidade do item existente
      updatedItems = currentItems.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * product.price,
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
    if (!productId?.trim()) {
      throw new Error('Product ID is required');
    }

    const updatedItems = this.items().filter((item) => item.product.id !== productId);
    this.updateCart(updatedItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (!productId?.trim()) {
      throw new Error('Product ID is required');
    }

    if (quantity === 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.items();
    const existingItem = currentItems.find((item) => item.product.id === productId);

    if (!existingItem) {
      throw new Error('Product not found in cart');
    }

    // Criar um item temporário para validação
    const tempItem: ICartItem = {
      ...existingItem,
      quantity,
      subtotal: existingItem.product.price * quantity,
    };

    // Usar domain service para validar o item
    const validationResult = this.cartDomainService.validateCartItem(tempItem);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join('; '));
    }

    const updatedItems = currentItems.map((item) =>
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
    // Validar o carrinho usando domain service
    const validationResult = this.cartDomainService.validateCart(items);
    if (!validationResult.isValid) {
      throw new Error(`Cart validation failed: ${validationResult.errors.join('; ')}`);
    }

    // Usar domain service para calcular totais
    const calculations = this.cartDomainService.calculateCartTotals(items);

    this.state.set({
      items,
      subtotal: calculations.subtotal,
      shipping: calculations.shipping,
      tax: calculations.tax,
      total: calculations.total,
      itemCount: calculations.itemCount,
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

  /**
   * Métodos que utilizam o domain service
   */

  formatCurrency(amount: number): string {
    return this.cartDomainService.formatCurrency(amount);
  }

  validateCurrentCart(): { isValid: boolean; errors: string[] } {
    return this.cartDomainService.validateCart(this.items());
  }

  canAddProduct(
    productId: string,
    quantity: number,
    productStock: number,
  ): { isValid: boolean; errors: string[] } {
    return this.cartDomainService.canAddProductToCart(
      productId,
      quantity,
      this.items(),
      productStock,
    );
  }
}
