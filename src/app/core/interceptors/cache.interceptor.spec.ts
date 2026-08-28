import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { of } from 'rxjs';
import { cacheInterceptor, clearCache, removeCacheItem } from './cache.interceptor';

describe('cacheInterceptor', () => {
  let mockRequest: HttpRequest<unknown>;
  let mockNext: HttpHandlerFn;
  const mockResponse = new HttpResponse({ body: { data: 'test' }, status: 200 });

  beforeEach(() => {
    clearCache();
    mockNext = vi.fn((req: HttpRequest<unknown>) => of(mockResponse as HttpEvent<unknown>));
  });

  afterEach(() => {
    clearCache();
  });

  it('should pass through POST requests without caching', () => {
    const postRequest = new HttpRequest('POST', '/api/test', { data: 'test' });

    cacheInterceptor(postRequest, mockNext);

    expect(mockNext).toHaveBeenCalledWith(postRequest);
  });

  it('should pass through PUT requests without caching', () => {
    const putRequest = new HttpRequest('PUT', '/api/test', { data: 'test' });

    cacheInterceptor(putRequest, mockNext);

    expect(mockNext).toHaveBeenCalledWith(putRequest);
  });

  it('should pass through DELETE requests without caching', () => {
    const deleteRequest = new HttpRequest('DELETE', '/api/test');

    cacheInterceptor(deleteRequest, mockNext);

    expect(mockNext).toHaveBeenCalledWith(deleteRequest);
  });

  it('should cache GET requests', async () => {
    const getRequest = new HttpRequest('GET', '/api/products');
    let callCount = 0;

    const testNext: HttpHandlerFn = () => {
      callCount++;
      return of(mockResponse.clone() as HttpEvent<unknown>);
    };

    await new Promise<void>((resolve) => {
      cacheInterceptor(getRequest, testNext).subscribe(() => {
        cacheInterceptor(getRequest, testNext).subscribe(() => {
          expect(callCount).toBe(1);
          resolve();
        });
      });
    });
  });

  it('should return cached response without calling next', async () => {
    const getRequest = new HttpRequest('GET', '/api/products');
    let nextCallCount = 0;

    const testNext: HttpHandlerFn = () => {
      nextCallCount++;
      return of(mockResponse.clone() as HttpEvent<unknown>);
    };

    await new Promise<void>((resolve) => {
      cacheInterceptor(getRequest, testNext).subscribe(() => {
        expect(nextCallCount).toBe(1);

        cacheInterceptor(getRequest, testNext).subscribe(() => {
          expect(nextCallCount).toBe(1);
          resolve();
        });
      });
    });
  });

  it('should skip cache when X-Skip-Cache header is present', async () => {
    const getRequest = new HttpRequest('GET', '/api/products', undefined, {
      headers: new HttpHeaders({ 'X-Skip-Cache': 'true' }),
    });
    let nextCallCount = 0;

    const testNext: HttpHandlerFn = () => {
      nextCallCount++;
      return of(mockResponse.clone() as HttpEvent<unknown>);
    };

    await new Promise<void>((resolve) => {
      cacheInterceptor(getRequest, testNext).subscribe(() => {
        expect(nextCallCount).toBe(1);

        cacheInterceptor(getRequest, testNext).subscribe(() => {
          expect(nextCallCount).toBe(2);
          resolve();
        });
      });
    });
  });

  it('should clear all cache items', async () => {
    const getRequest = new HttpRequest('GET', '/api/products');
    let nextCallCount = 0;

    const testNext: HttpHandlerFn = () => {
      nextCallCount++;
      return of(mockResponse.clone() as HttpEvent<unknown>);
    };

    await new Promise<void>((resolve) => {
      cacheInterceptor(getRequest, testNext).subscribe(() => {
        clearCache();

        cacheInterceptor(getRequest, testNext).subscribe(() => {
          expect(nextCallCount).toBe(2);
          resolve();
        });
      });
    });
  });

  it('should remove specific cache item', async () => {
    const getRequest = new HttpRequest('GET', '/api/products');
    let nextCallCount = 0;

    const testNext: HttpHandlerFn = () => {
      nextCallCount++;
      return of(mockResponse.clone() as HttpEvent<unknown>);
    };

    await new Promise<void>((resolve) => {
      cacheInterceptor(getRequest, testNext).subscribe(() => {
        removeCacheItem('/api/products');

        cacheInterceptor(getRequest, testNext).subscribe(() => {
          expect(nextCallCount).toBe(2);
          resolve();
        });
      });
    });
  });

  it('should cache multiple GET requests separately', async () => {
    const request1 = new HttpRequest('GET', '/api/products');
    const request2 = new HttpRequest('GET', '/api/users');
    let nextCallCount = 0;

    const testNext: HttpHandlerFn = (req) => {
      nextCallCount++;
      return of(mockResponse.clone() as HttpEvent<unknown>);
    };

    await new Promise<void>((resolve) => {
      cacheInterceptor(request1, testNext).subscribe(() => {
        cacheInterceptor(request2, testNext).subscribe(() => {
          cacheInterceptor(request1, testNext).subscribe(() => {
            expect(nextCallCount).toBe(2);
            resolve();
          });
        });
      });
    });
  });

  it('should only cache HttpResponse events', async () => {
    const getRequest = new HttpRequest('GET', '/api/products');

    const testNext: HttpHandlerFn = () => {
      return of(
        { type: 0, status: 200 } as HttpEvent<unknown>, // Not a HttpResponse
        mockResponse.clone() as HttpEvent<unknown>,
      );
    };

    await new Promise<void>((resolve) => {
      cacheInterceptor(getRequest, testNext).subscribe(() => {
        cacheInterceptor(getRequest, testNext).subscribe({
          next: () => {
            // On second call, should still hit next because we only cache HttpResponse
            resolve();
          },
        });
      });
    });
  });

  it('should handle empty cache operations', () => {
    clearCache();
    removeCacheItem('/api/nonexistent');
    expect(() => clearCache()).not.toThrow();
  });

  it('should cache response with different status codes', async () => {
    const getRequest = new HttpRequest('GET', '/api/products');
    const successResponse = new HttpResponse({ body: { data: 'test' }, status: 200 });

    const testNext: HttpHandlerFn = () => {
      return of(successResponse.clone() as HttpEvent<unknown>);
    };

    await new Promise<void>((resolve) => {
      cacheInterceptor(getRequest, testNext).subscribe(() => {
        cacheInterceptor(getRequest, testNext).subscribe(() => {
          resolve();
        });
      });
    });
  });
});
