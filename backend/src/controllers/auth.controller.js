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
 * Retorna access token e refresh token via httpOnly cookies
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

    // Configurar cookies httpOnly
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,           // Não acessível via JavaScript (proteção contra XSS)
      secure: isProduction,     // HTTPS apenas em produção
      sameSite: 'strict',       // Proteção contra CSRF
      maxAge: 15 * 60 * 1000    // 15 minutos
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 dias
    };

    // Enviar tokens em httpOnly cookies
    res.cookie('accessToken', result.accessToken, cookieOptions);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);

    return res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso',
      user: result.user
      // Nota: tokens NÃO são enviados no JSON body, apenas em cookies
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
 * Revoga tokens e limpa cookies
 */
function logout(req, res) {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // Revogar tokens
    authService.logout({ accessToken, refreshToken });

    // Limpar cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

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

/**
 * POST /api/auth/refresh
 * Renova o access token usando refresh token
 */
function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token não fornecido'
      });
    }

    // Renovar access token
    const result = authService.refreshAccessToken(refreshToken);

    // Configurar novo access token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    };

    res.cookie('accessToken', result.accessToken, cookieOptions);

    return res.status(200).json({
      status: 'success',
      message: 'Access token renovado com sucesso',
      user: result.user
    });
  } catch (err) {
    if (err.message.includes('Refresh token foi revogado')) {
      return res.status(401).json({
        status: 'error',
        message: 'Sessão expirada. Faça login novamente.'
      });
    }

    if (err.message.includes('Erro ao renovar token')) {
      return res.status(401).json({
        status: 'error',
        message: 'Token de renovação inválido ou expirado'
      });
    }

    next(err);
  }
}

module.exports = {
  register,
  login,
  me,
  logout,
  refresh
};
