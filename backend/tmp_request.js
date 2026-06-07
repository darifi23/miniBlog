import axios from 'axios';

(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testuser',
      email: 'bademail',
      password: 'password123'
    });
    console.log('STATUS', res.status, JSON.stringify(res.data));
  } catch (err) {
    console.error('ERROR STATUS', err.response?.status, JSON.stringify(err.response?.data));
  }
})();
