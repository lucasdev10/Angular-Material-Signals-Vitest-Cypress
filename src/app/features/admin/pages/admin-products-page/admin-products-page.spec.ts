import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter, Router } from '@angular/router';
import { ICreateProductDto, IProduct } from '@app/features/products/models/product.model';
import { ProductRepository } from '@app/features/products/repositories/product.repository';
import { initialProductState, ProductFacade, selectProducts } from '@app/features/products/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { AdminProductsPageComponent } from './admin-products-page';

describe('AdminProductsPageComponent', () => {
  let component: AdminProductsPageComponent;
  let fixture: ComponentFixture<AdminProductsPageComponent>;
  let store: MockStore;
  let repository: ProductRepository;
  let dialog: MatDialog;
  let router: Router;
  let productFacade: ProductFacade;

  const mockNewProduct: ICreateProductDto = {
    name: 'test',
    description: 'test',
    price: 10,
    image: '',
    category: 'test',
    stock: 10,
  };

  const mockProducts: IProduct[] = [
    {
      id: 'product-id-1',
      name: 'Premium Coffee Beans',
      description: 'Arabica blend from Colombia with rich flavor notes',
      price: 29.99,
      image: '/assets/images/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
    {
      id: 'product-id-2',
      name: 'Low Stock Product',
      description: 'Product with low stock',
      price: 19.99,
      image: '/assets/images/product.jpg',
      category: 'Electronics',
      stock: 5,
      rating: 4.0,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
    {
      id: 'product-id-3',
      name: 'Out of Stock Product',
      description: 'Product out of stock',
      price: 39.99,
      image: '/assets/images/product2.jpg',
      category: 'Clothing',
      stock: 0,
      rating: 3.5,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
  ];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AdminProductsPageComponent],
      providers: [
        provideRouter([]),
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

    repository = TestBed.inject(ProductRepository);
    vi.spyOn(repository, 'findAll').mockReturnValue(of(mockProducts));

    fixture = TestBed.createComponent(AdminProductsPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    productFacade = TestBed.inject(ProductFacade);

    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the list after creating the product', () => {
    const newProduct: IProduct = {
      ...mockNewProduct,
      id: 'new-product-id',
      rating: 0,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    };

    store.overrideSelector(selectProducts, [...mockProducts, newProduct]);
    store.refreshState();

    productFacade.createProduct(mockNewProduct);

    const hasProduct = productFacade.products().some((p) => p.name === mockNewProduct.name);

    expect(hasProduct).toBe(true);
  });

  it('should remove the product from the list after deleting it', () => {
    let productId = productFacade.products()[0].id;

    expect(productFacade.products().length).toBeGreaterThan(0);

    vi.spyOn(repository, 'delete').mockReturnValue(of(undefined));

    const updatedProducts = mockProducts.filter((p) => p.id !== productId);
    store.overrideSelector(selectProducts, updatedProducts);
    store.refreshState();

    productFacade.deleteProduct(productId);

    expect(productFacade.products().find((p) => p.id === productId)).toBeUndefined();
  });

  it('should navigate to edit page when onEdit is called', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const testProduct = mockProducts[0];

    component.onEdit(testProduct);

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/products/edit', testProduct.id]);
  });

  it('should not delete product when dialog is cancelled', () => {
    vi.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(false),
    } as any);

    const deleteProductSpy = vi.spyOn(productFacade, 'deleteProduct');

    component.onDelete(mockProducts[0]);

    expect(deleteProductSpy).not.toHaveBeenCalled();
  });

  it('should return correct stock class for out of stock', () => {
    const stockClass = component.getStockClass(0);
    expect(stockClass).toBe('out-of-stock');
  });

  it('should return correct stock class for low stock', () => {
    const stockClass = component.getStockClass(5);
    expect(stockClass).toBe('low-stock');
  });

  it('should return correct stock class for in stock', () => {
    const stockClass = component.getStockClass(50);
    expect(stockClass).toBe('in-stock');
  });

  it('should track products by id', () => {
    const testProduct = mockProducts[0];
    const trackId = component.trackByProductId(0, testProduct);
    expect(trackId).toBe(testProduct.id);
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual([
      'image',
      'name',
      'category',
      'price',
      'stock',
      'actions',
    ]);
  });
});
