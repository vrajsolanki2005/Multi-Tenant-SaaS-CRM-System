const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/rbacMiddleware');

router.use(authMiddleware);

router.post('/tasks', allowRoles('superAdmin', 'admin', 'manager', 'sales'), taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', allowRoles('superAdmin', 'admin', 'manager', 'sales'), taskController.updateTask);
router.delete('/tasks/:id', allowRoles('superAdmin', 'admin', 'manager'), taskController.deleteTask);

module.exports = router;
