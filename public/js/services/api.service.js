/**
 * API Service - N Eyes
 * Camada de requisições HTTP centralizada
 */

// Garantir que config está disponível
if (typeof CONFIG === 'undefined') {
  console.error('CONFIG não carregado. Certifique-se que config.js é carregado antes.');
}

/**
 * Faz requisição HTTP genérica
 * @param {string} endpoint - Endpoint relativo (ex: /devices)
 * @param {Object} options - Opções da requisição
 * @returns {Promise<Object>} Resposta da API
 */
async function apiCall(endpoint, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    retries = 0
  } = options;

  const url = `${CONFIG.API.BASE_URL}${endpoint}`;
  
  // Adiciona token de autenticação se disponível
  const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Headers padrão
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  try {
    const fetchOptions = {
      method,
      headers: defaultHeaders,
      timeout: CONFIG.API.TIMEOUT
    };

    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    // Tratamento de erro 401 (não autorizado)
    if (response.status === 401) {
      localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
      localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
      window.location.href = '/pages/login.html';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Trata respostas vazias
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response.ok;

  } catch (error) {
    // Retry logic
    if (retries < CONFIG.API.RETRY_ATTEMPTS) {
      console.warn(`Tentativa ${retries + 1}/${CONFIG.API.RETRY_ATTEMPTS}: ${error.message}`);
      await delay(500 * (retries + 1)); // Backoff exponencial
      return apiCall(endpoint, { ...options, retries: retries + 1 });
    }

    console.error(`[API Error] ${endpoint}:`, error.message);
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

// Exportar para global scope
if (typeof window !== 'undefined') {
  Object.assign(window, {
    apiCall,
    getDevices,
    getDevice,
    updateDevice,
    deleteDevice,
    getLogs,
    getSettings,
    updateSettings
  });
}
