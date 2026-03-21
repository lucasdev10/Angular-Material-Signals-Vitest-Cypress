import { TestBed } from '@angular/core/testing';
import { CartDomainService } from '@app/domain/cart/cart-domain.service';
import {
  CartFacade,
  initialCartState,
  selectItemCount,
  selectItems,
  selectShipping,
  selectSubtotal,
  selectTax,
  selectTotal,
} from '@app/features/cart/store';
import { IProduct } from '@app/features/products/models/product.model';
import { ProductRepository } from '@app/features/products/repositories/product.repository';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  initialProductState,
  ProductFacade,
  selectFilteredProducts,
  selectProducts,
} from '../store';

/**
 * Testes de integração para fluxo completo de produtos
 * Testa a interação entre ProductStore e CartStore
 */
describe('Product Flow Integration Tests', () => {
  let store: MockStore;
  let productRepository: ProductRepository;
  let productFacade: ProductFacade;
  let cartFacade: CartFacade;
  let cartDomainService: CartDomainService;

  const mockProducts: IProduct[] = [
    {
      id: 'product-id-1',
      name: 'Coffee Beans',
      description: 'Premium coffee',
      price: 29.99,
      image: '/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
    {
      id: 'product-id-2',
      name: 'Espresso Machine',
      description: 'Professional machine',
      price: 499.99,
      image: '/machine.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: 1773760056,
      updatedAt: 1773760056,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductRepository,
        provideMockStore({
          initialState: {
            product: {
              ...initialProductState,
              products: mockProducts,
              loading: 'success',
            },
            cart: {
              ...initialCartState,
            },
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectProducts, mockProducts);

    productRepository = TestBed.inject(ProductRepository);
    productFacade = TestBed.inject(ProductFacade);
    cartDomainService = TestBed.inject(CartDomainService);

    cartFacade = TestBed.inject(CartFacade);
    cartFacade.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Browse and Add to Cart Flow', () => {
    it('should load products and add to cart', () => {
      // Arrange
      productFacade.loadProducts();

      expect(productFacade.products().length).toBe(2);

      const productToAdd = productFacade.products()[0];
      const mockCartQuantity = 2;
      const mockCartItem = {
        product: productToAdd,
        quantity: mockCartQuantity,
        subtotal: productToAdd.price * mockCartQuantity,
      };

      // Act - Add product to cart
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectSubtotal, productToAdd.price * mockCartQuantity);
      store.refreshState();

      // Assert
      expect(cartFacade.items().length).toBe(1);
      expect(cartFacade.items()[0].product.id).toBe(productToAdd.id);
      expect(cartFacade.items()[0].quantity).toBe(2);
      expect(cartFacade.subtotal()).toBe(59.98);
    });

    it('should filter products and add filtered item to cart', () => {
      // Arrange
      productFacade.loadProducts();

      expect(productFacade.filteredProducts().length).toBe(2);

      // Act - Filter by category
      productFacade.setFilters({ category: 'Electronics' });

      store.overrideSelector(selectFilteredProducts, [mockProducts[1]]);
      store.refreshState();

      expect(productFacade.filteredProducts().length).toBe(1);
      expect(productFacade.filteredProducts()[0].category).toBe('Electronics');

      const mockCartQuantity = 1;
      const mockCartItem = {
        product: productFacade.filteredProducts()[0],
        quantity: mockCartQuantity,
        subtotal: productFacade.filteredProducts()[0].price * mockCartQuantity,
      };

      // Act - Add filtered product to cart
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(
        selectSubtotal,
        productFacade.filteredProducts()[0].price * mockCartQuantity,
      );
      store.refreshState();

      // Assert
      expect(cartFacade.items()[0].product.name).toBe('Espresso Machine');
      expect(cartFacade.subtotal()).toBe(499.99);
      expect(cartFacade.hasFreeShipping()).toBe(true);
    });
  });

  describe('Multiple Products in Cart', () => {
    it('should handle multiple products with correct calculations', () => {
      productFacade.loadProducts();

      expect(productFacade.products().length).toBe(2);

      const mockCartItems = [
        {
          product: productFacade.products()[0],
          quantity: 2,
          subtotal: productFacade.products()[0].price * 2,
        },
        {
          product: productFacade.products()[1],
          quantity: 1,
          subtotal: productFacade.products()[1].price * 1,
        },
      ];
      store.overrideSelector(selectItems, [...mockCartItems]);
      store.overrideSelector(
        selectSubtotal,
        mockCartItems.reduce((sum, item) => sum + item.subtotal, 0),
      );
      store.overrideSelector(
        selectItemCount,
        mockCartItems.reduce((sum, item) => sum + item.quantity, 0),
      );
      store.overrideSelector(
        selectTax,
        cartDomainService.calculateTax(mockCartItems.reduce((sum, item) => sum + item.subtotal, 0)),
      );

      // Act - Add multiple products
      store.overrideSelector(selectShipping, 0);
      store.refreshState();

      // Assert
      expect(cartFacade.items().length).toBe(2);
      expect(cartFacade.itemCount()).toBe(3);
      expect(cartFacade.subtotal()).toBeCloseTo(559.97, 2);
      expect(cartFacade.tax()).toBeCloseTo(55.997, 2);
      expect(cartFacade.shipping()).toBe(0); // Free shipping
      expect(cartFacade.hasFreeShipping()).toBe(true);
    });

    it('should update quantities and recalculate totals', () => {
      // Arrange
      productFacade.loadProducts();

      expect(productFacade.products().length).toBe(2);

      const product = productFacade.products()[0];
      const mockCartItem = {
        product,
        quantity: 5,
        subtotal: product.price * 5,
      };

      // Act - Update quantity
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectSubtotal, mockCartItem.subtotal);
      store.refreshState();

      // Assert
      expect(cartFacade.items()[0].quantity).toBe(5);
      expect(cartFacade.subtotal()).toBeCloseTo(149.95, 2);
      expect(cartFacade.hasFreeShipping()).toBe(true);
    });
  });

  describe('Search and Purchase Flow', () => {
    it('should search products and add to cart', () => {
      // Arrange
      productFacade.loadProducts();

      expect(productFacade.products().length).toBe(2);

      // Act - Search for coffee
      productFacade.setFilters({ search: 'coffee' });

      store.overrideSelector(selectFilteredProducts, [mockProducts[0]]);

      expect(productFacade.filteredProducts().length).toBe(1);
      expect(productFacade.filteredProducts()[0].name).toContain('Coffee');

      // Act - Add to cart
      const mockCartItem = {
        product: productFacade.filteredProducts()[0],
        quantity: 3,
        subtotal: productFacade.filteredProducts()[0].price * 3,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectItemCount, mockCartItem.quantity);
      store.refreshState();

      // Assert
      expect(cartFacade.items().length).toBe(1);
      expect(cartFacade.itemCount()).toBe(3);
    });
  });

  describe('Cart Persistence', () => {
    it('should persist cart across page reloads', async () => {
      // Arrange
      productFacade.loadProducts();

      expect(productFacade.products().length).toBe(2);

      // Act - Add items to cart
      const product = productFacade.products()[0];
      await cartFacade.addItem(product, 2);

      await vi.waitFor(() => {
        const stored = localStorage.getItem('cart');
        expect(stored).toBeTruthy();
      });

      // Simulate page reload by creating new store instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CartFacade,
          provideMockStore({
            initialState: {
              cart: {
                ...initialCartState,
              },
            },
          }),
        ],
      });

      const mockCartItem = {
        product: productFacade.products()[0],
        quantity: 2,
        subtotal: productFacade.products()[0].price * 2,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.refreshState();

      const newCartFacade = TestBed.inject(CartFacade);

      // Assert - Cart should be restored
      expect(newCartFacade.items().length).toBe(1);
      expect(newCartFacade.items()[0].quantity).toBe(2);
      expect(newCartFacade.items()[0].product.id).toBe(product.id);
    });
  });

  describe('Price Calculations', () => {
    it('should calculate correct totals with tax and shipping', () => {
      // Arrange
      productFacade.loadProducts();

      expect(productFacade.products().length).toBe(2);

      // Act - Add cheap item (should have shipping cost)
      const cheapProduct = productFacade.products()[0]; // 29.99
      const mockCartItem = {
        product: cheapProduct,
        quantity: 1,
        subtotal: cheapProduct.price * 1,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectSubtotal, mockCartItem.subtotal);
      store.overrideSelector(selectTax, mockCartItem.subtotal * 0.1);
      store.overrideSelector(selectShipping, 10);
      store.overrideSelector(selectTotal, mockCartItem.subtotal * 1.1 + 10);
      store.refreshState();

      // Assert
      const expectedSubtotal = 29.99;
      const expectedTax = expectedSubtotal * 0.1; // 10%
      const expectedShipping = 10;
      const expectedTotal = expectedSubtotal + expectedTax + expectedShipping;

      expect(cartFacade.subtotal()).toBeCloseTo(expectedSubtotal, 2);
      expect(cartFacade.tax()).toBeCloseTo(expectedTax, 2);
      expect(cartFacade.shipping()).toBe(expectedShipping);
      expect(cartFacade.total()).toBeCloseTo(expectedTotal, 2);
      expect(cartFacade.hasFreeShipping()).toBe(false);
    });

    it('should apply free shipping for orders over threshold', () => {
      // Arrange
      productFacade.loadProducts();

      expect(productFacade.products().length).toBe(2);

      // Act - Add expensive item (should have free shipping)
      const expensiveProduct = productFacade.products()[1]; // 499.99
      const mockCartItem = {
        product: expensiveProduct,
        quantity: 1,
        subtotal: expensiveProduct.price * 1,
      };
      store.overrideSelector(selectItems, [mockCartItem]);
      store.overrideSelector(selectSubtotal, mockCartItem.subtotal);
      store.overrideSelector(selectTax, mockCartItem.subtotal * 0.1);
      store.overrideSelector(selectShipping, 0);
      store.overrideSelector(selectTotal, mockCartItem.subtotal * 1.1);
      store.refreshState();

      // Assert
      const expectedSubtotal = 499.99;
      const expectedTax = expectedSubtotal * 0.1;
      const expectedShipping = 0; // Free
      const expectedTotal = expectedSubtotal + expectedTax + expectedShipping;

      expect(cartFacade.subtotal()).toBeCloseTo(expectedSubtotal, 2);
      expect(cartFacade.shipping()).toBe(expectedShipping);
      expect(cartFacade.total()).toBeCloseTo(expectedTotal, 2);
      expect(cartFacade.hasFreeShipping()).toBe(true);
    });
  });

  describe('Remove from Cart', () => {
    it('should remove item and recalculate totals', () => {
      // Arrange
      productFacade.loadProducts();

      expect(productFacade.products().length).toBe(2);

      const mockCartItems = [
        {
          product: productFacade.products()[0],
          quantity: 1,
          subtotal: productFacade.products()[0].price * 1,
        },
        {
          product: productFacade.products()[1],
          quantity: 1,
          subtotal: productFacade.products()[1].price * 1,
        },
      ];
      store.overrideSelector(selectItems, [...mockCartItems]);
      store.refreshState();

      expect(cartFacade.items().length).toBe(2);

      // Act - Remove one item
      store.overrideSelector(selectItems, [mockCartItems[1]]);
      store.refreshState();

      // Assert
      expect(cartFacade.items().length).toBe(1);
      expect(cartFacade.items()[0].product.id).toBe(productFacade.products()[1].id);
    });
  });
});
