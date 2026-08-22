# Requirements Document - Angular MFE Transformation

## Introduction

Este documento define os requisitos para transformar o projeto monolítico CoffeeWorkshop (Angular 21) em uma arquitetura de Micro Frontends (MFEs) usando Module Federation. A transformação deve manter todas as funcionalidades existentes, preservar os testes, e criar uma estrutura escalável onde cada MFE pode ser desenvolvido, testado e deployado independentemente.

## Glossary

- **Shell_App**: Aplicação orquestradora principal que gerencia roteamento, layout core e estado global compartilhado
- **MFE**: Micro Frontend - aplicação Angular independente que representa uma feature de negócio
- **Products_MFE**: Micro Frontend responsável pelo catálogo de produtos e visualização
- **Cart_MFE**: Micro Frontend responsável pelo carrinho de compras
- **Admin_MFE**: Micro Frontend responsável pelo painel administrativo
- **Auth_MFE**: Micro Frontend responsável pela autenticação e autorização
- **User_MFE**: Micro Frontend responsável pelo perfil e dados do usuário
- **Shared_Library**: Biblioteca compartilhada contendo componentes, pipes, directives e utils reutilizáveis
- **Module_Federation**: Tecnologia Webpack 5 que permite carregar módulos remotos em runtime
- **Remote_Entry**: Arquivo manifest que expõe os módulos de um MFE
- **Store_Compartilhada**: NgRx store global gerenciada pelo Shell_App para comunicação entre MFEs
- **Custom_Event**: Evento JavaScript customizado para comunicação entre MFEs
- **Deployment_Pipeline**: Pipeline CI/CD específico de cada MFE para build e deploy independente
- **Monorepo**: Repositório único contendo múltiplos projetos relacionados
- **Standalone_Repository**: Repositório Git independente para cada MFE

## Requirements

### Requirement 1: Separação do Shell App

**User Story:** Como arquiteto de software, eu quero criar uma aplicação Shell que orquestre os MFEs, para que possamos ter um ponto central de gerenciamento de roteamento e estado global.

#### Acceptance Criteria

1. THE Shell_App SHALL conter o AppComponent com layout base (router-outlet)
2. THE Shell_App SHALL manter o componente Header com navegação
3. THE Shell_App SHALL gerenciar todos os guards (authGuard, roleGuard, unsavedChangesGuard)
4. THE Shell_App SHALL gerenciar todos os interceptors (authInterceptor, errorInterceptor, loadingInterceptor, cacheInterceptor)
5. THE Shell_App SHALL manter os serviços core (LoadingService, NotificationService, ThemeService, LoggerService, StorageService)
6. THE Shell_App SHALL configurar o roteamento para carregar MFEs remotos via lazy loading
7. THE Shell_App SHALL configurar a Store_Compartilhada do NgRx com slices para auth, user e cart
8. THE Shell_App SHALL expor a configuração do Module_Federation como host
9. THE Shell_App SHALL manter o arquivo de configuração webpack.config.js para Module Federation
10. THE Shell_App SHALL preservar todos os testes unitários dos componentes e serviços core

### Requirement 2: Criação do Products MFE

**User Story:** Como desenvolvedor de produtos, eu quero um MFE independente para o catálogo de produtos, para que eu possa desenvolver e deployar funcionalidades de produtos sem afetar outros módulos.

#### Acceptance Criteria

1. THE Products_MFE SHALL ser uma aplicação Angular 21 standalone em repositório separado
2. THE Products_MFE SHALL conter todos os componentes da feature products (ProductCard, ProductForm)
3. THE Products_MFE SHALL conter todas as pages de products (ProductListPage, ProductCreatePage)
4. THE Products_MFE SHALL manter o ProductRepository para acesso a dados
5. THE Products_MFE SHALL manter a store local de produtos (ProductState, ProductActions, ProductSelectors, ProductEffects)
6. THE Products_MFE SHALL expor as rotas via Module_Federation: product-list (/products), product-detail (/products/:id)
7. THE Products_MFE SHALL configurar webpack.config.js como remote com nome "products"
8. THE Products_MFE SHALL expor o Remote_Entry no path /remoteEntry.js
9. THE Products_MFE SHALL importar a Shared_Library para componentes reutilizáveis
10. THE Products_MFE SHALL preservar todos os testes unitários e integration tests da feature products
11. THE Products_MFE SHALL ter seu próprio package.json com dependências específicas
12. THE Products_MFE SHALL consumir a Store_Compartilhada para autenticação e carrinho

