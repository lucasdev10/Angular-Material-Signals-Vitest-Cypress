import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthGlobalState } from './auth.state';

export const selectAuthGlobalState = createFeatureSelector<IAuthGlobalState>('authGlobal');

export const selectAuthToken = createSelector(selectAuthGlobalState, (state) => state.token);

export const selectAuthRefreshToken = createSelector(
  selectAuthGlobalState,
  (state) => state.refreshToken,
);

export const selectAuthUser = createSelector(selectAuthGlobalState, (state) => state.user);

export const selectAuthIsAuthenticated = createSelector(
  selectAuthGlobalState,
  (state) => state.isAuthenticated,
);

export const selectAuthLoading = createSelector(selectAuthGlobalState, (state) => state.loading);

export const selectAuthError = createSelector(selectAuthGlobalState, (state) => state.error);

export const selectAuthUserRole = createSelector(selectAuthUser, (user) => user?.role || null);

export const selectAuthIsAdmin = createSelector(selectAuthUserRole, (role) => role === 'ADMIN');
