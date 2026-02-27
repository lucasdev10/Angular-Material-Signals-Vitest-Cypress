import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, min, minLength, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreateProductDto } from '@app/features/products/models/product.model';
import { ProductStore } from '@app/features/products/store/product.store';
import { FormError } from '@app/shared';

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
    FormField,
    FormError,
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

  private readonly productModel = signal<ICreateProductDto>({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
  });
  readonly productForm = form(this.productModel, (fieldPath) => {
    required(fieldPath.name, { message: 'Field required' });
    minLength(fieldPath.name, 3, { message: 'Minimum of 3 characters' });
    required(fieldPath.description, { message: 'Field required' });
    minLength(fieldPath.description, 10, { message: 'Minimum of 10 characters' });
    required(fieldPath.category, { message: 'Field required' });
    required(fieldPath.price, { message: 'Field required' });
    min(fieldPath.price, 0.1, { message: 'Minimum of 00.1' });
    required(fieldPath.stock, { message: 'Field required' });
    min(fieldPath.stock, 0, { message: 'Minimum of 0' });
    required(fieldPath.image, { message: 'Field required' });
  });

  readonly canSubmit = computed(() => this.productForm().valid() && !this.isLoading());

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
      this.productModel.set({ ...product });
      this.isLoading.set(false);
    } else {
      this.router.navigate(['/admin/products']);
    }
  }

  onSubmit(): void {
    if (this.productForm().invalid()) {
      this.productForm().markAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.productForm().controlValue();

    if (this.isEditMode() && this.productId()) {
      this.productStore.updateProduct(this.productId()!, formValue);
    } else {
      const newProduct: ICreateProductDto = formValue;
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
}
