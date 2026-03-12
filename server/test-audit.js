const db = require('./src/config/db');

async function testAuditLogs() {
    try {
        console.log('🔍 Testing audit logs query...\n');
        
        // Get a tenant_id from users table
        const [users] = await db.query('SELECT tenant_id FROM users LIMIT 1');
        if (users.length === 0) {
            console.log('❌ No users found in database');
            process.exit(1);
        }
        
        const tenant_id = users[0].tenant_id;
        console.log(`✅ Using tenant_id: ${tenant_id}\n`);
        
        // Test the exact query from auditService
        const query = `SELECT al.id as log_id, al.action, al.entity, al.entity_id, 
                       al.user_id as performed_by, al.created_at, 
                       u.user_name, u.user_email 
                       FROM audit_logs al 
                       LEFT JOIN users u ON al.user_id = u.user_id 
                       WHERE al.tenant_id = ?
                       ORDER BY al.created_at DESC LIMIT 20 OFFSET 0`;
        
        const [logs] = await db.query(query, [tenant_id]);
        
        console.log(`✅ Found ${logs.length} audit logs\n`);
        
        if (logs.length > 0) {
            console.log('Sample log entry:');
            console.log(JSON.stringify(logs[0], null, 2));
        } else {
            console.log('⚠️  No audit logs found for this tenant');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err);
        process.exit(1);
    }
}

testAuditLogs();
