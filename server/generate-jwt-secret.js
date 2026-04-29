#!/usr/bin/env node

/**
 * Generate a cryptographically secure JWT secret
 * Usage: node generate-jwt-secret.js
 */

const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('hex');

console.log('\n==============================================');
console.log('  SECURE JWT SECRET GENERATED');
console.log('==============================================\n');
console.log('Add this to your .env file:\n');
console.log(`JWT_SECRET=${secret}\n`);
console.log('==============================================\n');
console.log('⚠️  IMPORTANT: Keep this secret secure!');
console.log('   - Never commit it to version control');
console.log('   - Never share it publicly');
console.log('   - Use different secrets for dev/prod\n');
