import { inject, Injectable } from '@angular/core';
import { StorageService } from '@app/core/storage/storage';
import { IUser } from '@app/features/user/models/user.model';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
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

  readonly isLoading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectError);
  readonly isAuthenticated$ = this.store.select(selectIsAuthenticated);
  readonly isAdmin$ = this.store.select(selectIsAdmin);
  readonly user$ = this.store.select(selectUser);
  readonly token$ = this.store.select(selectToken);

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

  async isAuthenticated(): Promise<boolean> {
    return (await firstValueFrom(this.isAuthenticated$)) as boolean;
  }

  async isAdmin(): Promise<boolean> {
    return (await firstValueFrom(this.isAdmin$)) as boolean;
  }

  async user(): Promise<IUser> {
    return (await firstValueFrom(this.user$)) as IUser;
  }

  async token(): Promise<string> {
    return (await firstValueFrom(this.token$)) as string;
  }

  async error(): Promise<string> {
    return (await firstValueFrom(this.error$)) as string;
  }

  async isLoading(): Promise<boolean> {
    return (await firstValueFrom(this.isLoading$)) as boolean;
  }
}
