import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { EUserRole, IUser } from '../../models/user.model';
import { UserRepository } from '../../repositories/user.repository';
import { UserActions } from '../user.actions';
import { UserEffects } from './user.effects';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;
  let repository: UserRepository;

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
        UserEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        UserRepository,
      ],
    });

    effects = TestBed.inject(UserEffects);
    repository = TestBed.inject(UserRepository);
  });

  describe('loadUsers$', () => {
    it('should return loadUsersSuccess on success', async () => {
      vi.spyOn(repository, 'findAll').mockReturnValue(of(mockUsers));
      actions$ = of(UserActions.loadUsers());

      await vi.waitFor(() => {
        effects.loadUsers$.subscribe((action) => {
          expect(action).toEqual(UserActions.loadUsersSuccess({ users: mockUsers }));
          expect(repository.findAll).toHaveBeenCalled();
        });
      });
    });

    it('should return loadUsersFailure on error', async () => {
      const error = new Error('Failed to load users');
      vi.spyOn(repository, 'findAll').mockReturnValue(throwError(() => error));
      actions$ = of(UserActions.loadUsers());

      await vi.waitFor(() => {
        effects.loadUsers$.subscribe((action) => {
          expect(action).toEqual(UserActions.loadUsersFailure({ error: error.message }));
        });
      });
    });
  });

  describe('loadUserById$', () => {
    it('should return loadUserByIdSuccess on success', async () => {
      vi.spyOn(repository, 'findById').mockReturnValue(of(mockUsers[0]));
      actions$ = of(UserActions.loadUserById({ id: mockUsers[0].id }));

      await vi.waitFor(() => {
        effects.loadUserById$.subscribe((action) => {
          expect(action).toEqual(UserActions.loadUserByIdSuccess({ user: mockUsers[0] }));
          expect(repository.findById).toHaveBeenCalledWith(mockUsers[0].id);
        });
      });
    });

    it('should return loadUserByIdFailure on error', async () => {
      const error = new Error('User not found');
      vi.spyOn(repository, 'findById').mockReturnValue(throwError(() => error));
      actions$ = of(UserActions.loadUserById({ id: 'invalid-id' }));

      await vi.waitFor(() => {
        effects.loadUserById$.subscribe((action) => {
          expect(action).toEqual(UserActions.loadUserByIdFailure({ error: error.message }));
        });
      });
    });
  });

  describe('createUser$', () => {
    it('should return createUserSuccess on success', async () => {
      const dto = {
        fullName: 'New User',
        email: 'new@example.com',
        password: 'password',
        role: EUserRole.USER,
      };
      const newUser: IUser = {
        ...dto,
        id: 'new-id',
        createdAt: 1773667531,
        updatedAt: 1773667531,
      };

      vi.spyOn(repository, 'create').mockReturnValue(of(newUser));
      actions$ = of(UserActions.createUser({ dto }));

      await vi.waitFor(() => {
        effects.createUser$.subscribe((action) => {
          expect(action).toEqual(UserActions.createUserSuccess({ user: newUser }));
          expect(repository.create).toHaveBeenCalledWith(dto);
        });
      });
    });

    it('should return createUserFailure on error', async () => {
      const dto = {
        fullName: 'New User',
        email: 'new@example.com',
        password: 'password',
        role: EUserRole.USER,
      };
      const error = new Error('Failed to create user');
      vi.spyOn(repository, 'create').mockReturnValue(throwError(() => error));
      actions$ = of(UserActions.createUser({ dto }));

      await vi.waitFor(() => {
        effects.createUser$.subscribe((action) => {
          expect(action).toEqual(UserActions.createUserFailure({ error: error.message }));
        });
      });
    });
  });

  describe('updateUser$', () => {
    it('should return updateUserSuccess on success', async () => {
      const dto = { fullName: 'Updated Name' };
      const updatedUser = { ...mockUsers[0], ...dto };

      vi.spyOn(repository, 'update').mockReturnValue(of(updatedUser));
      actions$ = of(UserActions.updateUser({ id: mockUsers[0].id, dto }));

      await vi.waitFor(() => {
        effects.updateUser$.subscribe((action) => {
          expect(action).toEqual(UserActions.updateUserSuccess({ user: updatedUser }));
          expect(repository.update).toHaveBeenCalledWith(mockUsers[0].id, dto);
        });
      });
    });

    it('should return updateUserFailure on error', async () => {
      const dto = { fullName: 'Updated Name' };
      const error = new Error('Failed to update user');
      vi.spyOn(repository, 'update').mockReturnValue(throwError(() => error));
      actions$ = of(UserActions.updateUser({ id: mockUsers[0].id, dto }));

      await vi.waitFor(() => {
        effects.updateUser$.subscribe((action) => {
          expect(action).toEqual(UserActions.updateUserFailure({ error: error.message }));
        });
      });
    });
  });

  describe('deleteUser$', () => {
    it('should return deleteUserSuccess on success', async () => {
      vi.spyOn(repository, 'delete').mockReturnValue(of(void 0));
      actions$ = of(UserActions.deleteUser({ id: mockUsers[0].id }));

      await vi.waitFor(() => {
        effects.deleteUser$.subscribe((action) => {
          expect(action).toEqual(UserActions.deleteUserSuccess({ id: mockUsers[0].id }));
          expect(repository.delete).toHaveBeenCalledWith(mockUsers[0].id);
        });
      });
    });

    it('should return deleteUserFailure on error', async () => {
      const error = new Error('Failed to delete user');
      vi.spyOn(repository, 'delete').mockReturnValue(throwError(() => error));
      actions$ = of(UserActions.deleteUser({ id: mockUsers[0].id }));

      await vi.waitFor(() => {
        effects.deleteUser$.subscribe((action) => {
          expect(action).toEqual(UserActions.deleteUserFailure({ error: error.message }));
        });
      });
    });
  });
});