### Requirement 3: Criação do Cart MFE

**User Story:** Como desenvolvedor de carrinho, eu quero um MFE independente para o carrinho de compras, para que eu possa otimizar e evoluir a experiência de checkout de forma isolada.

#### Acceptance Criteria

1. THE Cart_MFE SHALL ser uma aplicação Angular 21 standalone em repositório separado
2. THE Cart_MFE SHALL conter a page CartPage
3. THE Cart_MFE SHALL manter a store local de carrinho (CartState, CartActions, CartSelectors)
4. THE Cart_MFE SHALL sincronizar o estado do carrinho com a Store_Compartilhada
5. THE Cart_MFE SHALL expor a rota /cart via Module_Federation
6. THE Cart_MFE SHALL configurar webpack.config.js como remote com nome "cart"
7. THE Cart_MFE SHALL expor o Remote_Entry no path /remoteEntry.js
8. THE Cart_MFE SHALL importar a Shared_Library para componentes reutilizáveis
9. THE Cart_MFE SHALL preservar todos os testes unitários da feature cart
10. THE Cart_MFE SHALL ter seu próprio package.json com dependências específicas
11. THE Cart_MFE SHALL persistir o estado do carrinho no StorageService do Shell_App
12. THE Cart_MFE SHALL emitir Custom_Event quando items são adicionados ou removidos

### Requirement 4: Criação do Admin MFE

**User Story:** Como administrador do sistema, eu quero um MFE independente para o painel administrativo, para que funcionalidades admin possam ser desenvolvidas e deployadas separadamente com segurança reforçada.

#### Acceptance Criteria

1. THE Admin_MFE SHALL ser uma aplicação Angular 21 standalone em repositório separado
2. THE Admin_MFE SHALL conter todas as pages admin (AdminDashboardPage, AdminProductsPage, AdminProductFormPage)
3. THE Admin_MFE SHALL reutilizar o ProductRepository do Products_MFE para operações CRUD
4. THE Admin_MFE SHALL expor rotas protegidas via Module_Federation: /admin, /admin/products, /admin/products/new, /admin/products/:id/edit
5. THE Admin_MFE SHALL configurar webpack.config.js como remote com nome "admin"
6. THE Admin_MFE SHALL expor o Remote_Entry no path /remoteEntry.js
7. THE Admin_MFE SHALL verificar autorização via Store_Compartilhada (role ADMIN)
8. THE Admin_MFE SHALL importar a Shared_Library para componentes reutilizáveis
9. THE Admin_MFE SHALL preservar todos os testes unitários das pages admin
10. THE Admin_MFE SHALL ter seu próprio package.json com dependências específicas
11. THE Admin_MFE SHALL ser carregado somente quando o usuário tiver role ADMIN

### Requirement 5: Criação do Auth MFE

**User Story:** Como desenvolvedor de segurança, eu quero um MFE independente para autenticação, para que possamos gerenciar login e segurança de forma centralizada e reutilizável.

#### Acceptance Criteria

1. THE Auth_MFE SHALL ser uma aplicação Angular 21 standalone em repositório separado
2. THE Auth_MFE SHALL conter todos os componentes da feature auth (LoginPage, RegisterPage)
3. THE Auth_MFE SHALL manter a AuthStore (AuthState, AuthActions, AuthSelectors, AuthEffects)
4. THE Auth_MFE SHALL sincronizar o estado de autenticação com a Store_Compartilhada
5. THE Auth_MFE SHALL expor rotas via Module_Federation: /auth/login, /auth/register
6. THE Auth_MFE SHALL configurar webpack.config.js como remote com nome "auth"
7. THE Auth_MFE SHALL expor o Remote_Entry no path /remoteEntry.js
8. THE Auth_MFE SHALL importar a Shared_Library para componentes reutilizáveis
9. THE Auth_MFE SHALL preservar todos os testes unitários da feature auth
10. THE Auth_MFE SHALL ter seu próprio package.json com dependências específicas
11. THE Auth_MFE SHALL emitir Custom_Event quando login ou logout ocorrer
12. THE Auth_MFE SHALL persistir token de autenticação via StorageService do Shell_App

