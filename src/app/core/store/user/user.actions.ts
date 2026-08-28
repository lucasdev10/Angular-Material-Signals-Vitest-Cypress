import { createAction, props } from '@ngrx/store';
import { IUser } from '@app/features/user/models/user.model';

// Load user profile
export const userLoadProfile = createAction('[User] Load Profile', props<{ userId: string }>());

export const userLoadProfileSuccess = createAction(
  '[User] Load Profile Success',
  props<{ profile: IUser }>(),
);

export const userLoadProfileFailure = createAction(
  '[User] Load Profile Failure',
  props<{ error: string }>(),
);

// Update user profile
export const userUpdateProfile = createAction(
  '[User] Update Profile',
  props<{ profile: Partial<IUser> }>(),
);

export const userUpdateProfileSuccess = createAction(
  '[User] Update Profile Success',
  props<{ profile: IUser }>(),
);

export const userUpdateProfileFailure = createAction(
  '[User] Update Profile Failure',
  props<{ error: string }>(),
);

// Update preferences
export const userUpdatePreferences = createAction(
  '[User] Update Preferences',
  props<{ preferences: Record<string, unknown> }>(),
);

export const userUpdatePreferencesSuccess = createAction(
  '[User] Update Preferences Success',
  props<{ preferences: Record<string, unknown> }>(),
);

export const userUpdatePreferencesFailure = createAction(
  '[User] Update Preferences Failure',
  props<{ error: string }>(),
);

// Set user profile
export const userSetProfile = createAction('[User] Set Profile', props<{ profile: IUser }>());

// Clear user profile
export const userClearProfile = createAction('[User] Clear Profile');

// Clear user error
export const userClearError = createAction('[User] Clear Error');
