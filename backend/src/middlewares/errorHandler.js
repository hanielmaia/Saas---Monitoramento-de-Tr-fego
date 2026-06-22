/**
 * Middleware de Tratamento de Erros - N Eyes
 * Centraliza tratamento de erros e padroniza respostas
 */

/**
 * Classe para erros de API
 */
class APIError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'APIError';
  }
}

/**
 * Middleware de tratamento de erros
 * Deve ser o ÚLTIMO middleware a ser registrado
 */
const logger = require('../utils/logger.cjs');

function errorHandler(err, req, res, next) {
  logger.error({ err, path: req.path, method: req.method, body: req.body }, 'Unhandled error');

  // Erro de validação
  if (err.details && typeof err.details === 'object') {
    return res.status(400).json({
      status: 'error',
      message: err.message || 'Erro de validação',
      errors: err.details
    });
  }

  // Erro da API
  if (err instanceof APIError) {
    return res.status(err.status).json({
      status: 'error',
      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // Erro genérico
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  return res.status(status).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * Middleware para 404
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
}

module.exports = {
  APIError,
  errorHandler,
  notFoundHandler
};
