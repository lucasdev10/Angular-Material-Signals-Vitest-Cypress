import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthFacade } from '@app/features/auth/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let mockRouter: Router;
  let mockAuthFacade: Partial<AuthFacade>;

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn(),
    } as any;

    mockAuthFacade = {
      isAuthenticated: vi.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthFacade, useValue: mockAuthFacade },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access when user is authenticated', async () => {
    (mockAuthFacade.isAuthenticated as any).mockResolvedValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin' } as any),
    );

    expect(await result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user is not authenticated', async () => {
    (mockAuthFacade.isAuthenticated as any).mockResolvedValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin' } as any),
    );

    expect(await result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/admin' },
    });
  });

  it('should redirect to login with return URL', async () => {
    (mockAuthFacade.isAuthenticated as any).mockResolvedValue(false);

    const state = { url: '/admin/products' };

    await TestBed.runInInjectionContext(() => authGuard({} as any, state as any));

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/admin/products' },
    });
  });

  it('should call isAuthenticated method', async () => {
    (mockAuthFacade.isAuthenticated as any).mockResolvedValue(true);

    await TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/' } as any));

    expect(mockAuthFacade.isAuthenticated).toHaveBeenCalled();
  });

  it('should handle async isAuthenticated call', async () => {
    const asyncMock = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(true), 10)));
    (mockAuthFacade.isAuthenticated as any) = asyncMock;

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin' } as any),
    );

    expect(await result).toBe(true);
    expect(asyncMock).toHaveBeenCalled();
  });

  it('should pass current URL as queryParam returnUrl', async () => {
    (mockAuthFacade.isAuthenticated as any).mockResolvedValue(false);

    const testUrl = '/products/123/edit';
    await TestBed.runInInjectionContext(() => authGuard({} as any, { url: testUrl } as any));

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: testUrl },
    });
  });

  it('should work with root path', async () => {
    (mockAuthFacade.isAuthenticated as any).mockResolvedValue(false);

    await TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/' } as any));

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/' },
    });
  });

  it('should work with query parameters in URL', async () => {
    (mockAuthFacade.isAuthenticated as any).mockResolvedValue(false);

    const urlWithParams = '/products?sort=name&filter=active';
    await TestBed.runInInjectionContext(() => authGuard({} as any, { url: urlWithParams } as any));

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: urlWithParams },
    });
  });

  it('should return true when authenticated', async () => {
    (mockAuthFacade.isAuthenticated as any).mockResolvedValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin' } as any),
    );

    expect(await result).toBe(true);
  });

  it('should return false when not authenticated', async () => {
    (mockAuthFacade.isAuthenticated as any).mockResolvedValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin' } as any),
    );

    expect(await result).toBe(false);
  });
});
