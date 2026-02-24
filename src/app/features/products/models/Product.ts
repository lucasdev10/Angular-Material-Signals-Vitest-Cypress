export interface IProductService {
  getProducts(): IProduct[];
  getProductById(id: number): IProduct;
  addProduct(product: IProduct): void;
  updateProduct(id: number, product: IProduct): void;
  deleteProduct(id: number): void;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
}
