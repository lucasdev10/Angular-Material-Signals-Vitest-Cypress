import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
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
import { ProductFacade } from '@app/features/products/store';
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
  private readonly productFacade = inject(ProductFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly isEditMode = signal(false);
  readonly productId = signal<string | null>(null);

  readonly categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Other'];

  readonly productModel = signal<ICreateProductDto>({
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
    min(fieldPath.price, 0.1, { message: 'Minimum of 0.1' });
    required(fieldPath.stock, { message: 'Field required' });
    min(fieldPath.stock, 0, { message: 'Minimum of 0' });
    required(fieldPath.image, { message: 'Field required' });
  });

  private readonly syncedProduct = computed(() => {
    const isLoading = this.productFacade.isLoading();
    const product = this.productFacade.selectedProduct();
    const inEditMode = this.isEditMode();

    if (!isLoading && product && inEditMode) {
      return { ...(product as ICreateProductDto) };
    }

    return null;
  });

  readonly canSubmit = computed(() => this.productForm().valid() && !this.isLoading());

  constructor() {
    this.initializeForm();
    this.setupProductSync();
    this.setupErrorHandling();
  }

  private initializeForm(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  private setupProductSync(): void {
    effect(
      () => {
        const synced = this.syncedProduct();

        if (synced) {
          this.productModel.set(synced);
          this.isLoading.set(false);
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  private setupErrorHandling(): void {
    effect(
      () => {
        const error = this.productFacade.error?.();
        const isLoading = this.productFacade.isLoading();

        if (error && !isLoading && this.isEditMode()) {
          console.error('Erro ao carregar produto:', error);
          this.router.navigate(['/admin/products']);
        }
      },
      { injector: this.injector },
    );
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.productFacade.loadProductById(id);
  }

  onSubmit(): void {
    if (this.productForm().invalid()) {
      this.productForm().markAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.productForm().controlValue();

    if (this.isEditMode() && this.productId()) {
      this.productFacade.updateProduct(this.productId()!, formValue);
    } else {
      this.productFacade.createProduct(formValue);
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
