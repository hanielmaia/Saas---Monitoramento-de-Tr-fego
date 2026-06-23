/**
 * API Service - N Eyes
 * Camada de requisições HTTP centralizada
 * Gerencia autenticação, erros e retry automático
 */

// Garantir que config está disponível
if (typeof CONFIG === 'undefined') {
  console.error('CONFIG não carregado. Certifique-se que config.js é carregado antes.');
}

/**
 * Delay helper para retry com backoff exponencial
 * @param {number} ms - Milissegundos para esperar
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

  try {
    // Preparar headers
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);
    if (token) {
      // Validar formato do token
      if (typeof token === 'string' && token.length > 0) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('Token inválido encontrado em localStorage');
        localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
      }
    }

    // Preparar opções do fetch
    const fetchOptions = {
      method,
      headers: requestHeaders,
      timeout: CONFIG.API.TIMEOUT
    };

    // Adicionar body se fornecido
    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Executar requisição
    const response = await fetch(url, fetchOptions);

    // ===== TRATAMENTO DE STATUS DE ERRO =====

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

    // Verificar tipo de conteúdo
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }

    // Retornar true para requisições sem conteúdo
    return { success: response.ok };

  } catch (error) {
    // ===== RETRY LOGIC =====

    // Não fazer retry para erros de autenticação ou autorização
    const isAuthError = error.message.includes('Não autorizado') ||
      error.message.includes('Acesso proibido');

    if (!isAuthError && retries < CONFIG.API.RETRY_ATTEMPTS) {
      const delay_time = 500 * Math.pow(2, retries); // Backoff exponencial: 500ms, 1s, 2s
      console.warn(`[Retry ${retries + 1}/${CONFIG.API.RETRY_ATTEMPTS}] ${endpoint} - Tentando novamente em ${delay_time}ms`);
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
