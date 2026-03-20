const taskService = require('../services/taskService');
const { logAction } = require('../services/auditService');
const NotificationService = require('../services/notificationService');

exports.createTask = async (req, res) => {
    try {
        console.log('Create Task - User:', req.user);
        console.log('Create Task - User Role:', req.user.user_role);
        console.log('Create Task - Request Body:', req.body);
        console.log('Create Task - assigned_to from body:', req.body.assigned_to);
        
        const tenant_id = req.user.tenant_id;
        const { task_name, description, status, priority, due_date, lead_id, assigned_to } = req.body;
        
        if (!task_name) {
            return res.status(400).json({ message: "Task name is required" });
        }
        
        // Use the assigned_to value from request body directly
        // Only auto-assign from lead if assigned_to is explicitly null/undefined AND lead_id is provided
        let finalAssignedTo = assigned_to;
        
        // Only auto-assign from lead if no assignment was specified
        if (lead_id && (assigned_to === null || assigned_to === undefined)) {
            const conn = await require('../config/db').getConnection();
            try {
                const [leadRows] = await conn.execute(
                    'SELECT assigned_to FROM leads WHERE lead_id = ? AND tenant_id = ?',
                    [lead_id, tenant_id]
                );
                if (leadRows.length > 0 && leadRows[0].assigned_to) {
                    finalAssignedTo = leadRows[0].assigned_to;
                }
            } finally {
                conn.release();
            }
        }
        
        const taskData = {
            task_name, 
            description, 
            status, 
            priority, 
            due_date, 
            lead_id, 
            assigned_to: finalAssignedTo || null
        };
        
        console.log('Create Task - Final taskData:', taskData);
        console.log('Create Task - Final assigned_to:', taskData.assigned_to);
        
        const task_id = await taskService.createTask(tenant_id, taskData);
        
        await logAction('Task created', 'task', task_id, req.user.user_id, tenant_id);
        if (finalAssignedTo) {
            await logAction('Task assigned', 'task', task_id, req.user.user_id, tenant_id);
            // Create notification for assigned user
            await NotificationService.notifyTaskAssigned(
                tenant_id,
                finalAssignedTo,
                task_id,
                task_name,
                req.user.user_name
            );
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
        
        const tasks = await taskService.getTasks(
            tenant_id, 
            { status, priority, assigned_to, overdue, page, limit },
            req.user.user_id,
            req.user.user_role
        );
        
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
        
        const task = await taskService.getTaskById(
            tenant_id, 
            task_id,
            req.user.user_id,
            req.user.user_role
        );
        
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
        const { task_name, description, status, priority, due_date, lead_id, assigned_to } = req.body;
        
        console.log('Update Task - Request Body:', req.body);
        console.log('Update Task - assigned_to from body:', assigned_to);
        
        // Get current task to check if assignment changed
        const currentTask = await taskService.getTaskById(
            tenant_id, 
            task_id,
            req.user.user_id,
            req.user.user_role
        );
        
        if (!currentTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        // Build update data - only include fields that are provided
        const updateData = {};
        if (task_name !== undefined) updateData.task_name = task_name;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;
        if (due_date !== undefined) updateData.due_date = due_date;
        if (lead_id !== undefined) updateData.lead_id = lead_id;
        if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
        
        console.log('Update Task - Final updateData:', updateData);
        console.log('Update Task - Final updateData:', updateData);
        
        const result = await taskService.updateTask(
            tenant_id, 
            task_id, 
            updateData,
            req.user.user_id,
            req.user.role
        );
        
        if (!result) {
            return res.status(404).json({ message: "Task not found or access denied" });
        }
        
        await logAction('Task updated', 'task', task_id, req.user.user_id, tenant_id);
        
        // Create notification if task was assigned to a different user
        if (assigned_to !== undefined && assigned_to !== currentTask.assigned_to && assigned_to !== null) {
            await NotificationService.notifyTaskAssigned(
                tenant_id,
                assigned_to,
                task_id,
                task_name || currentTask.task_name,
                req.user.user_name
            );
        }
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
