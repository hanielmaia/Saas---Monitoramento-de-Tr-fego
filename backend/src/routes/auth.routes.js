/**
 * Auth Routes - N Eyes
 * Endpoints: /api/auth
 */

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth');
const { authLimiter, refreshLimiter } = require('../middlewares/rateLimit');

const router = Router();

// POST - Registrar novo usuário (sem autenticação, com rate limit)
router.post('/register', authLimiter, authController.register);

// POST - Fazer login (sem autenticação, com rate limit)
router.post('/login', authLimiter, authController.login);

// POST - Renovar access token (sem autenticação, com rate limit moderado)
router.post('/refresh', refreshLimiter, authController.refresh);

// GET - Dados do usuário logado (protegido)
router.get('/me', authMiddleware, authController.me);

// POST - Fazer logout (protegido)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
