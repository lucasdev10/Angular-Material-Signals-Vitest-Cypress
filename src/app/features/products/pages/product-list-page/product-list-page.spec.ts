import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartStore } from '@app/features/cart/store/cart.store';
import { DateUtils } from '@app/shared';
import { delay, of, throwError } from 'rxjs';
import { IProduct } from '../../models/product.model';
import { ProductRepository } from '../../repositories/product.repository';
import { ProductStore } from '../../store/product.store';
import { ProductListPageComponent } from './product-list-page';

describe('ProductListPageComponent', () => {
  let component: ProductListPageComponent;
  let fixture: ComponentFixture<ProductListPageComponent>;
  let productStore: InstanceType<typeof ProductStore>;
  let cartStore: InstanceType<typeof CartStore>;
  let productRepository: ProductRepository;

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
      createdAt: DateUtils.now(),
      updatedAt: DateUtils.now(),
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
      createdAt: DateUtils.now(),
      updatedAt: DateUtils.now(),
    },
  ];

  const setupTest = (repositoryMock: any) => {
    TestBed.configureTestingModule({
      imports: [ProductListPageComponent],
      providers: [provideHttpClient(), ProductStore, CartStore, ProductRepository],
    }).compileComponents();

    productStore = TestBed.inject(ProductStore);
    cartStore = TestBed.inject(CartStore);
    productRepository = TestBed.inject(ProductRepository);

    vi.spyOn(productRepository, 'findAll').mockReturnValue(repositoryMock);

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListPageComponent],
      providers: [provideHttpClient(), ProductStore, CartStore, ProductRepository],
    }).compileComponents();
  });

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
    const compiled = fixture.nativeElement as HTMLElement;
    const productCards = compiled.querySelectorAll('app-product-card');
    expect(productCards.length).toBe(2);
  });

  it('should display loading spinner when loading', () => {
    // Mock repository to delay response, keeping loading state
    setupTest(of(mockProducts).pipe(delay(1000)));

    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');
    const loadingText = compiled.querySelector('.loading-container p');

    expect(spinner).toBeTruthy();
    expect(loadingText?.textContent).toContain('Loading products...');
  });

  it('should display error message when there is an error', () => {
    const errorMessage = 'Failed to load products';
    setupTest(throwError(() => new Error(errorMessage)));

    const compiled = fixture.nativeElement as HTMLElement;
    const errorContainer = compiled.querySelector('.error-container');
    const errorText = compiled.querySelector('.error-message');

    expect(errorContainer).toBeTruthy();
    expect(errorText?.textContent).toContain(errorMessage);
  });

  it('should display empty state when no products are available', () => {
    setupTest(of([]));

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('.empty-state');

    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toContain('No products found');
  });

  it('should call cartStore.addItem when onAddToCart is called', () => {
    setupTest(of(mockProducts));
    const addItemSpy = vi.spyOn(cartStore, 'addItem');
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

  it('should expose correct signals from store', () => {
    setupTest(of(mockProducts));

    expect(component.products()).toEqual(mockProducts);
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
  });
});
