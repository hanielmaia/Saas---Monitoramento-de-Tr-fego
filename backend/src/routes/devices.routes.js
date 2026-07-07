
/**
 * Devices Routes - N Eyes
 * Endpoints: /api/devices
 */

const { Router } = require('express');
const devicesController = require('../controllers/devices.controller');
const { authMiddleware, authorizeRole } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validateRequest');
const { deviceCreateSchema, deviceUpdateSchema } = require('../utils/joiSchemas');

const router = Router();

// Proteger todas as rotas com autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/devices:
 * get:
 * summary: Retorna a lista de todos os equipamentos monitorados na rede
 * tags: [Devices]
 * responses:
 * 200:
 * description: Lista de dispositivos recuperada com sucesso.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * example: 1
 * ip_address:
 * type: string
 * example: "192.168.0.10"
 * status:
 * type: string
 * example: "online"
 * 500:
 * description: Erro interno no servidor.
 */
router.get('/', devicesController.getAllDevices);

/**
 * @swagger
 * /api/devices/stats:
 * get:
 * summary: Retorna as estatísticas gerais dos equipamentos (ex: online vs offline)
 * tags: [Devices]
 * responses:
 * 200:
 * description: Estatísticas recuperadas com sucesso.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * total:
 * type: integer
 * example: 45
 * online:
 * type: integer
 * example: 42
 * offline:
 * type: integer
 * example: 3
 */
router.get('/stats', devicesController.getDeviceStats);

/**
 * @swagger
 * /api/devices/{id}:
 * get:
 * summary: Busca os detalhes de um equipamento específico pelo ID
 * tags: [Devices]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * description: ID numérico do equipamento
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Dados do equipamento retornados com sucesso.
 * 404:
 * description: Equipamento não encontrado na base de dados.
 */
router.get('/:id', devicesController.getDeviceById);

/**
 * @swagger
 * /api/devices:
 * post:
 * summary: Cadastra um novo equipamento na rede (Requer permissão de ADMIN)
 * tags: [Devices]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * ip:
 * type: string
 * example: "10.0.0.254"
 * hostname:
 * type: string
 * example: "Switch-Core-01"
 * responses:
 * 201:
 * description: Equipamento criado com sucesso.
 * 400:
 * description: Erro de validação nos dados enviados (ex: IP inválido).
 */
router.post('/', authorizeRole('ADMIN'), validateRequest(deviceCreateSchema), devicesController.createDevice);

/**
 * @swagger
 * /api/devices/{id}:
 * patch:
 * summary: Atualiza as informações de um equipamento (Requer permissão de ADMIN)
 * tags: [Devices]
 * parameters:
 * - in: path
 * hostname: id
 * required: true
 * description: ID numérico do equipamento a ser editado
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * ip:
 * type: string
 * example: "10.0.0.250"
 * status:
 * type: string
 * example: "offline"
 * responses:
 * 200:
 * description: Equipamento atualizado com sucesso.
 * 404:
 * description: Equipamento não encontrado.
 */
router.patch('/:id', authorizeRole('ADMIN'), validateRequest(deviceUpdateSchema), devicesController.updateDevice);

/**
 * @swagger
 * /api/devices/{id}:
 * delete:
 * summary: Remove um equipamento do monitoramento (Requer permissão de ADMIN)
 * tags: [Devices]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * description: ID numérico do equipamento a ser deletado
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Equipamento removido com sucesso.
 * 404:
 * description: Equipamento não encontrado.
 */
router.delete('/:id', authorizeRole('ADMIN'), devicesController.deleteDevice);

module.exports = router;