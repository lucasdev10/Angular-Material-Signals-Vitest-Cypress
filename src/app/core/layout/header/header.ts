import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '@app/features/auth/store';
import { CartFacade } from '@app/features/cart/store';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly cartFacade = inject(CartFacade);
  private readonly authFacade = inject(AuthFacade);

  readonly cartItemCount = this.cartFacade.itemCount;
  readonly isAuthenticated = this.authFacade.isAuthenticated;
  readonly isAdmin = this.authFacade.isAdmin;
  readonly user = this.authFacade.user;

  onLogout(): void {
    this.authFacade.logout();
  }
}
