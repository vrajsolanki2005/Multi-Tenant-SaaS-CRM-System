const cron = require('node-cron');
const db = require('../config/db');

const startTaskScheduler = () => {
    // Run every hour
    cron.schedule('0 * * * *', async () => {
        try {
            const [result] = await db.query(
                `UPDATE tasks 
                 SET status = 'overdue' 
                 WHERE due_date < NOW() 
                 AND status IN ('pending', 'in_progress')`
            );
            console.log(`Auto-updated ${result.affectedRows} overdue tasks`);
        } catch (error) {
            console.error('Error updating overdue tasks:', error);
        }
    });
};

module.exports = { startTaskScheduler };
