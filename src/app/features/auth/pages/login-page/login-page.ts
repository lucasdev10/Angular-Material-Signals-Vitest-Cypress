import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormError } from '@app/shared';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormError,
    FormField,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoginPageComponent {
  private readonly authStore = inject(AuthStore);

  readonly isLoading = this.authStore.isLoading;
  readonly error = this.authStore.error;
  readonly hidePassword = signal(true);

  readonly loginForm = form(
    signal({
      email: '',
      password: '',
    }),
    (fieldPath) => {
      required(fieldPath.email, { message: 'Campo obrigatório' });
      email(fieldPath.email, { message: 'Email inválido' });
      required(fieldPath.password, { message: 'Campo obrigatório' });
      minLength(fieldPath.password, 6, { message: 'Mínimo de 6 caracteres' });
    },
  );

  readonly canSubmit = computed(() => this.loginForm().valid() && !this.isLoading());

  onSubmit(): void {
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }

    const credentials = this.loginForm().value();
    this.authStore.login(credentials);
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
  }
}