### Requirement 6: Criação do User MFE

**User Story:** Como desenvolvedor de perfil de usuário, eu quero um MFE independente para gerenciamento de usuários, para que funcionalidades de perfil possam evoluir independentemente.

#### Acceptance Criteria

1. THE User_MFE SHALL ser uma aplicação Angular 21 standalone em repositório separado
2. THE User_MFE SHALL conter todos os componentes da feature user (ProfilePage, SettingsPage)
3. THE User_MFE SHALL manter a UserStore (UserState, UserActions, UserSelectors, UserEffects)
4. THE User_MFE SHALL sincronizar dados do usuário com a Store_Compartilhada
5. THE User_MFE SHALL expor rotas protegidas via Module_Federation: /user/profile, /user/settings
6. THE User_MFE SHALL configurar webpack.config.js como remote com nome "user"
7. THE User_MFE SHALL expor o Remote_Entry no path /remoteEntry.js
8. THE User_MFE SHALL importar a Shared_Library para componentes reutilizáveis
9. THE User_MFE SHALL preservar todos os testes unitários da feature user
10. THE User_MFE SHALL ter seu próprio package.json com dependências específicas
11. THE User_MFE SHALL verificar autenticação via Store_Compartilhada

### Requirement 7: Criação da Shared Library

**User Story:** Como desenvolvedor de qualquer MFE, eu quero uma biblioteca compartilhada com componentes e utils reutilizáveis, para que possamos manter consistência e evitar duplicação de código.

#### Acceptance Criteria

1. THE Shared_Library SHALL ser uma biblioteca Angular publicável (npm package)
2. THE Shared_Library SHALL conter todos os componentes shared (FormError, Input, etc)
3. THE Shared_Library SHALL conter todas as directives (ClickOutside, LazyLoad, DebounceClick, AutoFocus)
4. THE Shared_Library SHALL conter todos os pipes (SafeHtml, TimeAgo, Truncate, Filter, Highlight)
5. THE Shared_Library SHALL conter todos os validators (CustomValidators)
6. THE Shared_Library SHALL conter todos os utils (DateUtils, StringUtils, ArrayUtils)
7. THE Shared_Library SHALL conter os models compartilhados (ApiResponse, User)
8. THE Shared_Library SHALL conter os enums compartilhados (OrderStatus, PaymentMethod)
9. THE Shared_Library SHALL expor barrel exports via index.ts para importações limpas
10. THE Shared_Library SHALL preservar todos os testes unitários dos componentes e utils
11. THE Shared_Library SHALL ser versionada semanticamente (semver)
12. THE Shared_Library SHALL ter seu próprio package.json configurado como library

### Requirement 8: Configuração do Module Federation

**User Story:** Como arquiteto de software, eu quero configurar Module Federation para permitir carregamento dinâmico de MFEs, para que possamos ter verdadeira independência e deploy separado.

#### Acceptance Criteria

1. THE Shell_App SHALL configurar ModuleFederationPlugin como host no webpack.config.js
2. THE Shell_App SHALL declarar todos os remotes: products, cart, admin, auth, user
3. FOR ALL MFEs, WHEN configurando Module_Federation, THE MFE SHALL usar ModuleFederationPlugin como remote
4. FOR ALL MFEs, THE MFE SHALL expor seus módulos via exposes no webpack.config.js
5. FOR ALL MFEs, THE MFE SHALL compartilhar dependências singleton (@angular/core, @angular/common, @ngrx/store, rxjs)
6. THE Shell_App SHALL configurar shared dependencies com singleton: true e strictVersion: false
7. THE Shell_App SHALL carregar remotes dinamicamente via loadRemoteModule()
8. FOR ALL MFEs, THE MFE SHALL especificar publicPath: "auto" no webpack.config.js
9. THE Shell_App SHALL tratar fallback quando um MFE remoto falhar ao carregar
10. FOR ALL MFEs, THE MFE SHALL ter script de build que gera o Remote_Entry corretamente

