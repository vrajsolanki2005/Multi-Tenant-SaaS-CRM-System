const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/rbacMiddleware');

router.use(authMiddleware);

router.post('/leads', allowRoles('superAdmin', 'admin', 'manager', 'sales'), leadController.createLead);
router.get('/leads', leadController.getLeads);
router.get('/leads/:id', leadController.getLeadById);
router.put('/leads/:id', allowRoles('superAdmin', 'admin', 'manager', 'sales'), leadController.updateLead);
router.delete('/leads/:id', allowRoles('superAdmin', 'admin', 'manager'), leadController.deleteLead);
router.put('/leads/:id/assign', authMiddleware, allowRoles('superAdmin', 'admin', 'manager'), leadController.assignLead);
module.exports = router;
