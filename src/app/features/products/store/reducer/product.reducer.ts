import { createReducer, on } from '@ngrx/store';
import { ProductActions } from '../product.actions';
import { initialProductState } from '../product.state';

export const productReducer = createReducer(
  initialProductState,
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: 'success' as const,
  })),
  on(ProductActions.loadProductsError, (state, { error }) => ({
    ...state,
    loading: 'error',
    error,
  })),
  on(ProductActions.loadProductById, (state) => ({
    ...state,
    selectedProduct: null,
    loading: 'loading' as const,
    error: null,
  })),
  on(ProductActions.loadProductByIdSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loading: 'success' as const,
  })),
  on(ProductActions.loadProductByIdError, (state, { error }) => ({
    ...state,
    loading: 'error',
    error,
  })),
  on(ProductActions.createProduct, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(ProductActions.createProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    loading: 'success' as const,
  })),
  on(ProductActions.createProductError, (state, { error }) => ({
    ...state,
    loading: 'error',
    error,
  })),
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p.id === product.id ? product : p)),
    selectedProduct: state.selectedProduct?.id === product.id ? product : state.selectedProduct,
    loading: 'success' as const,
  })),
  on(ProductActions.updateProductError, (state, { error }) => ({
    ...state,
    loading: 'error',
    error,
  })),
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter((p) => p.id !== id),
    selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
    loading: 'success' as const,
  })),
  on(ProductActions.deleteProductError, (state, { error }) => ({
    ...state,
    loading: 'error',
    error,
  })),
  on(ProductActions.setProductFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),
  on(ProductActions.cleanProductFilters, (state) => ({
    ...state,
    filters: {},
  })),
);
