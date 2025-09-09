const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration...');
    
    const response = await axios.post('http://localhost:5001/api/auth/register', {
      name: 'Test User 2',
      email: 'test2@example.com',
      password: 'password123',
      role: 'Customer'
    });
    
    console.log('Registration successful:', response.data);
    
    // Test login
    console.log('Testing login...');
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test2@example.com',
      password: 'password123'
    });
    
    console.log('Login successful:', loginResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testRegistration();