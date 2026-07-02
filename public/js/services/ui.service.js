(function (global) {
  'use strict';

  const defaultConfig = {
    UI: {
      NOTIFICATION_TIMEOUT: 4000,
      REDIRECT_DELAY: 1500
    }
  };

  function getConfig() {
    if (global.CONFIG && typeof global.CONFIG === 'object') {
      return global.CONFIG;
    }

    if (typeof CONFIG !== 'undefined' && CONFIG && typeof CONFIG === 'object') {
      return CONFIG;
    }

    return defaultConfig;
  }

  function showNotification(message, type = 'error', options = {}) {
    if (!message || typeof document === 'undefined') {
      return null;
    }

    const notification = document.createElement('div');
    notification.className = `api-notification api-notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
      <div class="api-notification__container">
        <span class="api-notification__icon">${options.icon || '⚠️'}</span>
        <span class="api-notification__message">${message}</span>
        <button class="api-notification__close" type="button" aria-label="Fechar notificação">✕</button>
      </div>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : '#f8d7da'};
      border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'warning' ? '#ffeeba' : '#f5c6cb'};
      color: ${type === 'success' ? '#155724' : type === 'warning' ? '#856404' : '#721c24'};
      padding: 15px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 9999;
      max-width: 400px;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    const closeButton = notification.querySelector('.api-notification__close');
    if (closeButton) {
      closeButton.addEventListener('click', () => notification.remove());
    }

    document.body.appendChild(notification);

    const timeout = options.timeout ?? getConfig().UI?.NOTIFICATION_TIMEOUT ?? 4000;
    window.setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s ease-out';
      window.setTimeout(() => notification.remove(), 300);
    }, timeout);

    return notification;
  }

  function showErrorNotification(message, type = 'error', options = {}) {
    return showNotification(message, type, options);
  }

  function showSuccessNotification(message, options = {}) {
    return showNotification(message, 'success', options);
  }

  function showInfoNotification(message, options = {}) {
    return showNotification(message, 'info', options);
  }

  function extractErrorMessage(error, fallback = 'Ocorreu um erro inesperado.') {
    if (!error) {
      return fallback;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error.message) {
      return error.message;
    }

    if (error.data?.message) {
      return error.data.message;
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.errors && typeof error.errors === 'object') {
      const firstError = Object.values(error.errors)[0];
      if (firstError) {
        return typeof firstError === 'string' ? firstError : fallback;
      }
    }

    return fallback;
  }

  function buildApiError(message, status = 500, data = null) {
    const error = new Error(message);
    error.status = status;
    error.data = data;
    return error;
  }

  function redirectToLogin(reason = 'Sessão expirada', options = {}) {
    if (typeof window === 'undefined') {
      return;
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('neyes_user');
      localStorage.removeItem('neyes_token');
    }

    showNotification(`${reason}. Faça login novamente.`, 'warning', { timeout: 5000 });

    const delay = options.delay ?? getConfig().UI?.REDIRECT_DELAY ?? 1500;
    window.setTimeout(() => {
      window.location.href = options.path || '/pages/login.html';
    }, delay);
  }

  global.UIService = {
    showNotification,
    showErrorNotification,
    showSuccessNotification,
    showInfoNotification,
    extractErrorMessage,
    buildApiError,
    redirectToLogin
  };

  global.showErrorNotification = showErrorNotification;
  global.showSuccessNotification = showSuccessNotification;
  global.showInfoNotification = showInfoNotification;
  global.redirectToLogin = redirectToLogin;
})(window);
