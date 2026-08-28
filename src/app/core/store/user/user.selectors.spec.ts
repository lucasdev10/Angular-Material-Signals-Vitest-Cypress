import { EUserRole } from '@app/features/user/models/user.model';
import {
  selectUserGlobalState,
  selectUserProfile,
  selectUserPreferences,
  selectUserLoading,
  selectUserError,
  selectUserTheme,
  selectUserLanguage,
  selectUserNotifications,
} from './user.selectors';
import { IUserGlobalState, initialUserGlobalState } from './user.state';

describe('User Selectors', () => {
  const mockUser = {
    id: 'user-id',
    email: 'test@test.com',
    fullName: 'Test User',
    role: EUserRole.USER,
    createdAt: 1774041882,
    updatedAt: 1774041882,
  };

  const mockState: { userGlobal: IUserGlobalState } = {
    userGlobal: {
      profile: mockUser,
      preferences: {
        theme: 'dark',
        language: 'pt',
        notifications: false,
      },
      loading: 'idle',
      error: null,
    },
  };

  it('should select user global state', () => {
    const result = selectUserGlobalState(mockState);
    expect(result).toEqual(mockState.userGlobal);
  });

  it('should select user profile', () => {
    const result = selectUserProfile(mockState);
    expect(result).toEqual(mockUser);
  });

  it('should select user preferences', () => {
    const result = selectUserPreferences(mockState);
    expect(result).toEqual({ theme: 'dark', language: 'pt', notifications: false });
  });

  it('should select user loading', () => {
    const result = selectUserLoading(mockState);
    expect(result).toBe('idle');
  });

  it('should select user error', () => {
    const errorState = { userGlobal: { ...mockState.userGlobal, error: 'Test error' } };
    const result = selectUserError(errorState);
    expect(result).toBe('Test error');
  });

  it('should select user theme', () => {
    const result = selectUserTheme(mockState);
    expect(result).toBe('dark');
  });

  it('should select default theme when not set', () => {
    const stateWithoutTheme = {
      userGlobal: { ...mockState.userGlobal, preferences: {} },
    };
    const result = selectUserTheme(stateWithoutTheme);
    expect(result).toBe('light');
  });

  it('should select user language', () => {
    const result = selectUserLanguage(mockState);
    expect(result).toBe('pt');
  });

  it('should select default language when not set', () => {
    const stateWithoutLanguage = {
      userGlobal: { ...mockState.userGlobal, preferences: {} },
    };
    const result = selectUserLanguage(stateWithoutLanguage);
    expect(result).toBe('en');
  });

  it('should select user notifications', () => {
    const result = selectUserNotifications(mockState);
    expect(result).toBe(false);
  });

  it('should select default notifications when not set', () => {
    const stateWithoutNotifications = {
      userGlobal: { ...mockState.userGlobal, preferences: {} },
    };
    const result = selectUserNotifications(stateWithoutNotifications);
    expect(result).toBe(true);
  });
});
