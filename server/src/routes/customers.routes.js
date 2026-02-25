const express = require('express')
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/rbacMiddleware');

router.use(authMiddleware);

router.post('/customer', allowRoles('admin', 'manager'), customerController.createCustomer);
router.get('/customer', customerController.getCustomers);
router.get('/customer/:id', customerController.getCustomersById);
router.put('/customer/:id', allowRoles('admin', 'manager'), customerController.updateCustomer);
router.delete('/customer/:id', allowRoles('admin'), customerController.deleteCustomer);

module.exports = router;