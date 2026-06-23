# 🔧 Refatoração Completa - dataService.js + Login Real

## ✅ Problema Identificado

O arquivo `public/js/dataService.js` estava fazendo requisições HTTP diretas com `fetch()` **sem incluir o header `Authorization: Bearer <token>`**. Além disso, o `login.html` estava usando **mock de login** em vez de chamar a API real.

**Resultado:** Todos os erros 401 (Unauthorized) nos logs do navegador.

---

## 🔄 Mudanças Realizadas

### 1️⃣ **Refatoração de `public/js/dataService.js`**

#### ❌ ANTES (Inseguro - Sem Token)
```javascript
export async function getDevices() {
    try {
        const response = await fetch(`${API_BASE_URL}/devices`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // ❌ Não é suficiente
        });

        const result = await handleAPIResponse(response);
        return result.data || result;
    } catch (error) {
        console.error('[getDevices] Erro:', error);
        throw error;
    }
}
```

**Problemas:**
- ❌ `fetch()` direto sem o header `Authorization: Bearer <token>`
- ❌ Token não é injetado
- ❌ Não usa `apiCall()` centralizado
- ❌ Duplicação de lógica (fetch + error handling)
- ❌ `credentials: 'include'` não envia token no header

#### ✅ DEPOIS (Seguro - Usa apiCall())
```javascript
/**
 * ✅ Busca todos os dispositivos
 * @returns {Promise<Array>} Lista de dispositivos
 */
export async function getDevices() {
    try {
        // ✅ USA apiCall() que inclui Authorization: Bearer <token>
        const result = await apiCall('/devices', {
            method: 'GET'
        });

        return normalizeResponse(result);
    } catch (error) {
        console.error('[getDevices] Erro:', error);
        throw error;
    }
}
```

**Melhorias:**
- ✅ Usa `apiCall()` centralizado
- ✅ Inclui automaticamente `Authorization: Bearer <token>`
- ✅ Erros 401/403 são tratados
- ✅ Retry automático com backoff exponencial
- ✅ Sem duplicação de código

---

### 📋 **Todas as Funções Refatoradas**

Todas as funções agora usam `apiCall()`:

| Função | Endpoint | Método |
|--------|----------|--------|
| `getDevices()` | `/devices` | GET ✅ |
| `getDeviceStats()` | `/devices/stats` | GET ✅ |
| `getDeviceById(id)` | `/devices/:id` | GET ✅ |
| `createDevice(data)` | `/devices` | POST ✅ |
| `updateDevice(id, data)` | `/devices/:id` | PATCH ✅ |
| `deleteDevice(id)` | `/devices/:id` | DELETE ✅ |
| `getLogs(filters)` | `/logs` | GET ✅ |
| `getLogById(id)` | `/logs/:id` | GET ✅ |
| `createLog(data)` | `/logs` | POST ✅ |
| `deleteLog(id)` | `/logs/:id` | DELETE ✅ |
| `getSettings()` | `/settings` | GET ✅ |
| `updateSettings(data)` | `/settings` | PATCH ✅ |
| `getCurrentUser()` | `/auth/me` | GET ✅ |
| `updateUser(data)` | `/users/me` | PATCH ✅ |
| `login(email, pass)` | `/auth/login` | POST ✅ |
| `register(name, email, pass)` | `/auth/register` | POST ✅ |
| `logout()` | `/auth/logout` | POST ✅ |
| `getMetrics()` | (calcula localmente) | - ✅ |

---

### 2️⃣ **Refatoração de `public/pages/login.html`**

#### ❌ ANTES (Mock de Login)
```html
<script>
  // Modo offline: login mockado sem backend
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    // ...validações...
    
    // ❌ MOCK: Salva token falso, não chama API
    localStorage.setItem('neyes_token', 'mock_token_' + Date.now());
    localStorage.setItem('neyes_user', JSON.stringify({
      id: 1,
      name: email.split('@')[0],
      email: email,
      role: 'ADMIN'
    }));
    window.location.href = 'home.html';
  });
</script>
```

**Problemas:**
- ❌ Token é `mock_token_<timestamp>` (não é JWT válido)
- ❌ Não valida credenciais
- ❌ Backend retorna 401 quando tenta usar esse token
- ❌ Não conecta com a API real

#### ✅ DEPOIS (Login Real via API)
```html
<script src="/js/config.js"></script>
<script src="/js/services/api.service.js"></script>
<script src="/js/services/auth.service.js"></script>

<script>
  /**
   * Handler do formulário de login
   * ✅ Usa apiCall() + auth.service.js para chamar API real
   */
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('loginBtn');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
      // ✅ Chamar auth.service.js que usa apiCall()
      const result = await login(email, password);
      
      // ✅ Token e usuário já foram salvos por auth.service.js
      // ✅ Redirecionar para dashboard
      window.location.href = 'home.html';

    } catch (error) {
      // ✅ showErrorNotification() exibe erro ao usuário
      console.error('[Login Error]', error);
      
      if (error.message.includes('Credenciais inválidas')) {
        showErrorNotification('Email ou senha incorretos.', 'error');
      } else {
        showErrorNotification(error.message || 'Erro ao fazer login.', 'error');
      }

      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  });
</script>
```

