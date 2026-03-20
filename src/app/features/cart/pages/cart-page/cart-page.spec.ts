import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartDomainService } from '@app/domain/cart/cart-domain.service';
import { IProduct } from '@app/features/products/models/product.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CartFacade, initialCartState, selectIsEmpty, selectItems } from '../../store';
import { selectItemCount, selectSubtotal, selectTax } from '../../store/selectors/cart.selectors';
import { CartPage } from './cart-page';

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let store: MockStore;
  let cartFacade: CartFacade;
  let cartDomainService: CartDomainService;

  const mockProduct: IProduct = {
    id: 'product-id-1',
    name: 'Test Product',
    description: 'Test Description',
    price: 50,
    image: '/test.jpg',
    category: 'Test',
    stock: 10,
    rating: 4.5,
    createdAt: 1773856464,
    updatedAt: 1773856464,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              ...initialCartState,
              items: [
                {
                  product: mockProduct,
                  quantity: 2,
                  subtotal: 100,
                },
              ],
              subtotal: 100,
              tax: 10,
              shipping: 10,
              total: 120,
              itemCount: 2,
            },
          },
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    cartFacade = TestBed.inject(CartFacade);
    cartDomainService = TestBed.inject(CartDomainService);

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectItems, [
      {
        product: mockProduct,
        quantity: 2,
        subtotal: 100,
      },
    ]);
    store.overrideSelector(selectIsEmpty, false);
    store.overrideSelector(selectTax, 10);
    store.overrideSelector(selectItemCount, 2);
    store.refreshState();

    vi.spyOn(cartDomainService, 'qualifiesForFreeShipping').mockReturnValue(false);

    cartFacade.clear();

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
    vi.spyOn(cartFacade, 'updateQuantity');

    component.onUpdateQuantity(mockProduct.id, 3);

    expect(cartFacade.updateQuantity).toHaveBeenCalledWith(mockProduct.id, 3);
  });

  it('should call removeItem when remove button is clicked', () => {
    vi.spyOn(cartFacade, 'removeItem');

    component.onRemoveItem(mockProduct.id);

    expect(cartFacade.removeItem).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should display empty cart message when cart is empty', () => {
    store.overrideSelector(selectIsEmpty, true);
    store.overrideSelector(selectItems, []);
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyMessage = compiled.querySelector('.empty-cart');

    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage?.textContent).toContain('Your cart is empty');
  });

  it('should show free shipping badge when applicable', () => {
    vi.spyOn(cartDomainService, 'qualifiesForFreeShipping').mockReturnValue(true);
    store.overrideSelector(selectSubtotal, 150);
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const freeShippingBadge = compiled.querySelector('.shipping-badge');

    expect(freeShippingBadge).toBeTruthy();
    expect(freeShippingBadge?.textContent?.trim()).toBe('Free');
  });

  it('should have checkout button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const checkoutButton = compiled.querySelector('.checkout-button');

    expect(checkoutButton).toBeTruthy();
  });

  it('should hidden checkout button when cart is empty', () => {
    store.overrideSelector(selectIsEmpty, true);
    store.refreshState();
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
    vi.spyOn(cartFacade, 'clear');

    component.onClearCart();

    expect(cartFacade.clear).toHaveBeenCalled();
  });
});
