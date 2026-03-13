# Coffee Workshop

[![CI](https://github.com/lucasdev10/Coffee-Workshop/actions/workflows/ci.yml/badge.svg)](https://github.com/lucasdev10/Coffee-Workshop/actions/workflows/ci.yml)
[![Deploy](https://github.com/lucasdev10/Coffee-Workshop/actions/workflows/deploy.yml/badge.svg)](https://github.com/lucasdev10/Coffee-Workshop/actions/workflows/deploy.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Projeto de estudo de e-commerce construído com Angular 21, demonstrando arquitetura moderna, estratégias de teste e melhores práticas de desenvolvimento.

## 🏗️ Arquitetura

Este projeto segue uma **arquitetura baseada em features** com clara separação de responsabilidades:

```
src/app/
├── core/                    # Funcionalidades centrais (serviços singleton)
│   ├── guards/             # Guards de rota (auth, role, unsaved-changes)
│   ├── interceptors/       # Interceptors HTTP (auth, tratamento de erros)
│   ├── layout/             # Componentes de layout (header, footer)
│   ├── storage/            # Serviço de storage (wrapper do localStorage)
│   └── http/               # Wrapper do cliente HTTP
│
├── features/               # Módulos de features (lazy-loaded)
│   ├── products/          # Gerenciamento de produtos
│   │   ├── components/    # Componentes específicos da feature
│   │   ├── pages/         # Componentes de rota
│   │   ├── store/         # Gerenciamento de estado (Signals)
│   │   ├── repositories/  # Camada de acesso a dados
│   │   ├── models/        # Interfaces TypeScript
│   │   └── integration/   # Testes de integração
│   │
│   ├── cart/              # Carrinho de compras
│   ├── admin/             # Painel administrativo (protegido)
│   ├── auth/              # Autenticação
│   └── user/              # Gerenciamento de usuários
│
└── shared/                 # Recursos compartilhados
    ├── components/        # Componentes reutilizáveis
    ├── directives/        # Diretivas customizadas
    ├── pipes/             # Pipes customizados
    ├── validators/        # Validadores de formulário
    └── utils/             # Funções utilitárias
```

### Principais Decisões Arquiteturais

**Gerenciamento de Estado**: Angular Signals (v16+)

- Estado reativo com detecção automática de mudanças
- Valores computados com memorização automática
- Melhor performance que os tradicionais RxJS BehaviorSubjects

**Lazy Loading**: Todos os módulos de features são carregados sob demanda

- Reduz o tamanho do bundle inicial
- Melhora o tempo de inicialização da aplicação
- Melhor divisão de código

**Padrão Repository**: Separação da lógica de acesso a dados

- Abstrai chamadas de API da lógica de negócio
- Mais fácil de testar e mockar
- Transformação de dados centralizada

**Guards & Interceptors**: Segurança e tratamento HTTP

- Guard de autenticação para rotas protegidas
- Controle de acesso baseado em roles
- Injeção automática de token
- Tratamento global de erros

## 🚀 Stack Tecnológico

- **Framework**: Angular 21
- **UI Library**: Angular Material 21
- **Gerenciamento de Estado**: Angular Signals
- **Formulários**: Signals Form
- **HTTP Client**: Angular HttpClient
- **Roteamento**: Angular Router com lazy loading
- **Testes**: Vitest (unitários) + Cypress (e2e)
- **Linting**: ESLint + Angular ESLint
- **Formatação**: Prettier
- **Git Hooks**: Husky + lint-staged
- **CI/CD**: GitHub Actions

## 📦 Funcionalidades

- ✅ Catálogo de produtos com filtros
- ✅ Carrinho de compras com persistência
- ✅ Painel administrativo (operações CRUD)
- ✅ Autenticação e autorização
- ✅ Controle de acesso baseado em roles
- ✅ Validação de formulários
- ✅ Design responsivo
- ✅ Lazy loading
- ✅ Otimizações de performance

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 22+
- npm 10+

### Instalação

```bash
npm install
```

### Servidor de Desenvolvimento

```bash
npm start
# ou
ng serve
```

Navegue para `http://localhost:4200/`

### Build

```bash
npm run build
```

Os artefatos de build serão armazenados no diretório `dist/`.

## 🧪 Testes

### Testes Unitários (Vitest)

```bash
npm test                 # Executar testes em modo watch
npm run test:coverage    # Executar testes com relatório de cobertura
```

### Testes E2E (Cypress)

```bash
npm run cypress          # Abrir interface do Cypress
npm run cypress:headless # Executar testes em modo headless
```

**Suítes de Teste**:

- Fluxo de compra do usuário
- Gerenciamento de produtos do admin
- Cálculos do carrinho
- Preservação da lista de produtos

## 📊 Qualidade de Código

### Linting

```bash
npm run lint             # Verificar erros de linting
npm run lint:fix         # Corrigir erros de linting automaticamente
```

**Configuração ESLint**:

- Regras do Angular ESLint
- Modo strict do TypeScript
- Proibição de tipos `any` (obrigatório)
- Estilo de código consistente

### Formatação

```bash
npm run format           # Formatar todos os arquivos
npm run format:check     # Verificar formatação
```

**Configuração Prettier**:

- Largura de impressão: 100
- Aspas simples
- Parser HTML do Angular

### Pre-commit Hooks

Husky + lint-staged executam automaticamente no commit:

- ESLint em arquivos `.ts`
- Prettier em todos os arquivos
- Previne commit de código quebrado

## 🔒 Segurança

- ✅ Rotas administrativas protegidas com guards
- ✅ Autenticação JWT (simulada)
- ✅ Controle de acesso baseado em roles
- ✅ Sanitização de entrada
- ✅ Proteção XSS (integrada ao Angular)
- ✅ Interceptors HTTP para auth e erros

Veja [SECURITY_GUIDE.md](docs/SECURITY_GUIDE.md) para detalhes.

## ♿ Acessibilidade

Este projeto implementa padrões de acessibilidade WCAG 2.1 Nível AA:

- ✅ HTML semântico com landmarks apropriados (main, nav, header)
- ✅ Atributos ARIA para suporte a leitores de tela
- ✅ Navegação por teclado (Tab, Enter, Escape)
- ✅ Gerenciamento de foco e indicadores visíveis
- ✅ Labels descritivos e texto alternativo
- ✅ Regiões live para conteúdo dinâmico
- ✅ Validação de formulário com mensagens de erro acessíveis
- ✅ Conformidade com contraste de cores

**Funcionalidades Principais**:

- Todos os elementos interativos acessíveis por teclado
- Labels aria dinâmicos para descrições contextuais
- Hierarquia de cabeçalhos adequada
- Testado com leitores de tela NVDA/VoiceOver

Veja [ACCESSIBILITY.md](docs/ACCESSIBILITY.md) para guia completo de implementação.

### Testando Acessibilidade

```bash
npm run cypress          # Inclui suíte de testes de acessibilidade
npm run test:a11y        # Executar testes específicos de acessibilidade
```

## ⚡ Performance

Este projeto é otimizado para excelentes pontuações no Lighthouse e experiência rápida do usuário:

- ✅ Pontuação de Performance no Lighthouse: 90+
- ✅ First Contentful Paint (FCP): < 1.8s
- ✅ Largest Contentful Paint (LCP): < 2.5s
- ✅ Time to Interactive (TTI): < 3.8s
- ✅ Cumulative Layout Shift (CLS): < 0.1

**Otimizações Principais**:

- Code splitting e lazy loading para todas as rotas
- Lazy loading de imagens com Intersection Observer
- Detecção de mudanças zoneless (experimental)
- Estratégia de detecção OnPush
- Inlining de CSS crítico
- Carregamento assíncrono de fontes com font-display: swap
- Cache HTTP e Fetch API
- Monitoramento de Web Vitals
- Pronto para PWA com manifest

Veja [PERFORMANCE.md](docs/PERFORMANCE.md) para guia completo de otimização.

### Testando Performance

```bash
npm run build            # Build para produção
npx lighthouse http://localhost:4200 --view  # Executar auditoria Lighthouse
```

## 🐳 Docker

A aplicação está totalmente containerizada e pronta para deploy:

- ✅ Dockerfile multi-stage para tamanho otimizado de imagem (~50 MB)
- ✅ Docker Compose para deploy local fácil
- ✅ Configuração Nginx com cache e headers de segurança
- ✅ Health checks e monitoramento
- ✅ Integração com GitHub Container Registry

**Início Rápido**:

```bash
# Usando Docker Compose
docker-compose up -d

# Usando Docker CLI
docker build -t coffee-workshop .
docker run -d -p 8080:80 coffee-workshop

# Acessar aplicação
open http://localhost:8080
```

Veja [DOCKER.md](docs/DOCKER.md) para guia completo do Docker.

## 🚀 Deploy Automatizado

Pipelines CI/CD configurados para deploys automatizados:

- ✅ Workflows do GitHub Actions
- ✅ Testes automatizados antes do deploy
- ✅ Suporte a múltiplos ambientes (dev, staging, produção)
- ✅ Build e publicação de imagens Docker
- ✅ Deploys em plataformas (Vercel, Netlify)
- ✅ Estratégias de rollback

**Ambientes de Deploy**:

- **Development**: Auto-deploy no push para `develop`
- **Staging**: Deploys de preview para PRs
- **Production**: Auto-deploy no push para `main` ou tags

**Plataformas Suportadas**:

- Vercel (Recomendado)
- Netlify
- Docker (Self-hosted)
- AWS Amplify
- Azure Static Web Apps

Veja [DEPLOYMENT.md](docs/DEPLOYMENT.md) para guia completo de deploy.

## 🔄 Pipeline CI/CD

### Workflows do GitHub Actions

**Pipeline CI** (`ci.yml`):

- Executa em push/PR para main/develop
- Verificações de linting e formatação
- Testes unitários
- Verificação de build
- Upload de artefatos

**Pipeline Deploy** (`deploy.yml`):

- Deploy para GitHub Pages
- Executa em push para main
- Deploy automático

**Verificações de PR** (`pr-checks.yml`):

- Valida pull requests
- Feedback detalhado sobre qualidade do código

### Configurando GitHub Pages

1. Vá para Configurações do repositório → Pages
2. Fonte: GitHub Actions
3. A aplicação será deployada automaticamente no push para main

## 📚 Documentação

- [Guia de Arquitetura](docs/ARCHITECTURE.md) - Arquitetura completa do projeto
- [Estratégia de Testes](docs/TESTING_STRATEGY.md) - Estratégias e padrões de teste
- [Guia de Segurança](docs/SECURITY_GUIDE.md) - Implementações de segurança
- [Otimizações de Performance](docs/PERFORMANCE.md) - Guia de performance
- [Guia de Desenvolvimento](docs/DEVELOPMENT.md) - Setup e desenvolvimento
- [Guia do Vitest](docs/VITEST_GUIDE.md) - Testes com Vitest
- [Guia de Acessibilidade](docs/ACCESSIBILITY.md) - Implementação WCAG
- [Guia de Deploy](docs/DEPLOYMENT.md) - Estratégias de deploy
- [Guia do Docker](docs/DOCKER.md) - Containerização
- [Ferramentas e Setup](docs/TOOLS_AND_SETUP.md) - Configuração e ferramentas

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch de feature (`git checkout -b feature/funcionalidade-incrivel`)
3. Faça commit das suas mudanças (`git commit -m 'Add: funcionalidade incrível'`)
4. Faça push para a branch (`git push origin feature/funcionalidade-incrivel`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é para fins educacionais.

## 🙏 Agradecimentos

- Time do Angular pelo framework incrível
- Angular Material pelos componentes UI
- Vitest pelos testes unitários rápidos
- Cypress pelos testes e2e confiáveis
