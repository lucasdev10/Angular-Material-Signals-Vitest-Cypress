import { EUserRole } from '@app/features/user/models/user.model';
import * as AuthActions from './auth.actions';
import { authGlobalReducer } from './auth.reducer';
import { initialAuthGlobalState } from './auth.state';

describe('AuthGlobalReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = authGlobalReducer(initialAuthGlobalState, action as any);

      expect(state).toEqual(initialAuthGlobalState);
    });
  });

  describe('Login', () => {
    it('should set loading to pending on login', () => {
      const action = AuthActions.authLogin({ email: 'test@test.com', password: 'password' });
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.loading).toBe('pending');
      expect(state.error).toBe(null);
    });

    it('should set user and tokens on login success', () => {
      const user = {
        id: 'user-id',
        email: 'test@test.com',
        fullName: 'Test User',
        role: EUserRole.USER,
        createdAt: 1774041882,
        updatedAt: 1774041882,
      };
      const action = AuthActions.authLoginSuccess({
        token: 'access-token',
        refreshToken: 'refresh-token',
        user,
      });
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.loading).toBe('success');
      expect(state.user).toEqual(user);
      expect(state.token).toBe('access-token');
      expect(state.refreshToken).toBe('refresh-token');
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should set error on login failure', () => {
      const error = 'Invalid credentials';
      const action = AuthActions.authLoginFailure({ error });
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBe(null);
      expect(state.user).toBe(null);
    });
  });

  describe('Logout', () => {
    it('should set loading to pending on logout', () => {
      const action = AuthActions.authLogout();
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.loading).toBe('pending');
    });

    it('should clear auth state on logout success', () => {
      const authenticatedState = {
        ...initialAuthGlobalState,
        token: 'token',
        user: {
          id: 'user-id',
          email: 'test@test.com',
          fullName: 'Test User',
          role: EUserRole.USER,
          createdAt: 1774041882,
          updatedAt: 1774041882,
        },
        isAuthenticated: true,
      };
      const action = AuthActions.authLogoutSuccess();
      const state = authGlobalReducer(authenticatedState, action);

      expect(state.loading).toBe('idle');
      expect(state.token).toBe(null);
      expect(state.refreshToken).toBe(null);
      expect(state.user).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('Register', () => {
    it('should set loading to pending on register', () => {
      const action = AuthActions.authRegister({
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
      });
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.loading).toBe('pending');
      expect(state.error).toBe(null);
    });

    it('should set user and tokens on register success', () => {
      const user = {
        id: 'user-id',
        email: 'test@test.com',
        fullName: 'Test User',
        role: EUserRole.USER,
        createdAt: 1774041882,
        updatedAt: 1774041882,
      };
      const action = AuthActions.authRegisterSuccess({
        token: 'access-token',
        refreshToken: 'refresh-token',
        user,
      });
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.loading).toBe('success');
      expect(state.user).toEqual(user);
      expect(state.token).toBe('access-token');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set error on register failure', () => {
      const error = 'Email already exists';
      const action = AuthActions.authRegisterFailure({ error });
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('RefreshToken', () => {
    it('should set loading to pending on token refresh', () => {
      const action = AuthActions.authRefreshToken();
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.loading).toBe('pending');
    });

    it('should update tokens on refresh success', () => {
      const authenticatedState = {
        ...initialAuthGlobalState,
        token: 'old-token',
        refreshToken: 'old-refresh-token',
        isAuthenticated: true,
      };
      const action = AuthActions.authRefreshTokenSuccess({
        token: 'new-token',
        refreshToken: 'new-refresh-token',
      });
      const state = authGlobalReducer(authenticatedState, action);

      expect(state.loading).toBe('success');
      expect(state.token).toBe('new-token');
      expect(state.refreshToken).toBe('new-refresh-token');
      expect(state.error).toBe(null);
    });
  });

  describe('LoadFromStorage', () => {
    it('should load auth state from storage', () => {
      const user = {
        id: 'user-id',
        email: 'test@test.com',
        fullName: 'Test User',
        role: EUserRole.USER,
        createdAt: 1774041882,
        updatedAt: 1774041882,
      };
      const action = AuthActions.authLoadFromStorageSuccess({
        token: 'stored-token',
        refreshToken: 'stored-refresh-token',
        user,
      });
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.loading).toBe('idle');
      expect(state.token).toBe('stored-token');
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle null values from storage', () => {
      const action = AuthActions.authLoadFromStorageSuccess({
        token: null,
        refreshToken: null,
        user: null,
      });
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.token).toBe(null);
      expect(state.user).toBe(null);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('SetUser', () => {
    it('should update the authenticated user', () => {
      const user = {
        id: 'user-id',
        email: 'newemail@test.com',
        fullName: 'Updated User',
        role: EUserRole.USER,
        createdAt: 1774041882,
        updatedAt: 1774041882,
      };
      const action = AuthActions.authSetUser({ user });
      const state = authGlobalReducer(initialAuthGlobalState, action);

      expect(state.user).toEqual(user);
    });
  });

  describe('ClearError', () => {
    it('should clear error message', () => {
      const stateWithError = {
        ...initialAuthGlobalState,
        error: 'Some error',
        loading: 'error' as const,
      };
      const action = AuthActions.authClearError();
      const state = authGlobalReducer(stateWithError, action);

      expect(state.error).toBe(null);
    });
  });
});
