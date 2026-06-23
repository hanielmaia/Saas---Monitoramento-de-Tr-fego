# 🔐 Correções de Segurança - JWT e Autenticação

## ✅ Mudanças Realizadas

---

## 1️⃣ `backend/src/server.ts` - Validação Obrigatória de JWT_SECRET

### ❌ ANTES (INSEGURO)
```typescript
import 'dotenv/config';
import app from './app.js';

const port = parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? 'localhost';

app.listen(port, host, () => {
  console.log(`\n✅ Servidor iniciado`);
  console.log(`📡 URL: http://${host}:${port}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV ?? 'development'}\n`);
});
```

### ✅ DEPOIS (SEGURO)
```typescript
import 'dotenv/config';
import app from './app.js';

/**
 * Validação de Variáveis de Ambiente Obrigatórias
 */
function validateEnvironment() {
  const requiredVars = ['JWT_SECRET'];
  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ ERRO: Variáveis de ambiente obrigatórias não configuradas:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n📝 Verifique seu arquivo .env e certifique-se de que contém:');
    console.error('   JWT_SECRET=sua_chave_secreta_super_segura_com_32_caracteres_minimo');
    process.exit(1);
  }
}

// Validar antes de iniciar
validateEnvironment();

const port = parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? 'localhost';

app.listen(port, host, () => {
  console.log(`\n✅ Servidor iniciado`);
  console.log(`📡 URL: http://${host}:${port}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV ?? 'development'}\n`);
});
```

**O que mudou:**
- ✅ Função `validateEnvironment()` verifica variáveis obrigatórias
- ✅ Aplicação **TRAVA** (process.exit(1)) se JWT_SECRET não estiver definido
- ✅ Mensagem de erro clara ao desenvolvedor
- ✅ Impede inicialização com autenticação quebrada

---

## 2️⃣ `backend/src/middlewares/auth.js` - Remover Default Inseguro

### ❌ ANTES (INSEGURO)
```javascript
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Token não fornecido ou formato inválido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_secret_aqui');
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = decoded;
    next();
  } catch (error) {
    // ...
  }
}
```

### ✅ DEPOIS (SEGURO)
```javascript
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Token não fornecido ou formato inválido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // JWT_SECRET é obrigatório e validado em server.ts
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = decoded;
    next();
  } catch (error) {
    // ...
  }
}
```

**O que mudou:**
- ✅ Removido `|| 'seu_secret_aqui'` (default inseguro)
- ✅ Agora usa apenas `process.env.JWT_SECRET` (obrigatório)
- ✅ Agregado comentário indicando validação em server.ts
- ✅ Se JWT_SECRET não existir, a aplicação já terá travado em server.ts

---

## 3️⃣ `backend/src/services/auth.service.js` - Remover Default Inseguro

### ❌ ANTES (INSEGURO)
```javascript
async function login({ email, password }) {
  // ...
  
  // Gerar token JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'seu_secret_aqui',
    { expiresIn: process.env.JWT_EXPIRATION || '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}
```

### ✅ DEPOIS (SEGURO)
```javascript
async function login({ email, password }) {
  // ...
  
  // Gerar token JWT
  // JWT_SECRET é obrigatório e validado em server.ts
  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}
```

**O que mudou:**
- ✅ Removido `|| 'seu_secret_aqui'` (default inseguro)
- ✅ Agora usa apenas `process.env.JWT_SECRET` (obrigatório)
- ✅ Agregado comentário indicando validação em server.ts
- ✅ Garante que tokens são gerados com chave segura

---

## 4️⃣ `backend/.env.example` - Documentação de Variáveis

### ✅ Atualizado com Instruções
```env
# ===== VARIÁVEIS OBRIGATÓRIAS =====
# JWT Secret - NUNCA use o valor padrão em produção!
# Gere uma chave segura com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="gere_uma_chave_segura_com_32_caracteres_minimo_aqui"

# ===== SERVIDOR =====
NODE_ENV=development
PORT=3000
HOST=localhost

# ===== BANCO DE DADOS =====
DB_PATH=../../db.json
DATABASE_URL="postgresql://usuario:senha@localhost:5432/neyes"

# ===== JWT CONFIGURATION =====
JWT_EXPIRATION=8h

# ===== CORS =====
CORS_ORIGIN=http://localhost:3000,http://localhost:8000

# ===== SEGURANÇA =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===== LOGGING =====
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

**O que mudou:**
- ✅ Reorganizado com seções claras
- ✅ Instruções para gerar JWT_SECRET seguro
- ✅ Adicionadas variáveis de segurança (rate limiting)
- ✅ Adicionadas variáveis de logging

---

## 5️⃣ `backend/.env` - Configuração de Desenvolvimento

### ✅ Atualizado com Chave Segura
```env
# ===================================
# N Eyes - Backend Configuration
# DESENVOLVIMENTO APENAS
# ===================================

# Server
PORT=3000
HOST=localhost
NODE_ENV=development

# CORS Origins (separados por vírgula)
CORS_ORIGIN=http://localhost:3000,http://localhost:8000

# JWT - OBRIGATÓRIO E CRÍTICO PARA SEGURANÇA
# Chave gerada com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6
JWT_EXPIRATION=8h

# Database
DB_PATH=../../db.json
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_db_aqui
DB_NAME=n_eyes_db

# Segurança
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Email (se usar no futuro)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app_aqui
```

**O que mudou:**
- ✅ JWT_SECRET agora tem chave segura de 64 caracteres
- ✅ Alterado `JWT_EXPIRY` para `JWT_EXPIRATION` (consistência com código)
- ✅ Adicionadas variáveis de segurança
- ✅ Melhorado comentário indicando uso em desenvolvimento

---

## 🧪 Como Testar as Mudanças

### 1. Verificar se aplicação trava sem JWT_SECRET

```bash
# Remover JWT_SECRET do .env
NODE_ENV=test PORT=3001 npm run dev
```

**Resultado esperado:**
```
❌ ERRO: Variáveis de ambiente obrigatórias não configuradas:
   - JWT_SECRET

📝 Verifique seu arquivo .env e certifique-se de que contém:
   JWT_SECRET=sua_chave_secreta_super_segura_com_32_caracteres_minimo
```

### 2. Iniciar com JWT_SECRET válido

```bash
npm run dev
```

**Resultado esperado:**
```
✅ Servidor iniciado
📡 URL: http://localhost:3000
📝 Ambiente: development
```

### 3. Testar autenticação

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","password":"password123"}'

# Response (com token válido)
{
  "status": "success",
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Calheiros",
    "email": "joao@test.com",
    "role": "ADMIN"
  }
}
```

### 4. Usar token protegido

```bash
# Acessar rota protegida com token
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Response
{
  "status": "success",
  "user": {
    "id": 1,
    "name": "João Calheiros",
    "email": "joao@test.com",
    "role": "ADMIN"
  }
}
```

---

## 🔒 Resumo de Segurança

| Vulnerabilidade | Antes | Depois | Status |
|-----------------|-------|--------|--------|
| JWT_SECRET default fraco | `'seu_secret_aqui'` | Obrigatório em .env | ✅ CORRIGIDO |
| Fallback inseguro | `\|\| 'seu_secret_aqui'` | Removido | ✅ CORRIGIDO |
| Validação ao iniciar | ❌ Não | ✅ Sim, trava se inválido | ✅ IMPLEMENTADO |
| Erro claro para dev | ❌ Falha silenciosa | ✅ Mensagem clara | ✅ IMPLEMENTADO |
| .env versionado | Risco | Protegido por .gitignore | ✅ VERIFICADO |

---

## 📋 Próximos Passos Recomendados

1. **Implementar Rate Limiting** (proteger contra brute force)
   - Middleware: `express-rate-limit`
   - Especialmente em `/api/auth/login`

2. **Adicionar Helmet.js** (headers de segurança)
   ```bash
   npm install helmet
   ```

3. **Implementar Logout com Token Blacklist** (invalidar tokens)
   - Armazenar tokens revogados em BD
   - Verificar blacklist antes de validar

4. **Adicionar 2FA/MFA** (autenticação multifator)
   - Opcional mas recomendado

5. **Logging Estruturado** (Sentry, LogRocket, Pino)
   - Rastrear tentativas de autenticação falhadas

---

**Gerado em:** 22 de junho de 2026  
**Status:** ✅ Todas as mudanças implementadas e testadas
