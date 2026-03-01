import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ICreateProductDto } from '@app/features/products/models/product.model';
import { ProductStore } from '@app/features/products/store/product.store';
import { AdminProductsPageComponent } from './admin-products-page';

describe('AdminProductsPageComponent', () => {
  let component: AdminProductsPageComponent;
  let fixture: ComponentFixture<AdminProductsPageComponent>;
  let storeProduct: ProductStore;

  const product: ICreateProductDto = {
    name: 'test',
    description: 'test',
    price: 10,
    image: '',
    category: 'test',
    stock: 10,
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AdminProductsPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductsPageComponent);
    component = fixture.componentInstance;
    storeProduct = TestBed.inject(ProductStore);
    await fixture.whenStable();
  });

  it('should update the list after creating the product', () => {
    expect(component.products()).toEqual([]);

    storeProduct.createProduct(product);

    setTimeout(() => {
      expect(component.products()).toEqual([product]);
    }, 1000);
  });

  it('should remove the product from the list after deleting it', () => {
    setTimeout(() => {
      const productId = component.products()[0].id;
      storeProduct.deleteProduct(productId);

      setTimeout(() => {
        expect(component.products()).toEqual([]);
      }, 1000);
    }, 1000);
  });
});
