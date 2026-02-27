import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICreateProductDto } from '@app/features/products/models/product.model';
import { IProduct, IProductFilters } from '../models/product.model';
import { ProductRepository } from '../repositories/product.repository';

/**
 * Estado de loading
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Estado da store de produtos
 */
interface IProductState {
  products: IProduct[];
  selectedProduct: IProduct | null;
  filters: IProductFilters;
  loading: LoadingState;
  error: string | null;
}

/**
 * Store de produtos usando Signals
 * Gerencia estado global dos produtos de forma reativa
 * Preparado para migração futura para NgRx
 */
@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly repository = inject(ProductRepository);
  private readonly destroyRef = inject(DestroyRef);

  // Estado privado (writable signals)
  private readonly state = signal<IProductState>({
    products: [],
    selectedProduct: null,
    filters: {},
    loading: 'idle',
    error: null,
  });

  // Selectores públicos (readonly computed signals)
  readonly products = computed(() => this.state().products);
  readonly selectedProduct = computed(() => this.state().selectedProduct);
  readonly filters = computed(() => this.state().filters);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly isLoading = computed(() => this.state().loading === 'loading');
  readonly hasError = computed(() => this.state().error !== null);

  // Computed: produtos filtrados
  readonly filteredProducts = computed(() => {
    const products = this.products();
    const filters = this.filters();

    return products.filter((product) => {
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchLower);
        const matchesDescription = product.description.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesDescription) {
          return false;
        }
      }

      if (filters.inStock && product.stock <= 0) {
        return false;
      }

      return true;
    });
  });

  // Computed: contagem de produtos
  readonly productCount = computed(() => this.products().length);
  readonly filteredProductCount = computed(() => this.filteredProducts().length);

  // Computed: categorias únicas
  readonly categories = computed(() => {
    const products = this.products();
    return [...new Set(products.map((p) => p.category))].sort();
  });

  constructor() {
    // Auto-carrega produtos na inicialização
    this.loadProducts();
  }

  /**
   * Actions - Métodos que modificam o estado
   */

  loadProducts(): void {
    this.setLoading('loading');

    this.repository
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.state.update((state) => ({
            ...state,
            products,
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to load products',
          }));
        },
      });
  }

  loadProductById(id: string): void {
    this.setLoading('loading');

    this.repository
      .findById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.state.update((state) => ({
            ...state,
            selectedProduct: product,
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to load product',
          }));
        },
      });
  }

  createProduct(dto: ICreateProductDto): void {
    this.setLoading('loading');

    this.repository
      .create(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.state.update((state) => ({
            ...state,
            products: [...state.products, product],
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to create product',
          }));
        },
      });
  }

  updateProduct(id: string, dto: Partial<IProduct>): void {
    this.setLoading('loading');

    this.repository
      .update(id, dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedProduct) => {
          this.state.update((state) => ({
            ...state,
            products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
            selectedProduct:
              state.selectedProduct?.id === id ? updatedProduct : state.selectedProduct,
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to update product',
          }));
        },
      });
  }

  deleteProduct(id: string): void {
    this.setLoading('loading');

    this.repository
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.update((state) => ({
            ...state,
            products: state.products.filter((p) => p.id !== id),
            selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to delete product',
          }));
        },
      });
  }

  setFilters(filters: IProductFilters): void {
    this.state.update((state) => ({
      ...state,
      filters: { ...state.filters, ...filters },
    }));
  }

  clearFilters(): void {
    this.state.update((state) => ({
      ...state,
      filters: {},
    }));
  }

  clearError(): void {
    this.state.update((state) => ({
      ...state,
      error: null,
    }));
  }

  private setLoading(loading: LoadingState): void {
    this.state.update((state) => ({
      ...state,
      loading,
    }));
  }
}
