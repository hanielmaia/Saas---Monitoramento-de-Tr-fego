/**
 * Devices Routes - N Eyes
 * Endpoints: /api/devices
 */

const { Router } = require('express');
const devicesController = require('../controllers/devices.controller');
const { authMiddleware, authorizeRole } = require('../middlewares/auth');

const router = Router();

// Proteger todas as rotas com autenticação
router.use(authMiddleware);

// GET - Listar todos os dispositivos
router.get('/', devicesController.getAllDevices);

// GET - Estatísticas de dispositivos
router.get('/stats', devicesController.getDeviceStats);

// GET - Dispositivo por ID
router.get('/:id', devicesController.getDeviceById);

// POST - Criar novo dispositivo (apenas admin)
router.post('/', authorizeRole('ADMIN'), devicesController.createDevice);

// PATCH - Atualizar dispositivo (apenas admin)
router.patch('/:id', authorizeRole('ADMIN'), devicesController.updateDevice);

// DELETE - Deletar dispositivo (apenas admin)
router.delete('/:id', authorizeRole('ADMIN'), devicesController.deleteDevice);

module.exports = router;
