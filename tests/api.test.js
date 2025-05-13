const request = require('supertest');
const app = require('../backend');  // Adjust the path to your server.js file

describe('API Endpoints', () => {
  test('GET / should return "HR System API Running"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('HR System API Running');
  });
});
