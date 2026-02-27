import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StorageService } from '@app/core/storage/storage';
import { EUserRole } from '@app/features/user/models/user.model';
import { of, throwError } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: AuthStore;
  let mockRepository: jest.Mocked<AuthRepository>;
  let mockStorage: jest.Mocked<StorageService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    // Criar mocks
    mockRepository = {
      login: jest.fn(),
      logout: jest.fn(),
      validateToken: jest.fn(),
      refreshToken: jest.fn(),
    } as any;

    mockStorage = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
    } as any;

    mockRouter = {
      navigate: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AuthRepository, useValue: mockRepository },
        { provide: StorageService, useValue: mockStorage },
        { provide: Router, useValue: mockRouter },
      ],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and redirect admin to /admin', (done) => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'admin@test.com',
          name: 'Admin',
          role: EUserRole.ADMIN,
        },
        token: 'mock-token',
      };

      mockRepository.login.mockReturnValue(of(mockResponse));

      store.login({ email: 'admin@test.com', password: 'password' });

      setTimeout(() => {
        expect(store.isAuthenticated()).toBe(true);
        expect(store.isAdmin()).toBe(true);
        expect(store.user()?.email).toBe('admin@test.com');
        expect(mockStorage.set).toHaveBeenCalledWith('auth_token', 'mock-token');
        expect(mockStorage.set).toHaveBeenCalledWith('auth_user', mockResponse.user);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
        done();
      }, 100);
    });

    it('should login successfully and redirect user to /products', (done) => {
      const mockResponse = {
        user: {
          id: '2',
          email: 'user@test.com',
          name: 'User',
          role: EUserRole.USER,
        },
        token: 'mock-token',
      };

      mockRepository.login.mockReturnValue(of(mockResponse));

      store.login({ email: 'user@test.com', password: 'password' });

      setTimeout(() => {
        expect(store.isAuthenticated()).toBe(true);
        expect(store.isAdmin()).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
        done();
      }, 100);
    });

    it('should handle login error', (done) => {
      mockRepository.login.mockReturnValue(throwError(() => ({ message: 'Invalid credentials' })));

      store.login({ email: 'wrong@test.com', password: 'wrong' });

      setTimeout(() => {
        expect(store.error()).toBe('Invalid credentials');
        expect(store.isAuthenticated()).toBe(false);
        done();
      }, 100);
    });
  });

  describe('logout', () => {
    it('should logout successfully', (done) => {
      mockRepository.logout.mockReturnValue(of(void 0));

      store.logout();

      setTimeout(() => {
        expect(store.isAuthenticated()).toBe(false);
        expect(store.user()).toBeNull();
        expect(mockStorage.remove).toHaveBeenCalledWith('auth_token');
        expect(mockStorage.remove).toHaveBeenCalledWith('auth_user');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
        done();
      }, 100);
    });
  });

  describe('computed signals', () => {
    it('should return correct isAuthenticated value', () => {
      expect(store.isAuthenticated()).toBe(false);
    });

    it('should return correct isAdmin value', () => {
      expect(store.isAdmin()).toBe(false);
    });
  });
});
