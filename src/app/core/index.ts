/**
 * Barrel exports for Core Module
 * Centralizes access to all core infrastructure: guards, interceptors, services, and utilities
 * Enables imports: import { authGuard, ApiService, StorageService } from '@app/core';
 */

// Guards - Route protection for authentication, authorization, and state management
export * from './guards';

// Interceptors - HTTP request/response handling for auth, errors, loading, and caching
export * from './interceptors';

// Services - Core application services for UI state, logging, analytics, performance
export * from './services';

// Storage - Local storage abstraction service
export * from './storage';

// Handlers - Global error handling
export * from './handlers/global-error.handler';

// Config - Application constants
export * from './config/app.constants';

// Operators - Custom RxJS operators
export * from './operators/retry-strategy.operator';

// Models - Shared data models
export * from '../shared/models/storage.model';
