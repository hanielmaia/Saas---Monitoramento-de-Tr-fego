const jwt = require('jsonwebtoken');
const { APIError } = require('./errorHandler');
const tokenRevocationService = require('../services/tokenRevocation.service');

/**
 * Middleware de Autenticação JWT
 * Verifica token (do cookie ou header) e extrai dados do usuário
 * Valida se token não foi revogado
 */
function authMiddleware(req, res, next) {
  // Tentar obter token do cookie primeiro, depois do header
  let token = req.cookies?.accessToken;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Token não fornecido'
    });
  }

  try {
    // Verificar se token foi revogado
    if (tokenRevocationService.isTokenRevoked(token)) {
      return res.status(401).json({
        status: 'error',
        message: 'Token foi revogado. Faça login novamente.'
      });
    }

    // JWT_SECRET é obrigatório e validado em server.ts
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validar tipo de token (deve ser access)
    if (decoded.type && decoded.type !== 'access') {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido: tipo de token incorreto'
      });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expirado. Use /api/auth/refresh para renovar.',
        code: 'TOKEN_EXPIRED'
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
