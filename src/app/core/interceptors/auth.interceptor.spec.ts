import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let mockRequest: HttpRequest<unknown>;
  let mockNext: HttpHandlerFn;

  beforeEach(() => {
    mockRequest = new HttpRequest('GET', '/api/test');

    mockNext = vi.fn((req: HttpRequest<unknown>) => of({} as HttpEvent<unknown>));

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should add Authorization header when token exists', () => {
    // Arrange
    const token = 'test-token-123';
    localStorage.setItem('auth_token', token);

    // Act
    authInterceptor(mockRequest, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          lazyUpdate: expect.arrayContaining([
            expect.objectContaining({
              name: 'Authorization',
              value: `Bearer ${token}`,
            }),
          ]),
        }),
      }),
    );
  });

  it('should not add Authorization header when token does not exist', () => {
    // Act
    authInterceptor(mockRequest, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });

  it('should pass request to next handler', () => {
    // Act
    const result = authInterceptor(mockRequest, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should clone request when adding token', () => {
    // Arrange
    const token = 'test-token-456';
    localStorage.setItem('auth_token', token);

    // Act
    authInterceptor(mockRequest, mockNext);

    // Assert
    const calledRequest = (mockNext as any).mock.calls[0][0];
    expect(calledRequest).not.toBe(mockRequest);
    expect(calledRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should handle empty token string', () => {
    // Arrange
    localStorage.setItem('auth_token', '');

    // Act
    authInterceptor(mockRequest, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });

  it('should work with different HTTP methods', () => {
    // Arrange
    const token = 'test-token-789';
    localStorage.setItem('auth_token', token);
    const postRequest = new HttpRequest('POST', '/api/test', { data: 'test' });

    // Act
    authInterceptor(postRequest, mockNext);

    // Assert
    const calledRequest = (mockNext as any).mock.calls[0][0];
    expect(calledRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(calledRequest.method).toBe('POST');
  });
});
