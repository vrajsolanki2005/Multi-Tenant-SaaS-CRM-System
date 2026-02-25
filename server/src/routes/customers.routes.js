const express = require('express')
const router = express.Router();
const customerController = require('../controllers/customerController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/rbacMiddleware');

router.use(authMiddleware);

router.post('/customers', allowRoles('admin', 'manager'), customerController.createCustomer);
router.get('/customers', customerController.getCustomers);
router.get('/customers/:id', customerController.getCustomersById);
router.put('/customers/:id', allowRoles('admin', 'manager'), customerController.updateCustomer);
router.delete('/customers/:id', allowRoles('admin'), customerController.deleteCustomer);

module.exports = router;