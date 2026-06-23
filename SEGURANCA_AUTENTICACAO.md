# 🔐 Melhorias de Segurança - Autenticação e Autorização

## 📋 Resumo das Implementações

Implementação completa de um sistema robusto de autenticação com **Refresh Tokens**, **httpOnly Cookies**, **Revogação de Tokens** e **Rate Limiting**.

---

## 1. ✅ Refresh Tokens

### O que é?
Um sistema de dois tokens que aumenta a segurança:
- **Access Token** (curta duração: 15 min)
- **Refresh Token** (longa duração: 7 dias)

### Benefícios:
✅ Se o access token vazar, dura apenas 15 minutos
✅ Usuário não precisa inserir credenciais a cada 15 min
✅ Logout é instantâneo (revoga refresh token)
✅ Melhor experiência UX

### Fluxo:

```
1. Login
   ↓
   Backend gera: Access Token (15m) + Refresh Token (7d)
   ↓
2. Cliente faz requisições com Access Token (cookie httpOnly)

3. Se Access Token expirar (após 15 min)
   ↓
   Cliente recebe erro 401 com código TOKEN_EXPIRED
   ↓
   Client chama /api/auth/refresh (enviando Refresh Token do cookie)
   ↓
   Backend valida refresh token e gera novo access token
   ↓
   Cliente retenta a requisição original com novo access token

4. Se Refresh Token expirar (após 7 dias)
   ↓
   Usuário é redirecionado para login
```

### Arquivos Principais:

#### Backend (`src/services/auth.service.js`):
```javascript
// Novo método refreshAccessToken()
async function refreshAccessToken(refreshToken) {
  // Valida refresh token
  // Verifica se está revogado
  // Gera novo access token
}
```

#### Frontend (`public/js/services/api.service.js`):
```javascript
// Novo método tryRefreshToken()
async function tryRefreshToken() {
  // Chama /api/auth/refresh
  // Retorna true se conseguir renovar
  // Usado quando access token expira
}

// Na apiCall(), quando recebe 401 TOKEN_EXPIRED:
if (errorData.code === 'TOKEN_EXPIRED' && !skipRefresh) {
  const refreshed = await tryRefreshToken();
  if (refreshed) {
    return apiCall(endpoint, { ...options, skipRefresh: true });
  }
}
```

---

## 2. 🍪 HttpOnly Cookies (Armazenamento Seguro)

### O que é?
Cookies que são **INACESSÍVEIS via JavaScript** (proteção contra XSS).

### Benefícios:
✅ Protege contra ataques XSS (roubo de tokens)
✅ Enviados automaticamente pelo navegador
✅ Requeridos para CORS com credenciais
✅ Padrão de segurança recomendado

### Configuração no Backend:

```javascript
res.cookie('accessToken', token, {
  httpOnly: true,           // ❌ JavaScript NÃO pode acessar
  secure: isProduction,     // HTTPS em produção
  sameSite: 'strict',       // Proteção contra CSRF
  maxAge: 15 * 60 * 1000   // 15 minutos
});
```

### Como Funciona:

**Antes** (vulnerável):
```javascript
// ❌ RUIM: Token em localStorage, acessível via XSS
localStorage.setItem('token', response.token);
// Um script malicioso poderia fazer:
const token = localStorage.getItem('token'); // ❌ Consegue acessar!
```

**Depois** (seguro):
```javascript
// ✅ BOM: Token em cookie httpOnly
res.cookie('accessToken', token, { httpOnly: true });
// Um script malicioso NÃO consegue acessar:
const token = document.cookie; // ❌ Não encontra 'accessToken'
// Mas é enviado automaticamente em requisições!
```

### Configuração no Frontend:

```javascript
// No fetch, incluir credentials para enviar cookies
const response = await fetch(url, {
  method: 'GET',
  credentials: 'include'  // ✅ Enviar cookies automaticamente
});
```

### CORS com Cookies:

```javascript
// Backend (app.ts)
app.use(cors({
  origin: corsOrigins,
  credentials: true,        // ✅ Permitir credenciais (cookies)
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 3. 🚫 Revogação de Tokens (Logout Efetivo)

### O que é?
Uma "blacklist" de tokens que foram explicitamente revogados (logout).

### Por que é necessário?
- ❌ **Sem revogação**: Mesmo após logout, o refresh token ainda é válido por 7 dias
- ✅ **Com revogação**: Logout invalida imediatamente ambos os tokens

### Implementação:

#### Arquivo: `src/services/tokenRevocation.service.js`

```javascript
// Adiciona token à blacklist
revokeToken(token, expiresAt)

// Verifica se token foi revogado
isTokenRevoked(token)  // true/false

// Limpa tokens expirados (chamado periodicamente)
cleanExpiredTokens()

