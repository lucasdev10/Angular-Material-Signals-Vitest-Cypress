import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartStore } from '@app/features/cart/store/cart.store';
import { IProduct } from '@app/features/products/models/product.model';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { HeaderComponent } from './header';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartStore: CartStore;

  const product: IProduct = {
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
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    cartStore = TestBed.inject(CartStore);
    cartStore.clear();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the badge when an item is added', () => {
    // Arrange
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.mat-badge-content');

    expect(badge?.textContent).toBe('0');

    // Act
    cartStore.addItem(product, 2);
    fixture.detectChanges();

    // Assert
    expect(badge?.textContent).toBe('2');
  });

  it('should react to the change of state', () => {
    // Arrange
    let cartItemCount = component.cartItemCount();
    expect(cartItemCount).toBe(0);

    // Act
    cartStore.addItem(product, 4);

    // Assert
    cartItemCount = component.cartItemCount();
    expect(cartItemCount).toBe(4);
  });
});
