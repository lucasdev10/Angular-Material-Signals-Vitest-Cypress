import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IProduct, IProductFilters } from '../../models/product.model';
import { ProductActions } from '../product.actions';
import { initialProductState } from '../product.state';
import {
  selectError,
  selectFilteredProductCount,
  selectFilteredProducts,
  selectFilters,
  selectHasError,
  selectIsLoading,
  selectLoading,
  selectProducts,
  selectSelectedProduct,
} from '../selectors/product.selectors';
import { ProductFacade } from './product.facade';

describe('ProductFacade', () => {
  let facade: ProductFacade;
  let store: MockStore;

  let mockProducts: IProduct[] = [
    {
      id: 'product-id-1',
      name: 'Premium Coffee Beans',
      description: 'Arabica blend from Colombia with rich flavor notes',
      price: 29.99,
      image: '/assets/images/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: 1774015190,
      updatedAt: 1774015190,
    },
    {
      id: 'product-id-2',
      name: 'Espresso Machine Pro',
      description: 'Professional grade espresso maker with 15 bar pressure',
      price: 499.99,
      image: '/assets/images/coffee.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: 1774015190,
      updatedAt: 1774015190,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            product: {
              ...initialProductState,
              products: mockProducts,
              loading: 'success',
            },
          },
        }),
      ],
    });

    facade = TestBed.inject(ProductFacade);
    store = TestBed.inject(MockStore);

    // Override selectors
    store.overrideSelector(selectProducts, mockProducts);
    store.overrideSelector(selectSelectedProduct, null);
    store.overrideSelector(selectFilters, {});
    store.overrideSelector(selectLoading, 'success');
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectHasError, false);
    store.overrideSelector(selectFilteredProducts, mockProducts);
    store.overrideSelector(selectFilteredProductCount, mockProducts.length);
  });

  describe('selectors', () => {
    it('should expose products$', () => {
      expect(facade.products()).toEqual(mockProducts);
    });

    it('should expose filteredProducts$', () => {
      expect(facade.filteredProducts()).toEqual(mockProducts);
    });

    it('should expose isLoading$', () => {
      expect(facade.isLoading()).toBeFalsy();
    });

    it('should expose error$', () => {
      expect(facade.error()).toBeNull();
    });

    it('should expose selectedProduct$', () => {
      expect(facade.selectedProduct()).toBeNull();
    });

    it('should expose totalProducts$', () => {
      expect(facade.totalProducts()).toBe(2);
    });

    it('should expose totalValue$', () => {
      expect(facade.totalValue()).toBe(529.98);
    });

    it('should expose lowStockProducts$', () => {
      expect(facade.lowStockProducts()).toBe(0);
    });
  });

  describe('actions', () => {
    it('should dispatch loadProducts action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      facade.loadProducts();

      expect(dispatchSpy).toHaveBeenCalledWith(ProductActions.loadProducts());
    });

    it('should dispatch loadProductById action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      facade.loadProductById(mockProducts[0].id);

      expect(dispatchSpy).toHaveBeenCalledWith(
        ProductActions.loadProductById({ id: mockProducts[0].id }),
      );
    });

    it('should dispatch createProduct action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      const dto = {
        name: 'New Product',
        description: 'Product description',
        price: 9.99,
        category: 'Food',
        stock: 100,
        rating: 4.5,
        image: '/assets/images/product.jpg',
      };

      facade.createProduct(dto);

      expect(dispatchSpy).toHaveBeenCalledWith(ProductActions.createProduct({ product: dto }));
    });

    it('should dispatch updateProduct action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      const dto = {
        name: 'Updated Product',
      };

      facade.updateProduct(mockProducts[0].id, dto);

      expect(dispatchSpy).toHaveBeenCalledWith(
        ProductActions.updateProduct({ id: mockProducts[0].id, product: dto }),
      );
    });

    it('should dispatch deleteProduct action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      facade.deleteProduct(mockProducts[0].id);

      expect(dispatchSpy).toHaveBeenCalledWith(
        ProductActions.deleteProduct({ id: mockProducts[0].id }),
      );
    });

    it('should dispatch setProductFilters action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      const filters: IProductFilters = {
        search: 'Updated Product',
      };

      facade.setFilters(filters);

      expect(dispatchSpy).toHaveBeenCalledWith(ProductActions.setProductFilters({ filters }));
    });
  });

  describe('integration', () => {
    it('should update loading when selectors change', () => {
      expect(facade.isLoading()).toBe(false);

      store.overrideSelector(selectIsLoading, true);
      store.overrideSelector(selectLoading, 'loading');
      store.refreshState();

      expect(facade.isLoading()).toBe(true);
    });
  });
});
