import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CartService } from '@app/features/cart/services/cart';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { IProduct } from '../../models/Product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
  standalone: true,
})
export class ProductListPageComponent {
  productsService = inject(ProductService);
  cartService = inject(CartService);
  products: WritableSignal<IProduct[]> = signal([]);

  constructor() {
    this.products.set(this.productsService.getProducts());
  }

  addProductToCart(product: IProduct) {
    this.cartService.addItemToCart(product);
  }
}
