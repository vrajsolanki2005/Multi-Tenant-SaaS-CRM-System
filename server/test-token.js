require('dotenv').config();
const jwt = require('jsonwebtoken');

// Test token generation and verification
const testPayload = { user_id: 1, tenant_id: 1, user_role: 'admin' };
const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

console.log('Generated Token:', token);
console.log('\nVerifying...');

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✓ Token Valid:', decoded);
} catch (err) {
    console.log('✗ Token Invalid:', err.message);
}
