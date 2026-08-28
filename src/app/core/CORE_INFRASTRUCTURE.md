# Core Infrastructure - Shell App

This document describes the core infrastructure of the Shell App that is preserved and made accessible to all MFEs.

## Overview

The `src/app/core/` directory contains all the critical infrastructure that the Shell App manages and shares with Micro Frontends. This includes:

- **Guards**: Route protection for authentication, authorization, and state management
- **Interceptors**: HTTP request/response handling
- **Services**: Application-wide services for state, notifications, logging, and analytics
- **Storage**: Local storage abstraction with error handling
- **Handlers**: Global error handling
- **Config**: Application constants

## Architecture

### Import Structure

MFEs can import any core infrastructure using the barrel export pattern:

```typescript
// From any MFE
import { 
  authGuard, 
  roleGuard, 
  unsavedChangesGuard,
  authInterceptor,
  errorInterceptor,
  loadingInterceptor,
  cacheInterceptor,
  LoadingService,
  NotificationService,
  ThemeService,
  LoggerService,
  StorageService,
  ApiService
} from '@app/core';
```

## Core Components

### Guards (src/app/core/guards/)

Guards protect routes based on authentication and authorization requirements.

#### authGuard
- **Purpose**: Protects routes that require authentication
- **Behavior**: Redirects unauthenticated users to `/auth/login` with return URL
- **Usage**:
  ```typescript
  { path: 'admin', canActivate: [authGuard], ... }
  ```

#### roleGuard
- **Purpose**: Protects routes based on user role/permissions
- **Behavior**: Checks route data for `roles` array and validates user permissions
- **Usage**:
  ```typescript
  { 
    path: 'admin', 
    canActivate: [roleGuard], 
    data: { roles: ['ADMIN'] },
    ...
  }
  ```

#### unsavedChangesGuard
- **Purpose**: Prevents navigation from components with unsaved changes
- **Behavior**: Prompts user before leaving route if component has pending changes
- **Implementation**: Component must implement `CanComponentDeactivate` interface
- **Usage**:
  ```typescript
  { 
    path: 'edit/:id', 
    canDeactivate: [unsavedChangesGuard],
    ...
  }
  ```

### Interceptors (src/app/core/interceptors/)

HTTP interceptors provide cross-cutting concerns for all HTTP requests/responses.

#### authInterceptor
- **Purpose**: Adds authentication token to all HTTP requests
- **Behavior**: 
  - Retrieves token from localStorage (or AuthService)
  - Adds `Authorization: Bearer <token>` header
  - Passes through requests without token

#### errorInterceptor
- **Purpose**: Centralized error handling for all HTTP requests
- **Behavior**:
  - Catches HTTP errors (4xx, 5xx)
  - Logs errors with context (URL, method, status)
  - Handles specific status codes:
    - 401: Redirects to login
    - 403: Redirects to products (forbidden)
    - 404: Logs resource not found
    - 500: Logs server error
  - Maintains original error for downstream handling

#### loadingInterceptor
- **Purpose**: Manages global loading state during HTTP requests
- **Behavior**:
  - Calls `LoadingService.show()` on request start
  - Calls `LoadingService.hide()` on request completion
  - Respects `X-Skip-Loading` header to bypass

#### cacheInterceptor
- **Purpose**: Implements simple HTTP response caching
- **Behavior**:
  - Only caches GET requests
  - Returns cached response if available
  - Respects `X-Skip-Cache` header to bypass
  - Cache is in-memory (cleared on app reload)
- **API**:
  - `clearCache()`: Clear all cached responses
  - `removeCacheItem(url)`: Remove specific cached URL

### Services (src/app/core/services/)

Application-wide services for cross-functional concerns.

#### LoadingService
- **Purpose**: Manage global loading/spinner state
- **API**:
  - `show()`: Increment loading counter and show spinner
  - `hide()`: Decrement loading counter (hide when counter = 0)
  - `reset()`: Reset counter and hide spinner
  - `isLoading`: Signal indicating loading state

#### NotificationService
- **Purpose**: Display toast notifications to users
- **API**:
  - `success(message, action)`: Show success notification
  - `error(message, action)`: Show error notification (5s duration)
  - `warning(message, action)`: Show warning notification
  - `info(message, action)`: Show info notification
  - `custom(message, config)`: Show custom notification with config

#### ThemeService
- **Purpose**: Manage application theme (light/dark mode)
- **API**:
  - `setTheme(theme)`: Set theme ('light', 'dark', 'auto')
  - `toggleTheme()`: Toggle between light and dark
  - `currentTheme`: Signal with current theme
- **Persistence**: Theme preference stored in localStorage

#### LoggerService
- **Purpose**: Structured logging with configurable levels
- **API**:
  - `setLogLevel(level)`: Set minimum log level
  - `setConsoleLogging(enabled)`: Enable/disable console output
  - `debug(message, ...args)`: Log at DEBUG level
  - `info(message, ...args)`: Log at INFO level
  - `warning(message, ...args)`: Log at WARNING level
  - `error(message, error?, ...args)`: Log at ERROR level
