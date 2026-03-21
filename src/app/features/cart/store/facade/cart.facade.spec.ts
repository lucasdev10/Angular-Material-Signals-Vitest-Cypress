import { TestBed } from '@angular/core/testing';
import { StorageService } from '@app/core/storage/storage';
import { IProduct } from '@app/features/products/models/product.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ICart, ICartItem } from '../../models/cart.model';
import { CartActions } from '../cart.actions';
import { initialCartState } from '../cart.state';
import {
  selectIsEmpty,
  selectItemCount,
  selectItems,
  selectShipping,
  selectSubtotal,
  selectTax,
  selectTotal,
} from '../selectors/cart.selectors';
import { CartFacade } from './cart.facade';

describe('Cart Facade', () => {
  let store: MockStore;
  let facade: CartFacade;

  let mockProducts: IProduct[] = [
    {
      id: 'product-id-1',
      name: 'Premium Coffee Beans',
      description: 'Arabica blend from Colombia with rich flavor notes',
      price: 30.0,
      image: '/assets/images/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: 1774015190,
      updatedAt: 1774015190,
    },
    {
      id: 'product-id-2',
      name: 'Espresso Machine Pro',
      description: 'Professional grade espresso maker with 15 bar pressure',
      price: 500.0,
      image: '/assets/images/coffee.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: 1774015190,
      updatedAt: 1774015190,
    },
  ];

  const mockCartItems: ICartItem[] = [
    {
      product: mockProducts[0],
      quantity: 2,
      subtotal: 60.0,
    },
    {
      product: mockProducts[1],
      quantity: 1,
      subtotal: 500.0,
    },
  ];

  const mockCartState = {
    items: mockCartItems,
    subtotal: 560.0,
    shipping: 0,
    tax: 10,
    total: 616.0,
    itemCount: 3,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            cart: {
              ...initialCartState,
              ...mockCartState,
            },
          },
        }),
      ],
    });

    facade = TestBed.inject(CartFacade);
    store = TestBed.inject(MockStore);

    store.overrideSelector(selectItems, mockCartItems);
    store.overrideSelector(selectSubtotal, 560);
    store.overrideSelector(selectShipping, 0);
    store.overrideSelector(selectTax, 0.1);
    store.overrideSelector(selectTotal, 616.0);
    store.overrideSelector(selectItemCount, 3);
    store.overrideSelector(selectIsEmpty, false);
  });

  describe('selectors', () => {
    it('should expose products$', () => {
      expect(facade.items()).toEqual(mockCartItems);
    });

    it('should expose subtotal$', () => {
      expect(facade.subtotal()).toBe(560);
    });

    it('should expose shipping$', () => {
      expect(facade.shipping()).toBe(0);
    });

    it('should expose tax$', () => {
      expect(facade.tax()).toBe(0.1);
    });

    it('should expose total$', () => {
      expect(facade.total()).toBe(616.0);
    });

    it('should expose itemCount$', () => {
      expect(facade.itemCount()).toBe(3);
    });

    it('should expose isEmpty$', () => {
      expect(facade.isEmpty()).toBe(false);
    });
  });

  describe('actions', () => {
    it('should dispatch updateCart action', async () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      store.overrideSelector(selectItems, []);
      store.refreshState();

      await facade.addItem(mockProducts[0], 2);

      const cart: ICart = {
        items: [
          {
            product: mockProducts[0],
            quantity: 2,
            subtotal: 60.0,
          },
        ],
        subtotal: 60.0,
        shipping: 10,
        tax: 6,
        total: 76,
        itemCount: 2,
      };

      expect(dispatchSpy).toHaveBeenCalledWith(CartActions.updateCart({ cart }));
    });

    it('should dispatch loadCartFromStorage action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      const emptyStorage = {
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      };

      const storage = TestBed.inject(StorageService);
      vi.spyOn(storage, 'get').mockReturnValue(emptyStorage);

      facade.loadInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CartActions.loadCartFromStorage({ cart: emptyStorage }),
      );
    });
  });
});
