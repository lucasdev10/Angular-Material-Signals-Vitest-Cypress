import { createAction, props } from '@ngrx/store';
import { IUser } from '@app/features/user/models/user.model';

// Login actions
export const authLogin = createAction('[Auth] Login', props<{ email: string; password: string }>());

export const authLoginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string; refreshToken: string; user: IUser }>(),
);

export const authLoginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

// Logout actions
export const authLogout = createAction('[Auth] Logout');

export const authLogoutSuccess = createAction('[Auth] Logout Success');

// Register actions
export const authRegister = createAction(
  '[Auth] Register',
  props<{ email: string; password: string; name: string }>(),
);

export const authRegisterSuccess = createAction(
  '[Auth] Register Success',
  props<{ token: string; refreshToken: string; user: IUser }>(),
);

export const authRegisterFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>(),
);

// Token refresh
export const authRefreshToken = createAction('[Auth] Refresh Token');

export const authRefreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ token: string; refreshToken: string }>(),
);

export const authRefreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>(),
);

// Load auth state from storage
export const authLoadFromStorage = createAction('[Auth] Load From Storage');

export const authLoadFromStorageSuccess = createAction(
  '[Auth] Load From Storage Success',
  props<{ token: string | null; refreshToken: string | null; user: IUser | null }>(),
);

// Set authenticated user
export const authSetUser = createAction('[Auth] Set User', props<{ user: IUser }>());

// Clear auth error
export const authClearError = createAction('[Auth] Clear Error');
