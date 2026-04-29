const app = require('./app');
const db = require('./config/db');
const { startTaskScheduler } = require('./services/taskScheduler');
const NotificationScheduler = require('./services/notificationScheduler');

const PORT = process.env.PORT || 3000;

// Validate critical environment variables
function validateEnvironment() {
    const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error('FATAL ERROR: Missing required environment variables:', missing.join(', '));
        console.error('Please configure these in your .env file');
        process.exit(1);
    }
    
    // Validate JWT secret strength
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret === 'gemini' || jwtSecret === 'CHANGE_THIS_TO_SECURE_RANDOM_STRING_MIN_32_CHARS') {
        console.error('FATAL SECURITY ERROR: JWT_SECRET is using default/placeholder value!');
        console.error('Generate a secure random string: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
        process.exit(1);
    }
    
    if (jwtSecret.length < 32) {
        console.error('SECURITY WARNING: JWT_SECRET should be at least 32 characters long');
        console.error('Current length:', jwtSecret.length);
        process.exit(1);
    }
    
    console.log('✓ Environment variables validated');
}

async function startServer(){
    try{
        // Validate environment first
        validateEnvironment();
        
        const conn = await db.getConnection();
        console.log("✓ Database Connected Successfully!")
        conn.release();

        app.listen(PORT, ()=>{
            console.log(`✓ Server is running on port ${PORT}`);
        });

        startTaskScheduler();
        console.log('✓ Task scheduler started');
        
        NotificationScheduler.init();
        console.log('✓ Notification scheduler started');
    }
    catch(err){
        console.error("FATAL ERROR while starting server:", err);
        process.exit(1);
    }
}

startServer();