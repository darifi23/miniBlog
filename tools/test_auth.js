const axios = require('axios');

(async () => {
  const results = {register: null, login: null, getMe: null};
  const baseURL = 'http://localhost:5000/api';

  // Register
  const testUsername = 'testuser' + Date.now().toString().slice(-4);
  const testEmail = `test${Date.now().toString().slice(-6)}@example.com`;
  const testPassword = 'Password123!';
  try {
    const regRes = await axios.post(baseURL + '/auth/register', {
      username: testUsername,
      email: testEmail,
      password: testPassword
    });
    results.register = {status: regRes.status, data: regRes.data};
  } catch (e) {
    results.register = {error: e.response?.data || e.message};
  }

  // Login
  try {
    const loginRes = await axios.post(baseURL + '/auth/login', {
      email: testEmail,
      password: testPassword
    });
    results.login = {status: loginRes.status, data: loginRes.data};
  } catch (e) {
    results.login = {error: e.response?.data || e.message};
  }

  // GetMe with token from login
  if (results.login && results.login.data && results.login.data.token) {
    try {
      const axiosWithAuth = axios.create({
        baseURL,
        headers: {Authorization: 'Bearer ' + results.login.data.token}
      });
      const meRes = await axiosWithAuth.get('/auth/me');
      results.getMe = {status: meRes.status, data: meRes.data};
    } catch (e) {
      results.getMe = {error: e.response?.data || e.message};
    }
  }

  console.log('AUTH TEST RESULTS:\n', JSON.stringify(results, null, 2));
  process.exit(0);
})();
