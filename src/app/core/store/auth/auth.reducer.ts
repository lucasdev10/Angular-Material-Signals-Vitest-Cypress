import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialAuthGlobalState } from './auth.state';

export const authGlobalReducer = createReducer(
  initialAuthGlobalState,
  on(AuthActions.authLogin, (state) => ({
    ...state,
    loading: 'pending' as const,
    error: null,
  })),
  on(AuthActions.authLoginSuccess, (state, { token, refreshToken, user }) => ({
    ...state,
    token,
    refreshToken,
    user,
    isAuthenticated: true,
    loading: 'success' as const,
    error: null,
  })),
  on(AuthActions.authLoginFailure, (state, { error }) => ({
    ...state,
    token: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    loading: 'error' as const,
    error,
  })),
  on(AuthActions.authLogout, (state) => ({
    ...state,
    loading: 'pending' as const,
  })),
  on(AuthActions.authLogoutSuccess, (state) => ({
    ...state,
    token: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    loading: 'idle' as const,
    error: null,
  })),
  on(AuthActions.authRegister, (state) => ({
    ...state,
    loading: 'pending' as const,
    error: null,
  })),
  on(AuthActions.authRegisterSuccess, (state, { token, refreshToken, user }) => ({
    ...state,
    token,
    refreshToken,
    user,
    isAuthenticated: true,
    loading: 'success' as const,
    error: null,
  })),
  on(AuthActions.authRegisterFailure, (state, { error }) => ({
    ...state,
    token: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    loading: 'error' as const,
    error,
  })),
  on(AuthActions.authRefreshToken, (state) => ({
    ...state,
    loading: 'pending' as const,
  })),
  on(AuthActions.authRefreshTokenSuccess, (state, { token, refreshToken }) => ({
    ...state,
    token,
    refreshToken,
    loading: 'success' as const,
    error: null,
  })),
  on(AuthActions.authRefreshTokenFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),
  on(AuthActions.authLoadFromStorageSuccess, (state, { token, refreshToken, user }) => ({
    ...state,
    token,
    refreshToken,
    user,
    isAuthenticated: !!(token && user),
    loading: 'idle' as const,
  })),
  on(AuthActions.authSetUser, (state, { user }) => ({
    ...state,
    user,
  })),
  on(AuthActions.authClearError, (state) => ({
    ...state,
    error: null,
  })),
);
