import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpService } from '@app/core/http/http';
import { IProduct, IProductService } from '@app/features/products/models/Product';
import { Utils } from '@app/shared/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements IProductService {
  protected httpService = inject(HttpService<IProduct>);

  getProducts(): IProduct[] {
    const products: WritableSignal<IProduct[]> = signal([]);

    this.httpService.get('api/products').subscribe({
      next: (res) => {
        products.set(res.data);
      },
      error: (err) => console.error(err),
    });

    return products();
  }

  getProductById(id: string): IProduct {
    const product: WritableSignal<IProduct | null> = signal(null);

    this.httpService.get(`api/products`).subscribe({
      next: (res) => {
        const response = res.filter((p: IProduct) => p.id === id);
        product.set(response);
      },
      error: (err) => console.error(err),
    });

    return product() as IProduct;
  }

  addProduct(product: IProduct): void {
    product.id = Utils.generateRandomId();
    this.httpService.post('api/products', product).subscribe({
      next: () => '',
      error: (err) => console.error(err),
    });
  }

  updateProduct(id: string, product: IProduct): void {
    this.httpService.put(`api/products/${id}`, product).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err),
    });
  }

  deleteProduct(id: string): void {
    this.httpService.delete(`api/products/${id}`).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err),
    });
  }
}
