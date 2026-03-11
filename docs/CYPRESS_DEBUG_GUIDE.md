# 🐛 Guia de Debug - Cypress

## Problemas Comuns e Soluções

### 1. Timing Assíncrono

**Problema**: Elementos não são encontrados ou contagens incorretas

```typescript
// ❌ ERRADO - Não funciona corretamente
cy.get('body').then(($body) => {
  const rows = $body.find('.products-table tbody tr');
  const initialCount = rows.length; // Pode ser 0 mesmo tendo produtos!
});
```

**Solução**: Use `cy.get()` que aguarda automaticamente

```typescript
// ✅ CORRETO - Aguarda os elementos aparecerem
cy.get('.products-table tbody tr').then(($rows) => {
  const initialCount = $rows.length; // Agora pega o valor correto!
});
```

**Por que acontece?**

- `cy.get('body').then()` captura um snapshot do DOM naquele momento
- Se o Angular ainda está renderizando, a tabela pode estar vazia
- `cy.get('.products-table tbody tr')` aguarda automaticamente até os elementos aparecerem

### 2. Signals e Store não Atualizam

**Problema**: Produto criado no admin não aparece na lista pública

```typescript
// ❌ Não funciona - produto não aparece na lista pública
it('test', () => {
  cy.visit('/admin/products/create');
  // ... cria produto ...
  cy.visit('/products'); // Produto não aparece!
});
```

**Causa**: Store singleton carrega produtos apenas uma vez no constructor

**Solução**: Força reload completo da página

```typescript
// ✅ Funciona - reinicializa toda a aplicação
it('should create and see product', () => {
  // Cria produto
  cy.visit('/admin/products/create');
  // ... preenche formulário ...
  cy.contains('button', 'Register').click();

  // Força reload completo - reinicializa toda a aplicação
  cy.reload();
  cy.visit('/products');

  // Agora o produto aparece!
  cy.contains(productName).should('be.visible');
});
```

### 3. Elementos não Encontrados

**Problema**: `cy.get()` falha ao encontrar elementos

**Soluções**:

```typescript
// Aguardar elemento aparecer
cy.get('.loading-spinner').should('not.exist');
cy.get('.products-table').should('be.visible');

// Usar timeout maior
cy.get('.my-element', { timeout: 10000 }).should('exist');

// Verificar estados alternativos
cy.get('body').then(($body) => {
  if ($body.find('.empty-state').length > 0) {
    cy.log('Empty state found');
  } else {
    cy.get('.products-table tbody tr').should('exist');
  }
});
```

### 4. Testes Flaky (Instáveis)

**Problema**: Testes passam às vezes e falham outras vezes

**Soluções**:

```typescript
// Aguardar condições específicas
cy.contains('h1', 'Products').should('be.visible');
cy.get('mat-spinner').should('not.exist');

// Verificar estado antes de agir
cy.get('button').should('be.enabled').click();

// Usar should() para aguardar condições
cy.get('.products-table tbody tr')
  .should('have.length.greaterThan', 0)
  .then(($rows) => {
    // Agora é seguro usar $rows
  });
```

## Comandos de Debug

### Executar Teste Específico

```bash
# Teste específico
npx cypress run --spec "cypress/e2e/user-shopping-flow.cy.ts"

# Com browser específico
npx cypress run --browser chrome --spec "cypress/e2e/*.cy.ts"

# Modo headed (ver execução)
npx cypress run --headed --spec "cypress/e2e/admin-product-management.cy.ts"
```

### Debug Interativo

```bash
# Abrir Cypress UI
npx cypress open

# Com configuração específica
npx cypress open --config video=true,screenshotOnRunFailure=true

# Com variável de ambiente
CYPRESS_BASE_URL=http://localhost:3000 npx cypress open
```

### Logs Detalhados

```bash
# Debug completo
DEBUG=cypress:* npx cypress run

# Debug específico
DEBUG=cypress:server:* npx cypress run
DEBUG=cypress:launcher npx cypress run
```

## Técnicas de Debug

