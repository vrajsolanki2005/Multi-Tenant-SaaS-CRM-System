const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/rbacMiddleware');

router.use(authMiddleware);

router.post('/tasks', allowRoles('admin', 'manager'), taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', allowRoles('admin', 'manager'), taskController.updateTask);
router.delete('/tasks/:id', allowRoles('admin'), taskController.deleteTask);

module.exports = router;
