const db = require('./src/config/db');

async function fixUserNames() {
    try {
        console.log('🔧 Fixing user names that are set to email addresses...\n');
        
        // Find users where user_name equals user_email
        const [users] = await db.query('SELECT user_id, user_name, user_email FROM users WHERE user_name = user_email');
        
        console.log(`Found ${users.length} users with email as name\n`);
        
        for (const user of users) {
            // Extract name from email (part before @)
            const emailPart = user.user_email.split('@')[0];
            // Capitalize first letter and replace dots/underscores with spaces
            const newName = emailPart
                .replace(/[._]/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            
            console.log(`Updating user ${user.user_id}:`);
            console.log(`  Email: ${user.user_email}`);
            console.log(`  Old name: "${user.user_name}"`);
            console.log(`  New name: "${newName}"`);
            
            await db.query('UPDATE users SET user_name = ? WHERE user_id = ?', [newName, user.user_id]);
            console.log('  ✅ Updated\n');
        }
        
        console.log('🎉 All user names fixed!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

fixUserNames();