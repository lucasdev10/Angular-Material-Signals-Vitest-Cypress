import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface representing a custom event emitted between MFEs
 * @template T - The type of data contained in the event detail
 */
export interface MFECustomEvent<
  T extends Record<string, unknown> | null | undefined = Record<string, unknown>,
> {
  /** Event type identifier (e.g., 'cart:item-added', 'auth:login') */
  type: string;

  /** Event payload data */
  detail: T;

  /** Timestamp when event was emitted (milliseconds since epoch) */
  timestamp: number;

  /** Source MFE name that emitted the event */
  source: string;
}

/**
 * Service for inter-MFE communication using custom events
 *
 * The EventBusService enables decoupled communication between Micro Frontends
 * by dispatching and listening to custom events on the global window object.
 * This allows MFEs to notify each other of state changes without direct dependencies.
 *
 * Usage example:
 * ` typescript
 * // Emit an event
 * eventBus.emit('cart:item-added', { product, quantity }, 'cart-mfe');
 *
 * // Listen for events
 * eventBus.listen<{ product: Product; quantity: number }>('cart:item-added')
 *   .subscribe(event => {
 *     console.log(\Item added by \\);
 *   });
 * \\
 */
@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  /**
   * Emits a custom event on the global window object
   *
   * @template T - The type of data in the event detail
   * @param eventType - Event identifier (e.g., 'cart:item-added')
   * @param detail - Event payload data
   * @param source - MFE name emitting the event (e.g., 'shell', 'cart-mfe', 'auth-mfe')
   *
   * @example
   * eventBus.emit('product:selected', { productId: '123', name: 'Coffee' }, 'products-mfe');
   */
  emit<T extends Record<string, unknown> | null | undefined>(
    eventType: string,
    detail: T,
    source: string,
  ): void {
    const mfeEvent: MFECustomEvent<T> = {
      type: eventType,
      detail,
      timestamp: Date.now(),
      source,
    };

    // Dispatch custom event on window object for global propagation
    window.dispatchEvent(
      new CustomEvent(eventType, {
        detail: mfeEvent,
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  /**
   * Listens to custom events emitted on the global window object
   *
   * @template T - The type of data expected in the event detail
   * @param eventType - Event identifier to listen for (e.g., 'cart:item-added')
   * @returns Observable that emits MFECustomEvent objects
   *
   * @example
   * eventBus.listen<CartItem>('cart:item-added')
   *   .pipe(
   *     takeUntilDestroyed(),
   *     map(event => event.detail)
   *   )
   *   .subscribe(cartItem => {
   *     console.log('Item added:', cartItem);
   *   });
   */
  listen<T extends Record<string, unknown> | null | undefined = Record<string, unknown>>(
    eventType: string,
  ): Observable<MFECustomEvent<T>> {
    return fromEvent<CustomEvent<MFECustomEvent<T>>>(window, eventType).pipe(
      map((event: CustomEvent<MFECustomEvent<T>>) => event.detail),
    );
  }
}
