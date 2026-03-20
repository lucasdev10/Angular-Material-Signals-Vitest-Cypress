import { TestBed } from '@angular/core/testing';
import { StorageService } from '@app/core/storage/storage';
import { EUserRole } from '@app/features/user/models/user.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthActions } from '../auth.actions';
import { initialAuthState } from '../auth.state';
import {
  selectError,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsLoading,
  selectToken,
  selectUser,
} from '../selectors/auth.selectors';
import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let store: MockStore;

  let mockUser = {
    id: 'user-id-1',
    email: 'admin@admin.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: EUserRole.ADMIN,
    createdAt: 1774046403,
    updatedAt: 1774046403,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            auth: {
              ...initialAuthState,
              loading: 'success',
              token: 'user-token',
              user: mockUser,
            },
          },
        }),
      ],
    });

    facade = TestBed.inject(AuthFacade);
    store = TestBed.inject(MockStore);

    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectIsAuthenticated, true);
    store.overrideSelector(selectIsAdmin, true);
    store.overrideSelector(selectUser, mockUser);
    store.overrideSelector(selectToken, 'user-token');
  });

  describe('selectors', () => {
    it('should expose isLoading$', async () => {
      await vi.waitFor(() => {
        facade.isLoading$.subscribe((isLoading) => {
          expect(isLoading).toBe(false);
        });
      });
    });

    it('should expose error$', async () => {
      await vi.waitFor(() => {
        facade.error$.subscribe((error) => {
          expect(error).toBe(null);
        });
      });
    });

    it('should expose isAuthenticated$', async () => {
      await vi.waitFor(() => {
        facade.isAuthenticated$.subscribe((isAuthenticated) => {
          expect(isAuthenticated).toBe(true);
        });
      });
    });

    it('should expose isAdmin$', async () => {
      await vi.waitFor(() => {
        facade.isAdmin$.subscribe((isAdmin) => {
          expect(isAdmin).toBe(true);
        });
      });
    });

    it('should expose user$', async () => {
      await vi.waitFor(() => {
        facade.user$.subscribe((user) => {
          expect(user).toEqual(mockUser);
        });
      });
    });

    it('should expose token$', async () => {
      await vi.waitFor(() => {
        facade.token$.subscribe((token) => {
          expect(token).toEqual('user-token');
        });
      });
    });
  });

  describe('actions', () => {
    it('should dispatch setAuthentication action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const mockAuthData = {
        token: 'user-token',
        user: mockUser,
      };
      const storage = TestBed.inject(StorageService);
      vi.spyOn(storage, 'get').mockImplementation((key: string) => {
        if (key === 'auth_token') {
          return 'user-token';
        }
        if (key === 'auth_user') {
          return mockUser;
        }
        return null;
      });

      facade.initializeAuth();

      expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.setAuthentication(mockAuthData));
    });

    it('should dispatch login action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const mockCredentials = {
        email: 'admin@admin.com',
        password: 'password123',
      };

      facade.login(mockCredentials);

      expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.login({ credentials: mockCredentials }));
    });

    it('should dispatch logout action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      facade.logout();

      expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
    });
  });

  describe('integration', () => {
    it('should update loading when selectors change', async () => {
      let currentValue: boolean | undefined;
      const subscription = facade.isLoading$.subscribe((isLoading) => {
        currentValue = isLoading;
      });

      await vi.waitFor(() => {
        expect(currentValue).toBe(false);
      });

      store.overrideSelector(selectIsLoading, true);
      store.refreshState();

      await vi.waitFor(() => {
        expect(currentValue).toBe(true);
      });

      subscription.unsubscribe();
    });
  });
});
