const router = require('express').Router();
const { putMe } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth');

router.put('/me', authMiddleware, putMe);

module.exports = router;
