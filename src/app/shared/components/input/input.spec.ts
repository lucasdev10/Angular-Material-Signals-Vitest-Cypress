import { FocusMonitor } from '@angular/cdk/a11y';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent, InputValidators } from './input';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let focusMonitor: FocusMonitor;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    focusMonitor = TestBed.inject(FocusMonitor);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input', () => {
    const inputElement = fixture.debugElement.nativeElement.querySelector('input');
    expect(inputElement).toBeTruthy();
  });

  it('should emit value on input', () => {
    const inputValue = 'test value';
    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    inputElement.value = inputValue;
    inputElement.dispatchEvent(new Event('input'));

    expect(emitSpy).toHaveBeenCalledWith(inputValue);
  });

  it('should set input value', () => {
    const inputValue = 'test value';
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    component.writeValue(inputValue);
    fixture.detectChanges();
    expect(component.value).toBe(inputValue);
  });

  it('should clear input value', () => {
    const inputValue = 'test value';
    component.clearable = true;
    component.writeValue(inputValue);
    fixture.detectChanges();

    component.clearValue();
    fixture.detectChanges();

    expect(component.value).toBe('');
  });

  it('should toggle password visibility', () => {
    component.type = 'password';
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.currentType).toBe('password');
    expect(component.showPassword).toBe(false);

    component.togglePasswordVisibility();
    fixture.detectChanges();
    expect(component.currentType).toBe('text');
    expect(component.showPassword).toBe(true);

    component.togglePasswordVisibility();
    fixture.detectChanges();
    expect(component.currentType).toBe('password');
    expect(component.showPassword).toBe(false);
  });

  it('should handle escape key press when clearable', () => {
    component.clearable = true;
    component.writeValue('test value');
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onKeyDown(event);

    expect(component.value).toBe('');
  });

  it('should not clear on escape when not clearable', () => {
    component.clearable = false;
    component.writeValue('test value');
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onKeyDown(event);

    expect(component.value).toBe('test value');
  });

  it('should emit focus event', () => {
    const emitSpy = vi.spyOn(component.focusedEvent, 'emit');
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    const focusEvent = new FocusEvent('focus');
    inputElement.dispatchEvent(focusEvent);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit blur event', () => {
    const emitSpy = vi.spyOn(component.blurred, 'emit');
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    const blurEvent = new FocusEvent('blur');
    inputElement.dispatchEvent(blurEvent);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit keydown event', () => {
    const emitSpy = vi.spyOn(component.keyDown, 'emit');
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    const keyEvent = new KeyboardEvent('keydown', { key: 'a' });
    inputElement.dispatchEvent(keyEvent);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit keyup event', () => {
    const emitSpy = vi.spyOn(component.keyUp, 'emit');
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    const keyEvent = new KeyboardEvent('keyup', { key: 'a' });
    inputElement.dispatchEvent(keyEvent);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(component.disabled).toBe(true);

    component.setDisabledState(false);
    fixture.detectChanges();
    expect(component.disabled).toBe(false);
  });

  it('should validate required field', () => {
    component.required = true;
    const control = new FormControl('');

    const errors = component.validate(control);

    expect(errors).toBeTruthy();
    expect(errors?.['required']).toBeTruthy();
  });

  it('should validate minLength', () => {
    component.minLength = 5;
    const control = new FormControl('abc');

    const errors = component.validate(control);

    expect(errors).toBeTruthy();
    expect(errors?.['minlength']).toBeTruthy();
  });

  it('should validate maxLength', () => {
    component.maxLength = 5;
    const control = new FormControl('abcdefgh');

    const errors = component.validate(control);

    expect(errors).toBeTruthy();
    expect(errors?.['maxlength']).toBeTruthy();
  });

  it('should validate email format', () => {
    component.type = 'email';
    const control = new FormControl('invalid-email');

    const errors = component.validate(control);

    expect(errors).toBeTruthy();
    expect(errors?.['email']).toBeTruthy();
  });

  it('should validate pattern', () => {
    component.pattern = '^[0-9]+$';
    const control = new FormControl('abc');

    const errors = component.validate(control);

    expect(errors).toBeTruthy();
    expect(errors?.['pattern']).toBeTruthy();
  });

  it('should apply custom validators', () => {
    const customValidator = (control: AbstractControl) => {
      return control.value === 'invalid' ? { custom: { message: 'Custom error' } } : null;
    };

    component.customValidators = [customValidator];
    const control = new FormControl('invalid');

    const errors = component.validate(control);

    expect(errors).toBeTruthy();
    expect(errors?.['custom']).toBeTruthy();
  });

  it('should focus input programmatically', () => {
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    const focusSpy = vi.spyOn(inputElement, 'focus');

    component.focus();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should blur input programmatically', () => {
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    const blurSpy = vi.spyOn(inputElement, 'blur');

    component.blur();

    expect(blurSpy).toHaveBeenCalled();
  });

  it('should select input text', () => {
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    const selectSpy = vi.spyOn(inputElement, 'select');

    component.select();

    expect(selectSpy).toHaveBeenCalled();
  });

  it('should handle icon click', () => {
    const icon = {
      name: 'search',
      position: 'left' as const,
      clickable: true,
      onClick: vi.fn(),
    };

    const emitSpy = vi.spyOn(component.iconClick, 'emit');

    component.onIconClick(icon);

    expect(icon.onClick).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(icon);
  });

  it('should not call onClick when icon is not clickable', () => {
    const icon = {
      name: 'search',
      position: 'left' as const,
      clickable: false,
      onClick: vi.fn(),
    };

    component.onIconClick(icon);

    expect(icon.onClick).not.toHaveBeenCalled();
  });

  it('should generate unique input id', () => {
    expect(component.inputId).toMatch(/^input-/);
    expect(component.helperId).toBe(`${component.inputId}-helper`);
    expect(component.errorId).toBe(`${component.inputId}-error`);
  });

  it('should get aria-describedby with helper text', () => {
    component.helperText = 'Helper text';
    fixture.detectChanges();

    const ariaDescribedBy = component.getAriaDescribedByValue();

    expect(ariaDescribedBy).toContain(component.helperId);
  });

  it('should get aria-describedby with error', () => {
    component.required = true;
    const control = new FormControl('');
    component.validate(control);
    fixture.detectChanges();

    const ariaDescribedBy = component.getAriaDescribedByValue();

    expect(ariaDescribedBy).toContain(component.errorId);
  });

  it('should apply css classes based on state', () => {
    component.size = 'lg';
    component.variant = 'filled';
    component.disabled = true;

    const classes = component.cssClasses;

    expect(classes).toContain('input-lg');
    expect(classes).toContain('input-filled');
    expect(classes).toContain('input-disabled');
  });

  it('should register onChange callback', () => {
    const callback = vi.fn();
    component.registerOnChange(callback);

    component.writeValue('test');
    component.onInput({ target: { value: 'new value' } } as any);

    expect(callback).toHaveBeenCalledWith('new value');
  });

  it('should register onTouched callback', () => {
    const callback = vi.fn();
    component.registerOnTouched(callback);

    component.onBlur(new FocusEvent('blur'));

    expect(callback).toHaveBeenCalled();
  });
});

