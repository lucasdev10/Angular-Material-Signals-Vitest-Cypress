import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartFacade } from '@app/features/cart/store';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { IProduct } from '../../models/product.model';
import { ProductFacade } from '../../store';

@Component({
  selector: 'app-product-list-page',
  imports: [ProductCardComponent, MatProgressSpinnerModule],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPageComponent implements OnInit {
  private readonly productFacade = inject(ProductFacade);
  private readonly cartFacade = inject(CartFacade);

  readonly products = this.productFacade.filteredProducts;
  readonly isLoading = this.productFacade.isLoading;
  readonly error = this.productFacade.error;

  ngOnInit(): void {
    this.productFacade.loadProducts();
  }

  onAddToCart(product: IProduct): void {
    this.cartFacade.addItem(product, 1);
  }
}
