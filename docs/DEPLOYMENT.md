# 🚀 Guia de Deploy

## Visão Geral

Este guia aborda estratégias de deploy automatizado para a aplicação Coffee Workshop usando pipelines de CI/CD.

---

## 🎯 Estratégias de Deploy

### 1. GitHub Actions (Recomendado)

- Builds automatizados no push
- Suporte a múltiplos ambientes
- Publicação de imagens Docker
- Deploys em plataformas (Vercel, Netlify)

### 2. Deploy com Docker

- Aplicação containerizada
- Fácil escalabilidade
- Ambientes consistentes
- Agnóstico de nuvem

### 3. Deploys em Plataformas

- Vercel (Recomendado para Angular)
- Netlify
- AWS Amplify
- Azure Static Web Apps

---

## 🔄 Workflows de CI/CD

### Visão Geral do Workflow

```
┌─────────────┐
│   Push no   │
│   GitHub    │
└──────┬──────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────┐                 ┌──────────────┐
│ Executar     │                 │ Build Imagem │
│ Testes & Lint│                 │    Docker    │
└──────┬───────┘                 └──────┬───────┘
       │                                 │
       ▼                                 ▼
┌──────────────┐                 ┌──────────────┐
│    Build     │                 │ Push para    │
│  Aplicação   │                 │     GHCR     │
└──────┬───────┘                 └──────────────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────┐                 ┌──────────────┐
│  Deploy no   │                 │  Deploy no   │
│   Vercel     │                 │   Netlify    │
└──────────────┘                 └──────────────┘
```

---

## 📋 Workflows do GitHub Actions

### 1. Workflow de CI (`.github/workflows/ci.yml`)

**Gatilhos**: Push, Pull Request  
**Propósito**: Executar testes e verificações de qualidade

```yaml
- Executar testes unitários (Vitest)
- Executar testes E2E (Cypress)
- Executar linter (ESLint)
- Verificar cobertura de código
- Build da aplicação
```

### 2. Build Docker (`.github/workflows/docker-build.yml`)

**Gatilhos**: Push para main/develop, Tags  
**Propósito**: Build e publicação de imagens Docker

```yaml
- Build de imagens multi-plataforma (amd64, arm64)
- Push para GitHub Container Registry
- Tag com versão/branch/sha
- Cache de camadas para builds mais rápidos
```

### 3. Deploy Produção (`.github/workflows/deploy-production.yml`)

**Gatilhos**: Push para main, Tags  
**Propósito**: Deploy para ambiente de produção

```yaml
- Executar testes
- Build da aplicação
- Deploy no Vercel (produção)
- Deploy no Netlify (produção)
- Notificar sucesso/falha
```

### 4. Deploy Staging (`.github/workflows/deploy-staging.yml`)

**Gatilhos**: Push para develop, Pull Requests  
**Propósito**: Deploy para ambiente de staging

```yaml
- Executar testes
- Build da aplicação
- Deploy no Vercel (preview)
- Deploy no Netlify (preview)
- Comentar PR com URL de preview
```

---

## 🔐 Secrets Necessários

### Secrets do GitHub

Configure em: `Settings > Secrets and variables > Actions`

#### Vercel

```
VERCEL_TOKEN          # Token da API do Vercel
VERCEL_ORG_ID         # ID da Organização
VERCEL_PROJECT_ID     # ID do Projeto
```

#### Netlify

```
NETLIFY_AUTH_TOKEN    # Token de acesso pessoal do Netlify
NETLIFY_SITE_ID       # ID do Site
```

#### Registro Docker

```
GITHUB_TOKEN          # Fornecido automaticamente
```

---

## 🌐 Configuração de Plataformas

### Deploy no Vercel

#### 1. Instalar CLI do Vercel

```bash
npm install -g vercel
```

#### 2. Login e Vincular Projeto

```bash
vercel login
vercel link
```

#### 3. Obter Detalhes do Projeto

```bash
vercel project ls
# Copiar ORG_ID e PROJECT_ID
```

#### 4. Configurar Configurações de Build

**Preset do Framework**: Angular  
**Comando de Build**: `npm run build`  
**Diretório de Saída**: `dist/Coffee-Workshop/browser`  
**Comando de Instalação**: `npm ci --legacy-peer-deps`

#### 5. Variáveis de Ambiente

```
NODE_ENV=production
```

---

### Deploy no Netlify

#### 1. Instalar CLI do Netlify

```bash
npm install -g netlify-cli
```

#### 2. Login e Inicializar

```bash
netlify login
netlify init
```

#### 3. Configurar Configurações de Build