### Requirement 9: Estratégia de Roteamento

**User Story:** Como desenvolvedor full-stack, eu quero uma estratégia clara de roteamento entre Shell e MFEs, para que a navegação seja transparente e sem quebras.

#### Acceptance Criteria

1. THE Shell_App SHALL configurar rotas usando loadChildren com loadRemoteModule para cada MFE
2. THE Shell_App SHALL manter a rota raiz "/" redirecionando para /products
3. THE Shell_App SHALL configurar rota /products apontando para Products_MFE
4. THE Shell_App SHALL configurar rota /cart apontando para Cart_MFE
5. THE Shell_App SHALL configurar rota /admin/\* apontando para Admin_MFE com guards (authGuard, roleGuard)
6. THE Shell_App SHALL configurar rota /auth/\* apontando para Auth_MFE
7. THE Shell_App SHALL configurar rota /user/\* apontando para User_MFE com authGuard
8. THE Shell_App SHALL configurar fallback route /\*\* redirecionando para /products
9. FOR ALL rotas protegidas, WHEN usuário não autenticado, THE Shell_App SHALL redirecionar para /auth/login
10. THE Shell_App SHALL preservar query params e fragments durante navegação entre MFEs

### Requirement 10: Comunicação entre MFEs via Store Compartilhada

**User Story:** Como desenvolvedor de MFE, eu quero compartilhar estado global via NgRx store, para que MFEs possam reagir a mudanças de estado de forma reativa e eficiente.

#### Acceptance Criteria

1. THE Shell_App SHALL expor a Store_Compartilhada do NgRx como singleton
2. THE Store_Compartilhada SHALL conter slice "auth" com AuthState (token, user, isAuthenticated)
3. THE Store_Compartilhada SHALL conter slice "cart" com CartState (items, total, count)
4. THE Store_Compartilhada SHALL conter slice "user" com UserState (profile, preferences)
5. FOR ALL MFEs, WHEN injetando Store, THE MFE SHALL receber a mesma instância singleton
6. THE Auth_MFE SHALL despachar actions para atualizar auth slice (login, logout, updateToken)
7. THE Cart_MFE SHALL despachar actions para atualizar cart slice (addItem, removeItem, clearCart)
8. THE User_MFE SHALL despachar actions para atualizar user slice (updateProfile, updatePreferences)
9. FOR ALL MFEs, THE MFE SHALL selecionar dados da Store_Compartilhada via selectors
10. THE Shell_App SHALL persistir slices críticos (auth, cart) no localStorage via StorageService

### Requirement 11: Comunicação entre MFEs via Custom Events

**User Story:** Como desenvolvedor de MFE, eu quero usar Custom Events para comunicação desacoplada, para que MFEs possam notificar mudanças sem dependências diretas.

#### Acceptance Criteria

1. THE Cart_MFE SHALL emitir Custom_Event "cart:item-added" quando item for adicionado
2. THE Cart_MFE SHALL emitir Custom_Event "cart:item-removed" quando item for removido
3. THE Cart_MFE SHALL emitir Custom_Event "cart:cleared" quando carrinho for limpo
4. THE Auth_MFE SHALL emitir Custom_Event "auth:login" quando login ocorrer com sucesso
5. THE Auth_MFE SHALL emitir Custom_Event "auth:logout" quando logout ocorrer
6. THE User_MFE SHALL emitir Custom_Event "user:profile-updated" quando perfil for atualizado
7. FOR ALL Custom_Event emitidos, THE evento SHALL conter payload com dados relevantes no detail
8. FOR ALL MFEs interessados, THE MFE SHALL registrar listeners com addEventListener
9. THE Shell_App SHALL documentar todos os Custom_Event disponíveis no README
10. FOR ALL Custom_Event, THE evento SHALL ser emitido no window object para alcance global

### Requirement 12: Estrutura de Repositórios

**User Story:** Como DevOps engineer, eu quero definir a estrutura de repositórios para os MFEs, para que possamos ter controle de versão e CI/CD independentes.

