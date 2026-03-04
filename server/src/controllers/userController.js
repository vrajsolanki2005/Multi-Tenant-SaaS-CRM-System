const userService = require('../services/userService');
const { logAction } = require('../services/auditService');

exports.createUser = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_role } = req.body;
        const tenant_id = req.user.tenant_id;
    
        const id = await userService.createUser(tenant_id, { user_name, user_email, user_password, user_role });
        await logAction('User created', 'user', id, req.user.user_id, tenant_id);
        return res.status(201).json({ 
            success: true, 
            message: "User created successfully", 
            data: { user_id: id } 
        });
    } catch (err) {
        if (err.code === 'DUPLICATE_USER') {
            return res.status(409).json({ success: false, message: err.message });
        }
        return res.status(500).json({ success: false, message: "Failed to create user" });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { page = 1, limit = 10, search, role, is_active } = req.query;
        
        const result = await userService.getAllUsers(tenant_id, { page, limit, search, role, is_active });
        return res.status(200).json({ 
            success: true, 
            message: "Users fetched successfully", 
            data: result.users,
            pagination: result.pagination
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const user_id = req.params.id;
        const user = await userService.getUserById(tenant_id, user_id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
}
exports.updateUser = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const user_id = req.params.id;
        
        const updatedUser = await userService.updateUser(tenant_id, user_id, req.body);
        
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await logAction('User updated', 'user', user_id, req.user.user_id, tenant_id);
        return res.status(200).json({ 
            success: true, 
            message: "User updated successfully", 
            data: updatedUser 
        });
    } catch (err) {
        if (err.code === 'DUPLICATE_EMAIL') {
            return res.status(409).json({ success: false, message: err.message });
        }
        return res.status(500).json({ success: false, message: "Failed to update user" });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const user_id = req.params.id;
        
        if (req.user.user_id == user_id) {
            return res.status(400).json({ success: false, message: "Cannot delete your own account" });
        }
        
        const deleted = await userService.deleteUser(tenant_id, user_id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await logAction('User deleted', 'user', user_id, req.user.user_id, tenant_id);
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to delete user" });
    }
}