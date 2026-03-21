import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ProductRepository } from '../../repositories/product.repository';
import { ProductActions } from '../product.actions';

@Injectable()
export class ProductEffects {
  private readonly actions$ = inject(Actions);
  private readonly repository = inject(ProductRepository);
  private readonly router = inject(Router);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.repository.findAll().pipe(
          map((products) => ProductActions.loadProductsSuccess({ products })),
          catchError((error) =>
            of(
              ProductActions.loadProductsError({
                error: error.message || 'Failed to load products',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadProductById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductById),
      switchMap(({ id }) =>
        this.repository.findById(id).pipe(
          map((product) => ProductActions.loadProductByIdSuccess({ product })),
          catchError((error) =>
            of(
              ProductActions.loadProductByIdError({
                error: error.message || 'Failed to load product by id',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      switchMap(({ product }) =>
        this.repository.create(product).pipe(
          map((newProduct) => {
            this.router.navigateByUrl('/admin/products');
            return ProductActions.createProductSuccess({ product: newProduct });
          }),
          catchError((error) =>
            of(
              ProductActions.createProductError({
                error: error.message || 'Failed to create product',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      switchMap(({ id, product }) =>
        this.repository.update(id, product).pipe(
          map((newProduct) => {
            this.router.navigateByUrl('/admin/products');
            return ProductActions.updateProductSuccess({ product: newProduct });
          }),
          catchError((error) =>
            of(
              ProductActions.updateProductError({
                error: error.message || 'Failed to update product',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap(({ id }) =>
        this.repository.delete(id).pipe(
          map(() => ProductActions.deleteProductSuccess({ id })),
          catchError((error) =>
            of(
              ProductActions.deleteProductError({
                error: error.message || 'Failed to delete product',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
