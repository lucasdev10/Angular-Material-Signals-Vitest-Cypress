import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { authInterceptor, cacheInterceptor, errorInterceptor, loadingInterceptor } from './core';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';
import { AuthEffects, authReducer } from './features/auth/store';
import { cartReducer } from './features/cart/store';
import { ProductEffects, productReducer } from './features/products/store';
import { UserEffects, userReducer } from './features/user/store';

/**
 * Configuração da aplicação
 *
 * Features habilitadas:
 * - Zoneless change detection (experimental) - melhor performance
 * - HTTP Client com fetch API - melhor performance
 * - Interceptors globais
 * - Router com input binding e view transitions
 * - Global error handler
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Change Detection Strategy
    // Zoneless (experimental - melhor performance)
    provideZonelessChangeDetection(),
    // HTTP Client com interceptors
    provideHttpClient(
      withFetch(), // Usa Fetch API em vez de XMLHttpRequest
      withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor, cacheInterceptor]),
    ),
    // Router com features modernas
    provideRouter(
      routes,
      withComponentInputBinding(), // Permite usar route params como @Input()
      withViewTransitions(),
    ),
    // Global Error Handler
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideStore({
      user: userReducer,
      product: productReducer,
      cart: cartReducer,
      auth: authReducer,
      // Global stores shared across MFEs via Module Federation
      authGlobal: authGlobalReducer,
      cartGlobal: cartGlobalReducer,
      userGlobal: userGlobalReducer,
    }),
    provideEffects(UserEffects, ProductEffects, AuthEffects),
    // Store persistence provider for localStorage sync
    StorePersistenceProvider,
  ],
};
