require('dotenv').config();
const http = require('http');

const request = (method, path, body, token) =>
  new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: process.env.PORT || 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(raw || '{}') }));
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });

const run = async () => {
  const health = await request('GET', '/api/health');
  console.log('Health:', health.status, health.body.success !== false ? 'OK' : health.body);

  const noAuth = await request('GET', '/api/scans');
  console.log('Scans without token:', noAuth.status, noAuth.body.message);

  const email = `test.${Date.now()}@example.com`;
  const signup = await request('POST', '/api/auth/signup', {
    name: 'Test User',
    email,
    password: 'password123',
    role: 'user',
  });
  console.log('Signup:', signup.status, signup.body.success ? 'OK' : signup.body.message);

  const login = await request('POST', '/api/auth/login', { email, password: 'password123' });
  const token = login.body?.data?.token;
  console.log('Login:', login.status, token ? 'OK' : login.body.message);

  if (token) {
    const scans = await request('GET', '/api/scans', null, token);
    console.log('Scans with token:', scans.status, scans.body.success ? 'OK' : scans.body.message);
  }

  console.log('\nAPI smoke test complete');
  process.exit(0);
};

run().catch((e) => {
  console.error('Smoke test failed:', e.message);
  process.exit(1);
});
