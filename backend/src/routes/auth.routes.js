/**
 * Auth Routes - N Eyes
 * Endpoints: /api/auth
 */

const { Router } = require('express');
// Importa o controlador (verifique se o caminho e o nome estão corretos no seu projeto)
const authController = require('../controllers/auth.controller'); 
const { validateRequest } = require('../middlewares/validateRequest');
const { registerSchema, loginSchema } = require('../utils/joiSchemas');

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Registra um novo usuário no sistema
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * example: "Operador NOC"
 * email:
 * type: string
 * example: "operador@neyes.com.br"
 * password:
 * type: string
 * example: "senhaSegura123"
 * responses:
 * 201:
 * description: Usuário criado com sucesso.
 * 400:
 * description: Erro de validação nos dados enviados (ex: e-mail inválido ou senha muito curta).
 */
// O middleware validateRequest intercepta a chamada e usa o registerSchema do Joi
router.post('/register', validateRequest(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Realiza o login e retorna o token de autenticação JWT
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * example: "operador@neyes.com.br"
 * password:
 * type: string
 * example: "senhaSegura123"
 * responses:
 * 200:
 * description: Login bem-sucedido. Retorna os dados do usuário e o token JWT.
 * 401:
 * description: Credenciais inválidas (e-mail ou senha incorretos).
 * 400:
 * description: Erro de formatação nos dados enviados.
 */
// O middleware validateRequest intercepta a chamada e usa o loginSchema do Joi
router.post('/login', validateRequest(loginSchema), authController.login);

module.exports = router;
