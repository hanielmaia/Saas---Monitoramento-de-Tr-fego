/**
 * Auth Guard - N Eyes
 * Proteção e Consistência de Autenticação
 * Garante que token e usuário permaneçam sincronizados
 */

class AuthGuard {
  constructor() {
    this.redirectDelay = CONFIG.UI.REDIRECT_DELAY;
    this.loginPage = '/pages/login.html';
  }

  /**
   * Verifica se usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);
    const user = localStorage.getItem(CONFIG.STORAGE.USER_KEY);
    return !!(token && user);
  }

  /**
   * Obtém usuário atual do localStorage
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem(CONFIG.STORAGE.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Obtém token de autenticação
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);
  }

  /**
   * Valida e restaura autenticação
   * Mantém consistência de token e usuário
   * @returns {boolean}
   */
  validateAndRefresh() {
    const token = localStorage.getItem(CONFIG.STORAGE.TOKEN_KEY);
    const user = localStorage.getItem(CONFIG.STORAGE.USER_KEY);

    if (!token || !user) {
      this.redirectToLogin();
      return false;
    }

    try {
      // Valida se usuário é JSON válido
      JSON.parse(user);
      return true;
    } catch (e) {
      // Se JSON inválido, limpa e redireciona
      this.logout();
      return false;
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout() {
    try {
      // Tentar fazer logout no servidor
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }

    // Sempre limpar dados locais
    localStorage.removeItem(CONFIG.STORAGE.TOKEN_KEY);
    localStorage.removeItem(CONFIG.STORAGE.USER_KEY);
    this.redirectToLogin();
  }

  /**
   * Redireciona para página de login
   */
  redirectToLogin() {
    setTimeout(() => {
      window.location.href = this.loginPage;
    }, this.redirectDelay);
  }

  /**
   * Protege página - redireciona se não autenticado
   * @returns {boolean}
   */
  protect() {
    if (!this.isAuthenticated()) {
      this.redirectToLogin();
      return false;
    }
    return true;
  }

  /**
   * Salva URL de redirecionamento anterior
   */
  saveRedirectUrl() {
    if (window.location.pathname !== '/pages/login.html') {
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
    }
  }

  /**
   * Retorna à página anterior após login
   */
  redirectAfterLogin() {
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectUrl;
    } else {
      window.location.href = '/pages/home.html';
    }
  }
}

// Criar instância global
const authGuard = new AuthGuard();

// Exportar para global scope
if (typeof window !== 'undefined') {
  window.AuthGuard = AuthGuard;
  window.authGuard = authGuard;
}
