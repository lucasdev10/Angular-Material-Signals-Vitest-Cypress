import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let mockRequest: HttpRequest<unknown>;
  let mockNext: HttpHandlerFn;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });

    loadingService = TestBed.inject(LoadingService);
    loadingService.reset();

    mockRequest = new HttpRequest('GET', '/api/test');
    mockNext = vi.fn((req: HttpRequest<unknown>) =>
      of(new HttpResponse({ body: { data: 'success' }, status: 200 }) as HttpEvent<unknown>),
    );
  });

  afterEach(() => {
    loadingService.reset();
  });

  it('should show loading when request starts', () => {
    loadingService.reset();

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(mockRequest, mockNext);
    });

    expect(loadingService.isLoading()).toBe(true);
  });

  it('should call next handler with request', () => {
    TestBed.runInInjectionContext(() => {
      loadingInterceptor(mockRequest, mockNext);
    });

    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });

  it('should skip loading for requests with X-Skip-Loading header', () => {
    const requestWithSkip = new HttpRequest('GET', '/api/test', undefined, {
      headers: new HttpHeaders({ 'X-Skip-Loading': 'true' }),
    });

    loadingService.reset();

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(requestWithSkip, mockNext);
    });

    expect(loadingService.isLoading()).toBe(false);
  });

  it('should handle POST requests', () => {
    const postRequest = new HttpRequest('POST', '/api/test', { data: 'test' });

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(postRequest, mockNext);
    });

    expect(loadingService.isLoading()).toBe(true);
  });

  it('should handle PUT requests', () => {
    const putRequest = new HttpRequest('PUT', '/api/test', { data: 'test' });

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(putRequest, mockNext);
    });

    expect(loadingService.isLoading()).toBe(true);
  });

  it('should handle DELETE requests', () => {
    const deleteRequest = new HttpRequest('DELETE', '/api/test');

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(deleteRequest, mockNext);
    });

    expect(loadingService.isLoading()).toBe(true);
  });
});
