import { TestBed } from '@angular/core/testing';
import { CartStore } from '@app/features/cart/store/cart.store';
import { IProduct } from '@app/features/products/models/product.model';
import { ProductRepository } from '@app/features/products/repositories/product.repository';
import { ProductStore } from '@app/features/products/store/product.store';
import { DateUtils } from '@app/shared';
import { Utils } from '@app/shared/utils/utils';
import { of } from 'rxjs';

/**
 * Testes de integração para fluxo completo de produtos
 * Testa a interação entre ProductStore e CartStore
 */
describe('Product Flow Integration Tests', () => {
  let productStore: InstanceType<typeof ProductStore>;
  let cartStore: InstanceType<typeof CartStore>;
  let productRepository: ProductRepository;

  const mockProducts: IProduct[] = [
    {
      id: Utils.generateId(),
      name: 'Coffee Beans',
      description: 'Premium coffee',
      price: 29.99,
      image: '/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: DateUtils.now(),
      updatedAt: DateUtils.now(),
    },
    {
      id: Utils.generateId(),
      name: 'Espresso Machine',
      description: 'Professional machine',
      price: 499.99,
      image: '/machine.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: DateUtils.now(),
      updatedAt: DateUtils.now(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductStore, CartStore, ProductRepository],
    });

    productStore = TestBed.inject(ProductStore);
    cartStore = TestBed.inject(CartStore);
    productRepository = TestBed.inject(ProductRepository);

    cartStore.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Browse and Add to Cart Flow', () => {
    it('should load products and add to cart', async () => {
      // Arrange
      const mockFindAll = vi.spyOn(productRepository, 'findAll');
      mockFindAll.mockReturnValue(of(mockProducts));

      // Act - Load products
      productStore.loadProducts();

      await vi.waitFor(() => {
        expect(productStore.products().length).toBe(2);
      });

      // Act - Add product to cart
      const productToAdd = productStore.products()[0];
      cartStore.addItem(productToAdd, 2);

      // Assert
      expect(cartStore.items().length).toBe(1);
      expect(cartStore.items()[0].product.id).toBe(productToAdd.id);
      expect(cartStore.items()[0].quantity).toBe(2);
      expect(cartStore.subtotal()).toBe(59.98);
    });

    it('should filter products and add filtered item to cart', async () => {
      // Arrange
      const mockFindAll = vi.spyOn(productRepository, 'findAll');
      mockFindAll.mockReturnValue(of(mockProducts));

      productStore.loadProducts();

      await vi.waitFor(() => {
        expect(productStore.products().length).toBe(2);
      });

      // Act - Filter by category
      productStore.setFilters({ category: 'Electronics' });
      const filteredProducts = productStore.filteredProducts();

      expect(filteredProducts.length).toBe(1);
      expect(filteredProducts[0].category).toBe('Electronics');

      // Act - Add filtered product to cart
      cartStore.addItem(filteredProducts[0], 1);

      // Assert
      expect(cartStore.items()[0].product.name).toBe('Espresso Machine');
      expect(cartStore.subtotal()).toBe(499.99);
      expect(cartStore.hasFreeShipping()).toBe(true);
    });
  });

  describe('Multiple Products in Cart', () => {
    it('should handle multiple products with correct calculations', async () => {
      // Arrange
      const mockFindAll = vi.spyOn(productRepository, 'findAll');
      mockFindAll.mockReturnValue(of(mockProducts));

      productStore.loadProducts();

      await vi.waitFor(() => {
        expect(productStore.products().length).toBe(2);
      });

      // Act - Add multiple products
      const products = productStore.products();
      cartStore.addItem(products[0], 2); // Coffee: 2 x 29.99 = 59.98
      cartStore.addItem(products[1], 1); // Machine: 1 x 499.99 = 499.99

      // Assert
      expect(cartStore.items().length).toBe(2);
      expect(cartStore.itemCount()).toBe(3);
      expect(cartStore.subtotal()).toBeCloseTo(559.97, 2);
      expect(cartStore.tax()).toBeCloseTo(55.997, 2);
      expect(cartStore.shipping()).toBe(0); // Free shipping
      expect(cartStore.hasFreeShipping()).toBe(true);
    });

    it('should update quantities and recalculate totals', async () => {
      // Arrange
      const mockFindAll = vi.spyOn(productRepository, 'findAll');
      mockFindAll.mockReturnValue(of(mockProducts));

      productStore.loadProducts();

      await vi.waitFor(() => {
        expect(productStore.products().length).toBe(2);
      });

      const product = productStore.products()[0];
      cartStore.addItem(product, 1);

      // Act - Update quantity
      cartStore.updateQuantity(product.id, 5);

      // Assert
      expect(cartStore.items()[0].quantity).toBe(5);
      expect(cartStore.subtotal()).toBeCloseTo(149.95, 2);
      expect(cartStore.hasFreeShipping()).toBe(true);
    });
  });

  describe('Search and Purchase Flow', () => {
    it('should search products and add to cart', async () => {
      // Arrange
      const mockFindAll = vi.spyOn(productRepository, 'findAll');
      mockFindAll.mockReturnValue(of(mockProducts));

      productStore.loadProducts();

      await vi.waitFor(() => {
        expect(productStore.products().length).toBe(2);
      });

      // Act - Search for coffee
      productStore.setFilters({ search: 'coffee' });
      const searchResults = productStore.filteredProducts();

      expect(searchResults.length).toBe(1);
      expect(searchResults[0].name).toContain('Coffee');

      // Act - Add to cart
      cartStore.addItem(searchResults[0], 3);

      // Assert
      expect(cartStore.items().length).toBe(1);
      expect(cartStore.itemCount()).toBe(3);
    });
  });

  describe('Cart Persistence', () => {
    it('should persist cart across page reloads', async () => {
      // Arrange
      const mockFindAll = vi.spyOn(productRepository, 'findAll');
      mockFindAll.mockReturnValue(of(mockProducts));

      productStore.loadProducts();

      await vi.waitFor(() => {
        expect(productStore.products().length).toBe(2);
      });

      // Act - Add items to cart
      const product = productStore.products()[0];
      cartStore.addItem(product, 2);

      await vi.waitFor(() => {
        const stored = localStorage.getItem('cart');
        expect(stored).toBeTruthy();
      });

      // Simulate page reload by creating new store instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [CartStore],
      });

      const newCartStore = TestBed.inject(CartStore);

      // Assert - Cart should be restored
      expect(newCartStore.items().length).toBe(1);
      expect(newCartStore.items()[0].quantity).toBe(2);
      expect(newCartStore.items()[0].product.id).toBe(product.id);
    });
  });

  describe('Price Calculations', () => {
    it('should calculate correct totals with tax and shipping', async () => {
      // Arrange
      const mockFindAll = vi.spyOn(productRepository, 'findAll');
      mockFindAll.mockReturnValue(of(mockProducts));

      productStore.loadProducts();

      await vi.waitFor(() => {
        expect(productStore.products().length).toBe(2);
      });

      // Act - Add cheap item (should have shipping cost)
      const cheapProduct = productStore.products()[0]; // 29.99
      cartStore.addItem(cheapProduct, 1);

      // Assert
      const subtotal = 29.99;
      const tax = subtotal * 0.1; // 10%
      const shipping = 10;
      const expectedTotal = subtotal + tax + shipping;

      expect(cartStore.subtotal()).toBeCloseTo(subtotal, 2);
      expect(cartStore.tax()).toBeCloseTo(tax, 2);
      expect(cartStore.shipping()).toBe(shipping);
      expect(cartStore.total()).toBeCloseTo(expectedTotal, 2);
      expect(cartStore.hasFreeShipping()).toBe(false);
    });

    it('should apply free shipping for orders over threshold', async () => {
      // Arrange
      const mockFindAll = vi.spyOn(productRepository, 'findAll');
      mockFindAll.mockReturnValue(of(mockProducts));

      productStore.loadProducts();

      await vi.waitFor(() => {
        expect(productStore.products().length).toBe(2);
      });

      // Act - Add expensive item (should have free shipping)
      const expensiveProduct = productStore.products()[1]; // 499.99
      cartStore.addItem(expensiveProduct, 1);

      // Assert
      const subtotal = 499.99;
      const tax = subtotal * 0.1;
      const shipping = 0; // Free
      const expectedTotal = subtotal + tax + shipping;

      expect(cartStore.subtotal()).toBeCloseTo(subtotal, 2);
      expect(cartStore.shipping()).toBe(shipping);
      expect(cartStore.total()).toBeCloseTo(expectedTotal, 2);
      expect(cartStore.hasFreeShipping()).toBe(true);
    });
  });

  describe('Remove from Cart', () => {
    it('should remove item and recalculate totals', async () => {
      // Arrange
      const mockFindAll = vi.spyOn(productRepository, 'findAll');
      mockFindAll.mockReturnValue(of(mockProducts));

      productStore.loadProducts();

      await vi.waitFor(() => {
        expect(productStore.products().length).toBe(2);
      });

      const products = productStore.products();
      cartStore.addItem(products[0], 1);
      cartStore.addItem(products[1], 1);

      expect(cartStore.items().length).toBe(2);

      // Act - Remove one item
      cartStore.removeItem(products[0].id);

      // Assert
      expect(cartStore.items().length).toBe(1);
      expect(cartStore.items()[0].product.id).toBe(products[1].id);
    });
  });
});
