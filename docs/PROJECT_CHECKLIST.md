# 🏗️ Project Checklist --- E-commerce Study Template

> Objetivo: Construir uma aplicação completa aplicando arquitetura,
> testes, estado e boas práticas.

---

# 📌 1. DEFINIÇÕES INICIAIS

## 🔧 Stack escolhida

- [x] Framework:
- [x] UI Library:
- [x] Gerenciamento de Estado:
- [x] Testes Unitários:
- [x] Testes E2E:
- [x] Padrão Arquitetural:

---

# 🧱 2. SETUP DO PROJETO

- [x] Criar projeto
- [x] Configurar ESLint
- [x] Configurar Prettier
- [x] Configurar Husky (pre-commit)
- [x] Configurar alias de imports
- [x] Criar estrutura base por feature:

/core\
/shared\
/features\
/products\
/cart\
/admin

- [x] Criar README com decisões técnicas

---

# 🧠 3. MODELAGEM DE DOMÍNIO

## Entidades

- [x] Criar interface/model `Product`
- [x] Criar interface/model `CartItem`
- [x] Criar interface/model `Cart`
- [x] Criar enums necessários

## Regras de Negócio (Funções Puras)

- [x] `addItemToCart`
- [x] `removeItemFromCart`
- [x] `updateItemQuantity`
- [x] `calculateCartTotal`

## Testes de Domínio

- [x] Deve adicionar item corretamente
- [x] Não deve duplicar item
- [x] Deve atualizar quantidade
- [x] Deve calcular total corretamente
- [x] Deve remover item corretamente

---

# 🌐 4. CAMADA DE API / INFRA

## Serviço de Produtos

- [x] `getProducts`
- [x] `getProductById`
- [x] `createProduct`
- [x] `updateProduct`
- [x] `deleteProduct`

## Testes do Serviço

- [x] Deve chamar endpoint correto
- [x] Deve tratar erro
- [x] Deve retornar lista vazia corretamente
- [x] Deve mapear dados se necessário

---

## Interceptor / Middleware Global

- [x] Adicionar headers automaticamente
- [x] Criar tratamento global de erro
- [x] Criar logger de requisições
- [x] Criar retry/timeout

### Testes

- [x] Deve interceptar requisição
- [x] Deve tratar erro 401 corretamente

---

# 🛍️ 5. FEATURE --- PRODUTOS

## Estado da Feature

- [x] Criar store/service/state
- [x] Criar estado de loading
- [x] Criar estado de erro
- [x] Criar selector de produtos
- [x] Criar selector de loading

### Testes de Estado

- [x] Deve atualizar loading corretamente
- [x] Deve atualizar lista após sucesso
- [x] Deve atualizar erro após falha

---

## Componentes

- [x] ProductList
- [x] ProductCard
- [x] ProductDetails

### Testes de Componentes

- [x] Deve renderizar lista corretamente
- [x] Deve exibir loading
- [x] Deve exibir erro
- [x] Deve emitir evento ao adicionar ao carrinho

---

# 🛒 6. FEATURE --- CARRINHO

## Estado do Carrinho

- [x] Criar store/service/cartState
- [x] Criar selector de total
- [x] Criar selector de quantidade total
- [x] Persistir no localStorage
- [x] Carregar estado salvo ao iniciar

### Testes

- [x] Deve adicionar item
- [x] Deve remover item
- [x] Deve atualizar quantidade
- [x] Deve calcular total corretamente
- [x] Deve persistir no localStorage
- [x] Deve recuperar estado salvo
- [x] Deve limpar carrinho

---

## Integração com Header

- [x] Mostrar badge com quantidade total
- [x] Atualizar automaticamente ao modificar carrinho

### Testes

- [x] Badge deve atualizar ao adicionar item
- [x] Deve reagir à mudança de estado

---

# 🧾 7. ADMIN --- CRUD COMPLETO

## Formulário

- [x] Campo nome obrigatório
- [x] Preço \> 0
- [x] Validação de tamanho mínimo
- [x] Botão desabilitado se inválido

### Testes de Formulário

- [x] Deve invalidar formulário vazio
- [x] Deve validar preço negativo
- [x] Deve emitir dados corretos no submit

---

## Integração CRUD

- [x] Criar produto
- [x] Atualizar produto
- [x] Deletar produto
- [x] Atualizar lista após operação

### Testes de Integração

- [x] Deve atualizar lista após criar produto
- [x] Deve remover produto da lista após deletar

---

# 🧪 8. TESTES DE INTEGRAÇÃO

- [x] Componente + Estado
- [x] Estado + Serviço
- [x] Form + Estado
- [x] Carrinho + Header

---

# 🖥️ 9. TESTES E2E

Fluxos obrigatórios:

- [ ] Usuário acessa página
- [ ] Usuário adiciona produto ao carrinho
- [ ] Badge atualiza
- [ ] Usuário acessa carrinho
- [ ] Total está correto
- [ ] Admin cria produto
- [ ] Produto aparece na lista

---

# ⚡ 10. PERFORMANCE

- [ ] Lazy loading
- [ ] Code splitting
- [ ] Memoização
- [ ] Evitar re-render desnecessário
- [ ] Selector memoizado
- [ ] TrackBy / React.memo

---

# 🔐 11. SEGURANÇA

- [ ] Criar rota protegida para admin
- [ ] Simular autenticação
- [ ] Guard / ProtectedRoute
- [ ] Sanitizar inputs

---

# 📊 12. QUALIDADE

- [ ] Cobertura mínima 80%
- [ ] ESLint sem erros
- [ ] Nenhum any desnecessário
- [ ] Build sem warnings
- [ ] README explicando arquitetura
- [ ] Pipeline CI rodando testes automaticamente

---

# 🚀 13. DIFERENCIAL (OPCIONAL)

- [ ] SSR
- [ ] Docker
- [ ] Deploy automatizado
- [ ] Lighthouse performance
- [ ] Acessibilidade (aria, roles, tabIndex)
- [ ] Internacionalização (i18n)

---

# 🏁 STATUS FINAL

Item Status

---

Setup ⬜
Domínio ⬜
API ⬜
Produtos ⬜
Carrinho ⬜
Admin ⬜
Testes ⬜
Performance ⬜
Segurança ⬜
Qualidade ⬜
