# Global Store Configuration - Shell App MFE

## Overview

This document describes the global NgRx store configuration for the Shell App in the Angular MFE architecture. The global store serves as a shared state management layer for all MFEs through Module Federation singleton pattern.

## Architecture

### Store Structure

The global store is divided into three main slices:

1. **Auth Global State** (`authGlobal`)
   - Manages authentication state shared across all MFEs
   - Stores: token, refreshToken, user, isAuthenticated, loading, error
   - Used for: User authentication, authorization checks, user profile info

2. **Cart Global State** (`cartGlobal`)
   - Manages shopping cart state shared across all MFEs
   - Stores: items, subtotal, shipping, tax, total, itemCount, loading, error
   - Used for: Cart synchronization across MFEs

3. **User Global State** (`userGlobal`)
   - Manages user preferences and profile shared across all MFEs
   - Stores: profile, preferences (theme, language, notifications), loading, error
   - Used for: User preferences, theme/language settings

### Module Federation Singleton Pattern

The store is configured as a singleton through Module Federation's shared configuration in `webpack.config.js`:

```javascript
'@ngrx/store': {
  singleton: true,
  strictVersion: false,
  requiredVersion: '21.0.1',
}
```

This ensures:
- All MFEs share the same NgRx Store instance
- State changes in one MFE are visible to all other MFEs
- No state duplication across MFEs
- Clean communication patterns between MFEs

### Provider Configuration

The global store is configured in `app.config.ts` using `provideStore()`:

```typescript
provideStore({
  // Local feature stores
  user: userReducer,
  product: productReducer,
  cart: cartReducer,
  auth: authReducer,
  // Global stores shared across MFEs
  authGlobal: authGlobalReducer,
  cartGlobal: cartGlobalReducer,
  userGlobal: userGlobalReducer,
}),
```

## State Interfaces

### Auth Global State

```typescript
interface IAuthGlobalState {
  token: string | null;
  refreshToken: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  loading: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
}
```

### Cart Global State

```typescript
interface ICartGlobalState {
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  loading: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
}
```

### User Global State

```typescript
interface IUserGlobalState {
  profile: IUser | null;
  preferences: {
    theme?: 'light' | 'dark';
    language?: string;
    notifications?: boolean;
    [key: string]: unknown;
  };
  loading: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
}
```

## Local Storage Persistence

The `StorePersistenceProvider` handles loading and saving state to localStorage:

- **Auth State**: Persisted to `shell_auth_global_state`
  - Includes: token, refreshToken, user
  - Loaded on app initialization
  - Updated on login/logout/token refresh

- **Cart State**: Persisted to `shell_cart_global_state`
  - Includes: items, subtotal, shipping, tax, total, itemCount
  - Loaded on app initialization
  - Updated when cart items change

- **Usage**: Subscribe to store changes and persist automatically

```typescript
// In your component/service
constructor(private persistence: StorePersistenceProvider) {}

ngOnInit() {
  // Load persisted state
  this.persistence.loadAuthFromStorage();
  this.persistence.loadCartFromStorage();
  
  // Subscribe to changes
  this.persistence.subscribeToAuthChanges();
  this.persistence.subscribeToCartChanges();
}
```

## Selectors

### Auth Selectors

```typescript
selectAuthToken              // Get current auth token
selectAuthRefreshToken       // Get refresh token
selectAuthUser               // Get authenticated user
selectAuthIsAuthenticated    // Check if user is authenticated
selectAuthLoading            // Get auth loading state
selectAuthError              // Get auth error message
selectAuthUserRole           // Get user's role
selectAuthIsAdmin            // Check if user is admin
```

### Cart Selectors

```typescript
selectCartItems              // Get all cart items
selectCartSubtotal           // Get cart subtotal
selectCartShipping           // Get shipping cost
selectCartTax                // Get tax amount
selectCartTotal              // Get cart total
selectCartItemCount          // Get item count
selectCartLoading            // Get cart loading state
selectCartError              // Get cart error message
selectCartIsEmpty            // Check if cart is empty
```

### User Selectors

```typescript
selectUserProfile            // Get user profile
selectUserPreferences        // Get user preferences
selectUserLoading            // Get user loading state
selectUserError              // Get user error message
selectUserTheme              // Get user theme preference
selectUserLanguage           // Get user language preference
selectUserNotifications      // Get notifications preference
```

## Actions

### Auth Actions

