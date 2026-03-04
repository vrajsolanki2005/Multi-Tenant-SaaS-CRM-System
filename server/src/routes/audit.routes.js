const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/rbacMiddleware');

router.get('/', verifyToken, authorize(['SuperAdmin', 'Admin']), auditController.getAuditLogs);

module.exports = router;