- **Levels**: DEBUG, INFO, WARNING, ERROR

#### StorageService
- **Purpose**: Abstract localStorage with error handling
- **API**:
  - `get<T>(key)`: Retrieve and parse value (returns null on error)
  - `set<T>(key, value)`: Serialize and store value
  - `remove(key)`: Delete stored value
  - `clear()`: Clear all stored values
  - `has(key)`: Check if key exists
  - `keys()`: Get all stored keys
- **Error Handling**: Handles QuotaExceededError and JSON parse errors gracefully

#### ApiService
- **Purpose**: HTTP client with centralized configuration
- **API**:
  - `get<T>(endpoint, options)`: GET request
  - `post<T>(endpoint, body, options)`: POST request
  - `put<T>(endpoint, body, options)`: PUT request
- **Options**: Can specify headers, parameters, error handling

#### AnalyticsService
- **Purpose**: Track page views and events for analytics
- **API**:
  - `trackPageView(url)`: Track page navigation
  - Route tracking automatically integrated

#### PerformanceService
- **Purpose**: Measure performance metrics and timings
- **API**:
  - `startMeasure(name, metadata)`: Start performance measurement
  - `endMeasure(name)`: End measurement and return duration
  - `measureAsync<T>(name, fn)`: Measure async operation duration

#### SeoService
- **Purpose**: Manage SEO meta tags and metadata
- **API**:
  - `updateSeo(config)`: Update page title, description, keywords
  - `setCanonicalUrl(url)`: Set canonical URL

#### WebVitalsService
- **Purpose**: Collect Web Vitals metrics for performance monitoring
- **API**: Automatically collects LCP, FID, CLS metrics

### Storage Service (src/app/core/storage/)

Dedicated storage service that provides localStorage abstraction.

#### StorageService
- **Generic**: `StorageService<T>` supports typed storage
- **Automatic Serialization**: Automatically JSON.stringify/parse values
- **Error Handling**: 
  - Catches and logs JSON errors
  - Handles QuotaExceededError
  - Returns sensible defaults (null, false) on error
- **Usage**:
  ```typescript
  const storage = inject(StorageService);
  storage.set('user', { id: 1, name: 'John' });
  const user = storage.get<User>('user');
  ```

## Barrel File Organization

### Core Structure
```
src/app/core/
├── guards/
│   ├── auth.guard.ts
│   ├── role.guard.ts
│   ├── unsaved-changes.guard.ts
│   └── index.ts (barrel export)
├── interceptors/
│   ├── auth.interceptor.ts
│   ├── cache.interceptor.ts
│   ├── error.interceptor.ts
│   ├── loading.interceptor.ts
│   └── index.ts (barrel export)
├── services/
│   ├── analytics.service.ts
│   ├── api.service.ts
│   ├── loading.service.ts
│   ├── logger.service.ts
│   ├── notification.service.ts
│   ├── performance.service.ts
│   ├── seo.service.ts
│   ├── theme.service.ts
│   ├── web-vitals.service.ts
│   └── index.ts (barrel export)
├── storage/
│   ├── storage.ts
│   └── index.ts (barrel export)
├── handlers/
│   └── global-error.handler.ts
├── config/
│   └── app.constants.ts
├── operators/
│   └── retry-strategy.operator.ts
└── index.ts (main barrel export)
```

### Import Patterns

**Pattern 1: Import from main core barrel**
```typescript
import { authGuard, LoadingService } from '@app/core';
```

**Pattern 2: Import from subdirectory barrel**
```typescript
import { authGuard } from '@app/core/guards';
import { LoadingService } from '@app/core/services';
```

**Pattern 3: Import directly from source**
```typescript
import { authGuard } from '@app/core/guards/auth.guard';
import { LoadingService } from '@app/core/services/loading.service';
```

## MFE Integration

All guards, interceptors, and services are automatically available to MFEs since they:

1. **Share same Angular instance**: Module Federation is configured to share @angular/core singleton
2. **Import from barrel files**: MFEs can import using the established patterns
3. **Depend on Shell's injection**: Services are provided at root scope via `providedIn: 'root'`
4. **Use App Config**: MFEs must configure interceptors in their app config

### MFE Configuration Example

```typescript
// MFE app.config.ts
import { authInterceptor, errorInterceptor, loadingInterceptor, cacheInterceptor } from '@app/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
        cacheInterceptor,
      ])
    ),
  ],
};
```

## Requirements Met

✅ **Requirement 1.3**: Guards exported from core (authGuard, roleGuard, unsavedChangesGuard)
✅ **Requirement 1.4**: Interceptors exported from core (authInterceptor, errorInterceptor, loadingInterceptor, cacheInterceptor)
✅ **Requirement 1.5**: Services exported from core (LoadingService, NotificationService, ThemeService, LoggerService, StorageService, ApiService, etc.)

All are properly organized, documented, and accessible to MFEs through barrel files.
