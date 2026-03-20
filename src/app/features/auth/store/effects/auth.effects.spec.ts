import { TestBed } from '@angular/core/testing';
import { EUserRole } from '@app/features/user/models/user.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { IAuthResponse } from '../../models/auth.model';
import { AuthRepository } from '../../repositories/auth.repository';
import { AuthActions } from '../auth.actions';
import { AuthEffects } from './auth.effects';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let repository: AuthRepository;
  let effects: AuthEffects;

  let authResponse: IAuthResponse = {
    token: 'token',
    refreshToken: 'refreshToken',
    user: {
      id: 'user-id-1',
      email: 'admin@admin.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: EUserRole.ADMIN,
      createdAt: 1774046403,
      updatedAt: 1774046403,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthEffects, provideMockActions(() => actions$), AuthRepository],
    });

    repository = TestBed.inject(AuthRepository);
    effects = TestBed.inject(AuthEffects);
  });

  describe('login$', () => {
    it('should return loginSuccess on success', async () => {
      vi.spyOn(repository, 'login').mockReturnValue(of(authResponse));
      actions$ = of(
        AuthActions.login({ credentials: { email: 'admin@admin.com', password: 'admin123' } }),
      );

      await vi.waitFor(() => {
        effects.login$.subscribe((action) => {
          expect(action).toEqual(AuthActions.loginSuccess({ auth: authResponse }));
          expect(repository.login).toHaveBeenCalled();
        });
      });
    });

    it('should return loginError on error', async () => {
      const error = new Error('Failed to login');
      vi.spyOn(repository, 'login').mockReturnValue(throwError(() => error));
      actions$ = of(
        AuthActions.login({ credentials: { email: 'admin@admin.com', password: 'admin123' } }),
      );

      await vi.waitFor(() => {
        effects.login$.subscribe((action) => {
          expect(action).toEqual(AuthActions.loginError({ error: error.message }));
          expect(repository.login).toHaveBeenCalled();
        });
      });
    });
  });

  describe('logout$', () => {
    it('should return logoutSuccess on success', async () => {
      vi.spyOn(repository, 'logout').mockReturnValue(of(void 0));
      actions$ = of(AuthActions.logout());

      await vi.waitFor(() => {
        effects.logout$.subscribe((action) => {
          expect(action).toEqual(AuthActions.logoutSuccess());
          expect(repository.logout).toHaveBeenCalled();
        });
      });
    });

    it('should return logoutError on error', async () => {
      const error = new Error('Failed to logout');
      vi.spyOn(repository, 'logout').mockReturnValue(throwError(() => error));
      actions$ = of(AuthActions.logout());

      await vi.waitFor(() => {
        effects.logout$.subscribe((action) => {
          expect(action).toEqual(AuthActions.logoutError());
          expect(repository.logout).toHaveBeenCalled();
        });
      });
    });
  });
});
