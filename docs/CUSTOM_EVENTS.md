# Custom Events Reference

## Overview

Custom events enable decoupled communication between Micro Frontends (MFEs) using the EventBusService. This document defines all custom events available in the CoffeeWorkshop application.

## EventBusService

The `EventBusService` is a singleton service that allows MFEs to emit and listen to custom events globally across the application.

### Location
- **Service**: `src/app/core/services/event-bus.service.ts`
- **Interface**: `MFECustomEvent<T>`

### Usage

#### Emitting Events

```typescript
import { EventBusService } from '@core/services';

export class CartService {
  constructor(private eventBus: EventBusService) {}

  addItem(product: Product, quantity: number): void {
    // Add to cart
    
    // Emit event
    this.eventBus.emit('cart:item-added', 
      { product, quantity }, 
      'cart-mfe'
    );
  }
}
```

#### Listening to Events

```typescript
import { EventBusService } from '@core/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class HeaderComponent {
  cartCount$ = signal<number>(0);

  constructor(
    private eventBus: EventBusService,
    private destroyRef: DestroyRef
  ) {
    this.eventBus
      .listen<CartItemAddedEvent>('cart:item-added')
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        this.updateCartCount();
      });
  }

  private updateCartCount(): void {
    // Update cart count display
  }
}
```

### Event Interface

All events conform to the `MFECustomEvent` interface:

```typescript
export interface MFECustomEvent<T = any> {
  /** Event type identifier (e.g., 'cart:item-added') */
  type: string;

  /** Event payload data */
  detail: T;

  /** Timestamp when event was emitted (milliseconds since epoch) */
  timestamp: number;

  /** Source MFE name that emitted the event */
  source: string;
}
```

---

## Cart Events

### cart:item-added

Emitted when an item is added to the cart.

**Emitter**: Cart MFE  
**Listeners**: Shell App (Header), Analytics

**Payload**:
```typescript
interface CartItemAddedEvent {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
```

**Example**:
```typescript
eventBus.emit('cart:item-added', {
  productId: 'prod-123',
  productName: 'Ethiopian Coffee',
  price: 12.99,
  quantity: 2,
  imageUrl: 'https://example.com/coffee.jpg'
}, 'cart-mfe');
```

**When it's emitted**:
- User clicks "Add to Cart" button on product page
- Successfully added to shopping cart

**What listeners should do**:
- Update cart count in header
- Show toast notification
- Track event for analytics

---

### cart:item-removed

Emitted when an item is removed from the cart.

**Emitter**: Cart MFE  
**Listeners**: Shell App (Header), Analytics

**Payload**:
```typescript
interface CartItemRemovedEvent {
  productId: string;
  quantity: number;
}
```

**Example**:
```typescript
eventBus.emit('cart:item-removed', {
  productId: 'prod-123',
  quantity: 2
}, 'cart-mfe');
```

**When it's emitted**:
- User removes item from cart
- Successfully removed from shopping cart

**What listeners should do**:
- Update cart count in header
- Show confirmation toast
- Track event for analytics

---

### cart:cleared

Emitted when the cart is completely cleared.

**Emitter**: Cart MFE  
**Listeners**: Shell App (Header), Analytics

**Payload**: `null` (no data)

**Example**:
```typescript
eventBus.emit('cart:cleared', null, 'cart-mfe');
```

**When it's emitted**:
- User empties entire cart
- Successful checkout/order completion
- After successful purchase

**What listeners should do**:
- Reset cart count to 0 in header
- Show success notification
- Track checkout completion
- Clear local cart cache if applicable

---

## Authentication Events

### auth:login

Emitted when user successfully logs in.

**Emitter**: Auth MFE  
**Listeners**: Shell App, All MFEs

**Payload**:
```typescript
interface AuthLoginEvent {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    avatar?: string;
  };
  token: string;
  expiresIn: number; // seconds
}
```

**Example**:
```typescript
eventBus.emit('auth:login', {
  user: {
    id: 'user-123',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'USER',
    avatar: 'https://example.com/avatar.jpg'
  },
  token: 'eyJhbGciOiJIUzI1NiIs...',
  expiresIn: 3600
}, 'auth-mfe');
```

**When it's emitted**:
- User submits valid login credentials
- Successfully authenticated

**What listeners should do**:
- Update global auth state
- Show welcome notification
- Update header UI (show user menu, hide login button)
- Enable access to protected routes
- Store token in localStorage
- Track login event

---

### auth:logout

Emitted when user logs out.

**Emitter**: Auth MFE, Shell App  
**Listeners**: All MFEs

**Payload**: `null` (no data)

**Example**:
```typescript
eventBus.emit('auth:logout', null, 'auth-mfe');
```

