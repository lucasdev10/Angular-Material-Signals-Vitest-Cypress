import { IUser } from '@app/features/user/models/user.model';

/**
 * Global User State - Shared across all MFEs
 * This state represents the user profile and preferences shared at the Shell App level
 */
export interface IUserGlobalState {
  profile: IUser | null;
  preferences: {
    theme?: 'light' | 'dark';
    language?: string;
    notifications?: boolean;
    [key: string]: unknown;
  };
  loading: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
}

export const initialUserGlobalState: IUserGlobalState = {
  profile: null,
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: true,
  },
  loading: 'idle',
  error: null,
};
