const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

// Set test environment variables before loading app
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test_dummy_db';
process.env.JWT_SECRET = 'test_jwt_secret_minimum_32_characters_long_for_security';
process.env.ALLOWED_ORIGINS = 'http://localhost:5173,http://localhost:3000';
process.env.ADMIN_REGISTRATION_SECRET = 'test_bootstrap_secret_key';

const app = require('../src/app');

describe('Security & Authentication Tests', () => {
    test('GET / should return 200 with service health info', async () => {
        const res = await request(app).get('/');
        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'online');
    });

    test('POST /api/admin/auth/login should reject credentials in URL query parameters', async () => {
        const res = await request(app)
            .post('/api/admin/auth/login?email=test@example.com&password=secretpassword')
            .send({});

        assert.equal(res.status, 400);
        assert.match(res.body.message, /query parameters are strictly forbidden/i);
    });

    test('POST /api/admin/auth/login should reject empty body', async () => {
        const res = await request(app)
            .post('/api/admin/auth/login')
            .send({});

        assert.equal(res.status, 400);
        assert.match(res.body.message, /email and password are required/i);
    });

    test('POST /api/admin/auth/register should reject credentials in URL query parameters', async () => {
        const res = await request(app)
            .post('/api/admin/auth/register?email=new@example.com&password=password123')
            .send({});

        assert.equal(res.status, 400);
        assert.match(res.body.message, /query parameters are strictly forbidden/i);
    });

    test('POST /api/admin/auth/register should reject missing or invalid bootstrap registration secret', async () => {
        const res = await request(app)
            .post('/api/admin/auth/register')
            .send({
                email: 'testadmin@example.com',
                password: 'password12345',
                registrationSecret: 'wrong_secret'
            });

        // Either 403 (registration closed or invalid secret) or 400 (if invalid body)
        assert.ok([400, 403].includes(res.status));
    });

    test('Protected route GET /api/admin/shows should reject requests without token', async () => {
        const res = await request(app).get('/api/admin/shows');
        assert.equal(res.status, 401);
        assert.match(res.body.message, /Authorization token required/i);
    });

    test('Protected route GET /api/admin/channels should reject requests with forged or invalid token', async () => {
        const res = await request(app)
            .get('/api/admin/channels')
            .set('Authorization', 'Bearer invalid_forged_token_here');

        assert.equal(res.status, 401);
        assert.match(res.body.message, /Invalid token/i);
    });

    test('Protected route GET /api/admin/banners should reject requests without token', async () => {
        const res = await request(app).get('/api/admin/banners');
        assert.equal(res.status, 401);
        assert.match(res.body.message, /Authorization token required/i);
    });

    test('Disallowed CORS origin should be blocked', async () => {
        const res = await request(app)
            .get('/')
            .set('Origin', 'http://malicious-site.com');

        // CORS error triggers 500 in Express error pipeline or omission of CORS headers
        assert.ok(res.headers['access-control-allow-origin'] !== 'http://malicious-site.com');
    });

    test('Allowed CORS origin should be granted', async () => {
        const res = await request(app)
            .get('/')
            .set('Origin', 'http://localhost:5173');

        assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
    });
});