- `authLogin` - Initiate login
- `authLoginSuccess` - Login successful
- `authLoginFailure` - Login failed
- `authLogout` - Initiate logout
- `authLogoutSuccess` - Logout successful
- `authRegister` - Initiate registration
- `authRegisterSuccess` - Registration successful
- `authRegisterFailure` - Registration failed
- `authRefreshToken` - Refresh access token
- `authRefreshTokenSuccess` - Token refresh successful
- `authRefreshTokenFailure` - Token refresh failed
- `authLoadFromStorage` - Load from localStorage
- `authLoadFromStorageSuccess` - Successfully loaded from storage
- `authSetUser` - Set authenticated user
- `authClearError` - Clear error message

### Cart Actions

- `cartAddItem` - Add item to cart
- `cartAddItemSuccess` - Item added successfully
- `cartAddItemFailure` - Failed to add item
- `cartRemoveItem` - Remove item from cart
- `cartRemoveItemSuccess` - Item removed successfully
- `cartRemoveItemFailure` - Failed to remove item
- `cartUpdateItem` - Update item quantity
- `cartUpdateItemSuccess` - Item updated successfully
- `cartUpdateItemFailure` - Failed to update item
- `cartClear` - Clear cart
- `cartClearSuccess` - Cart cleared successfully
- `cartLoadFromStorage` - Load from localStorage
- `cartLoadFromStorageSuccess` - Successfully loaded from storage
- `cartClearError` - Clear error message

### User Actions

- `userLoadProfile` - Load user profile
- `userLoadProfileSuccess` - Profile loaded
- `userLoadProfileFailure` - Failed to load profile
- `userUpdateProfile` - Update profile
- `userUpdateProfileSuccess` - Profile updated
- `userUpdateProfileFailure` - Failed to update profile
- `userUpdatePreferences` - Update preferences
- `userUpdatePreferencesSuccess` - Preferences updated
- `userUpdatePreferencesFailure` - Failed to update preferences
- `userSetProfile` - Set user profile
- `userClearProfile` - Clear profile
- `userClearError` - Clear error message

## Accessing Global Store in MFEs

In any MFE, you can access the global store the same way as the Shell:

```typescript
import { Store } from '@ngrx/store';
import { selectAuthIsAuthenticated, selectCartTotal } from '@shell/store';

export class MyMFEComponent {
  isAuthenticated$ = this.store.select(selectAuthIsAuthenticated);
  cartTotal$ = this.store.select(selectCartTotal);

  constructor(private store: Store) {}
}
```

## Testing

Unit tests are provided for all store slices:

- `auth.reducer.spec.ts` - 15 tests covering all auth actions
- `auth.selectors.spec.ts` - 10 tests for auth selectors
- `cart.reducer.spec.ts` - 12 tests covering all cart actions
- `cart.selectors.spec.ts` - 11 tests for cart selectors
- `user.reducer.spec.ts` - 14 tests covering all user actions
- `user.selectors.spec.ts` - 13 tests for user selectors

Run tests with:
```bash
npm test
```

## File Structure

```
src/app/core/store/
├── auth/
│   ├── auth.state.ts
│   ├── auth.reducer.ts
│   ├── auth.reducer.spec.ts
│   ├── auth.actions.ts
│   ├── auth.selectors.ts
│   └── auth.selectors.spec.ts
├── cart/
│   ├── cart.state.ts
│   ├── cart.reducer.ts
│   ├── cart.reducer.spec.ts
│   ├── cart.actions.ts
│   ├── cart.selectors.ts
│   └── cart.selectors.spec.ts
├── user/
│   ├── user.state.ts
│   ├── user.reducer.ts
│   ├── user.reducer.spec.ts
│   ├── user.actions.ts
│   ├── user.selectors.ts
│   └── user.selectors.spec.ts
├── persistence/
│   └── storage.provider.ts
└── index.ts
```

## Requirements Met

This implementation satisfies the following requirements:

- ✅ Requirement 1.7: Configure Store_Compartilhada NgRx store
- ✅ Requirement 10.1: Expose Store_Compartilhada as singleton
- ✅ Requirement 10.2: Auth slice with token, user, isAuthenticated
- ✅ Requirement 10.3: Cart slice with items, total, count
- ✅ Requirement 10.4: User slice with profile, preferences
- ✅ Requirement 10.10: Store configured as singleton for MFE sharing

## Best Practices

1. **Use Selectors**: Always use selectors to access state, not direct property access
2. **Dispatch Actions**: Dispatch actions for all state changes, not direct mutations
3. **Handle Loading States**: Check loading state before displaying data
4. **Error Handling**: Display error messages from store error field
5. **OnDestroy**: Unsubscribe from observables to prevent memory leaks
6. **Lazy Loading**: Store is loaded on app initialization, no manual setup needed in MFEs

## Notes

- The store is automatically configured as a singleton through Module Federation
- localStorage persistence is automatic when auth/cart state changes
- All MFEs have access to the same store instance through dependency injection
- Breaking changes to state interfaces may affect MFE compatibility
