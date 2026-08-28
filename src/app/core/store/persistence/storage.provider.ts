import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { StorageService } from '@app/core/services/storage/storage.service';
import * as AuthActions from '../auth/auth.actions';
import * as CartActions from '../cart/cart.actions';
import { selectAuthToken, selectAuthRefreshToken, selectAuthUser } from '../auth/auth.selectors';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartShipping,
  selectCartTax,
  selectCartTotal,
  selectCartItemCount,
} from '../cart/cart.selectors';

/**
 * Store Persistence Provider
 * Handles loading and saving global store state to localStorage
 */
@Injectable({ providedIn: 'root' })
export class StorePersistenceProvider {
  private readonly store = inject(Store);
  private readonly storageService = inject(StorageService);

  private readonly AUTH_STORAGE_KEY = 'shell_auth_global_state';
  private readonly CART_STORAGE_KEY = 'shell_cart_global_state';
  private readonly USER_PREFS_STORAGE_KEY = 'shell_user_preferences';

  /**
   * Load auth state from localStorage
   */
  loadAuthFromStorage(): void {
    try {
      const stored = this.storageService.getItem(this.AUTH_STORAGE_KEY);
      if (stored) {
        const { token, refreshToken, user } = JSON.parse(stored);
        this.store.dispatch(AuthActions.authLoadFromStorageSuccess({ token, refreshToken, user }));
      }
    } catch (error) {
      console.error('Failed to load auth state from storage', error);
    }
  }

  /**
   * Load cart state from localStorage
   */
  loadCartFromStorage(): void {
    try {
      const stored = this.storageService.getItem(this.CART_STORAGE_KEY);
      if (stored) {
        const { items, subtotal, shipping, tax, total, itemCount } = JSON.parse(stored);
        this.store.dispatch(
          CartActions.cartLoadFromStorageSuccess({
            items,
            subtotal,
            shipping,
            tax,
            total,
            itemCount,
          }),
        );
      }
    } catch (error) {
      console.error('Failed to load cart state from storage', error);
    }
  }

  /**
   * Subscribe to auth state changes and persist to localStorage
   */
  subscribeToAuthChanges(): void {
    this.store
      .select(selectAuthToken)
      .pipe(take(1))
      .subscribe(() => {
        this.store.select(selectAuthToken).subscribe((token) => {
          if (token) {
            this.persistAuthState();
          }
        });
      });
  }

  /**
   * Subscribe to cart state changes and persist to localStorage
   */
  subscribeToCartChanges(): void {
    this.store
      .select(selectCartItems)
      .pipe(take(1))
      .subscribe(() => {
        this.store.select(selectCartItems).subscribe(() => {
          this.persistCartState();
        });
      });
  }

  /**
   * Persist current auth state to localStorage
   */
  private persistAuthState(): void {
    try {
      const authState: { token: string | null; refreshToken: string | null; user: unknown | null } =
        {
          token: null,
          refreshToken: null,
          user: null,
        };

      this.store
        .select(selectAuthToken)
        .pipe(take(1))
        .subscribe((token) => {
          authState.token = token;
        });

      this.store
        .select(selectAuthRefreshToken)
        .pipe(take(1))
        .subscribe((refreshToken) => {
          authState.refreshToken = refreshToken;
        });

      this.store
        .select(selectAuthUser)
        .pipe(take(1))
        .subscribe((user) => {
          authState.user = user;
          this.storageService.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(authState));
        });
    } catch (error) {
      console.error('Failed to persist auth state to storage', error);
    }
  }

  /**
   * Persist current cart state to localStorage
   */
  private persistCartState(): void {
    try {
      const cartState: {
        items: unknown;
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        itemCount: number;
      } = {
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      };

      this.store
        .select(selectCartItems)
        .pipe(take(1))
        .subscribe((items) => {
          cartState.items = items;
        });

      this.store
        .select(selectCartSubtotal)
        .pipe(take(1))
        .subscribe((subtotal) => {
          cartState.subtotal = subtotal;
        });

      this.store
        .select(selectCartShipping)
        .pipe(take(1))
        .subscribe((shipping) => {
          cartState.shipping = shipping;
        });

      this.store
        .select(selectCartTax)
        .pipe(take(1))
        .subscribe((tax) => {
          cartState.tax = tax;
        });

      this.store
        .select(selectCartTotal)
        .pipe(take(1))
        .subscribe((total) => {
          cartState.total = total;
        });

      this.store
        .select(selectCartItemCount)
        .pipe(take(1))
        .subscribe((itemCount) => {
          cartState.itemCount = itemCount;
          this.storageService.setItem(this.CART_STORAGE_KEY, JSON.stringify(cartState));
        });
    } catch (error) {
      console.error('Failed to persist cart state to storage', error);
    }
  }

  /**
   * Clear auth state from localStorage (on logout)
   */
  clearAuthFromStorage(): void {
    try {
      this.storageService.removeItem(this.AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear auth state from storage', error);
    }
  }

  /**
   * Clear cart state from localStorage
   */
  clearCartFromStorage(): void {
    try {
      this.storageService.removeItem(this.CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear cart state from storage', error);
    }
  }
}
