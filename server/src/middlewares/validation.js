const { body, param, query, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

exports.createUserValidation = [
    body('user_name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 255 }).withMessage('Name must be 2-255 characters'),
    body('user_email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('user_password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
        .matches(/(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter')
        .matches(/(?=.*\d)/).withMessage('Password must contain at least one digit'),
    body('user_role').optional().isIn(['superAdmin', 'admin', 'manager', 'sales']).withMessage('Invalid role')
];

exports.updateUserValidation = [
    param('id').isInt().withMessage('Invalid user ID'),
    body('user_name').optional().trim().isLength({ min: 2, max: 255 }).withMessage('Name must be 2-255 characters'),
    body('user_email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('user_password').optional()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
        .matches(/(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter')
        .matches(/(?=.*\d)/).withMessage('Password must contain at least one digit'),
    body('user_role').optional().isIn(['superAdmin', 'admin', 'manager', 'sales']).withMessage('Invalid role'),
    body('is_active').optional().isBoolean().withMessage('is_active must be boolean')
];

exports.userIdValidation = [param('id').isInt()];

exports.paginationValidation = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().trim(),
    query('role').optional().isIn(['superAdmin', 'admin', 'manager', 'sales']),
    query('is_active').optional().isBoolean().toBoolean()
];
