//create organization
const express = require('express');
const router = express.router();
const authController = require('../controllers/authController');

router.post('/create-org', authController.createOrg);

module.exports = router;