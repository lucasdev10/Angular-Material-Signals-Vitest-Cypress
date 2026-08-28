import { loadRemoteModule } from '@angular-architects/module-federation';
import { inject, Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';

/**
 * Configuration options for remote module loading
 */
export interface RemoteLoaderConfig {
  type: 'module' | 'script';
  remoteEntry: string;
  exposedModule: string;
  remoteName?: string;
}

/**
 * Circuit breaker state for tracking consecutive failures
 */
interface CircuitBreakerState {
  failureCount: number;
  lastFailureTime: number;
  isOpen: boolean;
}

/**
 * Service to load remote MFE modules with resilience features:
 * - Timeout: 10 seconds per attempt
 * - Retry: 3 attempts with exponential backoff (2^n * 1000ms)
 * - Circuit Breaker: Stop retrying after max failures per remote
 * - Error Logging: Via LoggerService
 * - User Notifications: Via NotificationService
 */
@Injectable({
  providedIn: 'root',
})
export class RemoteLoaderService {
  private readonly logger = inject(LoggerService);
  private readonly notification = inject(NotificationService);

  // Configuration constants
  private readonly LOAD_TIMEOUT = 10000; // 10 seconds
  private readonly MAX_RETRIES = 3;
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5; // Open circuit after 5 failures
  private readonly CIRCUIT_BREAKER_RESET_TIME = 60000; // Reset after 60 seconds
  private readonly BACKOFF_BASE = 2; // Exponential backoff base: 2^n * 1000ms

  // Circuit breaker state per remote
  private circuitBreakerStates = new Map<string, CircuitBreakerState>();

  /**
   * Load a remote module with timeout, retry, and circuit breaker logic
   * @param config Remote loader configuration
   * @returns Promise resolving to the loaded module or a fallback module on failure
   */
  async loadRemoteModuleWithResilience<T>(
    config: RemoteLoaderConfig,
  ): Promise<T | Record<string, unknown>> {
    const remoteName = config.remoteName || config.remoteEntry;

    // Check circuit breaker before attempting
    if (this.isCircuitBreakerOpen(remoteName)) {
      this.logger.warning(`Circuit breaker open for ${remoteName}, skipping load attempt`);
      this.notification.warning(`Service temporarily unavailable, please try again later`);
      return this.getFallbackModule();
    }

    let lastError: Error | unknown;

    // Retry loop with exponential backoff
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        this.logger.debug(
          `Attempting to load ${remoteName} (attempt ${attempt + 1}/${this.MAX_RETRIES})`,
        );

        // Load with timeout
        const module = await this.loadWithTimeout<T>(config, this.LOAD_TIMEOUT);

        // Success: reset circuit breaker
        this.resetCircuitBreaker(remoteName);
        this.logger.info(`Successfully loaded ${remoteName}`);

        return module;
      } catch (error) {
        lastError = error;

        // Record failure for circuit breaker
        this.recordCircuitBreakerFailure(remoteName);

        const errorMessage = error instanceof Error ? error.message : String(error);

        this.logger.warning(
          `Failed to load ${remoteName} (attempt ${attempt + 1}/${this.MAX_RETRIES}): ${errorMessage}`,
        );

        // If this is the last attempt, don't retry
        if (attempt === this.MAX_RETRIES - 1) {
          break;
        }

        // Wait before retrying with exponential backoff
        const backoffDelay = Math.pow(this.BACKOFF_BASE, attempt) * 1000;
        await this.delay(backoffDelay);
      }
    }

    // All retries exhausted
    this.logger.error(
      `Failed to load ${remoteName} after ${this.MAX_RETRIES} attempts`,
      lastError as Error,
    );

    // Notify user
    this.notification.error(
      `Failed to load ${config.remoteName || 'module'}. Please refresh the page or try again.`,
    );

    return this.getFallbackModule();
  }

  /**
   * Load remote module with timeout wrapper
   */
  private loadWithTimeout<T>(config: RemoteLoaderConfig, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        reject(
          new Error(
            `Remote module ${config.remoteEntry} loading exceeded timeout of ${timeoutMs}ms`,
          ),
        );
      }, timeoutMs);

      loadRemoteModule({
        type: 'module' as const,
        remoteEntry: config.remoteEntry,
        exposedModule: config.exposedModule,
      })
        .then((module: unknown) => {
          clearTimeout(timeoutHandle);
          resolve(module as T);
        })
        .catch((error: unknown) => {
          clearTimeout(timeoutHandle);
          reject(error);
        });
    });
  }

  /**
   * Simple delay utility for exponential backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if circuit breaker is open for a remote
   */
  private isCircuitBreakerOpen(remoteName: string): boolean {
    const state = this.circuitBreakerStates.get(remoteName);

    if (!state) {
      return false;
    }

    if (!state.isOpen) {
      return false;
    }

    // Check if enough time has passed to attempt reset
    const timeSinceLastFailure = Date.now() - state.lastFailureTime;

    if (timeSinceLastFailure > this.CIRCUIT_BREAKER_RESET_TIME) {
      this.resetCircuitBreaker(remoteName);
      return false;
    }

    return true;
  }

  /**
   * Record a failure for circuit breaker tracking
   */
  private recordCircuitBreakerFailure(remoteName: string): void {
    let state = this.circuitBreakerStates.get(remoteName);

    if (!state) {
      state = {
        failureCount: 0,
        lastFailureTime: 0,
        isOpen: false,
      };
      this.circuitBreakerStates.set(remoteName, state);
    }

    state.failureCount++;
    state.lastFailureTime = Date.now();

    if (state.failureCount >= this.CIRCUIT_BREAKER_THRESHOLD) {
      state.isOpen = true;
      this.logger.warning(
        `Circuit breaker opened for ${remoteName} after ${state.failureCount} failures`,
      );
    }
  }

  /**
   * Reset circuit breaker for a remote
   */
  private resetCircuitBreaker(remoteName: string): void {
    this.circuitBreakerStates.set(remoteName, {
      failureCount: 0,
      lastFailureTime: 0,
      isOpen: false,
    });
  }

  /**
   * Get fallback module when loading fails
   */
  private getFallbackModule(): Record<string, unknown> {
    return {
      PRODUCT_ROUTES: [],
      CART_ROUTES: [],
      ADMIN_ROUTES: [],
      AUTH_ROUTES: [],
      USER_ROUTES: [],
    };
  }
}
