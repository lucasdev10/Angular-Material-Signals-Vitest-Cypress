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

- [ ] Deve adicionar item corretamente
- [ ] Não deve duplicar item
- [ ] Deve atualizar quantidade
- [ ] Deve calcular total corretamente
- [ ] Deve remover item corretamente

---

# 🌐 4. CAMADA DE API / INFRA

## Serviço de Produtos

- [x] `getProducts`
- [x] `getProductById`
- [x] `createProduct`
- [x] `updateProduct`
- [x] `deleteProduct`

## Testes do Serviço

- [ ] Deve chamar endpoint correto
- [ ] Deve tratar erro
- [ ] Deve retornar lista vazia corretamente
- [ ] Deve mapear dados se necessário

---

## Interceptor / Middleware Global

- [ ] Adicionar headers automaticamente
- [ ] Criar tratamento global de erro
- [ ] Criar logger de requisições
- [ ] Criar retry/timeout

### Testes

- [ ] Deve interceptar requisição
- [ ] Deve tratar erro 401 corretamente

---

# 🛍️ 5. FEATURE --- PRODUTOS

## Estado da Feature

- [ ] Criar store/service/state
- [ ] Criar estado de loading
- [ ] Criar estado de erro
- [ ] Criar selector de produtos
- [ ] Criar selector de loading

### Testes de Estado

- [ ] Deve atualizar loading corretamente
- [ ] Deve atualizar lista após sucesso
- [ ] Deve atualizar erro após falha

---

## Componentes

- [ ] ProductList
- [ ] ProductCard
- [ ] ProductDetails

### Testes de Componentes

- [ ] Deve renderizar lista corretamente
- [ ] Deve exibir loading
- [ ] Deve exibir erro
- [ ] Deve emitir evento ao adicionar ao carrinho

---

# 🛒 6. FEATURE --- CARRINHO

## Estado do Carrinho

- [ ] Criar store/service/cartState
- [ ] Criar selector de total
- [ ] Criar selector de quantidade total
- [ ] Persistir no localStorage
- [ ] Carregar estado salvo ao iniciar

### Testes

- [ ] Deve adicionar item
- [ ] Deve remover item
- [ ] Deve atualizar quantidade
- [ ] Deve calcular total corretamente
- [ ] Deve persistir no localStorage
- [ ] Deve recuperar estado salvo
- [ ] Deve limpar carrinho

---

## Integração com Header

- [ ] Mostrar badge com quantidade total
- [ ] Atualizar automaticamente ao modificar carrinho

### Testes

- [ ] Badge deve atualizar ao adicionar item
- [ ] Deve reagir à mudança de estado

---

# 🧾 7. ADMIN --- CRUD COMPLETO

## Formulário

- [ ] Campo nome obrigatório
- [ ] Preço \> 0
- [ ] Validação de tamanho mínimo
- [ ] Botão desabilitado se inválido

### Testes de Formulário

- [ ] Deve invalidar formulário vazio
- [ ] Deve validar preço negativo
- [ ] Deve emitir dados corretos no submit

---

## Integração CRUD

- [ ] Criar produto
- [ ] Atualizar produto
- [ ] Deletar produto
- [ ] Atualizar lista após operação

### Testes de Integração

- [ ] Deve atualizar lista após criar produto
- [ ] Deve remover produto da lista após deletar

---

# 🧪 8. TESTES DE INTEGRAÇÃO

- [ ] Componente + Estado
- [ ] Estado + Serviço
- [ ] Form + Estado
- [ ] Carrinho + Header

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
