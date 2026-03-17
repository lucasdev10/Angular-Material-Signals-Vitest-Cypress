import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EUserRole, IUser } from '../../models/user.model';
import {
  selectError,
  selectFilteredUserCount,
  selectFilteredUsers,
  selectFilters,
  selectHasError,
  selectIsLoading,
  selectLoading,
  selectSelectedUser,
  selectUserCount,
  selectUsers,
} from '../selectors/user.selectors';
import { UserActions } from '../user.actions';
import { initialUserState } from '../user.state';
import { UserFacade } from './user.facade';

describe('UserFacade', () => {
  let facade: UserFacade;
  let store: MockStore;

  const mockUsers: IUser[] = [
    {
      id: 'user-id-1',
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: EUserRole.USER,
      createdAt: 1773667531,
      updatedAt: 1773667531,
    },
    {
      id: 'user-id-2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password456',
      role: EUserRole.ADMIN,
      createdAt: 1773667531,
      updatedAt: 1773667531,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserFacade,
        provideMockStore({
          initialState: {
            user: {
              ...initialUserState,
              users: mockUsers,
              loading: 'success',
            },
          },
        }),
      ],
    });

    facade = TestBed.inject(UserFacade);
    store = TestBed.inject(MockStore);

    // Override selectors
    store.overrideSelector(selectUsers, mockUsers);
    store.overrideSelector(selectSelectedUser, null);
    store.overrideSelector(selectFilters, {});
    store.overrideSelector(selectLoading, 'success');
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectHasError, false);
    store.overrideSelector(selectFilteredUsers, mockUsers);
    store.overrideSelector(selectUserCount, mockUsers.length);
    store.overrideSelector(selectFilteredUserCount, mockUsers.length);
  });

  describe('selectors', () => {
    it('should expose users$', async () => {
      await vi.waitFor(() => {
        facade.users$.subscribe((users) => {
          expect(users).toEqual(mockUsers);
        });
      });
    });

    it('should expose selectedUser$', async () => {
      await vi.waitFor(() => {
        facade.selectedUser$.subscribe((user) => {
          expect(user).toBeNull();
        });
      });
    });

    it('should expose isLoading$', async () => {
      await vi.waitFor(() => {
        facade.isLoading$.subscribe((isLoading) => {
          expect(isLoading).toBe(false);
        });
      });
    });

    it('should expose filters$', async () => {
      await vi.waitFor(() => {
        facade.filters$.subscribe((filters) => {
          expect(filters).toEqual({});
        });
      });
    });

    it('should expose loading$', async () => {
      await vi.waitFor(() => {
        facade.loading$.subscribe((loading) => {
          expect(loading).toBe('success');
        });
      });
    });

    it('should expose error$', async () => {
      await vi.waitFor(() => {
        facade.error$.subscribe((error) => {
          expect(error).toBeNull();
        });
      });
    });

    it('should expose hasError$', async () => {
      await vi.waitFor(() => {
        facade.hasError$.subscribe((hasError) => {
          expect(hasError).toBe(false);
        });
      });
    });

    it('should expose filteredUsers$', async () => {
      await vi.waitFor(() => {
        facade.filteredUsers$.subscribe((users) => {
          expect(users).toEqual(mockUsers);
        });
      });
    });

    it('should expose userCount$', async () => {
      await vi.waitFor(() => {
        facade.userCount$.subscribe((count) => {
          expect(count).toBe(2);
        });
      });
    });

    it('should expose filteredUserCount$', async () => {
      await vi.waitFor(() => {
        facade.filteredUserCount$.subscribe((count) => {
          expect(count).toBe(2);
        });
      });
    });
  });

  describe('actions', () => {
    it('should dispatch loadUsers action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      facade.loadUsers();

      expect(dispatchSpy).toHaveBeenCalledWith(UserActions.loadUsers());
    });

    it('should dispatch loadUserById action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      facade.loadUserById(mockUsers[0].id);

      expect(dispatchSpy).toHaveBeenCalledWith(UserActions.loadUserById({ id: mockUsers[0].id }));
    });

    it('should dispatch createUser action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const dto = {
        fullName: 'New User',
        email: 'new@example.com',
        password: 'password789',
        role: EUserRole.USER,
      };

      facade.createUser(dto);

      expect(dispatchSpy).toHaveBeenCalledWith(UserActions.createUser({ dto }));
    });

    it('should dispatch updateUser action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const dto = { fullName: 'Updated Name' };

      facade.updateUser(mockUsers[0].id, dto);

      expect(dispatchSpy).toHaveBeenCalledWith(
        UserActions.updateUser({ id: mockUsers[0].id, dto }),
      );
    });

    it('should dispatch deleteUser action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      facade.deleteUser(mockUsers[0].id);

      expect(dispatchSpy).toHaveBeenCalledWith(UserActions.deleteUser({ id: mockUsers[0].id }));
    });

    it('should dispatch setFilters action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const filters = { search: 'john' };

      facade.setFilters(filters);

      expect(dispatchSpy).toHaveBeenCalledWith(UserActions.setFilters({ filters }));
    });

    it('should dispatch clearFilters action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      facade.clearFilters();

      expect(dispatchSpy).toHaveBeenCalledWith(UserActions.clearFilters());
    });

    it('should dispatch clearError action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      facade.clearError();

      expect(dispatchSpy).toHaveBeenCalledWith(UserActions.clearError());
    });
  });

  describe('integration', () => {
    it('should update loading when selectors change', async () => {
      let currentValue: boolean | undefined;
      const subscription = facade.isLoading$.subscribe((isLoading) => {
        currentValue = isLoading;
      });

      await vi.waitFor(() => {
        expect(currentValue).toBe(false);
      });

      store.overrideSelector(selectIsLoading, true);
      store.overrideSelector(selectLoading, 'loading');
      store.refreshState();

      await vi.waitFor(() => {
        expect(currentValue).toBe(true);
      });

      subscription.unsubscribe();
    });
  });
});
