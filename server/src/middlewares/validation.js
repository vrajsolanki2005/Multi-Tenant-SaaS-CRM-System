const { body, param, query, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

exports.createUserValidation = [
    body('user_name').trim().notEmpty().isLength({ min: 2, max: 255 }),
    body('user_email').isEmail().normalizeEmail(),
    body('user_password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('user_role').optional().isIn(['superAdmin', 'admin', 'manager', 'sales'])
];

exports.updateUserValidation = [
    param('id').isInt(),
    body('user_name').optional().trim().isLength({ min: 2, max: 255 }),
    body('user_email').optional().isEmail().normalizeEmail(),
    body('user_password').optional().isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('user_role').optional().isIn(['superAdmin', 'admin', 'manager', 'sales']),
    body('is_active').optional().isBoolean()
];

exports.userIdValidation = [param('id').isInt()];

exports.paginationValidation = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().trim(),
    query('role').optional().isIn(['superAdmin', 'admin', 'manager', 'sales']),
    query('is_active').optional().isBoolean().toBoolean()
];
