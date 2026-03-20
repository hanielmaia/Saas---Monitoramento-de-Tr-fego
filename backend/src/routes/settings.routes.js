const router = require('express').Router();
const { index, save } = require('../controllers/settings.controller');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, index);
router.put('/', authMiddleware, save);

module.exports = router;
