//role-based-access-control

exports.allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.user_role;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied: Insufficient permissions"
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Authorization error"
            });
        }
    };
};
