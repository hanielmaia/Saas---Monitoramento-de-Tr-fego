/**
 * Auth Controller - N Eyes
 * Endpoints de autenticação (register, login, logout, me)
 */

const authService = require('../services/auth.service');
const { validateRegister, validateLogin } = require('../utils/validation');

/**
 * POST /api/auth/register
 * Registra novo usuário
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validar entrada
    const validation = validateRegister({ name, email, password });
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Erro de validação',
        errors: validation.errors
      });
    }

    // Registrar usuário
    const user = await authService.register({ name, email, password });

    return res.status(201).json({
      status: 'success',
      message: 'Usuário criado com sucesso',
      user
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Faz login do usuário
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validar entrada
    const validation = validateLogin({ email, password });
    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Erro de validação',
        errors: validation.errors
      });
    }

    // Fazer login
    const result = await authService.login({ email, password });

    return res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso',
      ...result
    });
  } catch (err) {
    if (err.message === 'Credenciais inválidas') {
      return res.status(401).json({
        status: 'error',
        message: err.message
      });
    }
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Obtém dados do usuário logado
 */
function me(req, res, next) {
  try {
    const user = authService.me(req.userId);

    return res.status(200).json({
      status: 'success',
      user
    });
  } catch (err) {
    if (err.message === 'Usuário não encontrado') {
      return res.status(404).json({
        status: 'error',
        message: err.message
      });
    }
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Faz logout do usuário
 */
function logout(req, res) {
  try {
    authService.logout();

    return res.status(200).json({
      status: 'success',
      message: 'Logout realizado com sucesso'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao fazer logout'
    });
  }
}

module.exports = {
  register,
  login,
  me,
  logout
};
