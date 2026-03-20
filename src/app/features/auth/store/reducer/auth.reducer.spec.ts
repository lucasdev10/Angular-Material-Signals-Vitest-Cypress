import { EUserRole } from '@app/features/user/models/user.model';
import { IAuthResponse } from '../../models/auth.model';
import { AuthActions } from '../auth.actions';
import { initialAuthState } from '../auth.state';
import { authReducer } from './auth.reducer';

describe('AuthReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = authReducer(initialAuthState, action);

      expect(state).toEqual(initialAuthState);
    });
  });

  describe('Login', () => {
    it('should set loading in login', () => {
      const credentials = { email: 'test@test.com', password: 'password' };
      const action = AuthActions.login({ credentials });
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe('loading');
      expect(state.error).toBe(null);
    });
    it('should set user on login success', () => {
      const auth: IAuthResponse = {
        user: {
          id: 'user-id',
          email: 'test@test.com',
          fullName: 'user name',
          role: EUserRole.ADMIN,
          createdAt: 1774041882,
          updatedAt: 1774041882,
        },
        token: 'token',
        refreshToken: 'refreshToken',
      };
      const action = AuthActions.loginSuccess({ auth });
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe('success');
      expect(state.user).toEqual(auth.user);
      expect(state.token).toEqual(auth.token);
      expect(state.error).toBe(null);
    });
    it('should set error on login error', () => {
      const error = 'Failed login';
      const action = AuthActions.loginError({ error });
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('Logout', () => {
    it('should set loading in logout', () => {
      const action = AuthActions.logout();
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe('loading');
      expect(state.error).toBe(null);
    });
    it('should set state on logout success', () => {
      const action = AuthActions.logoutSuccess();
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe('success');
      expect(state.user).toEqual(null);
      expect(state.token).toEqual(null);
      expect(state.error).toBe(null);
    });
    it('should set state on logout error', () => {
      const action = AuthActions.logoutError();
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBe('error');
      expect(state.user).toEqual(null);
      expect(state.token).toEqual(null);
      expect(state.error).toBe(null);
    });
  });

  describe('SetAuthentication', () => {
    it('should set auth state', () => {
      const auth = {
        user: {
          id: 'user-id',
          email: 'test@test.com',
          fullName: 'user name',
          role: EUserRole.ADMIN,
          createdAt: 1774041882,
          updatedAt: 1774041882,
        },
        token: 'user-token',
      };
      const action = AuthActions.setAuthentication(auth);
      const state = authReducer(initialAuthState, action);

      expect(state.token).toBe('user-token');
      expect(state.user).toEqual(auth.user);
    });
  });
});
