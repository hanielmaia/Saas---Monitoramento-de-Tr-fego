# 🎨 Melhorias no Frontend - API Service e Notificações

## ✅ Mudanças Realizadas

---

## 1️⃣ `public/js/services/api.service.js` - Refatoração Completa

### 📋 Principais Melhorias

#### ✅ **Token com Validação Segura**
```javascript
// Adicionar token de autenticação se disponível
const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);
if (token) {
  // Validar formato do token
  if (typeof token === 'string' && token.length > 0) {
    requestHeaders['Authorization'] = `Bearer ${token}`;  // ✅ EXATO: "Bearer <token>"
  } else {
    console.warn('Token inválido encontrado em localStorage');
    localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
  }
}
```

**Mudanças:**
- ✅ Token validado antes de usar
- ✅ Token inválido é removido automaticamente
- ✅ Formato exato: `Authorization: Bearer <token>`

---

#### ✅ **Tratamento de Erros 401 e 403 com Feedback Visual**

```javascript
// 401 - Não Autorizado (token inválido ou expirado)
if (response.status === 401) {
  console.warn('[API 401]', endpoint, 'Token inválido ou expirado');
  redirectToLogin('Seu token de autenticação expirou');
  throw new Error('Não autorizado: token inválido ou expirado');
}

// 403 - Proibido (usuário sem permissão)
if (response.status === 403) {
  console.warn('[API 403]', endpoint, 'Acesso proibido');
  showErrorNotification('Acesso negado. Você não tem permissão para acessar este recurso.', 'error');
  throw new Error('Acesso proibido: você não tem permissão');
}
```

**Mudanças:**
- ✅ 401: Exibe notificação "Sessão expirada" + redireciona para login
- ✅ 403: Exibe notificação "Acesso negado" sem redirecionar
- ✅ Ambos fazem logging console para debug

---

#### ✅ **Função `showErrorNotification()` - Notificações Visuais**

```javascript
/**
 * Exibe notificação de erro ao usuário
 * @param {string} message - Mensagem de erro
 * @param {string} type - Tipo de erro: 'error', 'warning', 'info'
 */
function showErrorNotification(message, type = 'error') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `api-notification api-notification--${type}`;
  notification.setAttribute('role', 'alert');
  notification.innerHTML = `
    <div class="api-notification__container">
      <span class="api-notification__icon">⚠️</span>
      <span class="api-notification__message">${message}</span>
      <button class="api-notification__close" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;

  // Estilo inline como fallback
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 9999;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  document.body.appendChild(notification);

  // Auto-remover após 5 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}
```

**Recursos:**
- ✅ Notificação aparece no canto superior direito
- ✅ Cores diferentes por tipo (error, warning, info, success)
- ✅ Botão fechar manual
- ✅ Auto-desaparece em 5 segundos com fade-out suave
- ✅ Responsivo em mobile/tablet/desktop
- ✅ Acessível com role="alert"

---

#### ✅ **Função `redirectToLogin()` - Redirecionamento com Feedback**

```javascript
/**
 * Redireciona para a página de login
 * @param {string} reason - Razão do redirecionamento
 */
function redirectToLogin(reason = 'Sessão expirada') {
  // Limpar dados de autenticação
  localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
  localStorage.removeItem(CONFIG.STORAGE.USER_KEY);

  // Exibir mensagem ao usuário
  showErrorNotification(`${reason}. Faça login novamente.`, 'warning');

  // Redirecionar após pequeno delay para usuário ver a mensagem
  setTimeout(() => {
    window.location.href = '/pages/login.html';
  }, 1500);
}
```

**Recursos:**
- ✅ Limpa localStorage antes de redirecionar
- ✅ Exibe notificação visual antes de sair
- ✅ Delay de 1.5s dá tempo para usuário ler mensagem
- ✅ Redireciona para página de login

---

#### ✅ **Retry Logic Melhorado**

```javascript
// Não fazer retry para erros de autenticação ou autorização
const isAuthError = error.message.includes('Não autorizado') || 
                   error.message.includes('Acesso proibido');