#### Acceptance Criteria

1. THE Shell_App SHALL permanecer no repositório atual CoffeeWorkshop
2. THE Products_MFE SHALL ter um Standalone_Repository chamado "coffee-products-mfe"
3. THE Cart_MFE SHALL ter um Standalone_Repository chamado "coffee-cart-mfe"
4. THE Admin_MFE SHALL ter um Standalone_Repository chamado "coffee-admin-mfe"
5. THE Auth_MFE SHALL ter um Standalone_Repository chamado "coffee-auth-mfe"
6. THE User_MFE SHALL ter um Standalone_Repository chamado "coffee-user-mfe"
7. THE Shared_Library SHALL ter um Standalone_Repository chamado "coffee-shared-lib"
8. FOR ALL Standalone_Repository, THE repositório SHALL ter seu próprio .git, package.json, angular.json
9. FOR ALL Standalone_Repository, THE repositório SHALL ter README.md documentando setup e desenvolvimento
10. FOR ALL Standalone_Repository, THE repositório SHALL ter seu próprio .github/workflows para CI/CD

### Requirement 13: Desenvolvimento Local Multi-MFE

**User Story:** Como desenvolvedor, eu quero rodar múltiplos MFEs simultaneamente em ambiente local, para que eu possa desenvolver e testar integrações localmente.

#### Acceptance Criteria

