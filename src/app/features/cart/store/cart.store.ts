import { computed, effect, inject } from '@angular/core';
import { StorageService } from '@app/core/storage/storage';
import { CartDomainService } from '@app/domain/cart/cart-domain.service';
import { IProduct } from '@app/features/products/models/product.model';
import { APP_CONFIG } from '@app/shared/config/app.config';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ICart, ICartItem, ICartStoreState } from '../models/cart.model';

const initialState: ICartStoreState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
  loading: 'idle',
  error: null,
};

/**
 * Store do carrinho usando SignalsStore
 * Gerencia estado do carrinho com persistência em localStorage
 */
export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store, cartDomainService = inject(CartDomainService)) => ({
    items: computed(() => store.items()),
    subtotal: computed(() => store.subtotal()),
    shipping: computed(() => store.shipping()),
    tax: computed(() => store.tax()),
    total: computed(() => store.total()),
    itemCount: computed(() => store.itemCount()),
    isEmpty: computed(() => store.items().length === 0),
    hasItems: computed(() => store.items().length > 0),
    hasFreeShipping: computed(() => cartDomainService.qualifiesForFreeShipping(store.subtotal())),
    amountForFreeShipping: computed(() =>
      cartDomainService.amountNeededForFreeShipping(store.subtotal()),
    ),
  })),
  withMethods(
    (
      store,
      cartDomainService = inject(CartDomainService),
      storageService = inject(StorageService),
    ) => ({
      addItem(product: IProduct, quantity = 1): void {
        // Usar domain service para validar se pode adicionar o produto
        const validationResult = cartDomainService.canAddProductToCart(
          product.id,
          quantity,
          store.items(),
          product.stock,
        );

        if (!validationResult.isValid) {
          throw new Error(validationResult.errors.join('; '));
        }

        const currentItems = store.items();
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

        this._updateCart(updatedItems);
      },
      removeItem(productId: string): void {
        if (!productId?.trim()) {
          throw new Error('Product ID is required');
        }

        const updatedItems = store.items().filter((item) => item.product.id !== productId);
        this._updateCart(updatedItems);
      },
      updateQuantity(productId: string, quantity: number): void {
        if (!productId?.trim()) {
          throw new Error('Product ID is required');
        }

        if (quantity === 0) {
          this.removeItem(productId);
          return;
        }

        const currentItems = store.items();
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
        const validationResult = cartDomainService.validateCartItem(tempItem);
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

        this._updateCart(updatedItems);
      },
      incrementQuantity(productId: string): void {
        const item = store.items().find((i) => i.product.id === productId);
        if (item) {
          this.updateQuantity(productId, item.quantity + 1);
        }
      },
      decrementQuantity(productId: string): void {
        const item = store.items().find((i) => i.product.id === productId);
        if (item) {
          this.updateQuantity(productId, item.quantity - 1);
        }
      },
      clear(): void {
        this._updateCart([]);
      },
      _updateCart(items: ICartItem[]): void {
        // Validar o carrinho usando domain service
        const validationResult = cartDomainService.validateCart(items);
        if (!validationResult.isValid) {
          throw new Error(`Cart validation failed: ${validationResult.errors.join('; ')}`);
        }

        // Usar domain service para calcular totais
        const calculations = cartDomainService.calculateCartTotals(items);

        patchState(store, {
          items,
          subtotal: calculations.subtotal,
          shipping: calculations.shipping,
          tax: calculations.tax,
          total: calculations.total,
          itemCount: calculations.itemCount,
        });
      },
      _loadFromStorage(): ICart {
        const STORAGE_KEY = APP_CONFIG.storage.CART_KEY;

        try {
          const stored = storageService.get(STORAGE_KEY);
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
      },
      getItemByProductId(productId: string): ICartItem | undefined {
        return store.items().find((item) => item.product.id === productId);
      },
      hasProduct(productId: string): boolean {
        return store.items().some((item) => item.product.id === productId);
      },
      getProductQuantity(productId: string): number {
        const item = this.getItemByProductId(productId);
        return item?.quantity || 0;
      },
      formatCurrency(amount: number): string {
        return cartDomainService.formatCurrency(amount);
      },
      validateCurrentCart(): { isValid: boolean; errors: string[] } {
        return cartDomainService.validateCart(store.items());
      },
      canAddProduct(
        productId: string,
        quantity: number,
        productStock: number,
      ): { isValid: boolean; errors: string[] } {
        return cartDomainService.canAddProductToCart(
          productId,
          quantity,
          store.items(),
          productStock,
        );
      },
    }),
  ),
  withHooks((store, storageService = inject(StorageService)) => ({
    onInit: () => {
      const STORAGE_KEY = APP_CONFIG.storage.CART_KEY;

      const persistedCart = store._loadFromStorage();
      if (persistedCart && persistedCart.items && persistedCart.items.length > 0) {
        patchState(store, persistedCart);
      }

      effect(() => {
        const cart: ICart = {
          items: store.items(),
          subtotal: store.subtotal(),
          shipping: store.shipping(),
          tax: store.tax(),
          total: store.total(),
          itemCount: store.itemCount(),
        };
        storageService.set(STORAGE_KEY, cart);
      });
    },
  })),
);