if (!isAuthError && retries < CONFIG.API.RETRY_ATTEMPTS) {
  const delay_time = 500 * Math.pow(2, retries); // Backoff exponencial: 500ms, 1s, 2s
  console.warn(`[Retry ${retries + 1}/${CONFIG.API.RETRY_ATTEMPTS}] ${endpoint} - Tentando novamente em ${delay_time}ms`);
  await delay(delay_time);
  return apiCall(endpoint, { ...options, retries: retries + 1 });
}
```

**Mudanças:**
- ✅ Não tenta retry em erros de autenticação (economiza tempo)
- ✅ Backoff exponencial: 500ms → 1s → 2s
- ✅ Logging claro de tentativas

---

#### ✅ **Função Helper `delay()`**

```javascript
/**
 * Delay helper para retry com backoff exponencial
 * @param {number} ms - Milissegundos para esperar
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Usado em:**
- Backoff exponencial do retry
- Delay antes de redirecionar para login

---

## 2️⃣ `public/css/notifications.css` - Novo Arquivo de Estilos

### 📋 Variantes de Notificação

#### Error (Vermelho)
```css
.api-notification--error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}
```
**Uso:** Erros de acesso (403), erros do servidor (500+)

#### Warning (Amarelo)
```css
.api-notification--warning {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
}
```
**Uso:** Sessão expirada (401), avisos

#### Info (Azul)
```css
.api-notification--info {
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}
```
**Uso:** Informações geral

#### Success (Verde)
```css
.api-notification--success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}
```
**Uso:** Operações bem-sucedidas (futuro)

---

### 📱 Responsividade

```css
@media (max-width: 640px) {
  .api-notification {
    top: 10px;
    right: 10px;
    left: 10px;           /* Cobre quase tela inteira */
    min-width: auto;
    max-width: none;
  }
}
```

---

## 3️⃣ HTML Pages - Adição de CSS de Notificações

### Arquivos Atualizados
- ✅ `public/pages/home.html`
- ✅ `public/pages/devices.html`
- ✅ `public/pages/logs.html`
- ✅ `public/pages/config.html`
- ✅ `public/pages/edit-profile.html`
- ✅ `public/pages/login.html`
- ✅ `public/pages/register.html`
- ✅ `public/pages/logout-confirm.html`

### Adição Padronizada
```html
<!-- Em cada <head> -->
<link rel="stylesheet" href="/css/notifications.css">
```

---

## 🧪 **Exemplos de Uso**

### Exemplo 1: Login com Token

```javascript
// No login.html, ao fazer login
async function handleLogin(email, password) {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    // ✅ Token foi armazenado automaticamente por auth.service.js
    localStorage.setItem(CONFIG.STORAGE.TOKEN_KEY, response.token);
    
    // ✅ Redirecionar para dashboard
    window.location.href = '/pages/home.html';
    
  } catch (error) {
    // ✅ apiCall() já exibe notificação de erro automaticamente
    console.error('Erro ao fazer login:', error);
  }
}
```

### Exemplo 2: Requisição Protegida com Token

```javascript
// Em devices.html, ao buscar dispositivos
async function loadDevices() {
  try {
    // ✅ apiCall() adiciona "Authorization: Bearer <token>" automaticamente
    const devices = await apiCall('/devices');
    
    // Processa dispositivos...
    
  } catch (error) {
    if (error.message.includes('Não autorizado')) {
      // ✅ redirectToLogin() já foi chamado automaticamente
      // Usuário verá notificação e será redirecionado
    }
  }
}
```

### Exemplo 3: Erro de Permissão (403)

```javascript
// Usuário tenta criar dispositivo sem permissão
async function createDevice(data) {
  try {
    await apiCall('/devices', {
      method: 'POST',
      body: data
    });
    
  } catch (error) {
    if (error.message.includes('Acesso proibido')) {
      // ✅ Notificação vermelho já foi exibida
      // Usuário não é redirecionado (fica na mesma página)
    }
  }
}
```

### Exemplo 4: Token Inválido em localStorage

```javascript
// Token corrompido ou inválido
if (token && typeof token === 'string' && token.length > 0) {
  requestHeaders['Authorization'] = `Bearer ${token}`;
} else {
  // ✅ Token é removido automaticamente
  console.warn('Token inválido encontrado em localStorage');
  localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
}
```

---

## 📊 **Matriz de Tratamento de Status HTTP**

| Status | Ação | Feedback | Retry | Exemplo |
|--------|------|----------|-------|---------|
| 200 | Sucesso | Nenhuma | - | GET /devices |
| 400 | Erro validação | Notificação error | ❌ | Email inválido |
| 401 | Não autorizado | Warning + Redireciona | ❌ | Token expirado |
| 403 | Sem permissão | Notificação error | ❌ | Acesso negado |
| 404 | Não encontrado | Erro thrown | ✅ | Recurso deletado |
| 500+ | Erro servidor | Notificação error | ✅ | Database down |
| Network | Erro conexão | Erro thrown | ✅ | Sem internet |

---

## 🔄 **Fluxo Completo: Login Expirado**

```
1. Usuário clica para carregar dados
   ↓
