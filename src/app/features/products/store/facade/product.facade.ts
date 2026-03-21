import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ICreateProductDto, IProductFilters, IUpdateProductDto } from '../../models/product.model';
import { ProductActions } from '../product.actions';
import {
  selectError,
  selectFilteredProducts,
  selectIsLoading,
  selectLowStockProducts,
  selectProducts,
  selectSelectedProduct,
  selectTotalProducts,
  selectTotalValue,
} from '../selectors/product.selectors';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  private readonly store = inject(Store);

  readonly products = this.store.selectSignal(selectProducts);
  readonly filteredProducts = this.store.selectSignal(selectFilteredProducts);
  readonly isLoading = this.store.selectSignal(selectIsLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly selectedProduct = this.store.selectSignal(selectSelectedProduct);
  readonly totalProducts = this.store.selectSignal(selectTotalProducts);
  readonly totalValue = this.store.selectSignal(selectTotalValue);
  readonly lowStockProducts = this.store.selectSignal(selectLowStockProducts);

  loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  loadProductById(id: string): void {
    this.store.dispatch(ProductActions.loadProductById({ id }));
  }

  createProduct(product: ICreateProductDto): void {
    this.store.dispatch(ProductActions.createProduct({ product }));
  }

  updateProduct(id: string, product: IUpdateProductDto): void {
    this.store.dispatch(ProductActions.updateProduct({ id, product }));
  }

  deleteProduct(id: string): void {
    this.store.dispatch(ProductActions.deleteProduct({ id }));
  }

  setFilters(filters: IProductFilters): void {
    this.store.dispatch(ProductActions.setProductFilters({ filters }));
  }
}
