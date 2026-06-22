/**
 * Biblioteca de Funções Utilitárias - N Eyes
 * Centraliza funções reutilizáveis para todo o projeto
 */

/**
 * Formata bytes em unidade legível (KB, MB, GB)
 * @param {number} bytes - Valor em bytes
 * @param {number} decimals - Casas decimais (padrão: 2)
 * @returns {string} Valor formatado
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Formata data para formato legível (DD/MM/YYYY HH:mm:ss)
 * @param {Date|string} date - Data a formatar
 * @returns {string} Data formatada
 */
function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Formata hora relativa (ex: "há 5 minutos")
 * @param {Date|string} date - Data a formatar
 * @returns {string} Tempo relativo formatado
 */
function formatTimeAgo(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `há ${interval} ano${interval > 1 ? 's' : ''}`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `há ${interval} mês${interval > 1 ? 'es' : ''}`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `há ${interval} dia${interval > 1 ? 's' : ''}`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `há ${interval} hora${interval > 1 ? 's' : ''}`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `há ${interval} minuto${interval > 1 ? 's' : ''}`;
  
  return 'agora mesmo';
}

/**
 * Verifica se IP é válido
 * @param {string} ip - IP a verificar
 * @returns {boolean} True se válido
 */
function isValidIP(ip) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;
  
  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part);
    return num >= 0 && num <= 255;
  });
}

/**
 * Trunca texto com ellipsis
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado
 */
function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Converte status para classe CSS
 * @param {string} status - Status (ONLINE, OFFLINE, etc)
 * @returns {string} Classe CSS correspondente
 */
function getStatusClass(status) {
  const statusMap = {
    'ONLINE': 'badge-success',
    'OFFLINE': 'badge-danger',
    'IDLE': 'badge-warning',
    'MAINTENANCE': 'badge-secondary'
  };
  return statusMap[status] || 'badge-secondary';
}

/**
 * Converte status para cor Bootstrap
 * @param {string} status - Status
 * @returns {string} Cor Bootstrap (success, danger, warning, etc)
 */
function getStatusColor(status) {
  const colorMap = {
    'ONLINE': 'success',
    'OFFLINE': 'danger',
    'IDLE': 'warning',
    'MAINTENANCE': 'secondary'
  };
  return colorMap[status] || 'secondary';
}

/**
 * Copia texto para clipboard
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True se sucesso
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erro ao copiar:', err);
    return false;
  }
}

/**
 * Exibe notificação temporária
 * @param {string} message - Mensagem
 * @param {string} type - Tipo (success, danger, warning, info)
 * @param {number} duration - Duração em ms
 */
function showNotification(message, type = 'info', duration = 3000) {
  const alertClass = {
    'success': 'alert-success',
    'danger': 'alert-danger',
    'warning': 'alert-warning',
    'info': 'alert-info'
  }[type] || 'alert-info';

  const alert = document.createElement('div');
  alert.className = `alert ${alertClass} alert-dismissible fade show`;
  alert.role = 'alert';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  const container = document.querySelector('.navbar') || document.body;
  container.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, duration);
}

/**
 * Delay assíncrono (sleep)
 * @param {number} ms - Milissegundos
 * @returns {Promise} Promise que resolve após delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formata número com separador de milhar
 * @param {number} num - Número
 * @returns {string} Número formatado
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Valida se é JSON válido
 * @param {string} str - String a validar
 * @returns {boolean} True se JSON válido
 */
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// Exportar para global scope
if (typeof window !== 'undefined') {
  Object.assign(window, {
    formatBytes,
    formatDate,
    formatTimeAgo,
    isValidIP,
    truncateText,
    getStatusClass,
    getStatusColor,
    copyToClipboard,
    showNotification,
    delay,
    formatNumber,
    isValidJSON
  });
}
