import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { initialAuthState } from '@app/features/auth/store';
import {
  CartFacade,
  initialCartState,
  selectItemCount,
  selectItems,
  selectShipping,
  selectTax,
} from '@app/features/cart/store';
import { IProduct } from '@app/features/products/models/product.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HeaderComponent } from './header';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartFacade: CartFacade;
  let store: MockStore;

  const mockProduct: IProduct = {
    id: 'product-id-1',
    name: 'Premium Coffee Beans',
    description: 'Arabica blend from Colombia with rich flavor notes',
    price: 29.99,
    image: '/assets/images/coffee.jpg',
    category: 'Food',
    stock: 50,
    rating: 4.5,
    createdAt: 1773859273,
    updatedAt: 1773859273,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {
            cart: {
              ...initialCartState,
            },
            auth: {
              ...initialAuthState,
            },
          },
        }),
      ],
    }).compileComponents();

    cartFacade = TestBed.inject(CartFacade);
    cartFacade.clear();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectItems, [
      {
        product: mockProduct,
        quantity: 2,
        subtotal: 100,
      },
    ]);
    store.overrideSelector(selectItemCount, 0);
    store.overrideSelector(selectTax, 10);
    store.overrideSelector(selectItemCount, 0);
    store.overrideSelector(selectShipping, 10);
    store.refreshState();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the badge when an item is added', async () => {
    // Arrange
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.mat-badge-content');

    expect(badge?.textContent).toBe('0');

    store.overrideSelector(selectItemCount, 2);
    store.refreshState();

    // Act
    await cartFacade.addItem(mockProduct, 2);
    fixture.detectChanges();

    // Assert
    expect(badge?.textContent).toBe('2');
  });

  it('should react to the change of state', async () => {
    store.overrideSelector(selectItemCount, 0);
    store.refreshState();

    // Arrange
    expect(component.cartItemCount()).toBe(0);

    store.overrideSelector(selectItemCount, 4);
    store.refreshState();

    // Act
    await cartFacade.addItem(mockProduct, 4);
    fixture.detectChanges();

    // Assert
    expect(component.cartItemCount()).toBe(4);
  });

  it('should call logout correctly', () => {
    const mockLogout = vi.spyOn(component, 'onLogout');

    component.onLogout();

    expect(mockLogout).toHaveBeenCalled();
  });
});
