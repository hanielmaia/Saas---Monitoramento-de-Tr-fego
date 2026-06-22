/**
 * Auth Routes - N Eyes
 * Endpoints: /api/auth
 */

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validateRequest');
const { registerSchema, loginSchema } = require('../utils/joiSchemas');

const router = Router();

// POST - Registrar novo usuário (sem autenticação)
router.post('/register', validateRequest(registerSchema), authController.register);

// POST - Fazer login (sem autenticação)
router.post('/login', validateRequest(loginSchema), authController.login);

// GET - Dados do usuário logado (protegido)
router.get('/me', authMiddleware, authController.me);

// POST - Fazer logout (protegido)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
