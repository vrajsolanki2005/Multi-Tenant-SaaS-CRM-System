const express = require('express')
const router = express.Router();
const leadController = require('../controllers/leadController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const {allowRoles} = require('../middlewares/rbacMiddleware');

router.use(authMiddleware);

router.post('/lead', allowRoles('admin', 'manager'), leadController.createLead);
router.get('/lead', leadController.getLead);
router.put('/lead/:id', allowRoles('admin', 'manager'), leadController.updateLeadStatus);
router.delete('/lead/:id', allowRoles('admin'), leadController.deleteLead);

module.exports = router;