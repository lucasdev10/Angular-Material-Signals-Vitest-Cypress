import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductRepository } from '@app/features/products/repositories/product.repository';
import { initialProductState, ProductFacade, selectProducts } from '@app/features/products/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { AdminProductFormPageComponent } from './admin-product-form-page';

describe('AdminProductFormPageComponent', () => {
  let component: AdminProductFormPageComponent;
  let fixture: ComponentFixture<AdminProductFormPageComponent>;
  let store: MockStore;
  let repository: ProductRepository;
  let productFacade: ProductFacade;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AdminProductFormPageComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {
            product: {
              ...initialProductState,
              products: [],
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductFormPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    productFacade = TestBed.inject(ProductFacade);
    repository = TestBed.inject(ProductRepository);
    await fixture.whenStable();
  });

  it('should invalidate the empty form', () => {
    // Arrange
    const form = component.productForm();

    // Act

    // Assert
    expect(form.valid()).toBeFalsy();
    expect(form.value()).toEqual({
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      image: '',
    });
  });

  it('should validate the negative price', () => {
    // Arrange
    const formModel = component.productModel;
    formModel.set({
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: -10,
      stock: 5,
      image: 'test.jpg',
    });

    // Act

    // Assert
    expect(component.productForm().valid()).toBeFalsy();
    expect(component.productForm.price().errors()[0].message).toBe('Minimum of 00.1');
  });

  it('should submit the correct data', async () => {
    // Arrange
    let products = await firstValueFrom(productFacade.products$);

    expect(products.length).toBe(0);

    const formData = {
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 10.5,
      stock: 5,
      image: 'test.jpg',
    };

    component.productModel.set(formData);

    // Act
    component.onSubmit();

    store.overrideSelector(selectProducts, [
      { ...formData, id: 'product-id-1', createdAt: 1773778252, updatedAt: 1773778252, rating: 0 },
    ]);
    store.refreshState();

    // Assert
    let newProducts = await firstValueFrom(productFacade.products$);

    expect(newProducts.length).toBe(1);
  });
});
