const axios = require('axios');

(async () => {
  try {
    const resp = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testuser' + Math.random().toString().slice(2, 7),
      email: 'test' + Math.random().toString().slice(2, 7) + '@example.com',
      password: 'Password123!'
    });
    console.log('Register success:', resp.status, resp.data);
  } catch (err) {
    console.error('Register failed:', err.response?.status, err.response?.data || err.message);
  }
})();
