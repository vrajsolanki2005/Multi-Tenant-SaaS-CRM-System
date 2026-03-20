//create organization
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/create-org', authController.createOrg);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;