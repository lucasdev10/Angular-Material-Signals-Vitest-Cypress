import { TestBed } from '@angular/core/testing';
import { StorageService } from '@app/core/storage/storage';
import { IProduct } from '@app/features/products/models/product.model';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let cartStore: CartStore;
  let storageService: StorageService<unknown>;

  let mockProduct: IProduct = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [CartStore, StorageService],
    }).compileComponents();

    cartStore = TestBed.inject(CartStore);
    storageService = TestBed.inject(StorageService);
    cartStore.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should add item correctly', async () => {
    const mockItemsResponse = [
      {
        product: mockProduct,
        quantity: 1,
        subtotal: 29.99,
      },
    ];

    expect(cartStore.items().length).toBe(0);

    cartStore.addItem(mockProduct, 1);

    expect(cartStore.items()).toEqual(mockItemsResponse);
    expect(cartStore.items().length).toBe(1);
  });

  it('do not duplicate item', () => {
    const mockItemsResponse = [
      {
        product: mockProduct,
        quantity: 3,
        subtotal: 89.97,
      },
    ];

    cartStore.addItem(mockProduct, 1);
    cartStore.addItem(mockProduct, 2);

    expect(cartStore.items().length).toBe(1);
    expect(cartStore.items()).toEqual(mockItemsResponse);
  });

  it('should update quantity', () => {
    cartStore.addItem(mockProduct, 1);
    cartStore.updateQuantity(mockProduct.id, 2);

    expect(cartStore.items()[0].quantity).toBe(2);
  });

  it('should check if there is a shipping cost', () => {
    cartStore.addItem(mockProduct, 1);
    expect(cartStore.hasFreeShipping()).toBeFalsy();

    cartStore.addItem(mockProduct, 5);
    expect(cartStore.hasFreeShipping()).toBeTruthy();
  });

  it('should calculate total correctly', () => {
    cartStore.addItem(mockProduct, 1);
    cartStore.updateQuantity(mockProduct.id, 2);

    const total =
      mockProduct.price * cartStore.itemCount() + cartStore.shipping() + cartStore.tax();

    expect(cartStore.total()).toBe(total);
  });

  it('should remove item correctly', () => {
    cartStore.addItem(mockProduct, 1);
    expect(cartStore.items().length).toBe(1);

    cartStore.removeItem(mockProduct.id);
    expect(cartStore.items().length).toBe(0);
  });

  it('should persist in localStorage', () => {
    let storage = storageService.get('cart');
    expect(storage).toBeNull();

    cartStore.addItem(mockProduct, 2);

    setTimeout(() => {
      storage = storageService.get('cart');

      expect(storage).not.toBeNull();
    }, 500);
  });

  it('should recover saved state', () => {
    // Arrange - salvar dados no storage
    const savedCart = {
      items: [
        {
          product: mockProduct,
          quantity: 3,
          subtotal: 89.97,
        },
      ],
      subtotal: 89.97,
      shipping: 10,
      tax: 8.997,
      total: 108.967,
      itemCount: 3,
    };

    // Salvar no localStorage diretamente (como o StorageService faz)
    localStorage.setItem('cart', JSON.stringify(savedCart));

    // Act - criar uma nova instância da store
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CartStore, StorageService],
    });
    const newStore = TestBed.inject(CartStore);

    // Assert
    expect(newStore.items().length).toBe(1);
    expect(newStore.items()[0].product.id).toBe(mockProduct.id);
    expect(newStore.items()[0].quantity).toBe(3);
    expect(newStore.itemCount()).toBe(3);
    expect(newStore.subtotal()).toBe(89.97);
  });

  it('should clean cart', () => {
    cartStore.addItem(mockProduct, 2);
    expect(cartStore.items().length).toBe(1);

    cartStore.clear();

    expect(cartStore.items().length).toBe(0);
  });
});
