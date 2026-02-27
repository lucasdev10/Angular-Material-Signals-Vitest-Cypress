/**
 * Modelo de domínio para Produto
 */
export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * DTO para criação de produto (sem campos gerados automaticamente)
 */
export interface ICreateProductDto {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

/**
 * DTO para atualização de produto (todos os campos opcionais)
 */
export interface IUpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  stock?: number;
}

/**
 * Filtros para busca de produtos
 */
export interface IProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
}
