const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/rbacMiddleware');

router.get('/protected', authMiddleware, allowRoles('admin'), (req, res) => {
    res.json({
        success: true,
        message: 'Access granted',
        user: req.user
    });
});

module.exports = router;
