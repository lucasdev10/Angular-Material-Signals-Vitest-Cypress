import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';
import { RemoteLoaderConfig, RemoteLoaderService } from './remote-loader.service';

// Mock loadRemoteModule
vi.mock('@angular-architects/module-federation', () => ({
  loadRemoteModule: vi.fn(),
}));

import { loadRemoteModule } from '@angular-architects/module-federation';

describe('RemoteLoaderService', () => {
  let service: RemoteLoaderService;
  let loggerService: {
    debug: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    warning: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  let notificationService: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    warning: ReturnType<typeof vi.fn>;
  };

  const mockConfig: RemoteLoaderConfig = {
    type: 'module',
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    exposedModule: './Routes',
    remoteName: 'products',
  };

  const mockModule = {
    PRODUCT_ROUTES: [],
  };

  beforeEach(() => {
    loggerService = {
      debug: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
    };

    notificationService = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        RemoteLoaderService,
        {
          provide: LoggerService,
          useValue: loggerService,
        },
        {
          provide: NotificationService,
          useValue: notificationService,
        },
      ],
    });

    service = TestBed.inject(RemoteLoaderService);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('loadRemoteModuleWithResilience', () => {
    it('should load module successfully on first attempt', async () => {
      vi.mocked(loadRemoteModule).mockResolvedValueOnce(mockModule);

      const result = await service.loadRemoteModuleWithResilience(mockConfig);

      expect(result).toEqual(mockModule);
      expect(loggerService.info).toHaveBeenCalledWith(
        `Successfully loaded ${mockConfig.remoteName}`,
      );
      expect(loadRemoteModule).toHaveBeenCalledTimes(1);
    });

    it('should retry on timeout and eventually fail', async () => {
      const timeoutError = new Error('Remote module loading exceeded timeout of 10000ms');
      vi.mocked(loadRemoteModule).mockRejectedValue(timeoutError);

      const result = await service.loadRemoteModuleWithResilience(mockConfig);

      // Should have 3 retry attempts
      expect(loadRemoteModule).toHaveBeenCalledTimes(3);

      // Should return fallback module
      expect(result).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          PRODUCT_ROUTES: [],
        }),
      );

      // Should log errors
      expect(loggerService.warning).toHaveBeenCalled();
      expect(loggerService.error).toHaveBeenCalled();

      // Should notify user
      expect(notificationService.error).toHaveBeenCalled();
    });

    it('should succeed on retry after initial failure', async () => {
      const error = new Error('Network error');

      // First call fails, second succeeds
      vi.mocked(loadRemoteModule).mockRejectedValueOnce(error).mockResolvedValueOnce(mockModule);

      const result = await service.loadRemoteModuleWithResilience(mockConfig);

      expect(result).toEqual(mockModule);
      expect(loadRemoteModule).toHaveBeenCalledTimes(2);
      expect(loggerService.info).toHaveBeenCalledWith(
        `Successfully loaded ${mockConfig.remoteName}`,
      );
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network connection failed');
      vi.mocked(loadRemoteModule).mockRejectedValue(networkError);

      const result = await service.loadRemoteModuleWithResilience(mockConfig);

      expect(result).toBeDefined();
      expect(notificationService.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load'),
      );
    });

    it('should use remoteName in config if provided', async () => {
      vi.mocked(loadRemoteModule).mockResolvedValueOnce(mockModule);

      const customConfig: RemoteLoaderConfig = {
        ...mockConfig,
        remoteName: 'custom-module',
      };

      await service.loadRemoteModuleWithResilience(customConfig);

      expect(loggerService.info).toHaveBeenCalledWith('Successfully loaded custom-module');
    });

    it('should return fallback module with standard route exports', async () => {
      const error = new Error('Load failed');
      vi.mocked(loadRemoteModule).mockRejectedValue(error);

      const result = await service.loadRemoteModuleWithResilience(mockConfig);

      // Verify fallback module has standard structure
      expect(result).toHaveProperty('PRODUCT_ROUTES');
      expect(result).toHaveProperty('CART_ROUTES');
      expect(result).toHaveProperty('ADMIN_ROUTES');
      expect(result).toHaveProperty('AUTH_ROUTES');
      expect(result).toHaveProperty('USER_ROUTES');
    });

    it('should notify user on final failure', async () => {
      const error = new Error('Load failed');
      vi.mocked(loadRemoteModule).mockRejectedValue(error);

      await service.loadRemoteModuleWithResilience(mockConfig);

      expect(notificationService.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load'),
      );
    });
  });

  describe('error messages', () => {
    it('should handle errors without message property', async () => {
      vi.mocked(loadRemoteModule).mockRejectedValue('string error');

      const result = await service.loadRemoteModuleWithResilience(mockConfig);

      expect(result).toBeDefined();
      expect(loggerService.warning).toHaveBeenCalled();
    });

    it('should handle null or undefined errors gracefully', async () => {
      vi.mocked(loadRemoteModule).mockRejectedValue(null);

      const result = await service.loadRemoteModuleWithResilience(mockConfig);

      expect(result).toBeDefined();
      expect(loggerService.warning).toHaveBeenCalled();
    });
  });
});
