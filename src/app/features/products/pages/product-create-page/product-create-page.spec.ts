import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreatePageComponent } from './product-create-page';

describe('ProductCreatePageComponent', () => {
  let component: ProductCreatePageComponent;
  let fixture: ComponentFixture<ProductCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCreatePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
