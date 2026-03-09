import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter, Router } from '@angular/router';
import { ICreateProductDto, IProduct } from '@app/features/products/models/product.model';
import { ProductRepository } from '@app/features/products/repositories/product.repository';
import { ProductStore } from '@app/features/products/store/product.store';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { of } from 'rxjs';
import { AdminProductsPageComponent } from './admin-products-page';

describe('AdminProductsPageComponent', () => {
  let component: AdminProductsPageComponent;
  let fixture: ComponentFixture<AdminProductsPageComponent>;
  let storeProduct: ProductStore;
  let repository: ProductRepository;
  let dialog: MatDialog;
  let router: Router;

  const product: ICreateProductDto = {
    name: 'test',
    description: 'test',
    price: 10,
    image: '',
    category: 'test',
    stock: 10,
  };

  const products: IProduct[] = [
    {
      id: Utils.generateId(),
      name: 'Premium Coffee Beans',
      description: 'Arabica blend from Colombia with rich flavor notes',
      price: 29.99,
      image: '/assets/images/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: moment('2026-01-01').unix(),
      updatedAt: moment('2026-01-01').unix(),
    },
    {
      id: Utils.generateId(),
      name: 'Low Stock Product',
      description: 'Product with low stock',
      price: 19.99,
      image: '/assets/images/product.jpg',
      category: 'Electronics',
      stock: 5,
      rating: 4.0,
      createdAt: moment('2026-01-01').unix(),
      updatedAt: moment('2026-01-01').unix(),
    },
    {
      id: Utils.generateId(),
      name: 'Out of Stock Product',
      description: 'Product out of stock',
      price: 39.99,
      image: '/assets/images/product2.jpg',
      category: 'Clothing',
      stock: 0,
      rating: 3.5,
      createdAt: moment('2026-01-01').unix(),
      updatedAt: moment('2026-01-01').unix(),
    },
  ];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AdminProductsPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    repository = TestBed.inject(ProductRepository);
    vi.spyOn(repository, 'findAll').mockReturnValue(of(products));

    fixture = TestBed.createComponent(AdminProductsPageComponent);
    component = fixture.componentInstance;
    storeProduct = TestBed.inject(ProductStore);
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);

    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the list after creating the product', async () => {
    const newProduct: IProduct = {
      ...product,
      id: Utils.generateId(),
      rating: 0,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
    };

    vi.spyOn(repository, 'create').mockReturnValue(of(newProduct));

    storeProduct.createProduct(product);

    await vi.waitFor(() => {
      const hasProduct = component.products().some((p) => p.name === product.name);
      expect(hasProduct).toBe(true);
    });
  });

  it('should remove the product from the list after deleting it', async () => {
    await vi.waitFor(() => {
      expect(component.products().length).toBeGreaterThan(0);
    });

    const productId = component.products()[0].id;
    vi.spyOn(repository, 'delete').mockReturnValue(of(undefined));

    storeProduct.deleteProduct(productId);

    await vi.waitFor(() => {
      const remainingProducts = component.products();
      expect(remainingProducts.find((p) => p.id === productId)).toBeUndefined();
    });
  });

  it('should navigate to edit page when onEdit is called', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const testProduct = products[0];

    component.onEdit(testProduct);

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/products/edit', testProduct.id]);
  });

  it('should not delete product when dialog is cancelled', () => {
    vi.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(false),
    } as any);

    const deleteProductSpy = vi.spyOn(storeProduct, 'deleteProduct');

    component.onDelete(products[0]);

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
    const testProduct = products[0];
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
