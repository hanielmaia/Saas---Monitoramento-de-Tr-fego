/**
 * Settings Routes - N Eyes
 * Endpoints: /api/settings
 */

const { Router } = require('express');
const { index, save } = require('../controllers/settings.controller');
const { authMiddleware, authorizeRole } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validateRequest');
const { settingsUpdateSchema } = require('../utils/joiSchemas');

const router = Router();

// Proteger todas as rotas com autenticação
router.use(authMiddleware);

// GET - Obter configurações
router.get('/', index);

// PATCH - Atualizar configurações (apenas admin)
router.patch('/', authorizeRole('ADMIN'), validateRequest(settingsUpdateSchema), save);

module.exports = router;

module.exports = router;
