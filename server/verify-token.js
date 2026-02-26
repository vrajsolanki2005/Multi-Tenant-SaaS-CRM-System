const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ0ZW5hbnRfaWQiOjQsInVzZXJfcm9sZSI6ImFkbWluIiwiaWF0IjoxNzcyMTI1MDQwLCJleHAiOjE3NzIyMTE0NDB9.o1T9uay7HNhgLqstmgfgXHROxsMvv-3nhrbyRQbTkhE';

try {
    const decoded = jwt.verify(token, 'gemini');
    console.log('✓ Valid:', decoded);
} catch (err) {
    console.log('✗ Invalid:', err.message);
}