// Inicia cleanup automático
startCleanupInterval(6)  // 6 horas
```

#### Como Funciona:

```
1. Usuário clica em Logout
   ↓
2. Frontend chama POST /api/auth/logout
   ↓
3. Backend:
   - Lê accessToken e refreshToken dos cookies
   - Adiciona ambos à blacklist em `blacklist.json`
   - Limpa os cookies
   ↓
4. Requisições futuras com esses tokens são rejeitadas:
   - Middleware auth.js verifica se token está na blacklist
   - Se sim: retorna erro 401 "Token foi revogado"
```

#### Armazenamento:

```json
// blacklist.json
[
  {
    "token": "eyJhbGc...",
    "revokedAt": "2026-06-23T20:45:30.123Z",
    "expiresAt": 1719165930  // timestamp quando expira
  }
]
```

#### Cleanup Automático:

- Executado a cada 6 horas
- Remove tokens já expirados da blacklist
- Mantém arquivo compacto
- Inicia automaticamente quando servidor inicia

---

## 4. ⏱️ Rate Limiting

### O que é?
Limite de requisições por IP em um período de tempo para evitar brute force.

### Configuração:

#### Endpoints de Autenticação:
- **Max**: 5 requisições
- **Período**: 15 minutos
- **Aplica a**: `/api/auth/login`, `/api/auth/register`

#### Refresh Token:
- **Max**: 10 requisições
- **Período**: 15 minutos
- **Aplica a**: `/api/auth/refresh`
- **Mais permissivo**: Chamado automaticamente pelo cliente

#### Geral (todos os endpoints /api):
- **Max**: 100 requisições
- **Período**: 15 minutos

### Desabilitado em Desenvolvimento:

```javascript
skip: (req) => {
  return process.env.NODE_ENV !== 'production';
}
```

### Como Funciona:

```
1º tentativa: ✅ Sucesso
2º tentativa: ✅ Sucesso
3º tentativa: ✅ Sucesso
4º tentativa: ✅ Sucesso
5º tentativa: ✅ Sucesso
6º tentativa: ❌ "Muitas tentativas. Tente novamente em 15 minutos."
```

---

## 5. 🔒 Middleware de Autenticação Melhorado

### Arquivo: `src/middlewares/auth.js`

#### Melhorias:

1. **Lê tokens do cookie** (não apenas header):
```javascript
let token = req.cookies?.accessToken;
if (!token) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
}
```

2. **Verifica se token está revogado**:
```javascript
if (tokenRevocationService.isTokenRevoked(token)) {
  return res.status(401).json({
    status: 'error',
    message: 'Token foi revogado. Faça login novamente.'
  });
}
```

3. **Valida tipo de token** (access vs refresh):
```javascript
if (decoded.type && decoded.type !== 'access') {
  return res.status(401).json({
    status: 'error',
    message: 'Token inválido: tipo de token incorreto'
  });
}
```

4. **Retorna código de erro específico**:
```javascript
if (error.name === 'TokenExpiredError') {
  return res.status(401).json({
    status: 'error',
    message: 'Token expirado. Use /api/auth/refresh para renovar.',
    code: 'TOKEN_EXPIRED'  // ✅ Cliente sabe que pode renovar
  });
}
```

---

## 6. 🔄 Fluxo Completo de Autenticação

### Login:

```
POST /api/auth/login
├─ body: { email, password }
├─ rate limit: 5 tentativas/15min
└─ resposta:
   {
     "status": "success",
     "user": { id, name, email, role },
     "cookies": {
       "accessToken": "...",  // httpOnly, 15m
       "refreshToken": "..."  // httpOnly, 7d
     }
   }
```

### Requisição Autenticada:

```
GET /api/devices
├─ header: Authorization: Bearer <accessToken> OU
├─ cookies: accessToken (enviado automaticamente)
├─ middleware auth:
│  ├─ lê token do cookie
│  ├─ verifica se está revogado
│  ├─ valida assinatura JWT
│  └─ extrai userId, role
└─ sucesso ✅
```

### Renovação de Token:

```
POST /api/auth/refresh
├─ cookies: refreshToken (enviado automaticamente)
├─ rate limit: 10 tentativas/15min
├─ backend:
│  ├─ valida refresh token
│  ├─ verifica se está revogado
│  ├─ gera novo access token
│  ├─ define novo cookie accessToken
│  └─ resposta com user atualizado
└─ frontend retenta requisição original
```

### Logout:

```
POST /api/auth/logout
├─ header: Authorization: Bearer <accessToken> OU cookies
├─ backend:
│  ├─ lê accessToken e refreshToken dos cookies
│  ├─ adiciona ambos à blacklist
│  ├─ limpa os cookies
│  └─ resposta de sucesso
└─ frontend:
   ├─ limpa localStorage
   └─ redireciona para login
