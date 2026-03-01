import { TestBed } from '@angular/core/testing';
import { HttpService } from '@app/core/http/http';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ICreateProductDto } from '../models/product.model';
import { ProductRepository } from './product.repository';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let httpService: HttpService<{}>;

  let products = [
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
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductRepository],
    });

    productRepository = TestBed.inject(ProductRepository);
    httpService = TestBed.inject(HttpService);
  });

  // - [ ] Deve retornar lista vazia corretamente
  // - [ ] Deve mapear dados se necessário

  it('should add default fields on create', async () => {
    const dto: ICreateProductDto = {
      name: 'Product test',
      description: 'Product test',
      price: 10,
      image: '',
      category: 'Food',
      stock: 20,
    };

    const mockHttp = vi.spyOn(httpService, 'post');

    mockHttp.mockReturnValue(
      of({
        ...dto,
        id: Utils.generateId(),
        image: dto.image || '/assets/images/coffee.jpg',
        rating: 0,
        createdAt: moment().unix(),
        updatedAt: moment().unix(),
      }),
    );

    const response = await firstValueFrom(productRepository.create(dto));

    expect(mockHttp).toHaveBeenCalled();
    expect(response.rating).toBe(0);
    expect(response.createdAt).toBeDefined();
    expect(response.updatedAt).toBeDefined();
  });

  it('should call correct endpoint', async () => {
    const mockHttp = vi.spyOn(httpService, 'get');
    mockHttp.mockReturnValue(of(products));

    await firstValueFrom(productRepository.findAll());

    expect(mockHttp).toHaveBeenCalledWith('products');
  });

  it('should call findAll and return products', async () => {
    const mockHttp = vi.spyOn(httpService, 'get');
    mockHttp.mockReturnValue(of(products));

    const result = await firstValueFrom(productRepository.findAll());

    expect(result).toEqual(products);
  });

  it('should propagate error when http fails', async () => {
    const mockHttp = vi.spyOn(httpService, 'get');
    mockHttp.mockReturnValue(throwError(() => new Error('Http Error')));

    await expect(firstValueFrom(productRepository.findAll())).rejects.toThrow('Http Error');

    expect(mockHttp).toHaveBeenCalledWith('products');
  });

  it('should return list empty correctly', async () => {
    const mockHttp = vi.spyOn(httpService, 'get');
    mockHttp.mockReturnValue(of([]));

    const response = await firstValueFrom(productRepository.findAll());

    expect(response).toEqual([]);
  });

  it('should delete item correctly', async () => {
    const mockHttpDelete = vi.spyOn(httpService, 'delete');
    mockHttpDelete.mockReturnValueOnce(of(void 0));

    await firstValueFrom(productRepository.delete(products[0].id));

    expect(mockHttpDelete).toHaveBeenCalled();
  });
});