1. THE Shell_App SHALL servir na porta 4200 (padrão Angular)
2. THE Products_MFE SHALL servir na porta 4201
3. THE Cart_MFE SHALL servir na porta 4202
4. THE Admin_MFE SHALL servir na porta 4203
5. THE Auth_MFE SHALL servir na porta 4204
6. THE User_MFE SHALL servir na porta 4205
7. THE Shell_App SHALL configurar remotes com URLs de desenvolvimento (http://localhost:PORT/remoteEntry.js)
8. FOR ALL MFEs, THE MFE SHALL ter npm script "start" que serve na porta específica
9. THE Shell_App SHALL ter npm script "start:all" que inicia todos os MFEs usando concurrently
10. THE Shell_App SHALL ter arquivo .env.development com URLs de desenvolvimento dos remotes
11. THE Shell_App SHALL ter documentação no README explicando setup local multi-MFE
12. FOR ALL MFEs, WHEN servindo localmente, THE MFE SHALL usar --live-reload para hot module replacement

### Requirement 14: Build e Deploy Independente

**User Story:** Como DevOps engineer, eu quero que cada MFE tenha seu próprio pipeline de build e deploy, para que possamos deployar mudanças independentemente sem rebuild completo.

#### Acceptance Criteria

1. FOR ALL MFEs, THE MFE SHALL ter Deployment_Pipeline configurado no GitHub Actions
2. FOR ALL Deployment_Pipeline, THE pipeline SHALL executar em push para branch main
3. FOR ALL Deployment_Pipeline, THE pipeline SHALL executar lint, tests e build
4. FOR ALL Deployment_Pipeline, THE pipeline SHALL gerar artefatos de build otimizados
5. FOR ALL Deployment_Pipeline, THE pipeline SHALL publicar Remote_Entry e chunks em CDN ou storage
6. THE Shell_App SHALL configurar remotes com URLs de produção (https://cdn.example.com/products/remoteEntry.js)
7. THE Shell_App SHALL ter arquivo .env.production com URLs de produção dos remotes
8. FOR ALL MFEs, WHEN build for produção, THE MFE SHALL gerar hash único para cache busting
9. FOR ALL MFEs, THE MFE SHALL ter script de rollback para versão anterior
10. THE Shell_App SHALL ter estratégia de fallback quando MFE remoto não estiver disponível
11. THE Shared_Library SHALL ser publicada no npm registry privado ou public
12. FOR ALL MFEs, THE MFE SHALL especificar versão exata da Shared_Library no package.json

### Requirement 15: Testes Preservados e Reorganizados

**User Story:** Como QA engineer, eu quero que todos os testes unitários e E2E sejam preservados e reorganizados por MFE, para que mantenhamos a cobertura de testes após a transformação.

#### Acceptance Criteria

1. FOR ALL MFEs, THE MFE SHALL migrar seus testes unitários específicos do monolito
2. THE Products_MFE SHALL manter product.repository.spec.ts e product-flow.spec.ts
3. THE Shell_App SHALL manter testes dos guards, interceptors e serviços core
4. FOR ALL MFEs, THE MFE SHALL ter npm script "test" para executar testes unitários
5. FOR ALL MFEs, THE MFE SHALL ter npm script "test:coverage" para relatório de cobertura
6. THE Shell_App SHALL manter testes E2E do Cypress para fluxos completos
7. THE Shell_App SHALL configurar Cypress para testar integrações entre MFEs
8. FOR ALL MFEs, WHEN executando testes, THE MFE SHALL mockar dependências de outros MFEs
9. THE Shared_Library SHALL ter testes unitários para todos os componentes, pipes e directives
10. FOR ALL Deployment_Pipeline, THE pipeline SHALL executar testes e falhar build se testes falharem
11. THE Shell_App SHALL ter teste E2E end-to-end validando fluxo completo: login → products → add to cart → admin
12. FOR ALL MFEs, THE MFE SHALL manter cobertura de testes mínima de 80%

### Requirement 16: Documentação da Transformação

**User Story:** Como desenvolvedor novo no projeto, eu quero documentação completa da arquitetura MFE, para que eu possa entender a estrutura e começar a desenvolver rapidamente.

#### Acceptance Criteria

1. THE Shell_App SHALL ter arquivo docs/MFE_ARCHITECTURE.md documentando arquitetura completa
2. THE Shell_App SHALL ter arquivo docs/MFE_COMMUNICATION.md documentando estratégias de comunicação
3. THE Shell_App SHALL ter arquivo docs/MFE_DEVELOPMENT.md com guia de desenvolvimento local
4. THE Shell_App SHALL ter arquivo docs/MFE_DEPLOYMENT.md com guia de deploy
5. THE Shell_App SHALL ter diagrama de arquitetura mostrando Shell e MFEs remotos
6. THE Shell_App SHALL ter tabela mapeando features do monolito para MFEs
7. THE Shell_App SHALL ter lista de todos os Custom_Event com payload e uso
8. THE Shell_App SHALL ter guia de troubleshooting para problemas comuns de MFE
9. FOR ALL MFEs, THE MFE SHALL ter README.md com setup, desenvolvimento e build
10. FOR ALL MFEs, THE MFE SHALL ter seção no README sobre dependências da Shared_Library
11. THE Shared_Library SHALL ter documentação Storybook ou similar para componentes
12. THE Shell_App SHALL ter migration guide explicando processo de transformação passo a passo

### Requirement 17: Compatibilidade e Versioning

**User Story:** Como tech lead, eu quero garantir compatibilidade entre MFEs e gerenciar versões adequadamente, para que mudanças não quebrem integrações.

#### Acceptance Criteria

1. FOR ALL MFEs, THE MFE SHALL usar mesma versão do Angular (21.x)
2. FOR ALL MFEs, THE MFE SHALL usar mesma versão do Angular Material (21.x)
3. FOR ALL MFEs, THE MFE SHALL usar mesma versão do NgRx (21.x)
4. FOR ALL MFEs, THE MFE SHALL compartilhar dependências core como singleton no Module_Federation
5. THE Shared_Library SHALL seguir semantic versioning (major.minor.patch)
6. WHEN mudança breaking na Shared_Library ocorrer, THE versão major SHALL ser incrementada
7. FOR ALL MFEs, THE MFE SHALL testar compatibilidade com nova versão da Shared_Library antes de atualizar
8. THE Shell_App SHALL ter arquivo COMPATIBILITY.md listando versões compatíveis de cada MFE
9. FOR ALL MFEs, THE MFE SHALL ter changelog documentando mudanças de versão
10. THE Shell_App SHALL validar contratos de interface entre MFEs em tempo de build

### Requirement 18: Performance e Otimizações

**User Story:** Como usuário final, eu quero que a aplicação MFE tenha performance igual ou superior ao monolito, para que a experiência não seja degradada.

#### Acceptance Criteria

1. THE Shell_App SHALL carregar apenas o MFE necessário para a rota atual (lazy loading)
2. THE Shell_App SHALL implementar prefetching de MFEs críticos (products, cart) após load inicial
3. FOR ALL MFEs, THE MFE SHALL usar OnPush change detection para melhor performance
4. FOR ALL MFEs, THE MFE SHALL ter bundle size máximo de 200KB (gzipped) excluindo shared dependencies
5. THE Shell_App SHALL implementar loading indicator durante carregamento de MFE remoto
6. THE Shell_App SHALL cachear Remote_Entry por 1 hora em produção
7. THE Shell_App SHALL ter cache strategy para chunks dos MFEs (service worker)
8. FOR ALL MFEs, THE MFE SHALL ter Core Web Vitals otimizadas (LCP < 2.5s, FID < 100ms, CLS < 0.1)
9. THE Shell_App SHALL carregar CSS critical inline para evitar FOUC
10. FOR ALL MFEs, THE MFE SHALL implementar code splitting para rotas internas
11. THE Shell_App SHALL ter Lighthouse score mínimo de 90 em performance
12. THE Shell_App SHALL monitorar performance com Web Vitals API e enviar métricas

### Requirement 19: Tratamento de Erros entre MFEs

**User Story:** Como desenvolvedor, eu quero tratamento robusto de erros para falhas de carregamento de MFEs, para que a aplicação não quebre completamente quando um MFE falhar.

#### Acceptance Criteria

1. THE Shell_App SHALL capturar erros de carregamento de Remote_Entry usando try-catch
2. WHEN MFE remoto falhar ao carregar, THE Shell_App SHALL exibir mensagem de erro amigável
3. WHEN MFE remoto falhar ao carregar, THE Shell_App SHALL logar erro no LoggerService
4. THE Shell_App SHALL ter componente fallback para exibir quando MFE não carregar
5. THE Shell_App SHALL permitir retry manual quando MFE falhar ao carregar
6. THE Shell_App SHALL implementar circuit breaker para MFEs com falhas consecutivas
7. WHEN MFE remoto não for crítico, THE Shell_App SHALL continuar funcionando sem ele
8. FOR ALL MFEs, WHEN erro interno ocorrer, THE MFE SHALL capturar com ErrorHandler local
9. FOR ALL MFEs, WHEN erro interno ocorrer, THE MFE SHALL emitir Custom_Event "mfe:error" com detalhes
10. THE Shell_App SHALL escutar Custom_Event "mfe:error" e exibir notificação global
11. THE Shell_App SHALL ter timeout de 10s para carregamento de Remote_Entry
12. THE Shell_App SHALL ter fallback para versão anterior do MFE quando nova versão falhar

### Requirement 20: Migração Gradual e Rollback

**User Story:** Como tech lead, eu quero poder migrar para MFE de forma gradual e ter estratégia de rollback, para que possamos minimizar riscos durante a transformação.

#### Acceptance Criteria

1. THE Shell_App SHALL ter feature flag para ativar/desativar MFE por feature
2. WHEN feature flag de MFE estiver desativada, THE Shell_App SHALL carregar código monolítico original
3. THE Shell_App SHALL ter configuração para modo híbrido (alguns MFEs, alguns monolítico)
4. THE Shell_App SHALL ter branch "mfe-migration" para desenvolvimento da transformação
5. THE Shell_App SHALL manter branch "main" estável com monolito funcionando
6. FOR ALL MFEs, WHEN deployado, THE MFE SHALL manter última versão estável disponível
7. THE Shell_App SHALL ter script de rollback que aponta remotes para versão anterior
8. THE Shell_App SHALL ter testes de regressão validando paridade de funcionalidade MFE vs monolito
9. THE Shell_App SHALL documentar critérios de sucesso para migração de cada feature
10. THE Shell_App SHALL ter plano de migração por fases: Products → Cart → Auth → User → Admin
11. WHEN rollback for necessário, THE Shell_App SHALL executar rollback em menos de 5 minutos
12. THE Shell_App SHALL manter monitoramento comparativo de performance entre monolito e MFE durante migração
