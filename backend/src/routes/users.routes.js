/**
 * Users Routes - N Eyes
 * Endpoints: /api/users
 */

const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const { authMiddleware, authorizeRole } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validateRequest');
const { updateUserSchema } = require('../utils/joiSchemas');

const router = Router();

// Proteger todas as rotas com autenticação
router.use(authMiddleware);

// GET - Listar todos os usuários (apenas admin)
router.get('/', authorizeRole('ADMIN'), usersController.index);

// GET - Dados do usuário logado
router.get('/me', usersController.getMe);

// GET - Usuário por ID (apenas admin)
router.get('/:id', authorizeRole('ADMIN'), usersController.getById);

// PATCH - Atualizar perfil do usuário logado
router.patch('/me', validateRequest(updateUserSchema), usersController.updateMe);

// DELETE - Deletar usuário (apenas admin)
router.delete('/:id', authorizeRole('ADMIN'), usersController.remove);

module.exports = router;
