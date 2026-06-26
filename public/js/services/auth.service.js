/**
 * Auth Service - N Eyes
 * Serviço de autenticação centralizado com suporte a cookies httpOnly
 * Não armazena tokens em localStorage (agora via cookies seguros)
 */

/**
 * Faz login do usuário
 * Tokens são armazenados automaticamente em httpOnly cookies pelo servidor
 * @param {string} email - Email
 * @param {string} password - Senha
 * @returns {Promise<Object>} { user }
 */
async function login(email, password) {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (response.user) {
      // Armazenar apenas dados do usuário em localStorage
      localStorage.setItem(CONFIG.STORAGE.USER_KEY, JSON.stringify(response.user));
      
      // Tokens estão em httpOnly cookies, não são acessados por JavaScript
      return response;
    }

    throw new Error('Resposta de login inválida');

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Registra novo usuário
 * @param {string} name - Nome completo
 * @param {string} email - Email
 * @param {string} password - Senha
 * @returns {Promise<Object>} { user }
 */
async function register(name, email, password) {
  try {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });

    return response;

  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

/**
 * Faz logout do usuário
 * Revoga tokens no servidor e limpa dados locais
 * @returns {Promise<boolean>}
 */
async function logout() {
  try {
    // Notificar servidor para revogar tokens
    await apiCall('/auth/logout', { method: 'POST' }).catch(() => {});

    // Limpar dados locais
    localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
    // TOKEN_KEY não é mais usado, mas remover por segurança
    localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);

    return true;

  } catch (error) {
    // Sempre limpar dados locais mesmo se erro no servidor
    localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
    localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
    return true;
  }
}

/**
 * Obtém dados do usuário atual
 * Valida se ainda está autenticado
 * @returns {Promise<Object>}
 */
async function getCurrentUser() {
  try {
    return await apiCall('/auth/me');
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}

/**
 * Valida se usuário está autenticado
 * Verifica dados em cache e valida no servidor
 * @returns {Promise<boolean>}
 */
async function validateToken() {
  try {
    // Tentar obter dados do servidor
    await getCurrentUser();
    return true;
  } catch (error) {
    // Se erro, não está autenticado
    localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
    localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
    return false;
  }
}

/**
 * Obtém usuário armazenado em cache
 * Retorna dados do localStorage sem validar com servidor
 * @returns {Object|null}
 */
function getCachedUser() {
  try {
    const userJson = localStorage.getItem(CONFIG.STORAGE.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Erro ao obter usuário em cache:', error);
    return null;
  }
}

/**
 * Limpa todos os dados de autenticação locais
 */
function clearAuthData() {
  localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
  localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
}

// Exportar para global scope
if (typeof window !== 'undefined') {
  Object.assign(window, {
    login,
    register,
    logout,
    getCurrentUser,
    validateToken,
    getCachedUser,
    clearAuthData
  });
}
