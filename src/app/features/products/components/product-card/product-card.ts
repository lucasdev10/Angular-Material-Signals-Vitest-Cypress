import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IProduct } from '../../models/Product';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, CurrencyPipe, MatIconModule, MatButtonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  @Input() product: IProduct = {
    name: '',
    price: 0,
    description: '',
  };

  @Output() addToCart = new EventEmitter<IProduct>();

  addProductToCart() {
    this.addToCart.emit(this.product);
  }
}
