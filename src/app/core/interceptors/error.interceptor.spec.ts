import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let mockRequest: HttpRequest<unknown>;
  let mockNext: HttpHandlerFn;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    router = TestBed.inject(Router);
    mockRequest = new HttpRequest('GET', '/api/test');

    // Spy no console.error para evitar poluir os logs
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pass through successful requests', async () => {
    // Arrange
    const mockResponse = { data: 'success' };
    mockNext = vi.fn(() => of(mockResponse as any));

    // Act - executar dentro do contexto de injeção
    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(mockRequest, mockNext));

    // Assert
    await new Promise<void>((resolve) => {
      result$.subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(mockNext).toHaveBeenCalledWith(mockRequest);
          resolve();
        },
      });
    });
  });

  it('should handle 401 error and navigate to login', async () => {
    // Arrange
    const error = new HttpErrorResponse({
      error: 'Unauthorized',
      status: 401,
      statusText: 'Unauthorized',
    });
    mockNext = vi.fn(() => throwError(() => error));

    // Act
    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(mockRequest, mockNext));

    // Assert
    await new Promise<void>((resolve) => {
      result$.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          expect(console.error).toHaveBeenCalled();
          resolve();
        },
      });
    });
  });

  it('should handle 403 error and navigate to unauthorized', async () => {
    // Arrange
    const error = new HttpErrorResponse({
      error: 'Forbidden',
      status: 403,
      statusText: 'Forbidden',
    });
    mockNext = vi.fn(() => throwError(() => error));

    // Act
    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(mockRequest, mockNext));

    // Assert
    await new Promise<void>((resolve) => {
      result$.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
          expect(console.error).toHaveBeenCalled();
          resolve();
        },
      });
    });
  });

  it('should handle 404 error and log to console', async () => {
    // Arrange
    const error = new HttpErrorResponse({
      error: 'Not Found',
      status: 404,
      statusText: 'Not Found',
    });
    mockNext = vi.fn(() => throwError(() => error));

    // Act
    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(mockRequest, mockNext));

    // Assert
    await new Promise<void>((resolve) => {
      result$.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(console.error).toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          resolve();
        },
      });
    });
  });

  it('should handle 500 error and log to console', async () => {
    // Arrange
    const error = new HttpErrorResponse({
      error: 'Internal Server Error',
      status: 500,
      statusText: 'Internal Server Error',
    });
    mockNext = vi.fn(() => throwError(() => error));

    // Act
    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(mockRequest, mockNext));

    // Assert
    await new Promise<void>((resolve) => {
      result$.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(console.error).toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          resolve();
        },
      });
    });
  });

  it('should handle client-side errors', async () => {
    // Arrange
    const errorEvent = new ErrorEvent('Network error', {
      message: 'Connection failed',
    });
    const error = new HttpErrorResponse({
      error: errorEvent,
      status: 0,
      statusText: 'Unknown Error',
    });
    mockNext = vi.fn(() => throwError(() => error));

    // Act
    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(mockRequest, mockNext));

    // Assert
    await new Promise<void>((resolve) => {
      result$.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(console.error).toHaveBeenCalled();
          resolve();
        },
      });
    });
  });

  it('should handle generic server errors', async () => {
    // Arrange
    const error = new HttpErrorResponse({
      error: 'Bad Request',
      status: 400,
      statusText: 'Bad Request',
    });
    mockNext = vi.fn(() => throwError(() => error));

    // Act
    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(mockRequest, mockNext));

    // Assert
    await new Promise<void>((resolve) => {
      result$.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(console.error).toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          resolve();
        },
      });
    });
  });
});
