/**
 * Auth Service - N Eyes
 * Serviço de autenticação centralizado
 */

/**
 * Faz login do usuário
 * @param {string} email - Email
 * @param {string} password - Senha
 * @returns {Promise<Object>} { token, user }
 */
async function login(email, password) {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (response.token && response.user) {
      // Armazenar token e usuário
      localStorage.setItem(CONFIG.STORAGE.TOKEN_KEY, response.token);
      localStorage.setItem(CONFIG.STORAGE.USER_KEY, JSON.stringify(response.user));
      
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
 * @returns {Promise<boolean>}
 */
async function logout() {
  try {
    // Tentar notificar servidor
    await apiCall('/auth/logout', { method: 'POST' }).catch(() => {});

    // Limpar localStorage
    localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
    localStorage.removeItem(CONFIG.STORAGE.USER_KEY);

    return true;

  } catch (error) {
    // Sempre limpar dados locais mesmo se erro
    localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
    localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
    return true;
  }
}

/**
 * Obtém dados do usuário atual
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
 * Valida token armazenado
 * @returns {Promise<boolean>}
 */
async function validateToken() {
  const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);
  if (!token) return false;

  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
    localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
    return false;
  }
}

// Exportar para global scope
if (typeof window !== 'undefined') {
  Object.assign(window, {
    login,
    register,
    logout,
    getCurrentUser,
    validateToken
  });
}
