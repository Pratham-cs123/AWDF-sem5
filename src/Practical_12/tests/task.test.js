const request = require('supertest');
const app = require('../app');

describe('Practical 12: Automated CI/CD Endpoint Test Suite', () => {
  // Test 1: Health check endpoint
  test('GET /health returns 200 and status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  // Test 2: Core requirement from syllabus: GET /tasks returns 200
  test('GET /tasks returns 200 and returns array of tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test 3: POST /tasks with valid payload returns 201
  test('POST /tasks creates task and returns status 201', async () => {
    const newTask = { title: 'New CI Automated Task' };
    const res = await request(app).post('/tasks').send(newTask);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New CI Automated Task');
    expect(res.body.completed).toBe(false);
  });

  // Test 4: Validation failure returns 400
  test('POST /tasks without title returns 400 Bad Request', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // Test 5: Missing task returns 404
  test('GET /tasks/9999 returns 404 Not Found', async () => {
    const res = await request(app).get('/tasks/9999');
    expect(res.statusCode).toBe(404);
  });
});
