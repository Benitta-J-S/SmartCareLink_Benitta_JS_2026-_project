const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
    try {
        // Test register
        console.log('📝 Testing registration...');
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Patient',
            email: 'test@example.com',
            password: '123456',
            phone: '1234567890',
            role: 'patient'
        });
        console.log('✅ Registration successful:', registerRes.data.user);
        
        // Test login
        console.log('\n🔐 Testing login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@example.com',
            password: '123456'
        });
        console.log('✅ Login successful, token received');
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testAuth();