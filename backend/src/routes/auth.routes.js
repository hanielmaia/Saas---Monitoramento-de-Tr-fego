/**
 * Auth Routes - N Eyes
 * Endpoints: /api/auth
 */

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

// POST - Registrar novo usuário (sem autenticação)
router.post('/register', authController.register);

// POST - Fazer login (sem autenticação)
router.post('/login', authController.login);

// GET - Dados do usuário logado (protegido)
router.get('/me', authMiddleware, authController.me);

// POST - Fazer logout (protegido)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
