const db = require('./src/config/db');

async function verifyDatabase() {
    try {
        console.log('🔍 Checking database connection...');
        
        // Test connection
        const [result] = await db.query('SELECT 1');
        console.log('✅ Database connection successful');
        
        // Check if tables exist
        const tables = ['org', 'users', 'customers', 'leads', 'tasks', 'audit_logs'];
        
        for (const table of tables) {
            try {
                const [rows] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`✅ Table '${table}' exists with ${rows[0].count} records`);
            } catch (err) {
                console.log(`❌ Table '${table}' does NOT exist or has error: ${err.message}`);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Database error:', err.message);
        process.exit(1);
    }
}

verifyDatabase();