```

---

## 7. 📊 Variáveis de Ambiente Necessárias

### `.env` (Backend):

```bash
# Autenticação JWT
JWT_SECRET=sua_chave_secreta_super_segura_com_32_caracteres_minimo

# Opcional: usar secret diferente para refresh
JWT_REFRESH_SECRET=outro_secret_para_refresh_tokens

# Expirações (jwt.sign aceita: "15m", "7d", "24h", etc)
JWT_EXPIRATION=15m

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8000,https://seu-dominio.com

# Ambiente
NODE_ENV=development  # ou 'production'
```

### Validação na Inicialização:

```
✅ Servidor iniciado
📡 URL: http://localhost:3000
📝 Ambiente: development

[TokenRevocation] Cleanup automático iniciado (a cada 6h)
```

---

## 8. ⚠️ Problemas Comuns e Soluções

### Problema: "credentials mode is 'include', but CORS header 'Access-Control-Allow-Credentials' missing"

**Solução**: No backend, `app.use(cors({ credentials: true }))`

### Problema: Cookies não são enviados em requisições

**Solução**: 
- Frontend: `credentials: 'include'` no fetch
- Backend: `credentials: true` no CORS

### Problema: Token expirado mas cliente continua tentando

**Solução**: Implementado!
```javascript
if (errorData.code === 'TOKEN_EXPIRED') {
  await tryRefreshToken();  // Tenta renovar
  return apiCall(endpoint, ...);  // Retenta original
}
```

### Problema: Rate limit bloqueia usuário legítimo

**Solução**: Está desabilitado em desenvolvimento. Em produção:
- Aumentar maxAge conforme necessário
- Implementar whitelist de IPs conhecidos
- Usar Redis para rate limit distribuído

---

## 9. 🧪 Testando a Autenticação

### 1️⃣ Login Simples:

```powershell
# Terminal 1: Iniciar backend
cd backend
npm install  # Se não tiver node_modules
npm run dev
```

```powershell
# Terminal 2: Testar login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","password":"senha123"}' \
  -c cookies.txt  # Salva cookies em arquivo

# Próximas requisições com os cookies:
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### 2️⃣ Testar Refresh Token:

```powershell
# Renovar access token
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt

# Verifica novo accessToken foi definido
```

### 3️⃣ Testar Logout:

```powershell
# Logout revoga tokens
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt

# Tentar usar token revogado (deve falhar)
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
# Retorna: 401 "Token foi revogado"
```

### 4️⃣ Testar Rate Limiting:

```powershell
# Fazer 6 requisições de login seguidas
for ($i = 0; $i -lt 6; $i++) {
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"joao@test.com","password":"wrong"}' \
    -w "\n"
}

# 6ª tentativa retorna: 429 "Muitas tentativas"
```

---

## 10. 📚 Referências e Recursos

### JWT (JSON Web Tokens)
- [JWT.io](https://jwt.io)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### OWASP Security Guidelines
- [OWASP: Broken Authentication](https://owasp.org/www-project-top-ten/2021/)
- [OWASP: Session Management](https://owasp.org/www-community/attacks/csrf)

### Express.js Security
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js](https://helmetjs.github.io/)

---

## 11. 🚀 Próximas Etapas (Recomendadas)

### Melhorias Futuras:

1. **Helmet.js** - Headers de segurança:
```bash
npm install helmet
```

2. **Database para Revogação** - Usar Redis:
```bash
npm install redis
```

3. **2FA (Two-Factor Authentication)**:
- Google Authenticator
- SMS OTP

4. **OAuth2/SSO**:
- Login com Google/GitHub
- Integração com provedores

5. **Audit Logging**:
- Registrar todas as tentativas de login
- Detectar atividades suspeitas

6. **HTTPS em Produção**:
```javascript
secure: process.env.NODE_ENV === 'production'
```

---

## 📝 Checklist de Segurança

- ✅ Tokens armazenados em httpOnly cookies
- ✅ Refresh tokens implementados (15m + 7d)
- ✅ Revogação de tokens (logout efetivo)
- ✅ Rate limiting para endpoints sensíveis
- ✅ Middleware de auth verifica blacklist
- ✅ Proteção contra CSRF (SameSite: strict)
- ✅ Proteção contra XSS (httpOnly: true)
- ✅ Validação de entrada nos endpoints
- ✅ Erros genéricos (não revelar detalhes)
- ✅ CORS configurado corretamente
- ✅ Cleanup automático de tokens expirados
- ⏳ Helmet.js (TODO)
- ⏳ HTTPS em produção (TODO)
- ⏳ Audit logging (TODO)
- ⏳ 2FA/MFA (TODO)

---

**Última atualização**: 23 de Junho de 2026
**Status**: ✅ Implementação Completa
**Versão**: 1.0.0
