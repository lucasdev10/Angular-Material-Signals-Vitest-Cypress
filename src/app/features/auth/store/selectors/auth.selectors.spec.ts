import { EUserRole, IUser } from '@app/features/user/models/user.model';
import { IAuthState } from '../auth.state';
import {
  selectError,
  selectInitialAuthState,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsLoading,
  selectToken,
  selectUser,
} from './auth.selectors';

describe('AuthSelectors', () => {
  const mockUser: IUser = {
    id: 'user-id-1',
    email: 'admin@admin.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: EUserRole.ADMIN,
    createdAt: 1774040195,
    updatedAt: 1774040195,
  };

  const createMockState = (overrides: Partial<IAuthState> = {}): { auth: IAuthState } => ({
    auth: {
      user: mockUser,
      token: 'user-token',
      refreshToken: 'user-refresh-token',
      loading: 'success',
      error: null,
      ...overrides,
    },
  });

  describe('selectInitialAuthState', () => {
    it('should select initial auth state select', () => {
      const state = createMockState();
      const result = selectInitialAuthState.projector(state.auth);
      expect(result).toEqual(state.auth);
    });
  });

  describe('selectUser', () => {
    it('should select user', () => {
      const state = createMockState();
      const result = selectUser.projector(state.auth);
      expect(result).toEqual(mockUser);
    });
  });

  describe('selectIsLoading', () => {
    it('should select is loading', () => {
      const state = createMockState();
      const result = selectIsLoading.projector(state.auth);
      expect(result).toBe(false);
    });
  });

  describe('selectError', () => {
    it('should select error', () => {
      const state = createMockState();
      const result = selectError.projector(state.auth);
      expect(result).toBeNull();
    });
  });

  describe('selectIsAdmin', () => {
    it('should select is admin', () => {
      const state = createMockState();
      const result = selectIsAdmin.projector(state.auth);
      expect(result).toBe(true);
    });
  });

  describe('selectIsAuthenticated', () => {
    it('should select is authenticated', () => {
      const state = createMockState();
      const result = selectIsAuthenticated.projector(state.auth);
      expect(result).toBe(true);
    });
  });

  describe('selectToken', () => {
    it('should select token', () => {
      const state = createMockState();
      const result = selectToken.projector(state.auth);
      expect(result).toBe('user-token');
    });
  });
});
