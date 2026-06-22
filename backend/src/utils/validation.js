/**
 * Middleware de Validação - N Eyes
 * Valida entrada de dados e padroniza respostas de erro
 */

/**
 * Valida email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida senha
 * @param {string} password
 * @returns {Object} { valid, errors }
 */
function validatePassword(password) {
  const errors = [];
  if (!password) errors.push('Senha é obrigatória');
  if (password && password.length < 6) errors.push('Senha deve ter mínimo 6 caracteres');
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida dados de registro
 * @param {Object} data - { name, email, password }
 * @returns {Object} { valid, errors }
 */
function validateRegister(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Nome deve ter mínimo 2 caracteres';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Email inválido';
  }

  const pwdValidation = validatePassword(data.password);
  if (!pwdValidation.valid) {
    errors.password = pwdValidation.errors[0];
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida dados de login
 * @param {Object} data - { email, password }
 * @returns {Object} { valid, errors }
 */
function validateLogin(data) {
  const errors = {};

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Email inválido';
  }

  if (!data.password) {
    errors.password = 'Senha é obrigatória';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida dados de dispositivo
 * @param {Object} data
 * @returns {Object} { valid, errors }
 */
function validateDevice(data) {
  const errors = {};

  if (data.hostname !== undefined && (!data.hostname || data.hostname.trim().length === 0)) {
    errors.hostname = 'Hostname não pode ser vazio';
  }

  if (data.ip !== undefined && !isValidIP(data.ip)) {
    errors.ip = 'IP inválido';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida IP
 * @param {string} ip
 * @returns {boolean}
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
 * Valida nome
 * @param {string} name
 * @returns {Object} { valid, errors }
 */
function validateName(name) {
  const errors = [];
  if (!name || name.trim().length < 2) {
    errors.push('Nome deve ter mínimo 2 caracteres');
  }
  if (name && name.length > 100) {
    errors.push('Nome não pode ter mais de 100 caracteres');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida email (apenas boolean)
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  return isValidEmail(email);
}

/**
 * Valida hostname
 * @param {string} hostname
 * @returns {Object} { valid, errors }
 */
function validateHostname(hostname) {
  const errors = [];
  const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!hostname || hostname.trim().length === 0) {
    errors.push('Hostname não pode ser vazio');
  } else if (!hostnameRegex.test(hostname)) {
    errors.push('Hostname inválido');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida settings
 * @param {Object} data
 * @returns {Object} { valid, errors }
 */
function validateSettings(data) {
  const errors = {};

  if (data.alertThreshold !== undefined) {
    const threshold = parseInt(data.alertThreshold);
    if (isNaN(threshold) || threshold < 0 || threshold > 100) {
      errors.alertThreshold = 'Deve ser um número entre 0 e 100';
    }
  }

  if (data.scanFrequency !== undefined) {
    const freq = parseInt(data.scanFrequency);
    if (isNaN(freq) || freq < 1 || freq > 3600) {
      errors.scanFrequency = 'Deve ser um número entre 1 e 3600';
    }
  }

  if (data.retentionDays !== undefined) {
    const days = parseInt(data.retentionDays);
    if (isNaN(days) || days < 1 || days > 365) {
      errors.retentionDays = 'Deve ser um número entre 1 e 365';
    }
  }

  if (data.minPasswordLength !== undefined) {
    const length = parseInt(data.minPasswordLength);
    if (isNaN(length) || length < 6 || length > 128) {
      errors.minPasswordLength = 'Deve ser um número entre 6 e 128';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida log
 * @param {Object} data
 * @returns {Object} { valid, errors }
 */
function validateLog(data) {
  const errors = {};

  if (!data.deviceId || data.deviceId === '') {
    errors.deviceId = 'Device ID é obrigatório';
  }

  if (!data.deviceName || data.deviceName.trim().length === 0) {
    errors.deviceName = 'Device name é obrigatório';
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Mensagem é obrigatória';
  }

  if (data.severity && !['info', 'warning', 'critical'].includes(data.severity)) {
    errors.severity = 'Severity deve ser: info, warning ou critical';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Sanitiza string (remove caracteres perigosos)
 * @param {string} str
 * @returns {string}
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
}

/**
 * Valida intervalo de datas
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Object} { valid, errors }
 */
function validateDateRange(startDate, endDate) {
  const errors = [];
  
  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      errors.push('Data de início inválida');
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      errors.push('Data de fim inválida');
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      errors.push('Data de início não pode ser posterior à data de fim');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  isValidEmail,
  validatePassword,
  validateRegister,
  validateLogin,
  validateDevice,
  isValidIP,
  validateName,
  validateEmail,
  validateHostname,
  validateSettings,
  validateLog,
  validateDateRange,
  sanitizeString
};
