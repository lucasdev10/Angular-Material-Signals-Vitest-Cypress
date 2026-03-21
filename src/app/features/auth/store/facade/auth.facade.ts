import { inject, Injectable } from '@angular/core';
import { StorageService } from '@app/core/storage/storage';
import { IUser } from '@app/features/user/models/user.model';
import { Store } from '@ngrx/store';
import { ILoginCredentials } from '../../models/auth.model';
import { AuthActions } from '../auth.actions';
import {
  selectError,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsLoading,
  selectToken,
  selectUser,
} from '../selectors/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);
  private readonly storage = inject(StorageService);

  readonly isLoading = this.store.selectSignal(selectIsLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly isAdmin = this.store.selectSignal(selectIsAdmin);
  readonly user = this.store.selectSignal(selectUser);
  readonly token = this.store.selectSignal(selectToken);

  constructor() {
    this.initializeAuth();
  }

  initializeAuth(): void {
    const token = this.storage.get('auth_token') as string | null;
    const user = this.storage.get('auth_user') as IUser | null;

    if (token && user) {
      this.store.dispatch(AuthActions.setAuthentication({ token, user }));
    }
  }

  login(credentials: ILoginCredentials): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
