import { IUser } from '@app/features/user/models/user.model';

/**
 * Global Auth State - Shared across all MFEs
 * This state represents the authentication status shared at the Shell App level
 */
export interface IAuthGlobalState {
  token: string | null;
  refreshToken: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  loading: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
}

export const initialAuthGlobalState: IAuthGlobalState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  loading: 'idle',
  error: null,
};
