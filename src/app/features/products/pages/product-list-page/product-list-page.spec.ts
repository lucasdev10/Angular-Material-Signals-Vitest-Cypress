import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartFacade } from '@app/features/cart/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { delay, of, throwError } from 'rxjs';
import { IProduct } from '../../models/product.model';
import { ProductRepository } from '../../repositories/product.repository';
import {
  initialProductState,
  ProductFacade,
  selectError,
  selectFilteredProducts,
  selectIsLoading,
} from '../../store';
import { ProductListPageComponent } from './product-list-page';

describe('ProductListPageComponent', () => {
  let component: ProductListPageComponent;
  let fixture: ComponentFixture<ProductListPageComponent>;
  let store: MockStore;
  let productRepository: ProductRepository;
  let productFacade: ProductFacade;
  let cartFacade: CartFacade;

  const mockProducts: IProduct[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      image: 'image1.jpg',
      category: 'Coffee',
      stock: 10,
      rating: 4.5,
      createdAt: 1773756686,
      updatedAt: 1773756686,
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      price: 200,
      image: 'image2.jpg',
      category: 'Electronics',
      stock: 5,
      rating: 4.0,
      createdAt: 1773756686,
      updatedAt: 1773756686,
    },
  ];

  const setupTest = (repositoryMock: any) => {
    TestBed.configureTestingModule({
      imports: [ProductListPageComponent],
      providers: [
        provideHttpClient(),
        ProductRepository,
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
    }).compileComponents();

    store = TestBed.inject(MockStore);
    productFacade = TestBed.inject(ProductFacade);
    productRepository = TestBed.inject(ProductRepository);
    cartFacade = TestBed.inject(CartFacade);

    vi.spyOn(productRepository, 'findAll').mockReturnValue(repositoryMock);

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    setupTest(of(mockProducts));
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    setupTest(of(mockProducts));
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.page-title');

    expect(title).toBeTruthy();
    expect(title?.textContent).toContain('Our Products');
  });

  it('should render product cards when products are loaded', () => {
    setupTest(of(mockProducts));
    store.overrideSelector(selectFilteredProducts, [...mockProducts]);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.refreshState();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const productCards = compiled.querySelectorAll('app-product-card');
    expect(productCards.length).toBe(2);
  });

  it('should display loading spinner when loading', () => {
    // Mock repository to delay response, keeping loading state
    setupTest(of(mockProducts).pipe(delay(1000)));

    // Override selectors
    store.overrideSelector(selectIsLoading, true);
    store.refreshState();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');
    const loadingText = compiled.querySelector('.loading-container p');

    expect(spinner).toBeTruthy();
    expect(loadingText?.textContent).toContain('Loading products...');
  });

  it('should display error message when there is an error', () => {
    const errorMessage = 'Failed to load products';
    setupTest(throwError(() => new Error(errorMessage)));

    // Override selectors
    store.overrideSelector(selectError, errorMessage);
    store.refreshState();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorContainer = compiled.querySelector('.error-container');
    const errorText = compiled.querySelector('.error-message');

    expect(errorContainer).toBeTruthy();
    expect(errorText?.textContent).toContain(errorMessage);
  });

  it('should display empty state when no products are available', () => {
    setupTest([]);
    // Override selectors
    store.overrideSelector(selectFilteredProducts, []);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.refreshState();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('.empty-state');

    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toContain('No products found');
  });

  it('should call cartFacade.addItem when onAddToCart is called', () => {
    setupTest(of(mockProducts));
    const addItemSpy = vi.spyOn(cartFacade, 'addItem');
    const product = mockProducts[0];

    component.onAddToCart(product);

    expect(addItemSpy).toHaveBeenCalledWith(product, 1);
  });

  it('should not display loading or error when products are loaded successfully', () => {
    setupTest(of(mockProducts));

    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');
    const errorContainer = compiled.querySelector('.error-container');
    const productsGrid = compiled.querySelector('.products-grid');

    expect(spinner).toBeFalsy();
    expect(errorContainer).toBeFalsy();
    expect(productsGrid).toBeTruthy();
  });

  it('should expose correct signals from facade', () => {
    store.overrideSelector(selectFilteredProducts, mockProducts);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.refreshState();

    fixture.detectChanges();

    expect(component.products()).toEqual(mockProducts);
    expect(component.isLoading()).toEqual(false);
    expect(component.error()).toBeNull();
  });
});