**When it's emitted**:
- User clicks logout button
- Session expires
- Token is revoked

**What listeners should do**:
- Clear global auth state
- Clear user data
- Reset local component state
- Hide user-specific content
- Redirect to login page if on protected route
- Clear localStorage tokens
- Show goodbye notification

---

## User Profile Events

### user:profile-updated

Emitted when user profile is updated.

**Emitter**: User MFE  
**Listeners**: Shell App, Header, All MFEs

**Payload**:
```typescript
interface UserProfileUpdatedEvent {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  changedFields: string[]; // Fields that were changed
}
```

**Example**:
```typescript
eventBus.emit('user:profile-updated', {
  user: {
    id: 'user-123',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://example.com/new-avatar.jpg',
    bio: 'Coffee enthusiast'
  },
  changedFields: ['name', 'avatar', 'bio']
}, 'user-mfe');
```

**When it's emitted**:
- User updates profile information
- User changes avatar/profile picture
- User updates preferences

**What listeners should do**:
- Update user data in global state
- Refresh header user display
- Update user avatar in all locations
- Show confirmation notification

---

## Product Events

### product:viewed

Emitted when a product is viewed/opened.

**Emitter**: Products MFE  
**Listeners**: Analytics, Admin

**Payload**:
```typescript
interface ProductViewedEvent {
  productId: string;
  productName: string;
  category: string;
  price: number;
  sessionDuration: number; // seconds viewed
}
```

**Example**:
```typescript
eventBus.emit('product:viewed', {
  productId: 'prod-456',
  productName: 'Colombian Coffee',
  category: 'Coffee Beans',
  price: 14.99,
  sessionDuration: 45
}, 'products-mfe');
```

**When it's emitted**:
- User opens product detail page
- User closes product detail page

**What listeners should do**:
- Track product views for analytics
- Build user viewing history
- Update popular products statistics
- Recommend similar products

---

## Admin Events

### admin:product-created

Emitted when a new product is created via admin panel.

**Emitter**: Admin MFE  
**Listeners**: Products MFE, Analytics

**Payload**:
```typescript
interface AdminProductCreatedEvent {
  productId: string;
  productName: string;
  category: string;
  price: number;
  createdBy: string; // admin user ID
}
```

**Example**:
```typescript
eventBus.emit('admin:product-created', {
  productId: 'prod-789',
  productName: 'New Blend Coffee',
  category: 'Premium',
  price: 19.99,
  createdBy: 'admin-1'
}, 'admin-mfe');
```

**When it's emitted**:
- Admin creates new product
- Product successfully saved to database

**What listeners should do**:
- Refresh product catalog
- Update product list in Products MFE
- Show confirmation notification
- Update product cache

---

### admin:product-updated

Emitted when a product is updated via admin panel.

**Emitter**: Admin MFE  
**Listeners**: Products MFE, Analytics

**Payload**:
```typescript
interface AdminProductUpdatedEvent {
  productId: string;
  changes: Record<string, any>;
  changedFields: string[];
  updatedBy: string; // admin user ID
}
```

**Example**:
```typescript
eventBus.emit('admin:product-updated', {
  productId: 'prod-123',
  changes: {
    price: 13.99,
    inStock: true,
    category: 'Sale'
  },
  changedFields: ['price', 'inStock', 'category'],
  updatedBy: 'admin-1'
}, 'admin-mfe');
```

**When it's emitted**:
- Admin updates product details
- Changes successfully saved

**What listeners should do**:
- Invalidate product cache
- Refresh product listings
- Update price displays
- Show update notification

---

### admin:product-deleted

Emitted when a product is deleted via admin panel.

**Emitter**: Admin MFE  
**Listeners**: Products MFE, Cart MFE, Analytics

**Payload**:
```typescript
interface AdminProductDeletedEvent {
  productId: string;
  productName: string;
  deletedBy: string; // admin user ID
}
```

**Example**:
```typescript
eventBus.emit('admin:product-deleted', {
  productId: 'prod-123',
  productName: 'Ethiopian Coffee',
  deletedBy: 'admin-1'
}, 'admin-mfe');
```

**When it's emitted**:
- Admin deletes a product
- Product successfully removed from database

**What listeners should do**:
- Remove product from catalog
- Remove from cart if present
- Refresh product listings
- Update inventory display

---

## Error Events

### mfe:error

Emitted when an MFE encounters an error.

**Emitter**: Any MFE  
**Listeners**: Shell App (global error handler)

**Payload**:
```typescript
interface MFEErrorEvent {
  errorType: 'API_ERROR' | 'VALIDATION_ERROR' | 'RUNTIME_ERROR';
  message: string;
  stack?: string;
  details?: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
```

