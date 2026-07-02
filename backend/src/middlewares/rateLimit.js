/**
 * Rate Limiting Middleware - N Eyes
 * Protege endpoints sensíveis contra brute force
 */

const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

/**
 * Limiter para endpoints de autenticação (login, register)
 * Max 5 tentativas a cada 15 minutos por IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                     // 5 requisições por IP
  message: {
    status: 'error',
    message: 'Muitas tentativas. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,      // Retorna info do rate limit em headers
  legacyHeaders: false,       // Desativa headers legados
  skip: (req) => {
    // Skip se for ambiente de desenvolvimento
    return process.env.NODE_ENV !== 'production';
  },
  keyGenerator: ipKeyGenerator
});

/**
 * Limiter geral para toda a API
 * Max 100 requisições a cada 15 minutos por IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    message: 'Muitas requisições. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV !== 'production';
  },
  keyGenerator: ipKeyGenerator
});

/**
 * Limiter rigoroso para refresh token
 * Max 10 tentativas a cada 15 minutos por IP
 * (mais permissivo que login pois é chamado automaticamente)
 */
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 'error',
    message: 'Muitas tentativas de renovação. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV !== 'production';
  },
  keyGenerator: ipKeyGenerator
});

module.exports = {
  authLimiter,
  generalLimiter,
  refreshLimiter
};
