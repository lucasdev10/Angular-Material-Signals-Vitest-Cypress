import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EventBusService, MFECustomEvent } from './event-bus.service';

describe('EventBusService', () => {
  let service: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBusService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created as a singleton', () => {
    const service2 = TestBed.inject(EventBusService);
    expect(service).toBe(service2);
  });

  describe('emit', () => {
    it('should dispatch a custom event on window', () => {
      const listener = vi.fn();
      window.addEventListener('test-event', listener as EventListener);

      service.emit('test-event', { test: 'data' }, 'test-mfe');

      expect(listener).toHaveBeenCalled();
      window.removeEventListener('test-event', listener as EventListener);
    });

    it('should include correct event type in detail', () => {
      const listener = vi.fn();
      window.addEventListener('cart:item-added', listener as EventListener);

      service.emit('cart:item-added', {}, 'cart-mfe');

      expect(listener).toHaveBeenCalled();
      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.type).toBe('cart:item-added');
      window.removeEventListener('cart:item-added', listener as EventListener);
    });

    it('should include event detail payload', () => {
      const payload = { productId: '123', quantity: 2 };
      const listener = vi.fn();
      window.addEventListener('cart:item-added', listener as EventListener);

      service.emit('cart:item-added', payload, 'cart-mfe');

      expect(listener).toHaveBeenCalled();
      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.detail).toEqual(payload);
      window.removeEventListener('cart:item-added', listener as EventListener);
    });

    it('should include source MFE name', () => {
      const listener = vi.fn();
      window.addEventListener('product:selected', listener as EventListener);

      service.emit('product:selected', {}, 'products-mfe');

      expect(listener).toHaveBeenCalled();
      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.source).toBe('products-mfe');
      window.removeEventListener('product:selected', listener as EventListener);
    });

    it('should include current timestamp', () => {
      const beforeTime = Date.now();
      const listener = vi.fn();
      window.addEventListener('test-event', listener as EventListener);

      service.emit('test-event', {}, 'test-mfe');

      const afterTime = Date.now();
      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(event.detail.timestamp).toBeLessThanOrEqual(afterTime);
      window.removeEventListener('test-event', listener as EventListener);
    });

    it('should emit event with bubbles=true', () => {
      const listener = vi.fn();
      window.addEventListener('test-event', listener as EventListener);

      service.emit('test-event', {}, 'test-mfe');

      const event = listener.mock.calls[0][0] as Event;
      expect(event.bubbles).toBe(true);
      window.removeEventListener('test-event', listener as EventListener);
    });

    it('should emit event with cancelable=true', () => {
      const listener = vi.fn();
      window.addEventListener('test-event', listener as EventListener);

      service.emit('test-event', {}, 'test-mfe');

      const event = listener.mock.calls[0][0] as Event;
      expect(event.cancelable).toBe(true);
      window.removeEventListener('test-event', listener as EventListener);
    });

    it('should emit events with complex payloads', () => {
      const payload = {
        user: { id: '1', email: 'test@example.com' },
        token: 'auth-token-123',
        metadata: { loginTime: new Date(), ipAddress: '127.0.0.1' },
      };

      const listener = vi.fn();
      window.addEventListener('auth:login', listener as EventListener);

      service.emit('auth:login', payload, 'auth-mfe');

      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.detail).toEqual(payload);
      window.removeEventListener('auth:login', listener as EventListener);
    });

    it('should emit events with null detail', () => {
      const listener = vi.fn();
      window.addEventListener('cart:cleared', listener as EventListener);

      service.emit('cart:cleared', null, 'cart-mfe');

      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.detail).toBeNull();
      window.removeEventListener('cart:cleared', listener as EventListener);
    });

    it('should emit events with undefined detail', () => {
      const listener = vi.fn();
      window.addEventListener('test-event', listener as EventListener);

      service.emit('test-event', undefined, 'test-mfe');

      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.detail).toBeUndefined();
      window.removeEventListener('test-event', listener as EventListener);
    });
  });

  describe('listen', () => {
    it('should return an observable', () => {
      const result = service.listen('test-event');
      expect(result.subscribe).toBeDefined();
    });

    it('should emit MFECustomEvent when event is dispatched', () =>
      new Promise<void>((resolve) => {
        service
          .listen('test-event')
          .pipe(take(1))
          .subscribe((event) => {
            expect(event.type).toBe('test-event');
            resolve();
          });

        service.emit('test-event', { data: 'test' }, 'test-mfe');
      }));

    it('should extract event detail from custom event', () =>
      new Promise<void>((resolve) => {
        const payload = { productId: '123' };
        service
          .listen<{ productId: string }>('product:selected')
          .pipe(take(1))
          .subscribe((event) => {
            expect(event.detail).toEqual(payload);
            resolve();
          });

        service.emit('product:selected', payload, 'products-mfe');
      }));

    it('should include source in emitted event', () =>
      new Promise<void>((resolve) => {
        service
          .listen('cart:item-added')
          .pipe(take(1))
          .subscribe((event) => {
            expect(event.source).toBe('cart-mfe');
            resolve();
          });

        service.emit('cart:item-added', {}, 'cart-mfe');
      }));

    it('should include timestamp in emitted event', () =>
      new Promise<void>((resolve) => {
        service
          .listen('test-event')
          .pipe(take(1))
          .subscribe((event) => {
            expect(typeof event.timestamp).toBe('number');
            expect(event.timestamp).toBeGreaterThan(0);
            resolve();
          });

        service.emit('test-event', {}, 'test-mfe');
      }));

    it('should support multiple listeners for same event', () =>
      new Promise<void>((resolve) => {
        let count = 0;
        const subscription1 = service
          .listen('test-event')
          .pipe(take(1))
          .subscribe(() => {
            count++;
            if (count === 2) {
              subscription1.unsubscribe();
              subscription2.unsubscribe();
              resolve();
            }
          });

        const subscription2 = service
          .listen('test-event')
          .pipe(take(1))
          .subscribe(() => {
            count++;
            if (count === 2) {
              subscription1.unsubscribe();
              subscription2.unsubscribe();
              resolve();
            }
          });

        service.emit('test-event', {}, 'test-mfe');
      }));

    it('should support different listeners for different events', () =>
      new Promise<void>((resolve) => {
        let event1Fired = false;
        let event2Fired = false;

        const subscription1 = service
          .listen('event1')
          .pipe(take(1))
          .subscribe(() => {
            event1Fired = true;
            if (event1Fired && event2Fired) {
              subscription1.unsubscribe();
              subscription2.unsubscribe();
              resolve();
            }
          });

        const subscription2 = service
          .listen('event2')
          .pipe(take(1))
          .subscribe(() => {
            event2Fired = true;
            if (event1Fired && event2Fired) {
              subscription1.unsubscribe();
              subscription2.unsubscribe();
              resolve();
            }
          });

        service.emit('event1', {}, 'mfe1');
        service.emit('event2', {}, 'mfe2');
      }));

    it('should work with complex typed payloads', () =>
      new Promise<void>((resolve) => {
        interface CartItem {
          productId: string;
          quantity: number;
          price: number;
        }

        const cartItem: CartItem = {
          productId: '123',
          quantity: 2,
          price: 9.99,
        };

        service
          .listen<CartItem & Record<string, unknown>>('cart:item-added')
          .pipe(take(1))
          .subscribe((event) => {
            expect(event.detail.quantity).toBe(2);
            expect(event.detail.price).toBe(9.99);
            resolve();
          });

        service.emit<CartItem & Record<string, unknown>>(
          'cart:item-added',
          cartItem as any,
          'cart-mfe',
        );
      }));

    it('should handle events with null detail payload', () =>
      new Promise<void>((resolve) => {
        service
          .listen<null | Record<string, unknown>>('cart:cleared')
          .pipe(take(1))
          .subscribe((event) => {
            expect(event.detail).toBeNull();
            expect(event.type).toBe('cart:cleared');
            resolve();
          });

        service.emit<null | Record<string, unknown>>('cart:cleared', null as any, 'cart-mfe');
      }));
  });

  describe('Inter-MFE Communication Scenarios', () => {
    it('should enable auth MFE to notify login completion', () =>
      new Promise<void>((resolve) => {
        interface LoginEvent {
          user: { id: string; email: string };
          token: string;
        }

        const loginData: LoginEvent = {
          user: { id: '1', email: 'user@example.com' },
          token: 'auth-token',
        };

        service
          .listen<LoginEvent & Record<string, unknown>>('auth:login')
          .pipe(take(1))
          .subscribe((event) => {
            expect(event.source).toBe('auth-mfe');
            expect(event.detail.user.email).toBe('user@example.com');
            resolve();
          });

        service.emit<LoginEvent & Record<string, unknown>>(
          'auth:login',
          loginData as any,
          'auth-mfe',
        );
      }));

    it('should enable cart MFE to notify item addition', () =>
      new Promise<void>((resolve) => {
        interface CartItemAddedEvent {
          productId: string;
          quantity: number;
        }

        const itemData: CartItemAddedEvent = {
          productId: 'prod-123',
          quantity: 3,
        };

        service
          .listen<CartItemAddedEvent & Record<string, unknown>>('cart:item-added')
          .pipe(take(1))
          .subscribe((event) => {
            expect(event.source).toBe('cart-mfe');
            expect(event.detail.quantity).toBe(3);
            resolve();
          });

        service.emit<CartItemAddedEvent & Record<string, unknown>>(
          'cart:item-added',
          itemData as any,
          'cart-mfe',
        );
      }));

    it('should enable user MFE to notify profile updates', () =>
      new Promise<void>((resolve) => {
        interface UserProfile {
          id: string;
          name: string;
          avatar?: string;
        }

        const profile: UserProfile = {
          id: '1',
          name: 'John Doe',
          avatar: 'https://example.com/avatar.jpg',
        };

        service
          .listen<UserProfile & Record<string, unknown>>('user:profile-updated')
          .pipe(take(1))
          .subscribe((event) => {
            expect(event.source).toBe('user-mfe');
            expect(event.detail.name).toBe('John Doe');
            resolve();
          });

        service.emit<UserProfile & Record<string, unknown>>(
          'user:profile-updated',
          profile as any,
          'user-mfe',
        );
      }));

    it('should enable auth MFE to notify logout', () =>
      new Promise<void>((resolve) => {
        service
          .listen<undefined | Record<string, unknown>>('auth:logout')
          .pipe(take(1))
          .subscribe((event) => {
            expect(event.source).toBe('auth-mfe');
            expect(event.type).toBe('auth:logout');
            resolve();
          });

        service.emit<undefined | Record<string, unknown>>(
          'auth:logout',
          undefined as any,
          'auth-mfe',
        );
      }));

    it('should propagate events across multiple listeners', () =>
      new Promise<void>((resolve) => {
        let count = 0;

        const subscription1 = service
          .listen('product:viewed')
          .pipe(take(1))
          .subscribe(() => {
            count++;
          });

        const subscription2 = service
          .listen('product:viewed')
          .pipe(take(1))
          .subscribe(() => {
            count++;
            if (count === 2) {
              subscription1.unsubscribe();
              subscription2.unsubscribe();
              resolve();
            }
          });

        service.emit('product:viewed', { productId: '123' }, 'products-mfe');
      }));
  });

  describe('MFECustomEvent Interface', () => {
    it('should create event with all required properties', () => {
      const listener = vi.fn();
      window.addEventListener('test-event', listener as EventListener);

      service.emit('test-event', { data: 'test' }, 'test-mfe');

      const customEvent = listener.mock.calls[0][0] as CustomEvent;
      const mfeEvent: MFECustomEvent = customEvent.detail;

      expect(mfeEvent).toHaveProperty('type');
      expect(mfeEvent).toHaveProperty('detail');
      expect(mfeEvent).toHaveProperty('timestamp');
      expect(mfeEvent).toHaveProperty('source');

      window.removeEventListener('test-event', listener as EventListener);
    });

    it('should properly type generic event detail', () =>
      new Promise<void>((resolve) => {
        interface Product {
          id: string;
          name: string;
          price: number;
        }

        const product: Product = { id: '1', name: 'Coffee', price: 12.99 };

        service
          .listen<Product & Record<string, unknown>>('product:selected')
          .pipe(take(1))
          .subscribe((event: MFECustomEvent<Product & Record<string, unknown>>) => {
            expect(event.detail.price).toBe(12.99);
            expect(event.detail.name).toBe('Coffee');
            resolve();
          });

        service.emit<Product & Record<string, unknown>>(
          'product:selected',
          product as any,
          'products-mfe',
        );
      }));
  });

  describe('Error Scenarios', () => {
    it('should handle emit with special characters in event type', () => {
      const listener = vi.fn();
      window.addEventListener('mfe:error:404', listener as EventListener);

      service.emit('mfe:error:404', { message: 'Not found' }, 'products-mfe');

      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.type).toBe('mfe:error:404');
      window.removeEventListener('mfe:error:404', listener as EventListener);
    });

    it('should handle very large payloads', () =>
      new Promise<void>((resolve) => {
        const largeData = 'x'.repeat(1000);
        const largePayload = {
          data: largeData,
        };

        service
          .listen('test-event')
          .pipe(take(1))
          .subscribe((event) => {
            expect((event.detail as any)['data']?.length).toBe(1000);
            resolve();
          });

        service.emit('test-event', largePayload, 'test-mfe');
      }));

    it('should handle rapid successive emissions', () =>
      new Promise<void>((resolve) => {
        const results: number[] = [];

        const subscription = service
          .listen<{ id: number } & Record<string, unknown>>('rapid-event')
          .subscribe((event) => {
            results.push((event.detail as any)['id']);
            if (results.length === 5) {
              subscription.unsubscribe();
              expect(results).toEqual([1, 2, 3, 4, 5]);
              resolve();
            }
          });

        for (let i = 1; i <= 5; i++) {
          service.emit('rapid-event', { id: i }, 'test-mfe');
        }
      }));
  });
});