**Example**:
```typescript
eventBus.emit('mfe:error', {
  errorType: 'API_ERROR',
  message: 'Failed to load products',
  severity: 'HIGH',
  details: {
    statusCode: 500,
    endpoint: '/api/products'
  }
}, 'products-mfe');
```

**When it's emitted**:
- API request fails
- Validation error occurs
- Runtime exception is caught

**What listeners should do**:
- Log error for debugging
- Show user-friendly error notification
- Alert admin if critical
- Track error metrics

---

## Event Naming Convention

Events follow the naming pattern: `{source}:{action}`

- **source**: The MFE or feature that triggered the event
  - `cart`, `auth`, `user`, `product`, `admin`, `mfe`
- **action**: What happened
  - `item-added`, `login`, `profile-updated`, `product-created`, `error`

**Examples**:
- `cart:item-added`
- `auth:login`
- `user:profile-updated`
- `admin:product-created`
- `mfe:error`

---

## Best Practices

### 1. Source Identification

Always include the source MFE name when emitting events:

```typescript
// ✅ Good
eventBus.emit('cart:item-added', payload, 'cart-mfe');

// ❌ Avoid
eventBus.emit('cart:item-added', payload, 'unknown');
```

### 2. Payload Structure

Keep payloads serializable and minimal:

```typescript
// ✅ Good - Simple, serializable
eventBus.emit('product:viewed', {
  productId: 'prod-123',
  category: 'Coffee'
}, 'products-mfe');

// ❌ Avoid - Complex, non-serializable
eventBus.emit('product:viewed', {
  product: complexProductObject,
  handler: () => {}
}, 'products-mfe');
```

### 3. Event Cleanup

Always unsubscribe from events to prevent memory leaks:

```typescript
// ✅ Good - Using takeUntilDestroyed
this.eventBus
  .listen<CartItemAddedEvent>('cart:item-added')
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(event => {
    // Handle event
  });

// ❌ Avoid - Memory leak
this.eventBus
  .listen<CartItemAddedEvent>('cart:item-added')
  .subscribe(event => {
    // Handle event - never unsubscribes
  });
```

### 4. Error Handling

Always handle potential errors when listening to events:

```typescript
// ✅ Good - With error handling
this.eventBus
  .listen<CartItemAddedEvent>('cart:item-added')
  .pipe(
    takeUntilDestroyed(this.destroyRef),
    catchError(error => {
      this.logger.error('Error processing cart event', error);
      return of(null);
    })
  )
  .subscribe(event => {
    if (event) {
      this.handleCartUpdate(event);
    }
  });
```

### 5. Type Safety

Use TypeScript interfaces for type-safe events:

```typescript
// ✅ Good - Type-safe
interface CartItemAddedEvent {
  productId: string;
  quantity: number;
}

this.eventBus
  .listen<CartItemAddedEvent>('cart:item-added')
  .subscribe(event => {
    console.log(event.detail.quantity); // Type-safe
  });
```

---

## Testing Events

### Unit Testing

```typescript
describe('CartComponent', () => {
  it('should handle cart:item-added event', (done) => {
    const service = TestBed.inject(EventBusService);
    
    component.ngOnInit();
    
    service.emit('cart:item-added', {
      productId: '123',
      quantity: 1
    }, 'cart-mfe');

    setTimeout(() => {
      expect(component.cartCount()).toBe(1);
      done();
    }, 100);
  });
});
```

### E2E Testing

```typescript
describe('Cart MFE Integration', () => {
  it('should sync cart count across MFEs', () => {
    cy.visit('/');
    
    cy.visit('/products');
    cy.get('[data-cy=add-to-cart]').click();
    
    cy.visit('/');
    cy.get('[data-cy=cart-count]').should('contain', '1');
  });
});
```

---

## Debugging Events

### Browser Console

```typescript
// Listen to all events
window.addEventListener('*', (event) => {
  if (event instanceof CustomEvent && event.detail?.source) {
    console.log('Event:', event.detail);
  }
});
```

### Chrome DevTools

Use the Browser DevTools Event Listeners inspector to see all event listeners registered on the window object.

---

## Migration Guide

When adding new custom events to the system:

1. **Define the interface** in `event-bus.service.ts`
2. **Document the event** in this file
3. **Emit from source** MFE using `eventBus.emit()`
4. **Add listener** in destination MFE using `eventBus.listen()`
5. **Add unit tests** for both emit and listen logic
6. **Add integration tests** for cross-MFE communication
7. **Update this documentation** with examples

---

## Support

For issues or questions about custom events:

1. Check this documentation first
2. Review the EventBusService source code
3. Check unit tests for usage examples
4. Reach out to the team via project communication channels
