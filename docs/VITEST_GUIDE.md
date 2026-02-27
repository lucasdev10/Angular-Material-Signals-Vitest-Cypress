# 🧪 Guia de Testes com Vitest - Angular 21

## ✅ Por que Vitest?

O Angular 21 vem com **Vitest configurado por padrão**. É a solução oficial e moderna para testes:

- ✅ Oficialmente suportado pelo Angular CLI
- ✅ Extremamente rápido (usa Vite)
- ✅ API compatível com Jest
- ✅ Hot Module Replacement (HMR) para testes
- ✅ UI interativa para visualizar testes
- ✅ Melhor integração com TypeScript

## 🚀 Comandos Básicos

```bash
# Executar todos os testes
npm test

# Executar em modo watch (re-executa ao salvar)
npm test -- --watch

# Executar com UI interativa
npm test -- --ui

# Executar com cobertura
npm test -- --coverage

# Executar teste específico
npm test -- auth.store.spec.ts

# Executar testes que correspondem a um padrão
npm test -- -t "should login"
```

## 📝 Estrutura de um Teste

### Teste Básico

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyService],
    });
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct value', () => {
    const result = service.getValue();
    expect(result).toBe('expected value');
  });
});
```

### Testando Component

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent], // Para standalone components
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const compiled = fixture.nativeElement;
    const h1 = compiled.querySelector('h1');
    expect(h1?.textContent).toContain('My Title');
  });

  it('should handle button click', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(component.count()).toBe(1);
  });
});
```

### Testando Store com Signals

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ProductStore } from './product.store';

describe('ProductStore', () => {
  let store: ProductStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductStore],
    });
    store = TestBed.inject(ProductStore);
  });

  it('should initialize with empty products', () => {
    expect(store.products()).toEqual([]);
  });

  it('should update products signal', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 10 },
      { id: '2', name: 'Product 2', price: 20 },
    ];

    // Simular carregamento de produtos
    store.loadProducts();

    // Aguardar atualização assíncrona
    setTimeout(() => {
      expect(store.products().length).toBeGreaterThan(0);
    }, 100);
  });

  it('should compute filtered products', () => {
    store.setFilters({ minPrice: 15 });

    const filtered = store.filteredProducts();

    expect(filtered.every((p) => p.price >= 15)).toBe(true);
  });
});
```

### Testando com Mocks

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthStore } from './auth.store';
import { AuthRepository } from './auth.repository';

describe('AuthStore', () => {
  let store: AuthStore;
  let mockRepository: any;

  beforeEach(() => {
    // Criar mock do repository
    mockRepository = {
      login: vi.fn(),
      logout: vi.fn(),
      validateToken: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [AuthStore, { provide: AuthRepository, useValue: mockRepository }],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should login successfully', async () => {
    const mockResponse = {
      user: { id: '1', email: 'test@test.com', name: 'Test' },
      token: 'mock-token',
    };

    mockRepository.login.mockReturnValue(of(mockResponse));

    store.login({ email: 'test@test.com', password: 'password' });

    // Aguardar atualização assíncrona
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()?.email).toBe('test@test.com');
    expect(mockRepository.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password',
    });
  });

  it('should handle login error', async () => {
    mockRepository.login.mockReturnValue(throwError(() => ({ message: 'Invalid credentials' })));

    store.login({ email: 'wrong@test.com', password: 'wrong' });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(store.error()).toBe('Invalid credentials');
    expect(store.isAuthenticated()).toBe(false);
  });
});
```

## 🎭 Matchers (Assertions)

### Igualdade

```typescript
expect(value).toBe(expected); // Igualdade estrita (===)
expect(value).toEqual(expected); // Igualdade profunda
expect(value).not.toBe(expected); // Negação
expect(value).toStrictEqual(expected); // Igualdade estrita profunda
```

### Truthiness

```typescript
expect(value).toBeTruthy(); // Verdadeiro
expect(value).toBeFalsy(); // Falso
expect(value).toBeNull(); // Null
expect(value).toBeUndefined(); // Undefined
expect(value).toBeDefined(); // Definido
```

### Números

```typescript
expect(value).toBeGreaterThan(3); // Maior que
expect(value).toBeGreaterThanOrEqual(3); // Maior ou igual
expect(value).toBeLessThan(5); // Menor que
expect(value).toBeLessThanOrEqual(5); // Menor ou igual
expect(value).toBeCloseTo(0.3); // Aproximadamente
```

