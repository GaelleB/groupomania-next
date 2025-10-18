const request = require('supertest');
const app = require('../app');

describe('Health Check Endpoint', () => {
    it('should return 200 and server status', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body.status).toBe('OK');
    });

    it('should include database connection status', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect(200);

        expect(response.body).toHaveProperty('database');
        expect(['connected', 'disconnected']).toContain(response.body.database);
    });
});