### 1. Usar cy.log() e cy.debug()

```typescript
it('debug example', () => {
  cy.visit('/products');

  cy.get('.products-table tbody tr').then(($rows) => {
    cy.log(`Found ${$rows.length} products`);
    cy.debug(); // Pausa execução no DevTools
  });
});
```

### 2. Screenshots e Vídeos

```typescript
// Screenshot manual
cy.screenshot('before-action');
cy.get('button').click();
cy.screenshot('after-action');

// Configurar no cypress.config.ts
export default defineConfig({
  e2e: {
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
  },
});
```

### 3. Interceptar Requisições

```typescript
// Interceptar e debugar API calls
cy.intercept('GET', '/api/products').as('getProducts');

cy.visit('/products');
cy.wait('@getProducts').then((interception) => {
  cy.log('API Response:', interception.response.body);
});
```

### 4. Verificar Estado da Aplicação

```typescript
// Acessar store Angular
cy.window().then((win) => {
  const store = win['ng'].getInjector().get('ProductStore');
  cy.log('Store products:', store.products());
});

// Verificar localStorage
cy.window().then((win) => {
  const cartData = win.localStorage.getItem('cart_items');
  cy.log('Cart data:', cartData);
});
```

## Configurações de Debug

### cypress.config.ts

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',

    // Debug settings
    video: true,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,

    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,

    // Retry
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Viewport
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
```

### Variáveis de Ambiente

```bash
# .env ou export
CYPRESS_BASE_URL=http://localhost:4200
CYPRESS_VIDEO=true
CYPRESS_SCREENSHOTS=true
DEBUG=cypress:server:*
```

## Padrões de Debug

### Template de Teste com Debug

```typescript
describe('Feature Debug', () => {
  beforeEach(() => {
    cy.log('=== Starting test ===');
    cy.visit('/page');

    // Aguardar página carregar
    cy.get('h1').should('be.visible');
    cy.get('.loading-spinner').should('not.exist');
  });

  it('should debug step by step', () => {
    // Step 1: Log estado inicial
    cy.log('Step 1: Check initial state');
    cy.get('body').then(($body) => {
      cy.log('Page loaded, body classes:', $body.attr('class'));
    });

    // Step 2: Ação
    cy.log('Step 2: Perform action');
    cy.get('[data-cy=button]').should('be.visible').click();

    // Step 3: Verificar resultado
    cy.log('Step 3: Verify result');
    cy.get('[data-cy=result]').should('be.visible');

    // Debug final
    cy.debug();
  });
});
```

### Aguardar Condições Complexas

```typescript
// Aguardar múltiplas condições
cy.get('.products-table')
  .should('be.visible')
  .and('not.have.class', 'loading')
  .find('tbody tr')
  .should('have.length.greaterThan', 0);

// Aguardar com retry customizado
function waitForProducts() {
  cy.get('body').then(($body) => {
    if ($body.find('.empty-state').length > 0) {
      cy.log('Empty state - no products');
      return;
    }

    cy.get('.products-table tbody tr').should('have.length.greaterThan', 0);
  });
}
```

## Troubleshooting por Categoria

### Timing Issues

- Use `cy.should()` em vez de `cy.wait(timeout)`
- Aguarde elementos específicos, não tempos fixos
- Verifique se elementos estão visíveis antes de interagir

### State Issues

- Use `cy.reload()` para reinicializar aplicação
- Verifique localStorage/sessionStorage
- Intercepte APIs para verificar dados

### Selector Issues

- Use seletores estáveis (`data-cy`, `data-testid`)
- Evite seletores baseados em CSS/estrutura
- Prefira texto visível quando possível

### Performance Issues

- Configure timeouts apropriados
- Use `cy.intercept()` para mockar APIs lentas
- Otimize seletores complexos

## Recursos

- [Cypress Debugging Guide](https://docs.cypress.io/guides/guides/debugging)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Troubleshooting](https://docs.cypress.io/guides/references/troubleshooting)
- [Configuration](https://docs.cypress.io/guides/references/configuration)
