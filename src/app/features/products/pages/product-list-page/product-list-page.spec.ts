import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartStore } from '@app/features/cart/store/cart.store';
import moment from 'moment';
import { IProduct } from '../../models/product.model';
import { ProductStore } from '../../store/product.store';
import { ProductListPageComponent } from './product-list-page';

describe('ProductListPageComponent', () => {
  let component: ProductListPageComponent;
  let fixture: ComponentFixture<ProductListPageComponent>;
  let productStore: ProductStore;
  let cartStore: CartStore;

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
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      price: 200,
      image: 'image2.jpg',
      category: 'Eletronics',
      stock: 5,
      rating: 4.0,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListPageComponent],
      providers: [provideHttpClient(), ProductStore, CartStore],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    productStore = TestBed.inject(ProductStore);
    cartStore = TestBed.inject(CartStore);

    // Mock do estado da store para evitar chamadas HTTP reais
    vi.spyOn(productStore as any, 'state', 'get').mockReturnValue(
      signal({
        products: mockProducts,
        selectedProduct: null,
        filters: {},
        loading: 'success',
        error: null,
      }),
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.page-title');

    expect(title).toBeTruthy();
    expect(title?.textContent).toContain('Our Products');
  });

  it('should render product cards when products are loaded', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const productCards = compiled.querySelectorAll('app-product-card');

    expect(productCards.length).toBe(2);
  });

  it('should display loading spinner when loading', () => {
    // Arrange - simular estado de loading
    vi.spyOn(productStore as any, 'state', 'get').mockReturnValue(
      signal({
        products: [],
        selectedProduct: null,
        filters: {},
        loading: 'loading',
        error: null,
      }),
    );

    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');
    const loadingText = compiled.querySelector('.loading-container p');

    // Assert
    expect(spinner).toBeTruthy();
    expect(loadingText?.textContent).toContain('Loading products...');
  });

  it('should display error message when there is an error', () => {
    // Arrange - simular estado de erro
    const errorMessage = 'Failed to load products';
    vi.spyOn(productStore as any, 'state', 'get').mockReturnValue(
      signal({
        products: [],
        selectedProduct: null,
        filters: {},
        loading: 'error',
        error: errorMessage,
      }),
    );

    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const errorContainer = compiled.querySelector('.error-container');
    const errorText = compiled.querySelector('.error-message');

    // Assert
    expect(errorContainer).toBeTruthy();
    expect(errorText?.textContent).toContain(errorMessage);
  });

  it('should display empty state when no products are available', () => {
    // Arrange - simular lista vazia
    vi.spyOn(productStore as any, 'state', 'get').mockReturnValue(
      signal({
        products: [],
        selectedProduct: null,
        filters: {},
        loading: 'success',
        error: null,
      }),
    );

    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('.empty-state');

    // Assert
    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toContain('No products found');
  });

  it('should call cartStore.addItem when onAddToCart is called', () => {
    // Arrange
    const addItemSpy = vi.spyOn(cartStore, 'addItem');
    const product = mockProducts[0];

    // Act
    component.onAddToCart(product);

    // Assert
    expect(addItemSpy).toHaveBeenCalledWith(product, 1);
  });

  it('should not display loading or error when products are loaded successfully', () => {
    // Act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');
    const errorContainer = compiled.querySelector('.error-container');
    const productsGrid = compiled.querySelector('.products-grid');

    // Assert
    expect(spinner).toBeFalsy();
    expect(errorContainer).toBeFalsy();
    expect(productsGrid).toBeTruthy();
  });

  it('should expose correct signals from store', () => {
    // Assert
    expect(component.products()).toEqual(mockProducts);
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
  });
});