describe('InputValidators', () => {
  describe('cpf', () => {
    it('should validate valid CPF', () => {
      const control = new FormControl('12345678909');
      const result = InputValidators.cpf(control);
      expect(result).toBeNull();
    });

    it('should invalidate CPF with wrong length', () => {
      const control = new FormControl('123456789');
      const result = InputValidators.cpf(control);
      expect(result).toBeTruthy();
      expect(result?.['cpf']).toBeTruthy();
    });

    it('should invalidate invalid CPF', () => {
      const control = new FormControl('11111111111');
      const result = InputValidators.cpf(control);
      expect(result).toBeTruthy();
    });

    it('should allow empty value', () => {
      const control = new FormControl('');
      const result = InputValidators.cpf(control);
      expect(result).toBeNull();
    });
  });

  describe('cnpj', () => {
    it('should validate valid CNPJ', () => {
      const control = new FormControl('11222333000181');
      const result = InputValidators.cnpj(control);
      expect(result).toBeNull();
    });

    it('should invalidate CNPJ with wrong length', () => {
      const control = new FormControl('1122233300018');
      const result = InputValidators.cnpj(control);
      expect(result).toBeTruthy();
    });

    it('should invalidate invalid CNPJ', () => {
      const control = new FormControl('11111111111111');
      const result = InputValidators.cnpj(control);
      expect(result).toBeTruthy();
    });

    it('should allow empty value', () => {
      const control = new FormControl('');
      const result = InputValidators.cnpj(control);
      expect(result).toBeNull();
    });
  });

  describe('strongPassword', () => {
    it('should validate strong password', () => {
      const control = new FormControl('Abc123!@#');
      const result = InputValidators.strongPassword(control);
      expect(result).toBeNull();
    });

    it('should invalidate password without uppercase', () => {
      const control = new FormControl('abc123!@#');
      const result = InputValidators.strongPassword(control);
      expect(result).toBeTruthy();
    });

    it('should invalidate password without lowercase', () => {
      const control = new FormControl('ABC123!@#');
      const result = InputValidators.strongPassword(control);
      expect(result).toBeTruthy();
    });

    it('should invalidate password without number', () => {
      const control = new FormControl('Abcdef!@#');
      const result = InputValidators.strongPassword(control);
      expect(result).toBeTruthy();
    });

    it('should invalidate password without special character', () => {
      const control = new FormControl('Abc123456');
      const result = InputValidators.strongPassword(control);
      expect(result).toBeTruthy();
    });

    it('should invalidate short password', () => {
      const control = new FormControl('Abc1!');
      const result = InputValidators.strongPassword(control);
      expect(result).toBeTruthy();
    });

    it('should allow empty value', () => {
      const control = new FormControl('');
      const result = InputValidators.strongPassword(control);
      expect(result).toBeNull();
    });
  });
});