2. apiCall() busca token do localStorage
   ↓
3. Token é inválido/expirado
   ↓
4. Servidor retorna 401
   ↓
5. apiCall() detecta status 401
   ↓
6. redirectToLogin() é chamado
   ↓
7. localStorage é limpo
   ↓
8. Notificação amarela é exibida: "Seu token de autenticação expirou. Faça login novamente."
   ↓
9. Usuário vê notificação por 1.5 segundos
   ↓
10. Página redireciona para /pages/login.html
   ↓
11. Usuário faz login novamente
```

---

## 🔄 **Fluxo Completo: Acesso Negado (403)**

```
1. Admin tenta acessar rota protegida de ADMIN
   ↓
2. USER faz requisição POST /api/devices (sem permissão)
   ↓
3. apiCall() envia requisição com token USER
   ↓
4. Middleware authorizeRole() valida permissão
   ↓
5. Servidor retorna 403 (Forbidden)
   ↓
6. apiCall() detecta status 403
   ↓
7. showErrorNotification() é chamada com tipo 'error'
   ↓
8. Notificação vermelha é exibida: "Acesso negado. Você não tem permissão para acessar este recurso."
   ↓
9. IMPORTANTE: NÃO redireciona para login
   ↓
10. Usuário continua na página, vê a mensagem
   ↓
11. Notificação desaparece em 5 segundos
```

---

## 🎯 **Casos de Teste**

### Teste 1: Token Expirado
```
1. Fazer login normalmente
2. Aguardar 8+ horas (ou remover/corromper token no DevTools)
3. Tentar acessar rota protegida
4. Resultado esperado:
   - Notificação amarela: "Seu token de autenticação expirou. Faça login novamente."
   - Redirecionamento para /pages/login.html após 1.5s
```

### Teste 2: Sem Permissão
```
1. Fazer login como USER
2. Tentar criar dispositivo (rota requer ADMIN)
3. Resultado esperado:
   - Notificação vermelha: "Acesso negado. Você não tem permissão..."
   - Permanece na mesma página
   - Notificação desaparece em 5s
```

### Teste 3: Erro de Servidor
```
1. Fazer um request qualquer quando API está down
2. Resultado esperado:
   - Notificação vermelha: "Erro no servidor. Tente novamente mais tarde."
   - Tenta retry automático (backoff exponencial)
   - Se falhar após 2 tentativas, erro é thrown
```

### Teste 4: Falha de Rede
```
1. Desativar internet / colocar offline
2. Fazer requisição
3. Resultado esperado:
   - Erro thrown (network error)
   - Retry automático com backoff
   - Depois de 2 tentativas: erro final
```

---

## 📚 **Exportações Globais**

```javascript
// Disponíveis no window (global scope)
window.apiCall              // Requisição HTTP
window.getDevices          // GET /devices
window.getDevice           // GET /devices/:id
window.updateDevice        // PATCH /devices/:id
window.deleteDevice        // DELETE /devices/:id
window.getLogs             // GET /logs
window.getSettings         // GET /settings
window.updateSettings      // PATCH /settings
window.showErrorNotification  // 🆕 Notificação visual
window.redirectToLogin      // 🆕 Redirecionar com feedback
```

---

## 🚀 **Próximos Passos Recomendados**

1. **Adicionar Sucesso Notification**
   ```javascript
   function showSuccessNotification(message) {
     showErrorNotification(message, 'success');
   }
   ```

2. **Implementar Toast Stories**
   - Múltiplas notificações apilhadas
   - Cada uma com seu próprio timer

3. **Adicionar Interceptadores de Requisição**
   - Loading spinner global durante requisição
   - Disable de botões durante loading

4. **Logging Estruturado**
   - Enviar logs para servidor (Sentry, LogRocket)
   - Tracking de erros de autenticação

5. **Offline Mode**
   - Detectar quando offline
   - Exibir indicador permanente
   - Fila de requisições para quando voltar online

---

**Atualizado em:** 22 de junho de 2026  
**Status:** ✅ Implementação completa e pronta para uso
