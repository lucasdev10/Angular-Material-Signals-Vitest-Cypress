import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductRepository } from '@app/features/products/repositories/product.repository';
import { ProductStore } from '@app/features/products/store/product.store';
import { AdminProductFormPageComponent } from './admin-product-form-page';

describe('AdminProductFormPageComponent', () => {
  let component: AdminProductFormPageComponent;
  let fixture: ComponentFixture<AdminProductFormPageComponent>;
  let productStore: ProductStore;
  let repository: ProductRepository;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AdminProductFormPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductFormPageComponent);
    component = fixture.componentInstance;
    productStore = TestBed.inject(ProductStore);
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
    expect(productStore.products().length).toBe(0);

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

    // Assert
    await vi.waitFor(() => {
      expect(productStore.products().length).toBe(4);
    });
  });
});
