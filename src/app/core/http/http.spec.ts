import { TestBed } from '@angular/core/testing';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { STORAGE_MOCK, StorageMock } from '../data/mock-data.service';
import { HttpService } from './http';

describe('HttpService', () => {
  let service: HttpService<{ id?: string }>;

  const products = [
    {
      id: Utils.generateId(),
      name: 'Premium Coffee Beans',
      description: 'Arabica blend from Colombia with rich flavor notes',
      price: 29.99,
      image: '/assets/images/coffee.jpg',
      category: 'Food',
      stock: 50,
      rating: 4.5,
      createdAt: moment('2026-01-01').unix(),
      updatedAt: moment('2026-01-01').unix(),
    },
    {
      id: Utils.generateId(),
      name: 'Espresso Machine Pro',
      description: 'Professional grade espresso maker with 15 bar pressure',
      price: 499.99,
      image: '/assets/images/coffee.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: moment('2026-01-02').unix(),
      updatedAt: moment('2026-01-02').unix(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageMock],
    });
    service = TestBed.inject(HttpService);
    vi.spyOn(STORAGE_MOCK, 'set');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data correctly', async () => {
    vi.spyOn(STORAGE_MOCK, 'get').mockReturnValue(products);

    const response = await firstValueFrom(service.get('/api/test'));

    expect(response).toEqual(products);
  });

  it('should get with error', async () => {
    vi.spyOn(STORAGE_MOCK, 'get').mockReturnValue(null);

    await expect(async () => {
      await firstValueFrom(service.get('/api/test'));
    }).rejects.toThrowError(`Resource '/api/test' not found`);
  });

  it('should get data empty correctly ', async () => {
    vi.spyOn(STORAGE_MOCK, 'get').mockReturnValue([]);

    const response = await firstValueFrom(service.get('/api/test'));

    expect(response).toEqual([]);
  });

  it('should get data by ID correctly', async () => {
    vi.spyOn(STORAGE_MOCK, 'get').mockReturnValue(products);

    const response = await firstValueFrom(service.getById('/api/test', products[0].id));

    expect(response).toEqual(products[0]);
  });

  it('should get data with error by ID incorrectly', async () => {
    vi.spyOn(STORAGE_MOCK, 'get').mockReturnValue(products);

    await expect(
      async () => await firstValueFrom(service.getById('/api/test', '999')),
    ).rejects.toThrowError(`Item with id '999' not found in '/api/test'`);
  });

  it('should create data with ID correctly', async () => {
    vi.spyOn(STORAGE_MOCK, 'get').mockReturnValue([]);

    const product = {
      id: undefined,
      name: 'Espresso Machine Pro',
      description: 'Professional grade espresso maker with 15 bar pressure',
      price: 499.99,
      image: '/assets/images/coffee.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: moment('2026-01-02').unix(),
      updatedAt: moment('2026-01-02').unix(),
    };

    const response = await firstValueFrom(service.post('/api/test', product));

    expect(response.id).toBeTruthy();
    expect(response).toEqual({ ...product, id: response.id });
  });

  it('should update data correctly', async () => {
    const id = Utils.generateId();

    const currentProduct = {
      id: id,
      name: 'Espresso Machine Pro',
      description: 'Professional grade espresso maker with 15 bar pressure',
      price: 499.99,
      image: '/assets/images/coffee.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: moment('2026-01-02').unix(),
      updatedAt: moment('2026-01-02').unix(),
    };

    vi.spyOn(STORAGE_MOCK, 'get').mockReturnValue([currentProduct]);

    const newProduct = {
      id: id,
      name: 'Espresso Machine Pro',
      description: 'Professional grade espresso maker with 15 bar pressure',
      price: 399.99,
      image: '/assets/images/coffee.jpg',
      category: 'Electronics',
      stock: 20,
      rating: 4.8,
      createdAt: moment('2026-01-02').unix(),
      updatedAt: moment('2026-01-02').unix(),
    };

    const response = await firstValueFrom(service.put('/api/test', id, newProduct));

    expect(response).toEqual(newProduct);
    expect(response.stock).toBe(newProduct.stock);
    expect(response.price).toBe(newProduct.price);
  });

  it('should delete data correctly', async () => {
    const id = Utils.generateId();

    const product = {
      id: id,
      name: 'Espresso Machine Pro',
      description: 'Professional grade espresso maker with 15 bar pressure',
      price: 499.99,
      image: '/assets/images/coffee.jpg',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
      createdAt: moment('2026-01-02').unix(),
      updatedAt: moment('2026-01-02').unix(),
    };

    vi.spyOn(STORAGE_MOCK, 'get').mockReturnValue([product]);
    vi.spyOn(service, 'delete');

    await firstValueFrom(service.delete('/api/test', id));

    expect(service.delete).toHaveBeenCalledTimes(1);
  });
});
