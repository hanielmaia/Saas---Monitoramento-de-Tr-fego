/**
 * Auth Controller - N Eyes
 * Endpoints de autenticaÃ§Ã£o (register, login, logout, me)
 */

const authService = require('../services/auth.service');
const { validateRegister, validateLogin } = require('../utils/validation');
const { APIError } = require('../middlewares/errorHandler');

/**
 * POST /api/auth/register
 * Registra novo usuÃ¡rio
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validar entrada
    const validation = validateRegister({ name, email, password });
    if (!validation.valid) {
      throw new APIError('Erro de validação', 400, validation.errors);
    }

    // Registrar usuÃ¡rio
    const user = await authService.register({ name, email, password });

    return res.status(201).json({
      status: 'success',
      message: 'UsuÃ¡rio criado com sucesso',
      user
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Faz login do usuÃ¡rio
 * Retorna access token e refresh token via httpOnly cookies
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validar entrada
    const validation = validateLogin({ email, password });
    if (!validation.valid) {
      throw new APIError('Erro de validação', 400, validation.errors);
    }

    // Fazer login
    const result = await authService.login({ email, password });

    // Configurar cookies httpOnly
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,           // NÃ£o acessÃ­vel via JavaScript (proteÃ§Ã£o contra XSS)
      secure: isProduction,     // HTTPS apenas em produÃ§Ã£o
      sameSite: 'strict',       // ProteÃ§Ã£o contra CSRF
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
      // Nota: tokens NÃƒO sÃ£o enviados no JSON body, apenas em cookies
    });
  } catch (err) {
    if (err.message === 'Credenciais invÃ¡lidas') {
      return next(new APIError(err.message, 401));
    }
    next(err);
  }
}

/**
 * GET /api/auth/me
 * ObtÃ©m dados do usuÃ¡rio logado
 */
function me(req, res, next) {
  try {
    const user = authService.me(req.userId);

    return res.status(200).json({
      status: 'success',
      user
    });
  } catch (err) {
    if (err.message === 'UsuÃ¡rio nÃ£o encontrado') {
      return next(new APIError(err.message, 404));
    }
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Faz logout do usuÃ¡rio
 * Revoga tokens e limpa cookies
 */
function logout(req, res, next) {
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
    next(err);
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
      throw new APIError('Refresh token não fornecido', 401);
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
      return next(new APIError('Sessão expirada. Faça login novamente.', 401));
    }

    if (err.message.includes('Erro ao renovar token')) {
      return next(new APIError('Token de renovação inválido ou expirado', 401));
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

