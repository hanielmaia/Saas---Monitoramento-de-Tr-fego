/**
 * N Eyes - Utilities
 * Funções auxiliares para formatação, validação e manipulação
 */

// ============ FORMATAÇÃO ============

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatBandwidth(mbps) {
  if (mbps < 1) return (mbps * 1000).toFixed(0) + ' Kbps';
  return mbps.toFixed(2) + ' Mbps';
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString('pt-BR');
}

// ============ VALIDAÇÃO ============

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateIp(ip) {
  const re = /^(\d{1,3}\.){3}\d{1,3}$/;
  return re.test(ip);
}

function validateCIDR(cidr) {
  const [ip, mask] = cidr.split('/');
  return validateIp(ip) && (mask ? parseInt(mask) >= 0 && parseInt(mask) <= 32 : false);
}

function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;
  
  const labels = ['Fraca', 'OK', 'Boa', 'Forte', 'Muito Forte'];
  return { score: strength, label: labels[Math.min(strength, 4)], percentage: (strength / 4) * 100 };
}

// ============ DEVICE UTILITIES ============

function getDeviceIcon(type) {
  const icons = {
    desktop: '🖥️',
    laptop: '💻',
    server: '🖲️',
    printer: '🖨️',
    mobile: '📱',
    camera: '📹',
    switch: '🔀',
    voip: '☎️',
    nas: '💾',
    firewall: '🔥'
  };
  return icons[type] || '⚙️';
}

function getStatusBadge(status, blocked = false) {
  if (blocked) {
    return '<span class="badge bg-warning">🔒 Bloqueado</span>';
  }
  return status === 'online'
    ? '<span class="badge bg-success">✓ Online</span>'
    : '<span class="badge bg-danger">✗ Offline</span>';
}

function getStatusColor(status, blocked = false) {
  if (blocked) return 'warning';
  return status === 'online' ? 'success' : 'danger';
}

function getSeverityBadge(severity) {
  const badges = {
    info: '<span class="badge bg-info">ℹ️ Info</span>',
    warning: '<span class="badge bg-warning">⚠️ Aviso</span>',
    critical: '<span class="badge bg-danger">🔴 Crítico</span>'
  };
  return badges[severity] || '<span class="badge bg-secondary">?</span>';
}

function getLogTypeLabel(type) {
  const labels = {
    device_connected: 'Dispositivo conectado',
    device_disconnected: 'Dispositivo desconectado',
    device_blocked: 'Dispositivo bloqueado',
    device_unblocked: 'Dispositivo desbloqueado',
    device_renamed: 'Dispositivo renomeado',
    config_changed: 'Configuração alterada',
    threshold_exceeded: 'Limite excedido',
    alert_triggered: 'Alerta disparado'
  };
  return labels[type] || type;
}

// ============ STORAGE ============

function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Erro ao recuperar ${key} do storage:`, e);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erro ao salvar ${key} no storage:`, e);
  }
}

function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Erro ao remover ${key} do storage:`, e);
  }
}

// ============ ARRAY UTILITIES ============

function groupBy(array, key) {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
}

function sortBy(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
}

function filterBy(array, key, value) {
  return array.filter(item => item[key] === value);
}

function search(array, query, searchKeys = []) {
  const q = query.toLowerCase();
  return array.filter(item => {
    return searchKeys.some(key => {
      const value = item[key];
      return value && value.toString().toLowerCase().includes(q);
    });
  });
}

// ============ STATS ============

function calculateStats(values) {
  if (values.length === 0) return {};

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean: mean.toFixed(2),
    median: median.toFixed(2),
    min: Math.min(...values).toFixed(2),
    max: Math.max(...values).toFixed(2),
    stdDev: stdDev.toFixed(2),
    total: sum.toFixed(2)
  };
}

// ============ DEBOUNCE & THROTTLE ============

function debounce(fn, delay = 300) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, delay = 300) {
  let lastRun = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastRun >= delay) {
      fn(...args);
      lastRun = now;
    }
  };
}

// ============ DOM UTILITIES ============

function createElement(tag, className = '', innerHTML = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} position-fixed bottom-0 end-0 m-3`;
  toast.style.zIndex = '9999';
  toast.innerHTML = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, duration);
}

function showLoadingSpinner(container) {
  const spinner = document.createElement('div');
  spinner.className = 'text-center p-5';
  spinner.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div>';
  
  if (typeof container === 'string') {
    document.getElementById(container).appendChild(spinner);
  } else {
    container.appendChild(spinner);
  }
  
  return spinner;
}

function hideLoadingSpinner(spinner) {
  if (spinner) spinner.remove();
}

// ============ LOGGER ============

const Logger = {
  log: (message, data = null) => {
    console.log(`[LOG] ${message}`, data);
  },
  
  info: (message, data = null) => {
    console.info(`[INFO] ${message}`, data);
  },
  
  warn: (message, data = null) => {
    console.warn(`[WARN] ${message}`, data);
  },
  
  error: (message, data = null) => {
    console.error(`[ERROR] ${message}`, data);
  },
  
  debug: (message, data = null) => {
    if (localStorage.getItem('DEBUG_MODE')) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
};

// Ativar modo debug
function enableDebugMode() {
  localStorage.setItem('DEBUG_MODE', 'true');
  console.log('🐛 Modo debug ativado');
}

function disableDebugMode() {
  localStorage.removeItem('DEBUG_MODE');
  console.log('🐛 Modo debug desativado');
}
