import { TestBed } from '@angular/core/testing';
import { StorageService } from '@app/core/storage/storage';
import { IProduct } from '@app/features/products/models/product.model';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let storageService: StorageService<unknown>;

  const mockProduct: IProduct = {
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

  const mockProduct2: IProduct = {
    id: Utils.generateId(),
    name: 'Espresso Machine',
    description: 'Professional espresso machine',
    price: 499.99,
    image: '/assets/images/espresso.jpg',
    category: 'Electronics',
    stock: 10,
    rating: 4.8,
    createdAt: moment('2026-01-02').unix(),
    updatedAt: moment('2026-01-02').unix(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartStore,
        {
          provide: StorageService,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    });

    storageService = TestBed.inject(StorageService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    TestBed.resetTestingModule();
  });

  function createStore() {
    return TestBed.inject(CartStore);
  }

  it('should add item correctly', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);

    expect(store.items().length).toBe(1);
    expect(store.items()[0].quantity).toBe(1);
  });

  it('should not duplicate item', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);
    store.addItem(mockProduct, 2);

    expect(store.items().length).toBe(1);
    expect(store.items()[0].quantity).toBe(3);
  });

  it('should update quantity', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);
    store.updateQuantity(mockProduct.id, 2);

    expect(store.items()[0].quantity).toBe(2);
  });

  it('should remove item correctly', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);
    store.removeItem(mockProduct.id);

    expect(store.items().length).toBe(0);
  });

  it('should clear cart', () => {
    const store = createStore();

    store.addItem(mockProduct, 2);
    store.clear();

    expect(store.isEmpty()).toBe(true);
    expect(store.itemCount()).toBe(0);
  });

  it('should calculate totals correctly', () => {
    const store = createStore();

    store.addItem(mockProduct, 2);

    const subtotal = 59.98;
    const tax = subtotal * 0.1;
    const shipping = 10;
    const total = subtotal + tax + shipping;

    expect(store.subtotal()).toBeCloseTo(subtotal, 2);
    expect(store.tax()).toBeCloseTo(tax, 2);
    expect(store.total()).toBeCloseTo(total, 2);
  });

  it('should persist cart to localStorage', async () => {
    const store = createStore();
    const setSpy = vi.spyOn(storageService, 'set');

    store.addItem(mockProduct, 1);

    // Aguardar o effect ser executado
    await vi.waitFor(() => {
      expect(setSpy).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalledWith('cart', expect.any(Object));
    });
  });

  it('should load cart from localStorage on initialization', () => {
    const mockInitialCart = {
      items: [
        {
          product: mockProduct,
          quantity: 2,
          subtotal: 59.98,
        },
      ],
      subtotal: 59.98,
      tax: 5.998,
      shipping: 10,
      total: 75.978,
      itemCount: 2,
    };

    (storageService.get as any).mockReturnValue(mockInitialCart);

    const store = createStore();

    expect(store.items().length).toBe(1);
    expect(store.itemCount()).toBe(2);
  });

  it('should increment quantity correctly', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);
    store.incrementQuantity(mockProduct.id);

    expect(store.items()[0].quantity).toBe(2);
  });

  it('should decrement quantity correctly', () => {
    const store = createStore();

    store.addItem(mockProduct, 3);
    store.decrementQuantity(mockProduct.id);

    expect(store.items()[0].quantity).toBe(2);
  });

  it('should remove item when decrementing to zero', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);
    store.decrementQuantity(mockProduct.id);

    expect(store.items().length).toBe(0);
  });

  it('should remove item when updating quantity to zero', () => {
    const store = createStore();

    store.addItem(mockProduct, 2);
    store.updateQuantity(mockProduct.id, 0);

    expect(store.items().length).toBe(0);
  });

  it('should calculate free shipping correctly', () => {
    const store = createStore();

    // Add product with price below threshold
    store.addItem(mockProduct, 1);
    expect(store.hasFreeShipping()).toBe(false);
    expect(store.shipping()).toBe(10);

    // Add more to exceed threshold
    store.addItem(mockProduct, 3);
    expect(store.hasFreeShipping()).toBe(true);
    expect(store.shipping()).toBe(0);
  });

  it('should check if product exists in cart', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);

    expect(store.hasProduct(mockProduct.id)).toBe(true);
    expect(store.hasProduct('non-existent-id')).toBe(false);
  });

  it('should get product quantity', () => {
    const store = createStore();

    store.addItem(mockProduct, 3);

    expect(store.getProductQuantity(mockProduct.id)).toBe(3);
    expect(store.getProductQuantity('non-existent-id')).toBe(0);
  });

  it('should get item by product id', () => {
    const store = createStore();

    store.addItem(mockProduct, 2);

    const item = store.getItemByProductId(mockProduct.id);
    expect(item).toBeTruthy();
    expect(item?.quantity).toBe(2);
    expect(item?.product.id).toBe(mockProduct.id);
  });

  it('should return undefined for non-existent product', () => {
    const store = createStore();

    const item = store.getItemByProductId('non-existent-id');
    expect(item).toBeUndefined();
  });

  it('should handle multiple products', () => {
    const store = createStore();

    store.addItem(mockProduct, 2);
    store.addItem(mockProduct2, 1);

    expect(store.items().length).toBe(2);
    expect(store.itemCount()).toBe(3);
  });

  it('should calculate subtotal for multiple products', () => {
    const store = createStore();

    store.addItem(mockProduct, 2);
    store.addItem(mockProduct2, 1);

    const expectedSubtotal = mockProduct.price * 2 + mockProduct2.price;
    expect(store.subtotal()).toBeCloseTo(expectedSubtotal, 2);
  });

  it('should have isEmpty computed correctly', () => {
    const store = createStore();

    expect(store.isEmpty()).toBe(true);
    expect(store.hasItems()).toBe(false);

    store.addItem(mockProduct, 1);

    expect(store.isEmpty()).toBe(false);
    expect(store.hasItems()).toBe(true);
  });

  it('should handle storage errors gracefully', () => {
    (storageService.get as any).mockImplementation(() => {
      throw new Error('Storage error');
    });

    const store = createStore();

    expect(store.items().length).toBe(0);
    expect(store.isEmpty()).toBe(true);
  });

  it('should update subtotal when quantity changes', () => {
    const store = createStore();

    store.addItem(mockProduct, 1);
    const initialSubtotal = store.items()[0].subtotal;

    store.updateQuantity(mockProduct.id, 3);
    const updatedSubtotal = store.items()[0].subtotal;

    expect(updatedSubtotal).toBe(initialSubtotal * 3);
  });
});
