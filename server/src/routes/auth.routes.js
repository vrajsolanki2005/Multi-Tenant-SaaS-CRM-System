//create organization
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/create-org', authLimiter, authController.createOrg);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;