const { test, describe, before } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.NODE_ENV = 'test';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test_dummy_db';
process.env.JWT_SECRET = 'test_jwt_secret_minimum_32_characters_long_for_security';
process.env.ALLOWED_ORIGINS = 'http://localhost:5173,http://localhost:3000';

const Admin = require('../src/models/Admin');
const app = require('../src/app');

// Mock Admin.findById so tests run instantly without needing a live DB connection
before(() => {
    Admin.findById = () => ({
        select: () => Promise.resolve({
            _id: '65f1234567890abcdef12345',
            email: 'admin@test.com'
        })
    });
});

// Generate a valid admin token
const mockAdminToken = jwt.sign(
    { id: '65f1234567890abcdef12345', email: 'admin@test.com' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

describe('CRUD Payload Validation & Error Handling Tests', () => {
    test('POST /api/admin/shows should reject payload missing title, slug, or channel', async () => {
        const res = await request(app)
            .post('/api/admin/shows')
            .set('Authorization', `Bearer ${mockAdminToken}`)
            .send({});

        assert.equal(res.status, 400);
        assert.match(res.body.message, /title is required/i);
    });

    test('POST /api/admin/shows should reject invalid channel ObjectId', async () => {
        const res = await request(app)
            .post('/api/admin/shows')
            .set('Authorization', `Bearer ${mockAdminToken}`)
            .send({
                title: 'Dexter Laboratory',
                slug: 'dexter-lab',
                channel: 'invalid-id'
            });

        assert.equal(res.status, 400);
        assert.match(res.body.message, /Valid Channel ID is required/i);
    });

    test('POST /api/admin/channels should reject payload missing name and slug', async () => {
        const res = await request(app)
            .post('/api/admin/channels')
            .set('Authorization', `Bearer ${mockAdminToken}`)
            .send({});

        assert.equal(res.status, 400);
        assert.match(res.body.message, /Channel name is required/i);
    });

    test('PUT /api/admin/channels/invalid-id should reject non-ObjectId format', async () => {
        const res = await request(app)
            .put('/api/admin/channels/invalid-id-format')
            .set('Authorization', `Bearer ${mockAdminToken}`)
            .send({ name: 'New Name' });

        assert.equal(res.status, 400);
        assert.match(res.body.message, /Invalid channel ID format/i);
    });

    test('DELETE /api/admin/channels/invalid-id should reject non-ObjectId format', async () => {
        const res = await request(app)
            .delete('/api/admin/channels/invalid-id-format')
            .set('Authorization', `Bearer ${mockAdminToken}`);

        assert.equal(res.status, 400);
        assert.match(res.body.message, /Invalid channel ID format/i);
    });

    test('POST /api/admin/banners should reject missing show, image or tagline', async () => {
        const res = await request(app)
            .post('/api/admin/banners')
            .set('Authorization', `Bearer ${mockAdminToken}`)
            .send({});

        assert.equal(res.status, 400);
        assert.match(res.body.message, /associated Show ID is required/i);
    });

    test('GET non-existent API route should return 404 JSON', async () => {
        const res = await request(app).get('/api/completely-non-existent-endpoint');
        assert.equal(res.status, 404);
        assert.equal(res.body.message, 'Resource not found');
    });
});