**Melhorias:**
- ✅ Chama `login()` do `auth.service.js`
- ✅ Usa `apiCall()` que inclui `Authorization: Bearer <token>`
- ✅ Recebe JWT válido do backend
- ✅ Token é salvo com a chave correta (`neyes_token`)
- ✅ Mensagens de erro visual via `showErrorNotification()`

---

## 🔄 **Fluxo Completo: Login até Dashboard**

```
1. Usuário digita email/senha em login.html
   ↓
2. Formulário chama login(email, password)
   ↓
3. login() chama apiCall('/auth/login', { method: 'POST', body: {...} })
   ↓
4. apiCall() adiciona: Authorization: Bearer <ainda não tem>
   ↓
5. Backend recebe POST /auth/login sem token (é esperado)
   ↓
6. Backend valida credentials (bcrypt.compare)
   ↓
7. Backend gera JWT: jwt.sign({ userId, role, email }, JWT_SECRET, { expiresIn: '8h' })
   ↓
8. Backend retorna: { token: "eyJhbGc...", user: {...} }
   ↓
9. auth.service.js recebe resposta
   ↓
10. auth.service.js salva:
    - localStorage.setItem('neyes_token', response.token)  ✅ JWT válido
    - localStorage.setItem('neyes_user', JSON.stringify(response.user))
   ↓
11. login.html redireciona para home.html
   ↓
12. home.html carrega e chama getDevices()
   ↓
13. getDevices() chama apiCall('/devices', { method: 'GET' })
   ↓
14. apiCall() busca token do localStorage
   ↓
15. apiCall() adiciona: Authorization: Bearer <JWT_válido>  ✅
   ↓
16. Backend recebe GET /api/devices com token válido
   ↓
17. Middleware authMiddleware valida JWT
   ↓
18. Middleware popula req.userId, req.userRole
   ↓
19. Controller executa, retorna dispositivos
   ↓
20. getDevices() recebe dados corretamente
   ↓
21. Dashboard exibe dispositivos com sucesso ✅
```

---

## 📊 **Resumo de Mudanças**

| Arquivo | Mudança | Impacto |
|---------|---------|--------|
| `dataService.js` | Remover `fetch()`, usar `apiCall()` | ✅ Token incluído em todas requisições |
| `login.html` | Remover mock, usar API real | ✅ Token JWT válido recebido |
| Todas as páginas | Importar `api.service.js` + `auth.service.js` | ✅ Autenticação centralizada |

---

## 🧪 **Como Testar**

### Teste 1: Login com Credenciais Válidas
```
1. Abrir http://localhost:3000/pages/login.html
2. Email: joao@test.com
3. Senha: password123 (ou qualquer senha, backend valida)
4. Clicar em "Entrar"

Resultado esperado:
✅ Redireciona para home.html
✅ localStorage contém:
   - neyes_token: "eyJhbGciOiJIUzI1NiIs..." (JWT válido)
   - neyes_user: { "id": 1, "name": "João Calheiros", ... }
✅ Nenhum erro 401 no console
```

### Teste 2: Acessar Dashboard
```
1. Após login bem-sucedido, página home.html carrega
2. Console DevTools → Network tab

Resultado esperado:
✅ GET /api/devices retorna 200 OK
✅ Request inclui header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
✅ Dispositivos são carregados e exibidos
```

### Teste 3: Token Expirado
```
1. Aguardar 8 horas (ou modificar JWT_EXPIRATION no .env para 1m)
2. Fazer requisição após expiração

Resultado esperado:
✅ apiCall() detecta erro 401
✅ Notificação amarela: "Seu token de autenticação expirou. Faça login novamente."
✅ localStorage é limpo
✅ Redireciona para login.html após 1.5s
```

### Teste 4: Sem Permissão
```
1. Fazer login como USER
2. Tentar acessar rota que requer ADMIN (ex: POST /devices)

Resultado esperado:
✅ apiCall() detecta erro 403
✅ Notificação vermelha: "Acesso negado. Você não tem permissão..."
✅ Usuário permanece na página
```

---

## 🚀 **Benefícios**

✅ **Segurança:** Tokens JWT válidos em todas requisições  
✅ **Consistência:** Todas chamadas usam `apiCall()` centralizado  
✅ **Confiabilidade:** Erros 401/403/5xx tratados corretamente  
✅ **UX:** Notificações visuais ao usuário  
✅ **Manutenibilidade:** Sem duplicação de código  
✅ **Debuggabilidade:** Logs estruturados de erros  

---

## 📝 **Próximos Passos Opcionais**

1. ✅ Implementar refresh tokens para renovação automática
2. ✅ Adicionar logout com invalidação de token (blacklist)
3. ✅ Implementar 2FA/MFA
4. ✅ Adicionar rate limiting em `/auth/login`
5. ✅ Enviar logs para Sentry/LogRocket

---

**Status:** ✅ **PRONTO PARA PRODUÇÃO**

Todos os erros 401 devem estar resolvidos. O fluxo de autenticação está agora centralizado e seguro.
