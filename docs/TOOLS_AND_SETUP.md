# 🛠️ Ferramentas e Configuração

## Visão Geral

Este documento consolida informações sobre as ferramentas, tecnologias e configurações utilizadas no projeto Coffee Workshop.

---

## 🚀 Stack Tecnológico

### Framework e Bibliotecas Principais

- **Angular 21**: Framework principal
- **Angular Material 21**: Biblioteca de componentes UI
- **TypeScript**: Linguagem de programação
- **RxJS**: Programação reativa
- **NgRx SignalStore**: Gerenciamento de estado reativo

### Ferramentas de Desenvolvimento

- **Vitest**: Testes unitários (padrão no Angular 21)
- **Cypress**: Testes end-to-end
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Husky**: Git hooks
- **lint-staged**: Linting em arquivos staged

### Build e Deploy

- **Angular CLI**: Build e desenvolvimento
- **Docker**: Containerização
- **GitHub Actions**: CI/CD
- **Vercel/Netlify**: Deploy automático

---

## 📦 Instalação e Setup

### Pré-requisitos

```bash
# Versões recomendadas
Node.js: 22+
npm: 10+
Angular CLI: 21+
```

### Instalação

```bash
# Clonar repositório
git clone <repository-url>
cd coffee-workshop

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Acessar aplicação
open http://localhost:4200
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start                    # Servidor de desenvolvimento
npm run build               # Build para produção
npm run build:dev           # Build para desenvolvimento

# Testes
npm test                    # Testes unitários (Vitest)
npm run test:coverage       # Testes com cobertura
npm run test:ui             # Interface visual dos testes
npm run cypress             # Testes E2E (interface)
npm run cypress:headless    # Testes E2E (headless)

# Qualidade de Código
npm run lint                # Verificar linting
npm run lint:fix            # Corrigir linting automaticamente
npm run format              # Formatar código
npm run format:check        # Verificar formatação

# Docker
docker-compose up -d        # Executar com Docker
docker build -t coffee-workshop .  # Build da imagem
```

---

## 🧪 Configuração de Testes

### Vitest (Testes Unitários)

O Angular 21 vem com Vitest configurado por padrão. Principais comandos:

```bash
# Executar todos os testes
npm test

# Modo watch (re-executa ao salvar)
npm test -- --watch

# Interface visual
npm test -- --ui

# Com cobertura
npm test -- --coverage

# Teste específico
npm test -- auth.store.spec.ts
```

### Cypress (Testes E2E)

```bash
# Interface interativa (recomendado para desenvolvimento)
npm run cypress

# Modo headless (para CI/CD)
npm run cypress:headless

# Pré-requisito: aplicação rodando em localhost:4200
npm start  # Em outro terminal
```

---

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente

```typescript
// src/environments/environment.ts (desenvolvimento)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableAnalytics: false,
  logLevel: 'debug',
};

// src/environments/environment.prod.ts (produção)
export const environment = {
  production: true,
  apiUrl: 'https://api.coffee-workshop.com',
  enableAnalytics: true,
  logLevel: 'error',
};
```

### Configuração do Angular

```json
// angular.json - principais configurações
{
  "build": {
    "optimization": true,
    "sourceMap": false,
    "namedChunks": false,
    "extractLicenses": true,
    "outputHashing": "all"
  },
  "serve": {
    "port": 4200,
    "host": "localhost"
  }
}
```

---

## 🎨 Configuração de Código

### ESLint

```json
// .eslintrc.json
{
  "extends": ["@angular-eslint/recommended", "@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Prettier

```json
// .prettierrc
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### Husky (Git Hooks)

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,js}": ["eslint --fix"],
    "*.{ts,js,html,css,scss,md}": ["prettier --write"]
  }
}
```

---

## 🐳 Docker

### Dockerfile

```dockerfile
# Multi-stage build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/Angular-Material-Signals-Vitest-Cypress/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '8080:80'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Comandos Docker

```bash
# Build e executar
docker-compose up -d

# Acessar aplicação
open http://localhost:8080

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## 🔄 CI/CD com GitHub Actions

### Workflow Principal

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

### Deploy Automático

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/Angular-Material-Signals-Vitest-Cypress/browser
```

---

## 📊 Monitoramento e Analytics

### Web Vitals

```typescript
// src/app/core/services/web-vitals.service.ts
@Injectable({ providedIn: 'root' })
export class WebVitalsService {
  // Monitora:
  // - FCP (First Contentful Paint)
  // - LCP (Largest Contentful Paint)
  // - FID (First Input Delay)
  // - CLS (Cumulative Layout Shift)
  // - TTFB (Time to First Byte)
}
```

### Analytics

```typescript
// src/app/core/services/analytics.service.ts
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  trackEvent(category: string, action: string, label?: string) {
    // Integração com Google Analytics, etc.
  }
}
```

---

## 🔒 Segurança

### Configurações de Segurança

```typescript
// Headers de segurança (nginx.conf)
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### Validações

```typescript
// src/app/shared/validators/custom-validators.ts
export class CustomValidators {
  static email(): ValidatorFn;
  static strongPassword(): ValidatorFn;
  static cpf(): ValidatorFn;
  static phone(): ValidatorFn;
  // ... outros validadores
}
```

---

## 📚 Recursos e Documentação

### Links Úteis

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Vitest Documentation](https://vitest.dev)
- [Cypress Documentation](https://docs.cypress.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Guias do Projeto

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura do projeto
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guia de desenvolvimento
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Estratégia de testes
- [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) - Guia de segurança
- [PERFORMANCE.md](./PERFORMANCE.md) - Otimizações de performance
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia de deploy
- [DOCKER.md](./DOCKER.md) - Guia do Docker

---

## 🤝 Contribuição

### Fluxo de Desenvolvimento

1. Fork do repositório
2. Criar branch: `git checkout -b feature/nova-funcionalidade`
3. Fazer commit: `git commit -m 'Add: nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abrir Pull Request

### Padrões de Commit

- `Add: nova funcionalidade`
- `Fix: correção de bug`
- `Refactor: refatoração de código`
- `Docs: atualização de documentação`
- `Style: formatação de código`
- `Test: adição de testes`
- `Chore: tarefas de manutenção`

---

**Última atualização**: Março 2026  
**Versão do Angular**: 21.1.0  
**Status**: ✅ Configurado e Pronto para Desenvolvimento
