import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ICreateUserDto, IUpdateUserDto, IUserFilters } from '../../models/user.model';
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

/**
 * Facade para a User Store
 *
 * Encapsula a complexidade do NgRx Store, fornecendo uma API simplificada
 * para os componentes. Reduz boilerplate e facilita testes.
 *
 * Padrão recomendado quando há muitas chamadas de select/dispatch.
 *
 * @see https://ngrx.io/guide/data/facade
 */
@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  private readonly store = inject(Store);

  readonly users = this.store.selectSignal(selectUsers);
  readonly selectedUser = this.store.selectSignal(selectSelectedUser);
  readonly filters = this.store.selectSignal(selectFilters);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly isLoading = this.store.selectSignal(selectIsLoading);
  readonly hasError = this.store.selectSignal(selectHasError);
  readonly filteredUsers = this.store.selectSignal(selectFilteredUsers);
  readonly userCount = this.store.selectSignal(selectUserCount);
  readonly filteredUserCount = this.store.selectSignal(selectFilteredUserCount);

  /**
   * Carrega todos os usuários
   */
  loadUsers(): void {
    this.store.dispatch(UserActions.loadUsers());
  }

  /**
   * Carrega um usuário específico por ID
   */
  loadUserById(id: string): void {
    this.store.dispatch(UserActions.loadUserById({ id }));
  }

  /**
   * Cria um novo usuário
   */
  createUser(dto: ICreateUserDto): void {
    this.store.dispatch(UserActions.createUser({ dto }));
  }

  /**
   * Atualiza um usuário existente
   */
  updateUser(id: string, dto: IUpdateUserDto): void {
    this.store.dispatch(UserActions.updateUser({ id, dto }));
  }

  /**
   * Remove um usuário
   */
  deleteUser(id: string): void {
    this.store.dispatch(UserActions.deleteUser({ id }));
  }

  /**
   * Define filtros de busca
   */
  setFilters(filters: IUserFilters): void {
    this.store.dispatch(UserActions.setFilters({ filters }));
  }

  /**
   * Limpa todos os filtros
   */
  clearFilters(): void {
    this.store.dispatch(UserActions.clearFilters());
  }

  /**
   * Limpa o erro atual
   */
  clearError(): void {
    this.store.dispatch(UserActions.clearError());
  }
}
