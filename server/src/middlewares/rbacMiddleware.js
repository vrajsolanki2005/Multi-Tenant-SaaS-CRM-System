//role-based-access-control

exports.allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.user_role;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: `Access Denied: Role '${userRole}' not in allowed roles: ${allowedRoles.join(', ')}`
                });
            }

            next();
        } catch (error) {
            console.error('RBAC Error:', error);
            return res.status(500).json({
                success: false,
                message: "Authorization error"
            });
        }
    };
};
