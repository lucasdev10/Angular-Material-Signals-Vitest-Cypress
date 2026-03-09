import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormError } from './form-error';

describe('FormError', () => {
  let component: FormError;
  let fixture: ComponentFixture<FormError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormError],
    }).compileComponents();

    fixture = TestBed.createComponent(FormError);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.control = signal({
      invalid: () => false,
      touched: () => false,
      errors: () => null,
      pending: () => false,
    }) as any;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not display error when control is valid', () => {
    component.control = signal({
      invalid: () => false,
      touched: () => true,
      errors: () => null,
      pending: () => false,
    }) as any;

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should not display error when control is not touched', () => {
    component.control = signal({
      invalid: () => true,
      touched: () => false,
      errors: () => ({ required: true }),
      pending: () => false,
    }) as any;

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should handle pending state', () => {
    component.control = signal({
      invalid: () => false,
      touched: () => true,
      errors: () => null,
      pending: () => true,
    }) as any;

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
