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
 * Normaliza a resposta de erro da API
 */
function normalizeErrorPayload(response, fallbackMessage) {
  if (!response) {
    return fallbackMessage;
  }

  if (typeof response === 'string') {
    return response;
  }

  if (response.message) {
    return response.message;
  }

  if (response.error?.message) {
    return response.error.message;
  }

  if (response.errors && typeof response.errors === 'object') {
    const firstError = Object.values(response.errors)[0];
    if (typeof firstError === 'string') {
      return firstError;
    }
  }

  return fallbackMessage;
}

function showErrorNotification(message, type = 'error') {
  if (typeof UIService !== 'undefined' && UIService?.showErrorNotification) {
    return UIService.showErrorNotification(message, type);
  }

  if (typeof window !== 'undefined' && window.showErrorNotification) {
    return window.showErrorNotification(message, type);
  }

  return null;
}

function redirectToLogin(reason = 'Sessão expirada') {
  if (typeof UIService !== 'undefined' && UIService?.redirectToLogin) {
    return UIService.redirectToLogin(reason);
  }

  if (typeof window !== 'undefined' && window.redirectToLogin) {
    return window.redirectToLogin(reason);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
  }

  return null;
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

    let errorPayload = null;
    try {
      errorPayload = await response.clone().json();
    } catch (e) {
      errorPayload = null;
    }

    // 401 - Não Autorizado
    if (response.status === 401) {
      if (errorPayload?.code === 'TOKEN_EXPIRED' && !skipRefresh) {
        console.log('[Token Expired] Tentando renovar...');
        const refreshed = await tryRefreshToken();

        if (refreshed) {
          console.log('[Retry After Refresh] Reenviando requisição');
          return apiCall(endpoint, { ...options, skipRefresh: true });
        }
      }

      const message = normalizeErrorPayload(errorPayload, 'Seu token de autenticação expirou');
      console.warn('[API 401]', endpoint, message);
      redirectToLogin(message);
      throw new Error(message);
    }

    // 403 - Proibido
    if (response.status === 403) {
      const message = normalizeErrorPayload(errorPayload, 'Acesso negado. Você não tem permissão para acessar este recurso.');
      console.warn('[API 403]', endpoint, message);
      showErrorNotification(message, 'error');
      throw new Error(message);
    }

    // 404 - Não Encontrado
    if (response.status === 404) {
      const message = normalizeErrorPayload(errorPayload, 'Recurso não encontrado');
      console.warn('[API 404]', endpoint, message);
      throw new Error(message);
    }

    // 400/422 - Erro de validação
    if (response.status === 400 || response.status === 422) {
      const message = normalizeErrorPayload(errorPayload, 'Dados inválidos. Verifique as informações e tente novamente.');
      showErrorNotification(message, 'error');
      throw new Error(message);
    }

    // 500+ - Erro do Servidor
    if (response.status >= 500) {
      console.error('[API 5xx]', endpoint, response.status);
      showErrorNotification('Erro no servidor. Tente novamente mais tarde.', 'error');
      throw new Error(`Erro no servidor: ${response.status}`);
    }

    // Outros erros HTTP
    if (!response.ok) {
      const message = normalizeErrorPayload(errorPayload, `HTTP ${response.status}: ${response.statusText}`);
      console.error('[API Error]', endpoint, response.status, message);
      throw new Error(message);
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
      error.message.includes('Acesso proibido') ||
      error.message.includes('token') ||
      error.message.includes('autenticação');

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
