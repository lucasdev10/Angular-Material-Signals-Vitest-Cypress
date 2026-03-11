# Testes E2E com Cypress

Este diretório contém os testes end-to-end (E2E) da aplicação usando Cypress.

## 📁 Estrutura dos Testes

### Arquivos de Teste

- **user-shopping-flow.cy.ts**: Testes do fluxo de compra do usuário
  - Acesso à página de produtos
  - Adicionar produtos ao carrinho
  - Atualização do badge do carrinho
  - Navegação para o carrinho
  - Verificação de totais
  - Atualização de quantidades
  - Remoção de itens

- **cart-calculations.cy.ts**: Testes de cálculos do carrinho
  - Cálculo de subtotal
  - Cálculo de impostos (10%)
  - Cálculo de frete
  - Frete grátis para pedidos acima de $100
  - Atualização de cálculos ao mudar quantidade
  - Múltiplos itens com diferentes quantidades

- **admin-product-management.cy.ts**: Testes de gerenciamento de produtos (Admin)
  - Acesso ao painel admin
  - Criação de novos produtos
  - Verificação de produtos na lista
  - Edição de produtos existentes
  - Exclusão de produtos

- **accessibility.cy.ts**: Testes de acessibilidade
  - Navegação por teclado
  - Atributos ARIA
  - HTML semântico
  - Gerenciamento de foco
  - Regiões live
  - Formulários acessíveis

### Suporte

- **commands.ts**: Comandos customizados do Cypress
  - `cy.login(email, password)`: Faz login na aplicação
  - `cy.addProductToCart(index)`: Adiciona produto ao carrinho
  - `cy.clearCart()`: Limpa todos os itens do carrinho

- **fixtures/**: Dados de teste
  - Credenciais de admin e usuário
  - Dados de produto de teste
  - Dados de acessibilidade

## Como Executar

### Modo Interativo (recomendado para desenvolvimento)

```bash
npm run cypress
# ou
npm run e2e
```

### Modo Headless (para CI/CD)

```bash
npm run cypress:headless
# ou
npm run e2e:headless
```

## Pré-requisitos

1. A aplicação deve estar rodando em `http://localhost:4200`
2. Execute `npm start` em outro terminal antes de rodar os testes

## Cobertura dos Testes

### Funcionalidades Testadas

✅ Usuário acessa página de produtos  
✅ Usuário adiciona produto ao carrinho  
✅ Badge do carrinho atualiza  
✅ Usuário acessa o carrinho  
✅ Total está correto  
✅ Admin cria produto  
✅ Produto aparece na lista  
✅ Navegação por teclado  
✅ Atributos ARIA corretos  
✅ HTML semântico

### Cenários de Teste

- **Fluxo de Compra**: Navegação completa do usuário
- **Cálculos**: Validação de matemática do carrinho
- **Administração**: CRUD completo de produtos
- **Acessibilidade**: Conformidade WCAG 2.1 AA
- **Responsividade**: Testes em diferentes viewports

## Boas Práticas Implementadas

### Seletores

- Uso de seletores semânticos (classes, textos visíveis)
- Evitar seletores frágeis baseados em estrutura
- Preferir `data-cy` attributes quando necessário

### Comandos Customizados

- Reutilização de ações comuns
- Encapsulamento de lógica complexa
- Manutenibilidade melhorada

### Dados de Teste

- Fixtures para dados consistentes
- Isolamento entre testes
- Dados realistas

### Verificações

- Aguardo de elementos antes de interagir
- Verificações de estado antes de ações
- Tolerância para decimais em cálculos

## Configuração

### cypress.config.ts

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
});
```

### Variáveis de Ambiente

```bash
CYPRESS_BASE_URL=http://localhost:4200
CYPRESS_VIDEO=false
CYPRESS_SCREENSHOTS=true
```

## Debug e Troubleshooting

### Problemas Comuns

1. **Timing Issues**: Use `cy.wait()` ou `cy.should()` para aguardar elementos
2. **Elementos não encontrados**: Verifique seletores e aguarde carregamento
3. **Testes flaky**: Adicione verificações de estado antes de ações

### Debug

```bash
# Executar teste específico
npx cypress run --spec "cypress/e2e/user-shopping-flow.cy.ts"

# Modo debug
npx cypress open --config video=true

# Com logs detalhados
DEBUG=cypress:* npx cypress run
```

### Screenshots e Vídeos

- Screenshots automáticos em falhas
- Vídeos opcionais para análise
- Armazenados em `cypress/screenshots/` e `cypress/videos/`

## Integração CI/CD

### GitHub Actions

```yaml
- name: Run E2E Tests
  run: |
    npm start &
    npx wait-on http://localhost:4200
    npm run cypress:headless
```

### Relatórios

- Resultados em formato JUnit
- Screenshots de falhas
- Métricas de performance

## Melhores Práticas

### Estrutura de Testes

```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup comum
  });

  it('should do something specific', () => {
    // Arrange
    cy.visit('/page');

    // Act
    cy.get('[data-cy=button]').click();

    // Assert
    cy.get('[data-cy=result]').should('be.visible');
  });
});
```

### Comandos Customizados

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});
```

### Page Objects (Opcional)

```typescript
// cypress/support/pages/ProductPage.ts
export class ProductPage {
  visit() {
    cy.visit('/products');
  }

  addToCart(index: number) {
    cy.get(`[data-cy=add-to-cart-${index}]`).click();
  }
}
```

## Recursos

- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Accessibility Testing](https://docs.cypress.io/guides/tooling/accessibility-testing)
- [Visual Testing](https://docs.cypress.io/guides/tooling/visual-testing)