**Comando de Build**: `npm run build`  
**Diretório de Publicação**: `dist/Coffee-Workshop
**Branch de Produção**: `main`

#### 4. Criar `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist/Coffee-Workshop

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_ENV = "production"
```

---

## 🐳 Deploy com Docker

### GitHub Container Registry

#### 1. Build e Push

```bash
# Automático via GitHub Actions
# Ou manualmente:
docker build -t ghcr.io/username/coffee-workshop:latest .
docker push ghcr.io/username/coffee-workshop:latest
```

#### 2. Pull e Executar

```bash
docker pull ghcr.io/username/coffee-workshop:latest
docker run -d -p 8080:80 ghcr.io/username/coffee-workshop:latest
```

### Docker Hub

#### 1. Login

```bash
docker login
```

#### 2. Tag e Push

```bash
docker tag coffee-workshop username/coffee-workshop:latest
docker push username/coffee-workshop:latest
```

---

## ☁️ Deploys em Nuvem

### AWS Amplify

#### 1. Conectar Repositório

- Ir para o Console do AWS Amplify
- Conectar repositório GitHub
- Selecionar branch (main)

#### 2. Configurações de Build

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --legacy-peer-deps
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist/Coffee-Workshop
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Azure Static Web Apps

#### 1. Criar Recurso

```bash
az staticwebapp create \
  --name coffee-workshop \
  --resource-group myResourceGroup \
  --source https://github.com/username/repo \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --output-location "dist/Coffee-Workshop
```

#### 2. Configurar Workflow

Workflow do GitHub Actions é gerado automaticamente

---

## 🔄 Ambientes de Deploy

### Desenvolvimento

- **Branch**: `develop`
- **URL**: `https://dev.coffee-workshop.com`
- **Auto-deploy**: No push para develop
- **Propósito**: Testar novas funcionalidades

### Staging

- **Branch**: `develop` / PR previews
- **URL**: `https://staging.coffee-workshop.com`
- **Auto-deploy**: No push para develop
- **Propósito**: Testes pré-produção

### Produção

- **Branch**: `main`
- **URL**: `https://coffee-workshop.com`
- **Auto-deploy**: No push para main ou tags
- **Propósito**: Aplicação em produção

---

## 📊 Monitoramento de Deploy

### Verificações de Saúde

```bash
# Verificar saúde da aplicação
curl https://coffee-workshop.com/health

# Verificar tempo de resposta
curl -w "@curl-format.txt" -o /dev/null -s https://coffee-workshop.com
```

### Ferramentas de Monitoramento

- **Vercel Analytics**: Monitoramento de performance integrado
- **Netlify Analytics**: Insights de tráfego e performance
- **Google Analytics**: Rastreamento de comportamento do usuário
- **Sentry**: Rastreamento e monitoramento de erros

---

## 🔧 Estratégias de Rollback

### Rollback no Vercel

```bash
# Listar deploys
vercel ls

# Rollback para deploy anterior
vercel rollback [deployment-url]
```

### Rollback no Netlify

```bash
# Listar deploys
netlify deploy:list

# Restaurar deploy anterior
netlify deploy:restore [deploy-id]
```

### Rollback no Docker

```bash
# Pull da versão anterior
docker pull ghcr.io/username/coffee-workshop:v1.0.0

# Parar container atual
docker stop coffee-workshop

# Iniciar versão anterior
docker run -d -p 8080:80 --name coffee-workshop \
  ghcr.io/username/coffee-workshop:v1.0.0
```

---

## 🧪 Testando Deploys

### Testes de Fumaça

```bash
# Testar página inicial
curl -I https://coffee-workshop.com

# Testar endpoints da API
curl https://coffee-workshop.com/api/health

# Testar roteamento
curl https://coffee-workshop.com/products
```

### Testes E2E Contra Deploy

```bash
# Definir URL base
export CYPRESS_BASE_URL=https://staging.coffee-workshop.com

# Executar testes
npm run cypress:headless
```

---

## 📈 Otimização de Performance

### Configuração de CDN

- **Vercel**: CDN global automático
- **Netlify**: CDN global automático
- **CloudFlare**: Camada adicional de CDN

### Estratégia de Cache

```nginx
# Assets estáticos: 1 ano
Cache-Control: public, max-age=31536000, immutable

# HTML: Sem cache
Cache-Control: no-cache, must-revalidate

# API: 5 minutos
Cache-Control: public, max-age=300
```

---

## 🔒 Segurança

### HTTPS

- ✅ Certificados SSL automáticos (Let's Encrypt)
- ✅ Redirecionamento forçado para HTTPS
- ✅ Headers HSTS

### Headers de Segurança

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self'
```

### Variáveis de Ambiente

- Nunca fazer commit de secrets no repositório
- Usar gerenciamento de secrets da plataforma
- Rotacionar tokens regularmente

---

## 📚 Recursos

### Documentação

- [GitHub Actions](https://docs.github.com/en/actions)
- [Deploy no Vercel](https://vercel.com/docs)
- [Deploy no Netlify](https://docs.netlify.com/)
- [Deploy com Docker](https://docs.docker.com/get-started/)

### Ferramentas

- [CLI do Vercel](https://vercel.com/cli)
- [CLI do Netlify](https://docs.netlify.com/cli/get-started/)
- [CLI do GitHub](https://cli.github.com/)

---

**Última Atualização**: Março 2026  
**Status do Deploy**: ✅ Automatizado  
**Ambientes**: Desenvolvimento, Staging, Produção
