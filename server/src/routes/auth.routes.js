//create organization
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/create-org', authController.createOrg);
router.post('/login', authController.login);

module.exports = router;