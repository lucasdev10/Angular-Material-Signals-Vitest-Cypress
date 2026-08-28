import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { initialUserGlobalState } from './user.state';

export const userGlobalReducer = createReducer(
  initialUserGlobalState,
  on(UserActions.userLoadProfile, (state) => ({
    ...state,
    loading: 'pending' as const,
  })),
  on(UserActions.userLoadProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: 'success' as const,
    error: null,
  })),
  on(UserActions.userLoadProfileFailure, (state, { error }) => ({
    ...state,
    profile: null,
    loading: 'error' as const,
    error,
  })),
  on(UserActions.userUpdateProfile, (state) => ({
    ...state,
    loading: 'pending' as const,
  })),
  on(UserActions.userUpdateProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: 'success' as const,
    error: null,
  })),
  on(UserActions.userUpdateProfileFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),
  on(UserActions.userUpdatePreferences, (state) => ({
    ...state,
    loading: 'pending' as const,
  })),
  on(UserActions.userUpdatePreferencesSuccess, (state, { preferences }) => ({
    ...state,
    preferences: { ...state.preferences, ...preferences },
    loading: 'success' as const,
    error: null,
  })),
  on(UserActions.userUpdatePreferencesFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),
  on(UserActions.userSetProfile, (state, { profile }) => ({
    ...state,
    profile,
  })),
  on(UserActions.userClearProfile, (state) => ({
    ...state,
    profile: null,
    preferences: initialUserGlobalState.preferences,
  })),
  on(UserActions.userClearError, (state) => ({
    ...state,
    error: null,
  })),
);
