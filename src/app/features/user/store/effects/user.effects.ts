import { inject, Injectable } from '@angular/core';
import { AuthFacade } from '@app/features/auth/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserRepository } from '../../repositories/user.repository';
import { UserActions } from '../user.actions';

/**
 * Effects da feature de usuários
 * Gerencia side effects (chamadas HTTP, etc)
 */
@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly repository = inject(UserRepository);
  private readonly authFacade = inject(AuthFacade);

  /**
   * Effect: Load Users
   */
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this.repository.findAll().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(UserActions.loadUsersFailure({ error: error.message || 'Failed to load users' })),
          ),
        ),
      ),
    ),
  );

  /**
   * Effect: Load User By Id
   */
  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserById),
      switchMap(({ id }) =>
        this.repository.findById(id).pipe(
          map((user) => UserActions.loadUserByIdSuccess({ user })),
          catchError((error) =>
            of(UserActions.loadUserByIdFailure({ error: error.message || 'Failed to load user' })),
          ),
        ),
      ),
    ),
  );

  /**
   * Effect: Create User
   */
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      switchMap(({ dto }) =>
        this.repository.create(dto).pipe(
          map((user) => {
            this.authFacade.login({ email: user.email, password: dto.password });
            return UserActions.createUserSuccess({ user });
          }),
          catchError((error) =>
            of(UserActions.createUserFailure({ error: error.message || 'Failed to create user' })),
          ),
        ),
      ),
    ),
  );

  /**
   * Effect: Update User
   */
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({ id, dto }) =>
        this.repository.update(id, dto).pipe(
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.updateUserFailure({ error: error.message || 'Failed to update user' })),
          ),
        ),
      ),
    ),
  );

  /**
   * Effect: Delete User
   */
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      switchMap(({ id }) =>
        this.repository.delete(id).pipe(
          map(() => UserActions.deleteUserSuccess({ id })),
          catchError((error) =>
            of(UserActions.deleteUserFailure({ error: error.message || 'Failed to delete user' })),
          ),
        ),
      ),
    ),
  );
}
