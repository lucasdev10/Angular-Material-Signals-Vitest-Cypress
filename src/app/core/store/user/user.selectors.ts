import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUserGlobalState } from './user.state';

export const selectUserGlobalState = createFeatureSelector<IUserGlobalState>('userGlobal');

export const selectUserProfile = createSelector(selectUserGlobalState, (state) => state.profile);

export const selectUserPreferences = createSelector(
  selectUserGlobalState,
  (state) => state.preferences,
);

export const selectUserLoading = createSelector(selectUserGlobalState, (state) => state.loading);

export const selectUserError = createSelector(selectUserGlobalState, (state) => state.error);

export const selectUserTheme = createSelector(
  selectUserPreferences,
  (preferences) => preferences?.theme || 'light',
);

export const selectUserLanguage = createSelector(
  selectUserPreferences,
  (preferences) => preferences?.language || 'en',
);

export const selectUserNotifications = createSelector(
  selectUserPreferences,
  (preferences) => preferences?.notifications ?? true,
);
