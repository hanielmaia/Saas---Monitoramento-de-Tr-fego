const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
