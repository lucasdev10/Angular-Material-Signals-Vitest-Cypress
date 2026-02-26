import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

/**
 * Serviço centralizado para gerenciar dados mock
 * Simula comportamento de API real com delays e possíveis erros
 */
@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private readonly DELAY_MS = 500; // Simula latência de rede
  private storage = new Map<string, unknown>();

  constructor() {
    this.initializeMockData();
  }

  /**
   * Inicializa dados mock no "banco de dados" simulado
   */
  private initializeMockData(): void {
    // Produtos iniciais
    const products = [
      {
        id: '1',
        name: 'Premium Coffee Beans',
        description: 'Arabica blend from Colombia with rich flavor notes',
        price: 29.99,
        image: '/assets/images/coffee.jpg',
        category: 'Food',
        stock: 50,
        rating: 4.5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Espresso Machine Pro',
        description: 'Professional grade espresso maker with 15 bar pressure',
        price: 499.99,
        image: '/assets/images/coffee.jpg',
        category: 'Electronics',
        stock: 15,
        rating: 4.8,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        name: 'Coffee Grinder Deluxe',
        description: 'Precision burr grinder with 15 settings',
        price: 79.99,
        image: '/assets/images/coffee.jpg',
        category: 'Electronics',
        stock: 8,
        rating: 4.3,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];

    this.storage.set('products', products);
  }

  /**
   * GET - Busca dados por chave
   */
  get<T>(key: string): Observable<T> {
    const data = this.storage.get(key);

    if (!data) {
      return throwError(() => ({
        status: 404,
        message: `Resource '${key}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    return of(data as T).pipe(delay(this.DELAY_MS));
  }

  /**
   * GET BY ID - Busca item específico em uma coleção
   */
  getById<T>(key: string, id: string): Observable<T> {
    const collection = this.storage.get(key) as T[];

    if (!collection) {
      return throwError(() => ({
        status: 404,
        message: `Collection '${key}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    const item = collection.find((item: T) => (item as { id: string }).id === id);

    if (!item) {
      return throwError(() => ({
        status: 404,
        message: `Item with id '${id}' not found in '${key}'`,
      })).pipe(delay(this.DELAY_MS));
    }

    return of(item).pipe(delay(this.DELAY_MS));
  }

  /**
   * POST - Adiciona novo item à coleção
   */
  post<T extends { id?: string }>(key: string, item: T): Observable<T> {
    const collection = (this.storage.get(key) as T[]) || [];

    // Gera ID se não existir
    if (!item.id) {
      item.id = this.generateId();
    }

    collection.push(item);
    this.storage.set(key, collection);

    return of(item).pipe(delay(this.DELAY_MS));
  }

  /**
   * PUT - Atualiza item existente
   */
  put<T extends { id: string }>(key: string, id: string, item: T): Observable<T> {
    const collection = this.storage.get(key) as T[];

    if (!collection) {
      return throwError(() => ({
        status: 404,
        message: `Collection '${key}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    const index = collection.findIndex((i: T) => i.id === id);

    if (index === -1) {
      return throwError(() => ({
        status: 404,
        message: `Item with id '${id}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    collection[index] = { ...collection[index], ...item, id };
    this.storage.set(key, collection);

    return of(collection[index]).pipe(delay(this.DELAY_MS));
  }

  /**
   * DELETE - Remove item da coleção
   */
  delete(key: string, id: string): Observable<void> {
    const collection = this.storage.get(key) as { id: string }[];

    if (!collection) {
      return throwError(() => ({
        status: 404,
        message: `Collection '${key}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    const filtered = collection.filter((item) => item.id !== id);

    if (filtered.length === collection.length) {
      return throwError(() => ({
        status: 404,
        message: `Item with id '${id}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    this.storage.set(key, filtered);
    return of(void 0).pipe(delay(this.DELAY_MS));
  }

  /**
   * Gera ID único
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Limpa todos os dados (útil para testes)
   */
  clear(): void {
    this.storage.clear();
    this.initializeMockData();
  }
}
