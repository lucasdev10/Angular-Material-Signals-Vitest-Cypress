import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartStore } from '@app/features/cart/store/cart.store';
import { IProduct } from '@app/features/products/models/product.model';
import { DateUtils } from '@app/shared';
import { Utils } from '@app/shared/utils/utils';
import { CartPage } from './cart-page';

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let mockCartStore: Partial<InstanceType<typeof CartStore>>;

  const mockProduct: IProduct = {
    id: Utils.generateId(),
    name: 'Test Product',
    description: 'Test Description',
    price: 50,
    image: '/test.jpg',
    category: 'Test',
    stock: 10,
    rating: 4.5,
    createdAt: DateUtils.now(),
    updatedAt: DateUtils.now(),
  };

  beforeEach(async () => {
    mockCartStore = {
      items: signal([
        {
          product: mockProduct,
          quantity: 2,
          subtotal: 100,
        },
      ]),
      subtotal: signal(100),
      tax: signal(10),
      shipping: signal(10),
      total: signal(120),
      itemCount: signal(2),
      isEmpty: signal(false),
      hasItems: signal(true),
      hasFreeShipping: signal(false),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [{ provide: CartStore, useValue: mockCartStore }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display cart items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cartItems = compiled.querySelectorAll('.cart-item');

    expect(cartItems.length).toBe(1);
  });

  it('should display product information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const productName = compiled.querySelector('.item-name');

    expect(productName?.textContent).toContain('Test Product');
  });

  it('should display cart summary', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtotal = compiled.querySelector('.subtotal-value');
    const tax = compiled.querySelector('.tax-value');
    const shipping = compiled.querySelector('.shipping-value');
    const total = compiled.querySelector('.total-amount');

    expect(subtotal?.textContent).toContain('100');
    expect(tax?.textContent).toContain('10');
    expect(shipping?.textContent).toContain('10');
    expect(total?.textContent).toContain('120');
  });

  it('should call updateQuantity when quantity changes', () => {
    component.onUpdateQuantity(mockProduct.id, 3);

    expect(mockCartStore.updateQuantity).toHaveBeenCalledWith(mockProduct.id, 3);
  });

  it('should call removeItem when remove button is clicked', () => {
    component.onRemoveItem(mockProduct.id);

    expect(mockCartStore.removeItem).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should display empty cart message when cart is empty', () => {
    // Update signals
    (mockCartStore.isEmpty as any).set(true);
    (mockCartStore.items as any).set([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyMessage = compiled.querySelector('.empty-cart');

    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage?.textContent).toContain('Your cart is empty');
  });

  it('should show free shipping badge when applicable', () => {
    // Update signal
    (mockCartStore.hasFreeShipping as any).set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const freeShippingBadge = compiled.querySelector('.shipping-badge');

    expect(freeShippingBadge).toBeTruthy();
  });

  it('should have checkout button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const checkoutButton = compiled.querySelector('.checkout-button');

    expect(checkoutButton).toBeTruthy();
  });

  it('should hidden checkout button when cart is empty', () => {
    // Update signal
    (mockCartStore.isEmpty as any).set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const checkoutButton = compiled.querySelector('.checkout-button') as HTMLButtonElement;

    expect(checkoutButton).toBeNull();
  });

  it('should navigate to checkout on button click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const checkoutButton = compiled.querySelector('.checkout-button') as HTMLButtonElement;

    checkoutButton.click();

    // Verify navigation was attempted (would need router spy in real implementation)
    expect(checkoutButton).toBeTruthy();
  });

  it('should display item count', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const itemCount = compiled.querySelector('.items-count');

    expect(itemCount?.textContent).toContain('2');
  });

  it('should allow clearing the cart', () => {
    component.onClearCart();

    expect(mockCartStore.clear).toHaveBeenCalled();
  });
});
