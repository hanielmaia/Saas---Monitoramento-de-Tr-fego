/**
 * API Service - N Eyes
 * Camada de requisições HTTP centralizada com suporte a cookies httpOnly
 * Gerencia autenticação via cookies, erros, retry automático e refresh de tokens
 */

// Garantir que config está disponível
if (typeof CONFIG === 'undefined') {
  console.error('CONFIG não carregado. Certifique-se que config.js é carregado antes.');
}

// Flag para evitar multiple refresh token attempts
let isRefreshing = false;
let refreshPromise = null;

/**
 * Delay helper para retry com backoff exponencial
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Exibe notificação de erro ao usuário
 */
function showErrorNotification(message, type = 'error') {
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

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Redireciona para a página de login
 */
function redirectToLogin(reason = 'Sessão expirada') {
  localStorage.removeItem(CONFIG.STORAGE.USER_KEY);

  showErrorNotification(`${reason}. Faça login novamente.`, 'warning');

  setTimeout(() => {
    window.location.href = '/pages/login.html';
  }, 1500);
}

/**
 * Tenta renovar o access token usando o refresh token
 * Retorna true se conseguir renovar, false se falhar
 */
async function tryRefreshToken() {
  // Se já está tentando renovar, aguardar a promise existente
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${CONFIG.API.BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include' // Enviar cookies (refresh token)
      });

      if (response.ok) {
        console.log('[Token Refreshed] Access token renovado com sucesso');
        return true;
      } else {
        console.error('[Refresh Failed] Status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('[Refresh Error]', error.message);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Faz requisição HTTP genérica com suporte a cookies e refresh tokens
 */
async function apiCall(endpoint, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    retries = 0,
    skipRefresh = false
  } = options;

  const url = `${CONFIG.API.BASE_URL}${endpoint}`;

  try {
    // Preparar headers (não incluir Authorization, é via cookie)
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    const fetchOptions = {
      method,
      headers: requestHeaders,
      timeout: CONFIG.API.TIMEOUT,
      credentials: 'include' // IMPORTANTE: incluir cookies automaticamente
    };

    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Executar requisição
    const response = await fetch(url, fetchOptions);

    // ===== TRATAMENTO DE STATUS DE ERRO =====

    // 401 - Não Autorizado
    if (response.status === 401) {
      try {
        const errorData = await response.json();
        
        // Se o token expirou e ainda não tentamos refresh
        if (errorData.code === 'TOKEN_EXPIRED' && !skipRefresh) {
          console.log('[Token Expired] Tentando renovar...');
          const refreshed = await tryRefreshToken();
          
          if (refreshed) {
            // Retry a requisição com o novo token
            console.log('[Retry After Refresh] Reenviando requisição');
            return apiCall(endpoint, { ...options, skipRefresh: true });
          }
        }
      } catch (e) {
        // Ignorar erro de parse, será tratado abaixo
      }
      
      console.warn('[API 401]', endpoint, 'Token inválido ou expirado');
      redirectToLogin('Seu token de autenticação expirou');
      throw new Error('Não autorizado: token inválido ou expirado');
    }

    // 403 - Proibido
    if (response.status === 403) {
      console.warn('[API 403]', endpoint, 'Acesso proibido');
      showErrorNotification('Acesso negado. Você não tem permissão para acessar este recurso.', 'error');
      throw new Error('Acesso proibido: você não tem permissão');
    }

    // 404 - Não Encontrado
    if (response.status === 404) {
      console.warn('[API 404]', endpoint, 'Recurso não encontrado');
      throw new Error('Recurso não encontrado');
    }

    // 500+ - Erro do Servidor
    if (response.status >= 500) {
      console.error('[API 5xx]', endpoint, response.status);
      showErrorNotification('Erro no servidor. Tente novamente mais tarde.', 'error');
      throw new Error(`Erro no servidor: ${response.status}`);
    }

    // Outros erros HTTP
    if (!response.ok) {
      console.error('[API Error]', endpoint, response.status, response.statusText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // ===== PROCESSAR RESPOSTA BEM-SUCEDIDA =====

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }

    return { success: response.ok };

  } catch (error) {
    // ===== RETRY LOGIC =====

    const isAuthError = error.message.includes('Não autorizado') ||
      error.message.includes('Acesso proibido');

    if (!isAuthError && retries < CONFIG.API.RETRY_ATTEMPTS) {
      const delay_time = 500 * Math.pow(2, retries);
      console.warn(`[Retry ${retries + 1}/${CONFIG.API.RETRY_ATTEMPTS}] ${endpoint}`);
      await delay(delay_time);
      return apiCall(endpoint, { ...options, retries: retries + 1 });
    }

    console.error(`[API Error Final] ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Busca todos os dispositivos
 * @returns {Promise<Array>}
 */
async function getDevices() {
  return apiCall('/devices');
}

/**
 * Busca um dispositivo específico
 * @param {number} id - ID do dispositivo
 * @returns {Promise<Object>}
 */
async function getDevice(id) {
  return apiCall(`/devices/${id}`);
}

/**
 * Atualiza um dispositivo
 * @param {number} id - ID do dispositivo
 * @param {Object} data - Dados a atualizar
 * @returns {Promise<Object>}
 */
async function updateDevice(id, data) {
  return apiCall(`/devices/${id}`, {
    method: 'PATCH',
    body: data
  });
}

/**
 * Deleta um dispositivo
 * @param {number} id - ID do dispositivo
 * @returns {Promise<boolean>}
 */
async function deleteDevice(id) {
  return apiCall(`/devices/${id}`, { method: 'DELETE' });
}

/**
 * Busca logs com filtros
 * @param {Object} filters - Filtros opcionais
 * @returns {Promise<Array>}
 */
async function getLogs(filters = {}) {
  let query = '';

  if (Object.keys(filters).length > 0) {
    const params = new URLSearchParams(filters);
    query = '?' + params.toString();
  }

  return apiCall(`/logs${query}`);
}

/**
 * Busca configurações
 * @returns {Promise<Object>}
 */
async function getSettings() {
  return apiCall('/settings');
}

/**
 * Atualiza configurações
 * @param {Object} data - Dados de configuração
 * @returns {Promise<Object>}
 */
async function updateSettings(data) {
  return apiCall('/settings', {
    method: 'PATCH',
    body: data
  });
}

// ✅ Exportar para global scope (compatível com HTML scripts)
if (typeof window !== 'undefined') {
  Object.assign(window, {
    apiCall,
    getDevices,
    getDevice,
    updateDevice,
    deleteDevice,
    getLogs,
    getSettings,
    updateSettings,
    showErrorNotification,
    redirectToLogin
  });
}
