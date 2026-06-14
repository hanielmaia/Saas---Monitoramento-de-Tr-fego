/**
 * Configuração Global - N Eyes
 * Centraliza todas as configurações do frontend
 */

const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: (() => {
      // Detecta ambiente (desenvolvimento vs produção)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
      }
      // Em produção, usa a mesma origem
      return `${window.location.origin}/api`;
    })(),
    TIMEOUT: 5000,
    RETRY_ATTEMPTS: 2
  },

  // Storage Keys
  STORAGE: {
    TOKEN_KEY: 'neyes_token',
    USER_KEY: 'neyes_user',
    SETTINGS_KEY: 'neyes_settings',
    USERS_KEY: 'neyes_users'
  },

  // UI
  UI: {
    REDIRECT_DELAY: 500,
    NOTIFICATION_TIMEOUT: 3000
  },

  // Validation Rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100
  },

  // Environment
  ENV: {
    isDev: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isProd: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  }
};

// Exportar para global scope (compatível com scripts tradicionais)
window.CONFIG = CONFIG;

// Se usar módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
