import { EUserRole } from '@app/features/user/models/user.model';
import {
  selectAuthGlobalState,
  selectAuthToken,
  selectAuthRefreshToken,
  selectAuthUser,
  selectAuthIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthUserRole,
  selectAuthIsAdmin,
} from './auth.selectors';
import { IAuthGlobalState, initialAuthGlobalState } from './auth.state';

describe('Auth Selectors', () => {
  const mockUser = {
    id: 'user-id',
    email: 'test@test.com',
    fullName: 'Test User',
    role: EUserRole.ADMIN,
    createdAt: 1774041882,
    updatedAt: 1774041882,
  };

  const mockState: { authGlobal: IAuthGlobalState } = {
    authGlobal: {
      ...initialAuthGlobalState,
      token: 'test-token',
      refreshToken: 'test-refresh-token',
      user: mockUser,
      isAuthenticated: true,
    },
  };

  it('should select auth global state', () => {
    const result = selectAuthGlobalState(mockState);
    expect(result).toEqual(mockState.authGlobal);
  });

  it('should select auth token', () => {
    const result = selectAuthToken(mockState);
    expect(result).toBe('test-token');
  });

  it('should select auth refresh token', () => {
    const result = selectAuthRefreshToken(mockState);
    expect(result).toBe('test-refresh-token');
  });

  it('should select auth user', () => {
    const result = selectAuthUser(mockState);
    expect(result).toEqual(mockUser);
  });

  it('should select auth is authenticated', () => {
    const result = selectAuthIsAuthenticated(mockState);
    expect(result).toBe(true);
  });

  it('should select auth loading', () => {
    const result = selectAuthLoading(mockState);
    expect(result).toBe('idle');
  });

  it('should select auth error', () => {
    const errorState = {
      authGlobal: { ...mockState.authGlobal, error: 'Test error' },
    };
    const result = selectAuthError(errorState);
    expect(result).toBe('Test error');
  });

  it('should select auth user role', () => {
    const result = selectAuthUserRole(mockState);
    expect(result).toBe(EUserRole.ADMIN);
  });

  it('should return null role when user is not set', () => {
    const state = { authGlobal: { ...mockState.authGlobal, user: null } };
    const result = selectAuthUserRole(state);
    expect(result).toBe(null);
  });

  it('should select auth is admin when user has ADMIN role', () => {
    const result = selectAuthIsAdmin(mockState);
    expect(result).toBe(true);
  });

  it('should select auth is not admin when user has USER role', () => {
    const userState = {
      authGlobal: {
        ...mockState.authGlobal,
        user: { ...mockUser, role: EUserRole.USER },
      },
    };
    const result = selectAuthIsAdmin(userState);
    expect(result).toBe(false);
  });

  it('should select auth is not admin when user is not set', () => {
    const state = { authGlobal: { ...mockState.authGlobal, user: null } };
    const result = selectAuthIsAdmin(state);
    expect(result).toBe(false);
  });
});
