const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/rbacMiddleware');
const { createUserValidation, updateUserValidation, userIdValidation, paginationValidation, validate } = require('../middlewares/validation');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/me', authMiddleware, userController.getMyProfile);
router.post('/create-user', authMiddleware, allowRoles('admin', 'manager'), createUserValidation, validate, userController.createUser);
router.get('/users', authMiddleware, paginationValidation, validate, userController.getAllUsers);
router.get('/users/:id', authMiddleware, userIdValidation, validate, userController.getUserById);
router.put('/users/:id', authMiddleware, allowRoles('admin', 'manager'), updateUserValidation, validate, userController.updateUser);
router.delete('/users/:id', authMiddleware, allowRoles('admin'), userIdValidation, validate, userController.deleteUser);

module.exports = router;