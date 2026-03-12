const taskService = require('../services/taskService');
const { logAction } = require('../services/auditService');

exports.createTask = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { task_name, description, status, priority, due_date, lead_id, assigned_to } = req.body;
        
        if (!task_name) {
            return res.status(400).json({ message: "Task name is required" });
        }
        
        const task_id = await taskService.createTask(tenant_id, { 
            task_name, description, status, priority, due_date, lead_id, assigned_to 
        });
        
        await logAction('Task created', 'task', task_id, req.user.user_id, tenant_id);
        if (assigned_to) {
            await logAction('Task assigned', 'task', task_id, req.user.user_id, tenant_id);
        }
        
        return res.status(201).json({
            message: 'Task created successfully',
            task_id
        });
    } catch (err) {
        console.error("Error creating task:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { status, priority, assigned_to, overdue, page, limit } = req.query;
        
        const tasks = await taskService.getTasks(tenant_id, { 
            status, priority, assigned_to, overdue, page, limit 
        });
        
        return res.status(200).json({ tasks });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        return res.status(500).json({ message: "Database error: " + err.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const task_id = req.params.id;
        
        const task = await taskService.getTaskById(tenant_id, task_id);
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        return res.status(200).json({ task });
    } catch (err) {
        console.error("Error fetching task:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const task_id = req.params.id;
        const { task_name, description, status, priority, due_date, assigned_to } = req.body;
        
        const result = await taskService.updateTask(
            tenant_id, 
            task_id, 
            { task_name, description, status, priority, due_date, assigned_to },
            req.user.user_id,
            req.user.role
        );
        
        if (!result) {
            return res.status(404).json({ message: "Task not found or access denied" });
        }
        
        await logAction('Task updated', 'task', task_id, req.user.user_id, tenant_id);
        return res.status(200).json({ message: "Task updated successfully" });
    } catch (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const task_id = req.params.id;
        
        const result = await taskService.deleteTask(
            tenant_id, 
            task_id,
            req.user.user_id,
            req.user.role
        );
        
        if (!result) {
            return res.status(404).json({ message: "Task not found or access denied" });
        }
        
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Error deleting task:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
