const db = require('./src/config/db');

async function checkUserNames() {
    try {
        console.log('🔍 Checking user_name values in database...\n');
        
        const [users] = await db.query('SELECT user_id, user_name, user_email FROM users LIMIT 10');
        
        console.log('Users in database:');
        users.forEach(user => {
            console.log(`ID: ${user.user_id}`);
            console.log(`Name: "${user.user_name}"`);
            console.log(`Email: "${user.user_email}"`);
            console.log(`Name === Email: ${user.user_name === user.user_email}`);
            console.log('---');
        });
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

checkUserNames();