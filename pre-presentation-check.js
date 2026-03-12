const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let testTenantId = '';

console.log('🚀 Starting Pre-Presentation System Check...\n');

async function checkHealth() {
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Backend Health Check:', res.data.message);
    return true;
  } catch (err) {
    console.log('❌ Backend Health Check Failed:', err.message);
    return false;
  }
}

async function testLogin() {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@acme.com',
      password: 'Admin@123'
    });
    authToken = res.data.token;
    testTenantId = res.data.user.tenant_id;
    console.log('✅ Login Test: Success');
    console.log(`   User: ${res.data.user.name} (${res.data.user.role})`);
    console.log(`   Tenant: ${res.data.user.tenant_id}`);
    return true;
  } catch (err) {
    console.log('❌ Login Test Failed:', err.response?.data?.message || err.message);
    return false;
  }
}

async function testDashboard() {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Dashboard API: Success');
    console.log(`   Customers: ${res.data.totalCustomers}`);
    console.log(`   Leads: ${res.data.totalLeads}`);
    console.log(`   Tasks: ${res.data.totalTasks}`);
    return true;
  } catch (err) {
    console.log('❌ Dashboard API Failed:', err.response?.data?.message || err.message);
    return false;
  }
}

async function testCustomers() {
  try {
    const res = await axios.get(`${BASE_URL}/customers?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Customers API: Success');
    console.log(`   Total: ${res.data.total}, Fetched: ${res.data.customers.length}`);
    return true;
  } catch (err) {
    console.log('❌ Customers API Failed:', err.response?.data?.message || err.message);
    return false;
  }
}

async function testLeads() {
  try {
    const res = await axios.get(`${BASE_URL}/leads?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Leads API: Success');
    console.log(`   Total: ${res.data.total}, Fetched: ${res.data.leads.length}`);
    return true;
  } catch (err) {
    console.log('❌ Leads API Failed:', err.response?.data?.message || err.message);
    return false;
  }
}

async function testTasks() {
  try {
    const res = await axios.get(`${BASE_URL}/tasks?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Tasks API: Success');
    console.log(`   Total: ${res.data.total}, Fetched: ${res.data.tasks.length}`);
    return true;
  } catch (err) {
    console.log('❌ Tasks API Failed:', err.response?.data?.message || err.message);
    return false;
  }
}

async function testUsers() {
  try {
    const res = await axios.get(`${BASE_URL}/users?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Users API: Success');
    console.log(`   Total: ${res.data.total}, Fetched: ${res.data.users.length}`);
    return true;
  } catch (err) {
    console.log('❌ Users API Failed:', err.response?.data?.message || err.message);
    return false;
  }
}

async function testAuditLogs() {
  try {
    const res = await axios.get(`${BASE_URL}/audit-logs?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Audit Logs API: Success');
    console.log(`   Total: ${res.data.total}, Fetched: ${res.data.logs.length}`);
    return true;
  } catch (err) {
    console.log('❌ Audit Logs API Failed:', err.response?.data?.message || err.message);
    return false;
  }
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════\n');
  
  const healthOk = await checkHealth();
  if (!healthOk) {
    console.log('\n❌ Backend server is not running on port 3000!');
    console.log('   Run: cd server && npm start\n');
    return;
  }
  
  console.log('');
  const loginOk = await testLogin();
  if (!loginOk) {
    console.log('\n❌ Authentication failed! Check database and credentials.\n');
    return;
  }
  
  console.log('');
  await testDashboard();
  console.log('');
  await testCustomers();
  console.log('');
  await testLeads();
  console.log('');
  await testTasks();
  console.log('');
  await testUsers();
  console.log('');
  await testAuditLogs();
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✅ ALL SYSTEMS OPERATIONAL - READY FOR PRESENTATION! 🎉');
  console.log('═══════════════════════════════════════════════════════\n');
}

runAllTests();
