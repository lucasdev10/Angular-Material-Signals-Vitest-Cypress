import { EUserRole } from '@app/features/user/models/user.model';
import * as UserActions from './user.actions';
import { userGlobalReducer } from './user.reducer';
import { initialUserGlobalState } from './user.state';

describe('UserGlobalReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = userGlobalReducer(initialUserGlobalState, action as any);

      expect(state).toEqual(initialUserGlobalState);
    });
  });

  describe('LoadProfile', () => {
    it('should set loading to pending on load profile', () => {
      const action = UserActions.userLoadProfile({ userId: 'user-id' });
      const state = userGlobalReducer(initialUserGlobalState, action);

      expect(state.loading).toBe('pending');
    });

    it('should set profile on load profile success', () => {
      const user = {
        id: 'user-id',
        email: 'test@test.com',
        fullName: 'Test User',
        role: EUserRole.USER,
        createdAt: 1774041882,
        updatedAt: 1774041882,
      };
      const action = UserActions.userLoadProfileSuccess({ profile: user });
      const state = userGlobalReducer(initialUserGlobalState, action);

      expect(state.loading).toBe('success');
      expect(state.profile).toEqual(user);
      expect(state.error).toBe(null);
    });

    it('should set error on load profile failure', () => {
      const error = 'User not found';
      const action = UserActions.userLoadProfileFailure({ error });
      const state = userGlobalReducer(initialUserGlobalState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
      expect(state.profile).toBe(null);
    });
  });

  describe('UpdateProfile', () => {
    it('should set loading to pending on update profile', () => {
      const action = UserActions.userUpdateProfile({
        profile: { fullName: 'Updated Name' },
      });
      const state = userGlobalReducer(initialUserGlobalState, action);

      expect(state.loading).toBe('pending');
    });

    it('should update profile on update profile success', () => {
      const initialProfile = {
        id: 'user-id',
        email: 'test@test.com',
        fullName: 'Test User',
        role: EUserRole.USER,
        createdAt: 1774041882,
        updatedAt: 1774041882,
      };
      const stateWithProfile = {
        ...initialUserGlobalState,
        profile: initialProfile,
      };
      const updatedUser = {
        ...initialProfile,
        fullName: 'Updated User',
        updatedAt: 1774041900,
      };
      const action = UserActions.userUpdateProfileSuccess({ profile: updatedUser });
      const state = userGlobalReducer(stateWithProfile, action);

      expect(state.loading).toBe('success');
      expect(state.profile?.fullName).toBe('Updated User');
      expect(state.error).toBe(null);
    });

    it('should set error on update profile failure', () => {
      const error = 'Failed to update profile';
      const action = UserActions.userUpdateProfileFailure({ error });
      const state = userGlobalReducer(initialUserGlobalState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('UpdatePreferences', () => {
    it('should set loading to pending on update preferences', () => {
      const action = UserActions.userUpdatePreferences({
        preferences: { theme: 'dark' },
      });
      const state = userGlobalReducer(initialUserGlobalState, action);

      expect(state.loading).toBe('pending');
    });

    it('should update preferences on success', () => {
      const action = UserActions.userUpdatePreferencesSuccess({
        preferences: { theme: 'dark', language: 'pt' },
      });
      const state = userGlobalReducer(initialUserGlobalState, action);

      expect(state.loading).toBe('success');
      expect(state.preferences.theme).toBe('dark');
      expect(state.preferences.language).toBe('pt');
      expect(state.error).toBe(null);
    });

    it('should merge new preferences with existing ones', () => {
      const stateWithPrefs = {
        ...initialUserGlobalState,
        preferences: {
          theme: 'light' as const,
          language: 'en',
          notifications: true,
        },
      };
      const action = UserActions.userUpdatePreferencesSuccess({
        preferences: { theme: 'dark' },
      });
      const state = userGlobalReducer(stateWithPrefs, action);

      expect(state.preferences.theme).toBe('dark');
      expect(state.preferences.language).toBe('en');
      expect(state.preferences.notifications).toBe(true);
    });

    it('should set error on update preferences failure', () => {
      const error = 'Failed to update preferences';
      const action = UserActions.userUpdatePreferencesFailure({ error });
      const state = userGlobalReducer(initialUserGlobalState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('SetProfile', () => {
    it('should set the user profile', () => {
      const user = {
        id: 'user-id',
        email: 'test@test.com',
        fullName: 'Test User',
        role: EUserRole.USER,
        createdAt: 1774041882,
        updatedAt: 1774041882,
      };
      const action = UserActions.userSetProfile({ profile: user });
      const state = userGlobalReducer(initialUserGlobalState, action);

      expect(state.profile).toEqual(user);
    });
  });

  describe('ClearProfile', () => {
    it('should clear profile and reset preferences', () => {
      const stateWithProfile = {
        ...initialUserGlobalState,
        profile: {
          id: 'user-id',
          email: 'test@test.com',
          fullName: 'Test User',
          role: EUserRole.USER,
          createdAt: 1774041882,
          updatedAt: 1774041882,
        },
        preferences: { theme: 'dark' as const, language: 'pt' },
      };
      const action = UserActions.userClearProfile();
      const state = userGlobalReducer(stateWithProfile, action);

      expect(state.profile).toBe(null);
      expect(state.preferences).toEqual(initialUserGlobalState.preferences);
    });
  });

  describe('ClearError', () => {
    it('should clear error message', () => {
      const stateWithError = {
        ...initialUserGlobalState,
        error: 'Some error occurred',
        loading: 'error' as const,
      };
      const action = UserActions.userClearError();
      const state = userGlobalReducer(stateWithError, action);

      expect(state.error).toBe(null);
    });
  });
});