### Strings

```typescript
expect(string).toMatch(/pattern/); // Regex
expect(string).toContain('substring'); // Contém
expect(string).toHaveLength(5); // Tamanho
```

### Arrays

```typescript
expect(array).toContain(item); // Contém item
expect(array).toHaveLength(3); // Tamanho
expect(array).toEqual(
  // Array igual
  expect.arrayContaining([1, 2]),
);
```

### Objetos

```typescript
expect(obj).toHaveProperty('key'); // Tem propriedade
expect(obj).toMatchObject({
  // Corresponde parcialmente
  key: 'value',
});
```

## 🔧 Mocks e Spies

### Criar Mock

```typescript
import { vi } from 'vitest';

// Mock de função
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
mockFn.mockRejectedValue(new Error('error'));

// Verificar chamadas
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenLastCalledWith(arg);
```

### Spy em Método

```typescript
import { vi } from 'vitest';

const spy = vi.spyOn(obj, 'method');
spy.mockReturnValue('mocked value');

// Restaurar implementação original
spy.mockRestore();
```

### Mock de Módulo

```typescript
import { vi } from 'vitest';

vi.mock('./my-module', () => ({
  myFunction: vi.fn(() => 'mocked'),
}));
```

## ⏱️ Testes Assíncronos

### Usando async/await

```typescript
it('should load data', async () => {
  await service.loadData();

  expect(service.data()).toBeDefined();
});
```

### Usando Promises

```typescript
it('should load data', () => {
  return service.loadData().then(() => {
    expect(service.data()).toBeDefined();
  });
});
```

### Usando setTimeout

```typescript
it('should update after delay', async () => {
  service.delayedUpdate();

  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(service.value()).toBe('updated');
});
```

## 🎯 Hooks de Lifecycle

```typescript
import { describe, it, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

describe('MyTest', () => {
  // Executado uma vez antes de todos os testes
  beforeAll(() => {
    console.log('Setup once');
  });

  // Executado uma vez após todos os testes
  afterAll(() => {
    console.log('Cleanup once');
  });

  // Executado antes de cada teste
  beforeEach(() => {
    console.log('Setup before each test');
  });

  // Executado após cada teste
  afterEach(() => {
    console.log('Cleanup after each test');
  });

  it('test 1', () => {});
  it('test 2', () => {});
});
```

## 📊 Cobertura de Código

### Executar com cobertura

```bash
npm test -- --coverage
```

### Configurar limites de cobertura

Edite `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

## 🎨 UI Interativa

Execute com UI para visualizar testes:

```bash
npm test -- --ui
```

Recursos da UI:

- ✅ Visualização em árvore dos testes
- ✅ Filtros e busca
- ✅ Execução seletiva
- ✅ Visualização de cobertura
- ✅ Hot reload automático

## 🐛 Debugging

### No VS Code

Adicione em `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest Debug",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test", "--", "--run"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Com console.log

```typescript
it('should debug', () => {
  console.log('Debug info:', value);
  expect(value).toBe(expected);
});
```

## 🎯 Boas Práticas

### 1. Organize com describe

```typescript
describe('MyComponent', () => {
  describe('initialization', () => {
    it('should create', () => {});
  });

  describe('user interactions', () => {
    it('should handle click', () => {});
  });
});
```

### 2. Use beforeEach para setup

```typescript
beforeEach(() => {
  // Setup comum
});
```

### 3. Teste comportamento, não implementação

```typescript
// ❌ Ruim
it('should call private method', () => {
  // Testando implementação interna
});

// ✅ Bom
it('should update value when button clicked', () => {
  // Testando comportamento visível
});
```

### 4. Nomes descritivos

```typescript
// ❌ Ruim
it('test 1', () => {});

// ✅ Bom
it('should display error message when login fails', () => {});
```

### 5. Um assert por teste (quando possível)

```typescript
// ✅ Bom
it('should set loading to true', () => {
  expect(store.isLoading()).toBe(true);
});

it('should set error message', () => {
  expect(store.error()).toBe('Error message');
});
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Vitest API Reference](https://vitest.dev/api/)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/)

## ✅ Checklist

- [ ] Todos os services têm testes
- [ ] Todos os components têm testes
- [ ] Todos os stores têm testes
- [ ] Todos os guards têm testes
- [ ] Todos os pipes têm testes
- [ ] Cobertura > 80%
- [ ] Testes passam no CI/CD

---

**Happy Testing with Vitest! 🚀**
