import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProductDto } from '@app/features/products/models/product.model';
import { ProductStore } from '@app/features/products/store/product.store';

@Component({
  selector: 'app-admin-product-form-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-product-form-page.html',
  styleUrl: './admin-product-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdminProductFormPageComponent {
  private readonly productStore = inject(ProductStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = signal(false);
  readonly isEditMode = signal(false);
  readonly productId = signal<string | null>(null);

  readonly categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Other'];

  readonly productForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    image: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly canSubmit = computed(() => this.productForm.valid && !this.isLoading());

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    const product = this.productStore.products().find((p) => p.id === id);

    if (product) {
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
      });
      this.isLoading.set(false);
    } else {
      this.router.navigate(['/admin/products']);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.productForm.getRawValue();

    if (this.isEditMode() && this.productId()) {
      this.productStore.updateProduct(this.productId()!, formValue);
    } else {
      const newProduct: CreateProductDto = formValue;
      this.productStore.createProduct(newProduct);
    }

    // Aguarda um pouco para simular salvamento
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/admin/products']);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['minlength'])
      return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}`;

    return '';
  }
}
