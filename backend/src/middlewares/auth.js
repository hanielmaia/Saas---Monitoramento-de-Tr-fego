const jwt = require('jsonwebtoken');
const { APIError } = require('./errorHandler');

/**
 * Middleware de Autenticação JWT
 * Verifica token e extrai dados do usuário
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Token não fornecido ou formato inválido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // JWT_SECRET é obrigatório e validado em server.ts
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expirado'
      });
    }

    return res.status(401).json({
      status: 'error',
      message: 'Token inválido'
    });
  }
}

/**
 * Middleware de Autorização por Role
 * @param {...string} allowedRoles - Roles permitidos
 */
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado. Você não tem permissão para acessar este recurso.'
      });
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  authorizeRole
};
