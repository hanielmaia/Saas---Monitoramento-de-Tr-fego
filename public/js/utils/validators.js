/**
 * Validadores - N Eyes
 * Funções de validação reutilizáveis
 */

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida senha
 * @param {string} password - Senha a validar
 * @param {Object} options - Opções de validação
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validatePassword(password, options = {}) {
  const {
    minLength = 6,
    requireUppercase = false,
    requireNumbers = false,
    requireSpecialChars = false
  } = options;

  const errors = [];

  if (!password) {
    errors.push('Senha é obrigatória');
    return { valid: false, errors };
  }

  if (password.length < minLength) {
    errors.push(`Senha deve ter no mínimo ${minLength} caracteres`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida nome completo
 * @param {string} name - Nome a validar
 * @returns {boolean} True se válido
 */
function validateName(name) {
  if (!name || name.trim().length < 2) return false;
  if (name.trim().length > 100) return false;
  return true;
}

/**
 * Valida formulário de login
 * @param {Object} data - { email, password }
 * @returns {Object} { valid: boolean, errors: Object }
 */
function validateLoginForm(data) {
  const errors = {};

  if (!data.email || !data.email.trim()) {
    errors.email = 'E-mail é obrigatório';
  } else if (!validateEmail(data.email)) {
    errors.email = 'E-mail inválido';
  }

  if (!data.password) {
    errors.password = 'Senha é obrigatória';
  } else if (data.password.length < 6) {
    errors.password = 'Senha deve ter no mínimo 6 caracteres';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Valida formulário de registro
 * @param {Object} data - { name, email, password, passwordConfirm }
 * @returns {Object} { valid: boolean, errors: Object }
 */
function validateRegisterForm(data) {
  const errors = {};

  // Validar nome
  if (!data.name || !data.name.trim()) {
    errors.name = 'Nome é obrigatório';
  } else if (!validateName(data.name)) {
    errors.name = 'Nome deve ter entre 2 e 100 caracteres';
  }

  // Validar email
  if (!data.email || !data.email.trim()) {
    errors.email = 'E-mail é obrigatório';
  } else if (!validateEmail(data.email)) {
    errors.email = 'E-mail inválido';
  }

  // Validar senha
  const passwordValidation = validatePassword(data.password, {
    minLength: 6
  });
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.errors[0];
  }

  // Validar confirmação de senha
  if (data.password !== data.passwordConfirm) {
    errors.passwordConfirm = 'Senhas não coincidem';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Limpa erros de um formulário
 * @param {string} formId - ID do formulário
 */
function clearFormErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.classList.remove('is-invalid');
    const errorElement = input.parentElement.querySelector('.invalid-feedback');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  });
}

/**
 * Exibe erros de validação no formulário
 * @param {string} formId - ID do formulário
 * @param {Object} errors - Objeto com erros por campo
 */
function displayFormErrors(formId, errors) {
  clearFormErrors(formId);
  const form = document.getElementById(formId);
  if (!form) return;

  Object.entries(errors).forEach(([fieldName, errorMessage]) => {
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (input) {
      input.classList.add('is-invalid');
      let errorElement = input.parentElement.querySelector('.invalid-feedback');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        input.parentElement.appendChild(errorElement);
      }
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
    }
  });
}

// Exportar para global scope
if (typeof window !== 'undefined') {
  Object.assign(window, {
    validateEmail,
    validatePassword,
    validateName,
    validateLoginForm,
    validateRegisterForm,
    clearFormErrors,
    displayFormErrors
  });
}
