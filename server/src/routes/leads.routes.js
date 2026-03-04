const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/rbacMiddleware');

router.use(authMiddleware);

router.post('/leads', allowRoles('admin', 'manager'), leadController.createLead);
router.get('/leads', leadController.getLeads);
router.get('/leads/:id', leadController.getLeadById);
router.put('/leads/:id', allowRoles('admin', 'manager'), leadController.updateLead);
router.delete('/leads/:id', allowRoles('admin'), leadController.deleteLead);
router.put('/leads/:id/assign', authMiddleware, allowRoles('admin'), leadController.assignLead);
module.exports = router;
