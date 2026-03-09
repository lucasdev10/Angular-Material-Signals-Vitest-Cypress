import { TestBed } from '@angular/core/testing';
import { MockDataService, STORAGE_MOCK } from './mock-data.service';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    STORAGE_MOCK.clear();

    TestBed.configureTestingModule({
      providers: [MockDataService],
    });
    service = TestBed.inject(MockDataService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize mock data on creation', () => {
    expect(STORAGE_MOCK.size).toBeGreaterThan(0);
  });

  it('should have products in storage', () => {
    const products = STORAGE_MOCK.get('products');
    expect(products).toBeTruthy();
    expect(Array.isArray(products)).toBe(true);
    expect((products as any[]).length).toBeGreaterThan(0);
  });

  it('should have users in storage', () => {
    const users = STORAGE_MOCK.get('users');
    expect(users).toBeTruthy();
    expect(Array.isArray(users)).toBe(true);
    expect((users as any[]).length).toBeGreaterThan(0);
  });

  it('should clear and reinitialize data', () => {
    const initialSize = STORAGE_MOCK.size;

    service.clear();

    expect(STORAGE_MOCK.size).toBe(initialSize);
  });

  it('should not reinitialize if storage already has data', () => {
    const initialProducts = STORAGE_MOCK.get('products');

    // Create new service instance
    const newService = new MockDataService();

    const productsAfter = STORAGE_MOCK.get('products');
    expect(productsAfter).toEqual(initialProducts);
  });
});

describe('StorageMock', () => {
  beforeEach(() => {
    localStorage.clear();
    STORAGE_MOCK.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should set and get values', () => {
    const testData = { name: 'test', value: 123 };
    STORAGE_MOCK.set('test', testData);

    const retrieved = STORAGE_MOCK.get('test');
    expect(retrieved).toEqual(testData);
  });

  it('should return undefined for non-existent keys', () => {
    const result = STORAGE_MOCK.get('non-existent');
    expect(result).toBeUndefined();
  });

  it('should check if key exists', () => {
    STORAGE_MOCK.set('test', 'value');

    expect(STORAGE_MOCK.has('test')).toBe(true);
    expect(STORAGE_MOCK.has('non-existent')).toBe(false);
  });

  it('should clear all mock data', () => {
    STORAGE_MOCK.set('test1', 'value1');
    STORAGE_MOCK.set('test2', 'value2');

    expect(STORAGE_MOCK.size).toBe(2);

    STORAGE_MOCK.clear();

    expect(STORAGE_MOCK.size).toBe(0);
  });

  it('should only clear keys with MOCK_ prefix', () => {
    localStorage.setItem('other_key', 'other_value');
    STORAGE_MOCK.set('test', 'value');

    STORAGE_MOCK.clear();

    expect(localStorage.getItem('other_key')).toBe('other_value');
    expect(STORAGE_MOCK.has('test')).toBe(false);
  });

  it('should calculate size correctly', () => {
    expect(STORAGE_MOCK.size).toBe(0);

    STORAGE_MOCK.set('test1', 'value1');
    expect(STORAGE_MOCK.size).toBe(1);

    STORAGE_MOCK.set('test2', 'value2');
    expect(STORAGE_MOCK.size).toBe(2);

    STORAGE_MOCK.clear();
    expect(STORAGE_MOCK.size).toBe(0);
  });

  it('should handle complex objects', () => {
    const complexData = {
      id: '123',
      nested: {
        array: [1, 2, 3],
        object: { key: 'value' },
      },
      date: new Date().toISOString(),
    };

    STORAGE_MOCK.set('complex', complexData);
    const retrieved = STORAGE_MOCK.get('complex');

    expect(retrieved).toEqual(complexData);
  });

  it('should handle arrays', () => {
    const arrayData = [1, 2, 3, 4, 5];

    STORAGE_MOCK.set('array', arrayData);
    const retrieved = STORAGE_MOCK.get('array');

    expect(retrieved).toEqual(arrayData);
  });

  it('should handle null values', () => {
    STORAGE_MOCK.set('null', null);
    const retrieved = STORAGE_MOCK.get('null');

    expect(retrieved).toBeNull();
  });

  it('should handle boolean values', () => {
    STORAGE_MOCK.set('bool', true);
    const retrieved = STORAGE_MOCK.get('bool');

    expect(retrieved).toBe(true);
  });

  it('should handle number values', () => {
    STORAGE_MOCK.set('number', 42);
    const retrieved = STORAGE_MOCK.get('number');

    expect(retrieved).toBe(42);
  });

  it('should handle string values', () => {
    STORAGE_MOCK.set('string', 'test string');
    const retrieved = STORAGE_MOCK.get('string');

    expect(retrieved).toBe('test string');
  });

  it('should overwrite existing values', () => {
    STORAGE_MOCK.set('test', 'value1');
    expect(STORAGE_MOCK.get('test')).toBe('value1');

    STORAGE_MOCK.set('test', 'value2');
    expect(STORAGE_MOCK.get('test')).toBe('value2');
  });
});
