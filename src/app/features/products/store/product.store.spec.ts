import { TestBed } from '@angular/core/testing';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { of, throwError } from 'rxjs';
import { IProduct } from '../models/product.model';
import { ProductRepository } from '../repositories/product.repository';
import { ProductStore } from './product.store';

describe('ProductStore', () => {
  let productStore: ProductStore;
  let productRepository: ProductRepository;

  let mockProducts: IProduct[] = [
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
      name: 'Espresso Machine Pro',
      description: 'Professional grade espresso maker with 15 bar pressure',
      price: 499.99,
      image: '/assets/images/coffee.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: moment('2026-01-02').unix(),
      updatedAt: moment('2026-01-02').unix(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [],
    }).compileComponents();

    productStore = TestBed.inject(ProductStore);
    productRepository = TestBed.inject(ProductRepository);
  });

  it('should update loading correctly', () => {
    const mockRepository = vi.spyOn(productRepository, 'findAll');
    mockRepository.mockReturnValue(of([]));
    expect(productStore.isLoading()).toBe(true);

    productStore.loadProducts();

    expect(productStore.isLoading()).toBe(false);
  });

  it('should load products correctly', () => {
    const mockRepository = vi.spyOn(productRepository, 'findAll');
    mockRepository.mockReturnValue(of(mockProducts));

    productStore.loadProducts();

    expect(productStore.products()).toEqual(mockProducts);
  });

  it('should update the error after it fails', () => {
    const mockRepository = vi.spyOn(productRepository, 'findAll');
    mockRepository.mockReturnValue(throwError(() => new Error('Failed to load products')));
    expect(productStore.error()).toBeNull();

    productStore.loadProducts();

    expect(productStore.error()).toBe('Failed to load products');
  });
});
