/**
 * Logs Routes - N Eyes
 * Endpoints: /api/logs
 */

const { Router } = require('express');
const logsController = require('../controllers/logs.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

// Proteger todas as rotas com autenticação
router.use(authMiddleware);

// GET - Listar todos os logs com filtros
router.get('/', logsController.getAllLogs);

// GET - Log por ID
router.get('/:id', logsController.getLogById);

// POST - Criar novo log
router.post('/', logsController.createLog);

// DELETE - Deletar log
router.delete('/:id', logsController.deleteLog);

module.exports = router;
