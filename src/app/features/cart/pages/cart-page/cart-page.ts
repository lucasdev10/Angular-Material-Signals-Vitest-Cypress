import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CartService } from '@app/features/cart/services/cart';

@Component({
  selector: 'app-cart-page',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    CurrencyPipe,
  ],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CartPage {
  cartService = inject(CartService);

  deleteProduct(productId: string) {
    this.cartService.removeItemFromCart(productId);
  }

  updateItemQuantity(event: Event, productId: string) {
    const target = event.target as HTMLInputElement;
    this.cartService.updateItemQuantity(productId, Number(target.value));
  }
}
