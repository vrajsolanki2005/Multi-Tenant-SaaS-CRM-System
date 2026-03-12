const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/rbacMiddleware');

router.get('/', authMiddleware, allowRoles('SuperAdmin', 'admin', 'Manager'), auditController.getAuditLogs);

module.exports = router;
